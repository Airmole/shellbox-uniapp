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
		app.globalData.loginPromise.then((res) => {
			setAppAuth(res)
			app.globalData.isVip = (res && res.isVip) ? true : false
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
			let userInfo = {}
			if (res.data.avatar) userInfo.avatar = res.data.avatar
			if (res.data.nickname) userInfo.nickname = res.data.nickname
			if (res.data.isVip) userInfo.isVip = res.data.isVip
			if (Object.keys(userInfo).length === 0) userInfo = undefined
			setUserInfo(userInfo)
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
