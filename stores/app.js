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
			const { auth, account, password } = res
			if (account || password) {
				setLoginStatus(auth, account, password)
			}
			store.edusysAccount = getEdusysAccount()
			store.loginStatus = true
			console.log('权限校验完成');
			getCourses() // 获取课表信息
			getCalendar() // 
		}).catch(err => {
			clearLoginStatus()
		})
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
		...toRefs(store)
	}
})