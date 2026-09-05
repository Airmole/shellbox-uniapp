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
			clearLoginStatus()
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
	// 获取课表信息
	function getCourses() {
		api.fetchDateCourse().then(res => {
			store.courses = res.data
		})
	}
	// 获取校历
	function getCalendar() {
		api.fetchCalendar().then(res => {
			store.calendar = res.data
		})
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
	
	return {
		getCourses,
		dataInit,
		setAppAuth,
		setUserInfo,
		getUserInfo,
		...toRefs(store)
	}
})
