<template>
	<view class="height-screen">
		<view class="bg-img bg-mask height-full" :style="{ backgroundImage: `url(${bgImgUrl})` }">
			<cu-custom bgColor="#ffffff" :isBack="true">
				<block slot="content"><span class="text-white">登录</span></block>
			</cu-custom>
			<view class="margin-top-xxl padding margin radius">
				<view class="text-center margin">
					<image class='cu-avatar round' style="height: 180rpx;width: 180rpx;" :src="logoUrl"
						mode="aspectFit"></image>
				</view>
				<form>
					<view class="cu-form-group round margin-top-xl">
						<view class="title">账号</view>
						<input v-model="loginForm.account" type="number" placeholder="统一身份认证账号(学号/教职工号)" name="account"
							maxlength="10" focus="true" confirm-type="next" @input="accountInput" />
					</view>
					<view class="cu-form-group round margin-tb-xl">
						<view class="title">密码</view>
						<input v-model="loginForm.password" password="true" placeholder="仅支持统一身份认证密码"
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
		
		<view style="position: fixed;bottom: 0;width: 100%;" class="margin-tb-sm">
			<view class="flex justify-center">
				<view @tap="helpModal" class="bg-white padding-tb-xs padding-lr-sm round">
					<text class="cuIcon-question"></text> 登录账号密码相关疑问
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="showHelpModal?'show':''" style="z-index: 99;">
			<view class="cu-dialog">
				<view class="bg-img padding-sm text-center">
					<image @tap="previewHelp" :src="helpImage" mode="widthFix"></image>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left" @tap="helpModal">我知道了</view>
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

<script setup>
	import api from '@/request/api.js'
	import { onMounted, reactive, ref, toRefs } from 'vue'
	const app = getApp()
	import { useAppStore } from '@/stores/app.js'
	const { setAppAuth } = useAppStore()
	const loadingUrl = 'https://store2018.muapp.cn/images/weapp/loading_cat.gif'
	const helpImage = 'https://r2.airmole.cn/i/2025/08/17/t9fix-x1.jpg'
	const logoUrl = app.globalData.logoImageUrl
	const isLoading = ref(false)
	const showHelpModal = ref(false)
	const bgImgUrl = ref('')
	let loginFailureCount = ref(0)
	const loginForm = ref({
		account: '',
		password: ''
	})
	
	onMounted(() => {
		fetchBackgroundImage()
	})
	
	function accountInput(e) {
		const length = e.detail.value.length
		if (length == 9) uni.hideKeyboard()
	
	}
	function submitLogin() {
		let openid = null
		// #ifdef MP-WEIXIN
		openid = app.getOpenId()
		if (typeof openid === 'object') openid = openid.openid
		if (typeof openid === 'string') openid = openid
		// #endif
		
		// #ifdef MP-WEIXIN
		loginForm.value.wx_open_id = openid
		// #endif
		
		// #ifdef MP-QQ
		loginForm.value.qq_open_id = openid
		// #endif
		
		if (loginForm.value.account.length == 0 || loginForm.value.password.length == 0) {
			uni.showToast({ title: '请填写账号密码', icon: 'error' })
			return
		}
		isLoading.value = true
		autoLogin(loginForm.value)
	}
	function autoLogin (formData) {
		console.log('autoLogin (formData)', formData)
		api.autoLogin(formData).then(res => {
			setAppAuth(Object.assign({
				account: formData.account,
				password: formData.password
			}, res.data))
			uni.switchTab({ url: '/pages/index/index' })
		}).catch(err => {
			console.log(err)
			loginFailureCount.value = loginFailureCount.value + 1
			if (loginFailureCount.value == 2) helpModal()
			const errorMessage = formatErrorMessage(err.data)
			console.log(errorMessage)
			uni.showToast({ title: errorMessage, icon: 'none'})
		}).finally(()=> {
			isLoading.value = false
		})
	}
	function fetchBackgroundImage() {
		api.getLoginBackground().then(res => {
			const min = 0
			const max = 4
			const index = Math.floor(Math.random() * (max - min + 1)) + min
			bgImgUrl.value = `https://bing.com${res.data.images[index].url}`
		})
	}
	
	
	function helpModal () {
		showHelpModal.value = !showHelpModal.value
	}
	
	function previewHelp () {
		uni.previewImage({ urls: [helpImage] })
	}
	
	function formatErrorMessage (data) {
		if (data && data.errors) {
			let message = ''
			for (let key in data.errors) {
				message = key + data.errors[key] + ';'
			}
			return message
		}
		if (data && data.message) return data.message
		if (data && data.msg) return data.msg
		if (typeof data == 'string') return data
		if (typeof data == 'object' && data !== null) {
			let message = ''
			for (let key in data.errors) {
				message = key + data.errors[key] + ';'
			}
			return message
		}
	}
</script>

<style>
</style>