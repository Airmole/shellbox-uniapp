<template>
	<view>
		<view class="bg-img bg-mask" :style="{ backgroundImage: `url(${bgImgUrl})`, height: pageHeight + 'px' }">
			<cu-custom bgColor="#ffffff" :isBack="true">
				<block slot="content"><span class="text-white">登录</span></block>
			</cu-custom>
			<view class="margin-top-xxl padding margin radius">
				<view class="text-center margin">
					<image class='cu-avatar round' style="height: 180upx;width: 180upx;;" :src="logoUrl"
						mode="aspectFit"></image>
				</view>
				<form>
					<view class="cu-form-group round margin-top-xl">
						<view class="title">账号</view>
						<input v-model="loginForm.account" type="number" placeholder="教务系统账号(学号)" name="account"
							maxlength="10" focus="true" confirm-type="next" @input="accountInput" />
					</view>
					<view class="cu-form-group round margin-tb-xl">
						<view class="title">密码</view>
						<input v-model="loginForm.password" password="true" placeholder="教务系统登录密码"
							name="password" />
					</view>
				</form>
				<view class="flex padding-top">
					<button style="visibility: hidden;" class="flex-sub round margin-right cu-btn lg">快速免密登录</button>
					<button @click="submitLogin()" class="flex-sub round margin-left cu-btn lg bg-green">
						绑定登录 <span class="cuIcon-right margin-left-xs"></span>
					</button>
				</view>
			</view>
		</view>


		<view class="cu-modal" :class="isLoading?'show':''">
			<view class="cu-dialog" style="width: 120px; height: 120px;">
				<view class="bg-img" :style="{ backgroundImage: `url(${loadingUrl})`, height: '120px' }"></view>
				<view class="text-center" style="position: absolute;top: 40%;left: 28%;">
					<text>登录中...</text>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	import api from '@/request/api.js'
	import { setLoginStatus } from '@/common/utils/auth.js'
	
	const app = getApp()
	export default {
		data() {
			return {
				loadingUrl: 'https://store2018.muapp.cn/images/weapp/loading_cat.gif',
				logoUrl: app.globalData.logoImageUrl,
				pageHeight: app.globalData.screenHeight,
				isLoading: false,
				bgImgUrl: '',
				loginForm: {
					account: '235160545',
					password: '20040526'
				}
			}
		},
		onLoad() {
			this.fetchBackgroundImage()
		},
		methods: {
			accountInput(e) {
				const length = e.detail.value.length
				if (length == 9) uni.hideKeyboard()

			},
			submitLogin() {
				let loginForm = this.loginForm
				// #ifdef MP-WEIXIN
				loginForm.wx_open_id = app.getOpenId()
				// #endif
				// #ifdef MP-QQ
				loginForm.qq_open_id = app.getOpenId()
				// #endif
				if (loginForm.account.length == 0 || loginForm.password.length == 0) {
					uni.showToast({ title: '请填写账号密码', icon: 'error' })
					return
				}
				this.isLoading = true
				console.log('this.loginForm', this.loginForm)
				this.autoLogin(loginForm)
			},
			autoLogin (loginForm) {
				var _this = this
				api.autoLogin(loginForm).then(res => {
					console.log(res)
					_this.isLoading = false
					setLoginStatus(res.data.auth, loginForm.account, loginForm.password)
					console.log('登录成功')
					uni.switchTab({ url: '/pages/index/index' })
				}).catch(err => {
					console.log('err:>>', err);
					_this.isLoading = false
					uni.showToast({ title: err.data.message, icon: 'none'})
					console.log(err)
				})
			},
			fetchBackgroundImage() {
				const _this = this
				api.getLoginBackground().then(res => {
					const min = 0
					const max = 4
					const index = Math.floor(Math.random() * (max - min + 1)) + min
					_this.bgImgUrl = `https://bing.com${res.data.images[index].url}`
				})
			}
		}
	}
</script>

<style>
</style>