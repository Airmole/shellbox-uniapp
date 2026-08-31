const BASE_URL = 'http://localhost/wap'
const MOCK_URL = 'https://mock.apifox.com/m1/3906316-0-default/wap'
const TEST_URL = 'https://dev-api.shellbox.ustb.tj.cn/wap'
const PROD_URL = 'https://api.shellbox.ustb.tj.cn/wap'
const API_ENV = 'prod' // local、mock、test、prod

const ENV_MAP = {
	local: BASE_URL,
	mock: MOCK_URL,
	test: TEST_URL,
	prod: PROD_URL,
}

// 根据环境获取请求域名
const getBaseUrl = () => ENV_MAP[API_ENV] || PROD_URL

const requestDomain = getBaseUrl

// 判断是否为完整URL
const isFullUrl = (url) => /^https?:\/\//i.test(url)

// 获取office在线预览链接
const getOfficeViewerUrl = (url) => `https://view.officeapps.live.com/op/view.aspx?src=${url}`

// 获取PDF在线预览链接
const getPdfViewerUrl = (url) => `https://pdfviewer.airmole.cn/?url=${url}`

const request = (url, method = 'GET', data = {}, isUpload = false) => {
	return new Promise((resolve, reject) => {
		const auth = uni.getStorageSync('auth')
		const baseUrl = isFullUrl(url) ? '' : getBaseUrl()

		if (!isUpload) {
			uni.request({
				url: baseUrl + url,
				data,
				method,
				timeout: 60000 * 3, // 超时时间3分钟
				header: {
					'Content-Type': 'application/json',
					'Auth': auth
				},
				success: (res) => {
					res.statusCode === 200 ? resolve(res) : reject(res)
				},
				fail: (error) => reject(error)
			})
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
				success: (uploadFileRes) => resolve(uploadFileRes),
				fail: () => {
					uni.showToast({ title: '上传失败', icon: 'none' })
				}
			})
		}
	})
}

export {
	request,
	requestDomain,
	getOfficeViewerUrl,
	getPdfViewerUrl
}
