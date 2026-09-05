const ACCOUNT_KEY = 'edusysAccount'
const AUTH_KEY = 'auth'

export function setLoginStatus(auth, account, password) {
	uni.setStorageSync(AUTH_KEY, auth)
	uni.setStorageSync(ACCOUNT_KEY, {
		account: account,
		password: password
	})
}
export function clearLoginStatus() {
	// 仅清除登录相关存储，保留 openid 等微信身份标识
	uni.removeStorageSync(AUTH_KEY)
	uni.removeStorageSync(ACCOUNT_KEY)
}
export function getLoginStatus() {
	const auth = uni.getStorageSync(AUTH_KEY)
	const edusysAccount = uni.getStorageSync(ACCOUNT_KEY)
	// 兼容旧版本历史数据：若已登录数据写入的是空对象而非删除 key
	if (!auth || !edusysAccount || !edusysAccount.account || !edusysAccount.password) {
		return false
	}
	return true
}
export function getAuthValue() {
	const auth = uni.getStorageSync(AUTH_KEY)
	if (!auth) return false
	return auth
}
export function getEdusysAccount() {
	const edusysAccount = uni.getStorageSync(ACCOUNT_KEY)
	// 兼容旧数据：可能存的是空字符串或 account/password 为空的旧对象
	if (!edusysAccount || !edusysAccount.account || !edusysAccount.password) {
		return false
	}
	return edusysAccount
}
