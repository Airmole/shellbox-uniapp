const BASE_URL = 'http://localhost/wap'
const MOCK_URL = 'https://mock.apifox.com/m1/3906316-0-default/wap'
const TEST_URL = 'https://dev-api.shellbox.ustb.tj.cn/wap'
const MOCK = false
const IS_TEST = true

const request = (url, method = 'GET', data = {}, isUpload = false) => {
	return new Promise((resolve, reject) => {
		const auth = uni.getStorageSync('auth')
		let baseUrl = BASE_URL
		if (url.indexOf('http') >= 0) baseUrl = ''
		if (IS_TEST) {
			baseUrl = TEST_URL
		} else if (MOCK) {
			baseUrl = MOCK_URL
		}
		
		if (!isUpload) {
			uni.request({
				url: baseUrl + url,
				data: data,
				method: method,
				header: {
					'Content-Type': 'application/json',
					'Auth': auth
				},
				success: (res) => {
					if (res.statusCode === 200) {
						resolve(res)
					} else {
						reject(res)
					}
				},
				fail(error) {
					reject(error)
				},
				complete(res) {
					// console.log('complete', res)
				}
			});
		} else {
			uni.uploadFile({
				url: BASE_URL + '/upload',
				filePath: data,
				name: 'file',
				header: {
					'Auth': auth
				},
				formData: {
					file: data,
				},
				success: (uploadFileRes) => {
					resolve(uploadFileRes)
				},
				fail: () => {
					uni.showToast({
						title: '图片上传失败',
						icon: 'none'
					})
				}
			});
		}

	})
}

export {
	request
}