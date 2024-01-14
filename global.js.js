export const globalVar = {
	apiDomain: 'https://localhost',
	screenHeight: 800
};

export function setOpenId(openid = '') {
	uni.setStorageSync('openid', openid)
}

export function getOpenId() {
	return uni.getStorageSync('openid')
}

export function uniLogin() {
	uni.login({
		success(res) {
			if (res.code) {
				//发起网络请求
				wx.request({
					url: `${globalVar.apiDomain}/wap/weapp/login/code`,
					method: 'post',
					data: {
						code: res.code
					},
					success(loginRes) {
						console.log('openid', loginRes.data)
						setOpenId(loginRes.data.openid)
					}
				})
			} else {
				console.log('登录失败！' + res.errMsg)
			}
		}
	})
}