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
		getCalendar() // 
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
	
	return {
		getCourses,
		dataInit,
		setAppAuth,
		...toRefs(store)
	}
})