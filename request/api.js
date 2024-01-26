import request from './index.js'
const api = request

export default {
	// 登录换取openID
	uniLogin: (data) => {
		return api.request('/weapp/login/code', 'POST', data)
	},
	// 获取登录页背景图
	getLoginBackground: () => {
		return api.request('/login/image', 'GET')
	},
	// 自动登录接口
	autoLogin: (data) => {
		return api.request('/login', 'POST', data)
	},
	// 获取资料
	fetchProfile: () => {
		return api.request('/profile', 'GET')
	},
	// 更新资料
	updateProfile: (data) => {
		return api.request('/profile', 'PUT')
	},
	// 个人学期课表筛选项
	fetchSemesterCourseOptions: () => {
		return api.request(`/edusys/course/semester/options`, 'GET')
	},
	// 个人学期课表
	fetchSemesterCourse: (semester = '', week = '') => {
		return api.request(`/edusys/course/semester?semester=${semester}&week=${week}`, 'GET')
	}
}