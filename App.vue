<script>
	import Vue from 'vue'
	export default {
		globalData: {
			apiDomain: 'http://localhost',
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
					success() {
						console.log('getOpenid', openid)
					},
					fail() {
						this.uniLogin()
					}
				})
			}
			uni.getSystemInfo({
				success(e) {
					self.globalData.screenHeight = e.screenHeight
				}
			})
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
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
							//发起网络请求
							wx.request({
								url: `${self.globalData.apiDomain}/wap/weapp/login/code`,
								method: 'post',
								data: {
									code: res.code
								},
								success(loginRes) {
									console.log('openid', loginRes.data)
									setOpenId(loginRes.data.openid)
								}
							})
						}
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
</style>