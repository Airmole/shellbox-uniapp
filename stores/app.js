import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { getEdusysAccount, setLoginStatus, clearLoginStatus } from '@/common/utils/auth.js'
import api from '@/request/api.js'

export const useAppStore = defineStore('app', () => {
	const app = getApp()
	
	const store = reactive({
		userInfo: undefined,
		edusysAccount: undefined, // 账号信息
		courses: {
			table: []
		}, // 课表
		calendar: undefined,
		loginStatus: false,
	})
	
	dataInit()
	getUserInfo()
	
	function dataInit() {
		if (!app.globalData.loginPromise) return
		app.globalData.loginPromise.then((res) => {
			setAppAuth(res)
			app.globalData.isVip = !!(res && res.isVip)
		}).catch(err => {
			// 登录失败：清除登录态并同步重置 store 响应式状态
			clearLoginStatus()
			resetAppState()
		})
	}
	function setAppAuth(res) {
		const { auth, account, password } = res
		if (account && password) {
			setLoginStatus(auth, account, password)
		}
		store.edusysAccount = getEdusysAccount()
		store.loginStatus = true
		// 同步更新全局 isVip（兼容手动登录场景）
		if (res && typeof res.isVip !== 'undefined') {
			app.globalData.isVip = !!res.isVip
		}
		getCourses() // 获取课表信息
		getCalendar() // 获取校历
	}
	// 重置 store 中与登录态相关的响应式状态（退出账号/登录失败时调用）
	function resetAppState() {
		store.userInfo = undefined
		store.edusysAccount = undefined
		store.courses = { table: [] }
		store.calendar = undefined
		store.loginStatus = false
	}
	// 获取课表信息
	function getCourses() {
		api.fetchDateCourse().then(res => {
			store.courses = res.data
		}).catch(() => {})
	}
	// 获取校历
	function getCalendar() {
		api.fetchCalendar().then(res => {
			store.calendar = res.data
		}).catch(() => {})
	}
	// 设置用户昵称头像信息
	function setUserInfo (userInfo) {
		store.userInfo = userInfo
	}
	
	// 获取用户昵称头像信息
	function getUserInfo () {
		api.fetchProfile().then(res => {
			const profile = res.data.data || res.data
			let userInfo = {}
			if (profile.avatar) userInfo.avatar = profile.avatar
			if (profile.nickname) userInfo.nickname = profile.nickname
			if (profile.isVip) userInfo.isVip = profile.isVip
			if (Object.keys(userInfo).length === 0) userInfo = undefined
			setUserInfo(userInfo)
			// 同步全局 isVip
			if (typeof profile.isVip !== 'undefined') {
				app.globalData.isVip = !!profile.isVip
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
		app.globalData.isVip = false
		app.globalData.profile = undefined
		app.globalData.loginPromise = null
	}
	
	return {
		getCourses,
		dataInit,
		setAppAuth,
		setUserInfo,
		getUserInfo,
		resetAppState,
		logout,
		...toRefs(store)
	}
})
