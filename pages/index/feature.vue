<template>
	<view>
		<view class="padding-top bg-height bg-img bg-mask flex justify-center"
			:style="{backgroundImage: `url(${backgroundImageUrl})`}">
			<!-- #ifdef MP -->
			<view class="padding-xl text-white radius bg-card">
				<navigator :url="loginStatus?'/pages/setting/profile':'/pages/index/login'" class="margin-top-xxl flex justify-center">
					<image class="cu-avatar round avatar"
						:src="(loginStatus&&userInfo?.avatar) ? userInfo.avatar : defaultAvatar" mode="scaleToFill">
					</image>
				</navigator>
				<navigator url="/pages/index/login" v-if="!loginStatus"
					class="round bg-gray text-center margin-tb padding-xs">
					<span>您尚未登录</span>
				</navigator>
				<navigator url="/pages/setting/profile" v-else class="round bg-gray text-center margin-tb padding-xs">
					<span>{{userInfo?.nickname}}({{edusysAccount.account}})</span>
				</navigator>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP -->
			<view class="padding-xl text-white radius bg-card">
				<view @click="goProfileSettingPage()" class="margin-top-xxl flex justify-center">
					<image class="cu-avatar round avatar"
						:src="(loginStatus&&userInfo?.avatar) ? userInfo.avatar : defaultAvatar" mode="scaleToFill">
					</image>
				</view>
				<navigator url="/pages/index/login" v-if="!loginStatus"
					class="round bg-gray text-center margin-tb padding-xs">
					<span>您尚未登录</span>
				</navigator>
				<view @click="goProfileSettingPage()" v-else class="round bg-gray text-center margin-tb padding-xs">
					<span>{{userInfo?.nickname}}({{edusysAccount.account}})</span>
				</view>
			</view>
			<!-- #endif -->
			
			<image class="gif-wave" :src="waterWaveUrl" mode="scaleToFill"></image>
		</view>

		<block v-for="(item, index) in menuList" :key="index">
			<menuGuide :title="item.title" :menuList="item.children"></menuGuide>
		</block>
		

		<view class="flex margin">
			<view class="flex-sub margin-right-sm">
				<button class="round bg-default shadow" @click="shareApp()" open-type="share">分享</button>
			</view>
			<navigator v-if="!loginStatus" class="flex-sub margin-left-sm" url="/pages/index/login">
				<button class="round bg-default">登录</button>
			</navigator>
			<button v-else @click="logout()" class="flex-sub margin-left-sm round bg-red">退出账号</button>
		</view>

		<view class="text-center padding"></view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onShow, onLoad } from '@dcloudio/uni-app'
	import api from '@/request/api.js'
	import { useAppStore } from '@/stores/app.js'
	import { storeToRefs } from 'pinia'
	import menuGuide from './components/menuGuide.vue'
	
	const app = getApp()
	const appStore = useAppStore()
	const { loginStatus, userInfo, edusysAccount } = storeToRefs(appStore)
	const defaultAvatar = 'https://store2018.muapp.cn/images/weapp/defaultAvatar.png'
	const backgroundImageUrl = 'https://store2018.muapp.cn/images/weapp/background/4697920-48dab9eddafb6ce3.webp'
	const waterWaveUrl = 'https://store2018.muapp.cn/images/weapp/water-wave.gif'
	
	const menuList = ref([])
	
	onLoad(() => {
		uni.showLoading({ title: '加载中...' })
		fetchMenuList()
	})
	
	onShow(() => {
	})
	
	function fetchMenuList () {
		api.fetchMenuList().then((res) => {
			menuList.value = res.data
			uni.hideLoading()
		})
	}
	
	function logout() {
		uni.showModal({
			title: '提示',
			content: '确定要退出账号吗？',
			success(res) {
				if (res.confirm) {
					app.logout()
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	}
	function shareApp() {
		// #ifdef MP-WEIXIN
		return
		// #endif
		// #ifdef MP-QQ
		return
		// #endif
		uni.setClipboardData({
			data: 'https://shellbox.ustb.tj.cn',
			showToast: false,
			success() {
				uni.showToast({ title: '已复制链接到粘贴板，可分享给同学', icon: 'none' })
			}
		})
	}
	
	function goProfileSettingPage () {
		uni.showToast({ title: '暂仅支持在小程序端修改头像昵称', icon: 'none' })
	}
</script>

<style>
	.bg-height {
		height: 480upx;
	}

	.avatar {
		height: 180upx;
		width: 180upx;
	}

	.gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}
</style>