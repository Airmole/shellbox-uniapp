<template>
	<view>
		<view class="padding-top bg-height bg-img bg-mask flex justify-center"
			:style="{backgroundImage: `url(${backgroundImageUrl})`}">
			<!-- #ifdef MP-WEIXIN -->
			<view class="padding-xl text-white radius bg-card">
				<navigator :url="loginStatus?'/pages/setting/profile':'/pages/index/login'" class="margin-top-xxl flex justify-center">
					<image class="cu-avatar round avatar"
						:src="(loginStatus && userInfo && userInfo.avatar) ? userInfo.avatar : defaultAvatar" mode="scaleToFill">
					</image>
				</navigator>
				<navigator url="/pages/index/login" v-if="!loginStatus"
					class="round bg-gray text-center margin-tb padding-xs">
					<span>您尚未登录</span>
				</navigator>
				<navigator url="/pages/setting/profile" v-else class="round bg-gray text-center margin-tb padding-xs">
					<span>{{userInfo && userInfo.nickname}}({{edusysAccount.account}})</span>
				</navigator>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="padding-xl text-white radius bg-card">
				<view @click="goProfileSettingPage()" class="margin-top-xxl flex justify-center">
					<image class="cu-avatar round avatar"
						:src="(loginStatus && userInfo && userInfo.avatar) ? userInfo.avatar : defaultAvatar" mode="scaleToFill">
					</image>
				</view>
				<navigator url="/pages/index/login" v-if="!loginStatus"
					class="round bg-gray text-center margin-tb padding-xs">
					<span>您尚未登录</span>
				</navigator>
				<view @click="goProfileSettingPage()" v-else class="round bg-gray text-center margin-tb padding-xs">
					<span>{{userInfo && userInfo.nickname}}({{edusysAccount.account}})</span>
				</view>
			</view>
			<!-- #endif -->
			
			<image class="gif-wave" :src="waterWaveUrl" mode="scaleToFill"></image>
		</view>

		<block v-for="(item, index) in menuList" :key="index">
			<menuGuide :title="item.title" :menuList="item.children" :isFold="item.fold"></menuGuide>
		</block>
		
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isVip" class="margin-lr margin-tb-sm radius">
			<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-QQ -->
		<view v-if="!isVip" class="margin-lr margin-tb-sm radius">
			<ad unit-id="297c24fcd434022129795daed3f46440"></ad>
		</view>
		<!-- #endif -->

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
	import { onShow, onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
	import api from '@/request/api.js'
	import { useAppStore } from '@/stores/app.js'
	import { storeToRefs } from 'pinia'
	import menuGuide from './components/menuGuide.vue'
	
	const app = getApp()
	const appStore = useAppStore()
	const { loginStatus, userInfo, edusysAccount } = storeToRefs(appStore)
	const defaultAvatar = 'https://store2018.muapp.cn/images/weapp/defaultAvatar.png'
	const backgroundImageUrl = 'https://store2018.muapp.cn/images/weapp/background/4697920-48dab9eddafb6ce3.webp'
	let waterWaveUrl = ref('https://shellbox-image.ustb.tj.cn/water-wave-light.webp')
	
	const isVip = ref(false)
	const menuList = ref([])
	
	onLoad(() => {
		isVip.value = app.globalData.isVip
		uni.showLoading({ title: '加载中...' })
		const sysInfo = uni.getSystemInfoSync()
		if (sysInfo.theme === 'dark') waterWaveUrl.value = 'https://shellbox-image.ustb.tj.cn/water-wave-dark.webp'
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
		// #ifdef MP-QQ
		return
		// #endif
		uni.showToast({ title: '暂仅支持在微信小程序端修改头像昵称', icon: 'none' })
	}
	
	onShareAppMessage (() => {
		return {
		  title: '贝壳小盒子 - 贝壳田园小助手',
		  path: '/pages/index/feature'
		}
	})
	
	onShareTimeline(() => {
		return { title: '贝壳小盒子 - 贝壳田园小助手' }
	})
</script>

<style>
	.bg-height {
		height: 480rpx;
	}

	.avatar {
		height: 180rpx;
		width: 180rpx;
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