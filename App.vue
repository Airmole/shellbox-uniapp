<script>
	import api from './request/api.js'
	import { setLoginStatus, getEdusysAccount, clearLoginStatus } from '@/common/utils/auth.js'
	import { setGlobalData, markAppDataReady, GLOBAL_DATA_DEFAULTS } from '@/common/store/globalData.js'
	
	export default {
		globalData: {
			env: 'develop',
			screenHeight: 800,
			isVip: false,
			logoImageUrl: 'https://r2.airmole.cn/i/2024/11/30/17v4j5-c1.jpg',
			loginPromise: null,
			defaultAvatar: 'https://r2.airmole.cn/i/2026/09/10/4zmggf-skb0.png'
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
			try {
				uni.getSystemInfo({
					success(e) {
						self.setAppGlobalData('screenHeight', e.screenHeight)
					}
				})
			} catch (e) {
				console.error('getSystemInfo error:', e)
			}
			try {
				const accountInfo = uni.getAccountInfoSync()
				self.setAppGlobalData('env', accountInfo.miniProgram.envVersion)
			} catch (e) {
				console.error('getAccountInfoSync error:', e)
			}
			self.mpappUpdate()
			// #endif
			
			// App 实例此时必然就绪，把 globalData 兜底值同步给安全访问层
			try {
				Object.keys(GLOBAL_DATA_DEFAULTS).forEach((key) => {
					const value = this.globalData[key]
					if (typeof value !== 'undefined' && value !== null) {
						setGlobalData(key, value)
					}
				})
				setGlobalData('loginPromise', this.globalData.loginPromise || null)
				markAppDataReady()
			} catch (e) {
				console.error('sync globalData error:', e)
			}

			this.clientLoginEdusys()
		},
		onShow: function() {},
		onHide: function() {},
		methods: {
			// 统一写入入口：同时写 App.globalData（兼容存量页面）与安全访问层（App 实例未就绪也能读）
			setAppGlobalData(key, value) {
				try {
					this.globalData[key] = value
				} catch (e) { /* ignore */ }
				setGlobalData(key, value)
			},
			logout() {
				// 仅清除 eduSys 账号登录态，保留 openid 等微信身份标识
				clearLoginStatus()
				// 重置全局登录 Promise，防止后续使用旧 Promise 导致状态错乱
				this.setAppGlobalData('loginPromise', null)
				this.setAppGlobalData('isVip', false)
				uni.reLaunch({ url: '/pages/index/index' })
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
				this.setAppGlobalData('profile', profile)
				this.setAppGlobalData('isVip', !!(profile && profile.isVip))
			},
			clientLoginEdusys () {
				const self = this
				const loginPromise = new Promise(async (resolve, reject) => {
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
				// globalData(同步) + 安全访问层 双写，供 App 实例不可用时兜底读取
				this.globalData.loginPromise = loginPromise
				setGlobalData('loginPromise', loginPromise)
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
