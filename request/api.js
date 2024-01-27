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
	},
	// 个人当天日期本周课表
	fetchDateCourse: (date = '') => {
		return api.request(`/edusys/course/date?date=${date}`, 'GET')
	},
	// 成绩查询筛选项
	fetchScoreOptions: () => {
		return api.request(`/edusys/score/options`, 'GET')
	},
	// 成绩查询
	fetchScore: (semester = '', nature = '', course = '', show = '') => {
		const params = new URLSearchParams();
		if (semester.length > 0) params.append('semester', semester)
		if (nature.length > 0) params.append('nature', nature)
		if (course.length > 0) params.append('course', course)
		if (show.length > 0) params.append('show', show)
		const queryString = params.toString()
		return api.request(`/edusys/score?${queryString}`, 'GET')
	}
}