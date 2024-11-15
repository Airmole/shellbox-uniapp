<script>
	import api from './request/api.js'
	import { setLoginStatus, getEdusysAccount, clearLoginStatus } from '@/common/utils/auth.js'
	
	export default {
		globalData: {
			env: 'develop',
			screenHeight: 800,
			logoImageUrl: 'https://store2018.muapp.cn/images/weapp/logo.jpeg',
			loginPromise: null,
			defaultAvatar: 'https://store2018.muapp.cn/images/weapp/defaultAvatar.png'
		},
		onLaunch: function() {
			var self = this

			// #ifdef MP-WEIXIN || MP-QQ
			const openid = this.getOpenId()
			if (!openid) {
				this.uniLogin()
			} else {
				uni.checkSession({
					success() { console.log('getOpenid', openid) },
					fail() { self.uniLogin() }
				})
			}
			uni.getSystemInfo({
				success(e) {
					self.globalData.screenHeight = e.screenHeight
				}
			})
			const accountInfo = uni.getAccountInfoSync()
			self.globalData.env = accountInfo.miniProgram.envVersion
			// #endif
			this.clientLoginEdusys()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			logout() {
				uni.clearStorageSync()
				uni.redirectTo({ url: '/pages/index/login' })
			},
			setOpenId(openid = '') {
				uni.setStorageSync('openid', openid)
			},
			getOpenId() {
				return uni.getStorageSync('openid')
			},
			uniLogin() {
				const self = this
				uni.login({
					success(res) {
						if (!res.code) {
							console.log('登录失败！' + res.errMsg)
						} else {
							api.uniLogin({
								code: res.code
							}).then(loginRes => {
								console.log('openid', loginRes.data)
								self.setOpenId(loginRes.data.openid)
								return loginRes.data.openid
							})
						}
					}
				})
			},
			clientLoginEdusys () {
				this.globalData.loginPromise = new Promise(async (resolve, reject) => {
					try {
						const res = await api.fetchProfile()
						console.log('登录成功11:》》', res);
						resolve(res.data)
					} catch(err) {
						if (err?.statusCode == 401 && ['请先登录', '账号未登录'].includes(err.data.message)) {
							let edusysAccount = getEdusysAccount()
							if (edusysAccount == false) return
							// #ifdef MP-WEIXIN
							edusysAccount.wx_open_id = self.getOpenId()
							// #endif
							
							// #ifdef MP-QQ
							edusysAccount.qq_open_id = self.getOpenId()
							// #endif
							await api.autoLogin(edusysAccount).then(loginRes => {
								resolve(Object.assign({
									...edusysAccount
								}, loginRes.data))
								console.log('登录成功')
							}).catch(err => {
								console.log('登录失败');
								uni.showToast({ title: err.data.message, icon: 'none'})
								reject(err)
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "static/css/icon.css";
	@import "~@/common/css/index.scss";
	
	page {
		background-color: #f1f1f1;
	}

	body {
		background: #f1f1f1;
	}
	.press-class {
		background: rgb(230, 230, 230);
	}
	.card-radius {
		border-radius: 30rpx;
	}
</style>