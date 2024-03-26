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
	setLoginStatus('', '', '')
}
export function getLoginStatus() {
	const edusysAccount = uni.getStorageSync(ACCOUNT_KEY)
	if (edusysAccount.length == 0 || edusysAccount.account.length == 0 || edusysAccount.password.length == 0) {
		return false
	}
	if (edusysAccount.account.length > 0 && edusysAccount.password.length > 0) {
		return true
	}
}
export function getAuthValue() {
	const auth = uni.getStorageSync(AUTH_KEY)
	if (auth == null || auth.length == 0) return false
	return auth
}
export function getEdusysAccount() {
	const edusysAccount = uni.getStorageSync(ACCOUNT_KEY)
	if (edusysAccount == null || edusysAccount.length == 0) return false
	return edusysAccount
}