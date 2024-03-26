import { request } from './index.js'

export default {
	// 登录换取openID
	uniLogin: (data) => {
		return request('/weapp/login/code', 'POST', data)
	},
	// 获取登录页背景图
	getLoginBackground: () => {
		return request('/login/image', 'GET')
	},
	// 自动登录接口
	autoLogin: (data) => {
		return request('/login', 'POST', data)
	},
	// 获取资料
	fetchProfile: () => {
		return request('/profile', 'GET')
	},
	// 更新资料
	updateProfile: (data) => {
		return request('/profile', 'PUT', data)
	},
	// 个人学期课表筛选项
	fetchSemesterCourseOptions: () => {
		return request(`/edusys/course/semester/options`, 'GET')
	},
	// 个人学期课表
	fetchSemesterCourse: (semester = '', week = '') => {
		return request(`/edusys/course/semester?semester=${semester}&week=${week}`, 'GET')
	},
	// 个人当天日期本周课表
	fetchDateCourse: (date = '') => {
		return request(`/edusys/course/date?date=${date}`, 'GET')
	},
	// 成绩查询筛选项
	fetchScoreOptions: () => {
		return request(`/edusys/score/options`, 'GET')
	},
	// 成绩查询
	fetchScore: (semester = '', nature = '', course = '', show = '') => {
		const params = {}
		if (semester.length > 0) params.semester = semester
		if (nature.length > 0) params.nature = nature
		if (course.length > 0) params.course = course
		if (show.length > 0) params.show = show
		let queryString = ''
		const queryStringArray = []
		for (let key in params) {
			const value = params[key]
			const queryString = `${key}=${encodeURIComponent(value)}`
			queryStringArray.push(queryString)
		}
		queryString = queryStringArray.join('&')
		console.log(queryString)
		return request(`/edusys/score?${queryString}`, 'GET')
	},
	// 首页组件数据
	fetchHomeWidget(widgetNameList = []) {
		if (!Array.isArray(widgetNameList)) {
			widgetNameList = []
		}
		const paramsStr = widgetNameList.join(',')
		return request(`/widget/batch?widgets=${paramsStr}`, 'GET')
	},
	// 校历查询
	fetchCalendar() {
		return request(`/edusys/calendar`, `Get`)
	}
}