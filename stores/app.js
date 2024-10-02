import { defineStore } from 'pinia'
import { onMounted, reactive, toRefs } from 'vue'
import { getLoginStatus, getEdusysAccount, setLoginStatus } from '@/common/utils/auth.js'
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
		}).catch(err => {
			console.log('err:>>',err);
			clearLoginStatus()
		})
	}
	function setAppAuth(res) {
		const { auth, account, password } = res
		console.log('tt:>.', res);
		if (account && password) {
			console.log('set auth', res);
			setLoginStatus(auth, account, password)
		}
		console.log('errr:>>', account, password);
		store.edusysAccount = getEdusysAccount()
		store.loginStatus = true
		console.log('权限校验完成');
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
			console.log(store.calendar);
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
			if (Object.keys(userInfo).length === 0) userInfo = undefined
			setUserInfo(userInfo)
		}).catch(error => {
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