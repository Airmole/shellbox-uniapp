import { defineStore } from 'pinia'
import { reactive, toRefs, ref } from 'vue'
import { getEdusysAccount, setLoginStatus, clearLoginStatus } from '@/common/utils/auth.js'
import {
	getGlobalData,
	setGlobalData,
	getIsVip,
	getAppInstance,
	syncToAppInstance,
} from '@/common/store/globalData.js'
import api from '@/request/api.js'

/**
 * ⚠️ 本文件运行在 App 冷启动最早的阶段（首个 tabBar 页面的 setup 中），
 * 因此遵守以下硬性约束，避免「store 定义阶段抛错 → 所有页面 setup 中断 → 白屏」：
 *
 *   1. 模块顶层与 store 初始化过程中，绝不调用 getApp()
 *      （App 实例未就绪时它直接抛 "getApp() failed"，这正是白屏根因）
 *   2. 不直接触碰 uni.* 存储 API（早期可能不可用），统一走 common/store/globalData.js
 *      （storage-first + 内存兜底，永不抛错）
 *   3. 不在初始化时发起任何网络请求（api 是 default 导出对象，这里也不能出现
 *      `api.xxx` 非法语法，否则整个模块会变成不可解析的表达式）
 *   4. 所有取值都带默认值，绝不让 undefined 进入模板
 */

export const useAppStore = defineStore('app', () => {
	// ⚠️ 注意：变量名必须与下方 toRefs(...) 的引用保持完全一致。
	// 构建期（app-service.js / babel）可能对函数内局部变量做重命名，
	// 一旦某处引用没被同步改名，运行期就是 ReferenceError，
	// 而它恰好发生在 useStore 帧 -> store 定义失败 -> 所有页面 setup 中断 -> 白屏。
	const storeState = reactive({
		userInfo: undefined,
		edusysAccount: undefined, // 账号信息
		courses: {
			table: []
		}, // 课表
		calendar: undefined,
		loginStatus: false,
	})

	// 数据加载状态：页面不再各自调接口，统一「只加载一次 + 失败可重试」
	const loaded = ref(false)
	let loadingPromise = null

	// 初始化：只做本地同步操作 + 挂载已存在的登录 Promise，全程 try-catch
	try {
		// App 实例若已就绪，先把本地状态同步回去
		syncToAppInstance()
		dataInit()
	} catch (e) {
		console.error('[app store] init error:', e)
	}

	/**
	 * 拉取 store 所需的全部数据（课表 / 校历 / 用户资料）
	 * 所有接口调用都带类型判断与 catch，任何接口不可用都不会中断 store 初始化
	 */
	function fetchAll() {
		getCourses()
		getCalendar()
		getUserInfo()
	}

	/**
	 * 确保数据已加载：首个 tabBar 页面 onShow 时调用。
	 * 只在没有本地登录态（未登录过的设备）时触发，避免冷启动瞬间发起 3 个请求。
	 * 失败不会标记 loaded，下次 onShow 可重试。
	 */
	function ensureAppData() {
		if (loaded.value || loadingPromise) return loadingPromise
		if (getGlobalData('loginPromise', null)) return null // 已有登录 Promise，登录回调会加载数据
		if (getEdusysAccount() === false) return null         // 未登录过，无需请求
		loadingPromise = Promise.all([
			api && typeof api.fetchProfile === 'function' ? api.fetchProfile().then(res => {
				setGlobalData('profile', (res && res.data && res.data.data) || (res && res.data) || undefined)
			}).catch(() => {}) : Promise.resolve(),
			api && typeof api.fetchDateCourse === 'function' ? api.fetchDateCourse().then(res => {
				storeState.courses = (res && res.data) || { table: [] }
			}).catch(() => {}) : Promise.resolve(),
			api && typeof api.fetchCalendar === 'function' ? api.fetchCalendar().then(res => {
				storeState.calendar = (res && res.data) || undefined
			}).catch(() => {}) : Promise.resolve(),
		]).then(() => { loaded.value = true })
		return loadingPromise
	}

	function dataInit() {
		const loginPromise = getGlobalData('loginPromise', null)
		if (!loginPromise || typeof loginPromise.then !== 'function') return
		loginPromise.then((res) => {
			setAppAuth(res)
			setGlobalData('isVip', !!(res && res.isVip))
		}).catch(() => {
			// 登录失败：清除登录态并同步重置 store 响应式状态
			clearLoginStatus()
			resetAppState()
		})
	}

	function setAppAuth(res) {
		const data = res || {}
		const { auth, account, password } = data
		if (account && password) {
			setLoginStatus(auth, account, password)
		}
		storeState.edusysAccount = getEdusysAccount()
		storeState.loginStatus = true
		// 同步更新全局 isVip（兼容手动登录场景）
		if (typeof data.isVip !== 'undefined') {
			setGlobalData('isVip', !!data.isVip)
		}
		getCourses() // 获取课表信息
		getCalendar() // 获取校历
	}

	// 重置 store 中与登录态相关的响应式状态（退出账号/登录失败时调用）
	function resetAppState() {
		storeState.userInfo = undefined
		storeState.edusysAccount = undefined
		storeState.courses = { table: [] }
		storeState.calendar = undefined
		storeState.loginStatus = false
	}

	// 获取课表信息
	function getCourses() {
		if (!api || typeof api.fetchDateCourse !== 'function') return
		api.fetchDateCourse().then(res => {
			storeState.courses = (res && res.data) || { table: [] }
		}).catch(() => {
			storeState.courses = { table: [] }
		})
	}

	// 获取校历
	function getCalendar() {
		if (!api || typeof api.fetchCalendar !== 'function') return
		api.fetchCalendar().then(res => {
			storeState.calendar = (res && res.data) || undefined
		}).catch(() => {
			storeState.calendar = undefined
		})
	}

	// 设置用户昵称头像信息
	function setUserInfo (userInfo) {
		storeState.userInfo = userInfo
	}

	// 获取用户昵称头像信息
	function getUserInfo () {
		if (!api || typeof api.fetchProfile !== 'function') return
		api.fetchProfile().then(res => {
			const profile = (res && res.data && res.data.data) || (res && res.data) || {}
			let userInfo = {}
			if (profile.avatar) userInfo.avatar = profile.avatar
			if (profile.nickname) userInfo.nickname = profile.nickname
			if (profile.isVip) userInfo.isVip = profile.isVip
			if (Object.keys(userInfo).length === 0) userInfo = undefined
			setUserInfo(userInfo)
			// 同步全局 isVip
			if (typeof profile.isVip !== 'undefined') {
				setGlobalData('isVip', !!profile.isVip)
			}
		}).catch(() => {
			setUserInfo(undefined)
		})
	}

	// 退出登录：清理登录态并重置响应式状态
	function logout() {
		clearLoginStatus()
		resetAppState()
		// 同步重置 app 全局变量
		setGlobalData('isVip', false)
		setGlobalData('profile', undefined)
		setGlobalData('loginPromise', null)
	}

	return {
		getCourses,
		dataInit,
		ensureAppData,
		loaded,
		setAppAuth,
		setUserInfo,
		getUserInfo,
		resetAppState,
		logout,
		// 供页面安全读写全局状态（App 实例未就绪时也不会抛错）
		getGlobalData,
		setGlobalData,
		getIsVip,
		getAppInstance,
		...toRefs(storeState)
	}
})

export default useAppStore
