<script>
	import Vue from 'vue'
	import { globalVar, getOpenId, uniLogin } from '@/global.js'
	export default {
		globalData: {
			defaultAvatar: 'https://store2018.muapp.cn/images/weapp/defaultAvatar.png'
		},
		onLaunch: function() {
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
			const openid = getOpenId()
			if (!openid) {
				uniLogin()
			} else {
				uni.checkSession({
					success() {
						console.log('getOpenid', openid)
					},
					fail() {
						uniLogin()
					}
				})
			}
			uni.getSystemInfo({
				success(e) {
					globalVar.screenHeight = e.screenHeight
				}
			})
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
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