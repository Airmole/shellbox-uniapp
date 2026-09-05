<script>
	import api from './request/api.js'
	import { setLoginStatus, getEdusysAccount, clearLoginStatus } from '@/common/utils/auth.js'
	
	export default {
		globalData: {
			env: 'develop',
			screenHeight: 800,
			isVip: false,
			logoImageUrl: 'https://r2.airmole.cn/i/2024/11/30/17v4j5-c1.jpg',
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
			self.mpappUpdate()
			// #endif
			
			this.clientLoginEdusys()
		},
		onShow: function() {},
		onHide: function() {},
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
						if (res.code) {
							api.uniLogin({
								code: res.code
							}).then(loginRes => {
								self.setOpenId(loginRes.data.openid)
								return loginRes.data.openid
							})
						}
					}
				})
			},
			updateGlobalProfile (profile) {
				this.globalData.profile = profile
				this.globalData.isVip = !!(profile && profile.isVip)
			},
			clientLoginEdusys () {
				const self = this
				this.globalData.loginPromise = new Promise(async (resolve, reject) => {
					try {
						// 已有有效 auth，直接获取用户资料
						const res = await api.fetchProfile()
						const profile = res.data.data || res.data
						self.updateGlobalProfile(profile)
						resolve(Object.assign({}, res.data, profile))
					} catch(err) {
						// auth 失效或未登录，尝试使用 edusys 账号静默自动登录
						if (err && err.statusCode === 401 && ['请先登录', '账号未登录'].includes(err.data.message)) {
							let edusysAccount = getEdusysAccount()
							if (edusysAccount == false) {
								reject(err)
								return
							}
							// #ifdef MP-WEIXIN
							edusysAccount.wx_open_id = self.getOpenId()
							// #endif
							
							// #ifdef MP-QQ
							edusysAccount.qq_open_id = self.getOpenId()
							// #endif
							try {
								const loginRes = await api.autoLogin(edusysAccount)
								const loginData = Object.assign({
									...edusysAccount
								}, loginRes.data)
								const { auth, account, password } = loginData
								// 保存登录态，使后续请求能携带有效 auth
								if (account && password && auth) {
									setLoginStatus(auth, account, password)
								}
								// 自动登录成功后重新获取用户资料（含 isVip）
								let profileData = loginData
								try {
									const profileRes = await api.fetchProfile()
									const profile = profileRes.data.data || profileRes.data
									profileData = Object.assign({}, loginData, profile)
								} catch (e) {
									console.log('fetchProfile after autoLogin error:', e)
								}
								self.updateGlobalProfile(profileData)
								resolve(profileData)
							} catch (err2) {
								if (err2 && err2.data && err2.data.message) {
									uni.showToast({ title: err2.data.message, icon: 'none'})
								}
								reject(err2)
							}
						} else {
							reject(err)
						}
					}
				})
			},
			mpappUpdate (from) {
				const updateManager = uni.getUpdateManager()
				updateManager.onCheckForUpdate(function (res) {
				  if (from === 'userClick' && !res.hasUpdate) {
					uni.showToast({ title: '已是最新版', icon: 'none' })
				  }
				})
			
				updateManager.onUpdateReady(function () {
				  wx.showModal({
					title: '小盒子更新',
					content: "小盒子有版本功能更新啦，建议各位小可爱重启应用体验新版本(●'◡'●)",
					success: function (res) {
					  if (res.confirm) {
						updateManager.applyUpdate()
					  }
					}
				  })
				})
			
				updateManager.onUpdateFailed(function () {
				  wx.showToast({ title: '555更新失败了。可能网络不好' });
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
	
	@keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}
	
	@-webkit-keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}
	
	@media (prefers-color-scheme: dark) {
		/* DarkMode 下的样式 start */
		page {
			background-color: #1b1b1b;
		}
		body {
			background: #1b1b1b;
		}
		/* DarkMode 下的样式 end */
	}
	
	.press-class {
		background: rgb(230, 230, 230);
	}
	.card-radius {
		border-radius: 30rpx;
	}
</style>
