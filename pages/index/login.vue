<template>
	<view class="height-screen">
		<view class="bg-img bg-mask height-full" :style="{ backgroundImage: `url(${bgImgUrl})`, height: pageHeight + 'px' }">
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

<script setup>
	import api from '@/request/api.js'
	import { useAppStore } from '@/stores/app.js'
	import { onMounted, reactive, ref, toRefs } from 'vue'
	const app = getApp()
	const { setAppAuth } = useAppStore()
	const loadingUrl = 'https://store2018.muapp.cn/images/weapp/loading_cat.gif'
	const logoUrl = app.globalData.logoImageUrl
	const isLoading = ref(false)
	const bgImgUrl = ref('')
	const loginForm = ref({
		account: '235160545',
		password: '20040526'
	})
	
	onMounted(() => {
		fetchBackgroundImage()
	})
	
	function accountInput(e) {
		const length = e.detail.value.length
		if (length == 9) uni.hideKeyboard()
	
	}
	function submitLogin() {
		// #ifdef MP-WEIXIN
		loginForm.value.wx_open_id = app.getOpenId()
		// #endif
		// #ifdef MP-QQ
		loginForm.value.qq_open_id = app.getOpenId()
		// #endif
		if (loginForm.value.account.length == 0 || loginForm.value.password.length == 0) {
			uni.showToast({ title: '请填写账号密码', icon: 'error' })
			return
		}
		this.isLoading = true
		this.autoLogin(loginForm.value)
	}
	function autoLogin (formData) {
		api.autoLogin(formData).then(res => {
			setAppAuth(Object.assign({
				account: formData.account,
				password: formData.password
			}, res.data))
			uni.switchTab({ url: '/pages/index/index' })
		}).catch(err => {
			console.log(err)
			uni.showToast({ title: err.data.message, icon: 'none'})
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
</script>

<style>
</style>