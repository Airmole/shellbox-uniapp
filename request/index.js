const BASE_URL = 'http://localhost/wap'
const MOCK_URL = 'https://mock.apifox.com/m1/3906316-0-default/wap'
const TEST_URL = 'https://dev-api.shellbox.ustb.tj.cn/wap'
const PROD_URL = 'https://api.shellbox.ustb.tj.cn/wap'
const API_ENV = 'prod' // local、mock、test、prod

const requestDomain = () => {
	let baseUrl = ''
	if (API_ENV === 'test') baseUrl = TEST_URL
	if (API_ENV === 'mock') baseUrl = MOCK_URL
	if (API_ENV === 'local') baseUrl = BASE_URL
	if (API_ENV === 'prod') baseUrl = PROD_URL
	return baseUrl
}

const request = (url, method = 'GET', data = {}, isUpload = false) => {
	return new Promise((resolve, reject) => {
		const auth = uni.getStorageSync('auth')
		let baseUrl = ''
		if (API_ENV === 'test') baseUrl = TEST_URL
		if (API_ENV === 'mock') baseUrl = MOCK_URL
		if (API_ENV === 'local') baseUrl = BASE_URL
		if (API_ENV === 'prod') baseUrl = PROD_URL
		if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) baseUrl = ''
		
		if (!isUpload) {
			uni.request({
				url: baseUrl + url,
				data: data,
				method: method,
				timeout: 60000 * 3, // 超时时间3分钟
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
				url: baseUrl + '/upload',
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
					uni.showToast({ title: '上传失败', icon: 'none' })
				}
			});
		}

	})
}

export {
	request,
	requestDomain
}