import request from './index.js'
const api = request

export default {
	uniLogin: (data) => {
		return api.request('/weapp/login/code', 'POST', data)
	},
	// 获取登录页背景图
	getLoginBackground: () => {
		return api.request('/login/image', 'GET')
	},
	autoLogin: (data) => {
		let url = '/login'
		url = 'https://mock.apifox.com/m1/3906316-0-default/wap/login'
		return api.request(url, 'POST', data)
	},
	fetchProfile: () => {
		let url = '/profile'
		url = 'https://mock.apifox.com/m1/3906316-0-default/wap/profile'
		return api.request(url, 'GET')
	},
	updateProfile: (data) => {
		let url = '/profile'
		url = 'https://mock.apifox.com/m1/3906316-0-default/wap/profile'
		return api.request(url, 'PUT')
	}
}