<script>
	import Vue from 'vue'
	export default {
		globalData: {
			apiDomain: 'http://localhost/wap',
			screenHeight: 800,
			logoImageUrl: 'https://store2018.muapp.cn/images/weapp/logo.jpeg',
			defaultAvatar: 'https://store2018.muapp.cn/images/weapp/defaultAvatar.png'
		},
		onLaunch: function() {
			var self = this
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN || MP-QQ
					Vue.prototype.StatusBar = e.statusBarHeight;
					let capsule = wx.getMenuButtonBoundingClientRect();
					if (capsule) {
						Vue.prototype.Custom = capsule;
						// Vue.prototype.capsuleSafe = uni.upx2px(750) - capsule.left + uni.upx2px(750) - capsule.right;
						Vue.prototype.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					}
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})

			// #ifdef MP-WEIXIN
			const openid = this.getOpenId()
			if (!openid) {
				this.uniLogin()
			} else {
				uni.checkSession({
					success() { console.log('getOpenid', openid) },
					fail() { self.uniLogin() }
				})
			}
			uni.getSystemInfo({ success(e) { self.globalData.screenHeight = e.screenHeight} })
			// #endif
			this.slientLoginEdusys()
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
							self.$api.uniLogin({
								code: res.code
							}).then(loginRes => {
								console.log('openid', loginRes.data)
								self.setOpenId(loginRes.data.openid)
							})
						}
					}
				})
			},
			getLoginStatus() {
				const edusysAccount = uni.getStorageSync('edusysAccount')
				if (edusysAccount.length == 0 || edusysAccount.account.length == 0 || edusysAccount.password.length == 0) {
					return false
				}
				if (edusysAccount.account.length > 0 && edusysAccount.password.length > 0) {
					return true
				}
			},
			getAuthValue() {
				const auth = uni.getStorageSync('auth')
				if (auth == null || auth.length == 0) return false
				return auth
			},
			getEdusysAccount() {
				const edusysAccount = uni.getStorageSync('edusysAccount')
				if (edusysAccount == null || edusysAccount.length == 0) return false
				return edusysAccount
			},
			setLoginStatus(auth, account, password) {
				uni.setStorageSync('auth', auth)
				uni.setStorageSync('edusysAccount', {
					account: account,
					password: password
				})
			},
			slientLoginEdusys () {
				this.$api.fetchProfile().then(res => {
					if (res.statusCode == 200) {
						console.log('auth cookie值有效')
					} else if (res.statusCode == 401 && res.data.message == '请先登录') {
						const edusysAccount = this.getEdusysAccount()
						if (edusysAccount == false) return
						this.$api.autoLogin(edusysAccount).then(loginRes => {
							if (loginRes.statusCode != 200) {
								uni.showToast({ title: res.data.message, icon: 'none'})
							} else {
								this.setLoginStatus(loginRes.data.auth, edusysAccount.account, edusysAccount.password)
								console.log('登录成功')
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "static/css/icon.css";

	.press-class {
		background: rgb(230, 230, 230);
	}
	.card-radius {
		border-radius: 30upx;
	}
</style>