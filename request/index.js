const app = getApp()
const BASE_URL = 'http://localhost/wap'
const TOKEN = uni.getStorageSync('auth')

const request = (url, method = 'GET', data = {}, isUpload = false) => {
	return new Promise((resolve, reject) => {
		let baseUrl = BASE_URL
		if (url.indexOf('http') >= 0) baseUrl = ''
		if (!isUpload) {
			uni.request({
				url: baseUrl + url,
				data: data,
				method: method,
				header: {
					'Content-Type': 'application/json',
					'Auth': TOKEN
				},
				success: (res) => {
					resolve(res)
				},
				fail(error) {
					reject(error)
				},
				complete() {}
			});
		} else {
			uni.uploadFile({
				url: BASE_URL + '/upload',
				filePath: data,
				name: 'file',
				header: {
					'Auth': TOKEN
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

export default {
	request
}