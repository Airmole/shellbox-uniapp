<script>
	import api from './request/api.js'
	import { setLoginStatus, getEdusysAccount, clearLoginStatus } from '@/common/utils/auth.js'
	
	export default {
		globalData: {
			env: 'develop',
			screenHeight: 800,
			logoImageUrl: 'https://r2.airmole.net/i/2024/11/30/17v4j5-c1.jpg',
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
			self.mpappUpdate()
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
				const self = this
				this.globalData.loginPromise = new Promise(async (resolve, reject) => {
					try {
						const res = await api.fetchProfile()
						console.log('登录成功11:》》', res)
						resolve(res.data)
					} catch(err) {
						if (err && err.statusCode === 401 && ['请先登录', '账号未登录'].includes(err.data.message)) {
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
					title: '小盒子求更新',
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