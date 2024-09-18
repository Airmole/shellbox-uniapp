<template>
	<view>
		<view class="padding-top bg-height bg-img bg-mask flex justify-center"
			:style="{backgroundImage: `url(${backgroundImageUrl})`}">
			<view class="padding-xl text-white radius bg-card">
				<navigator :url="loginStatus?'/pages/setting/profile':'/pages/index/login'"
					class="margin-top-xxl flex justify-center">
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
			<image class="gif-wave" :src="waterWaveUrl" mode="scaleToFill"></image>
		</view>

<!-- 		<view class="cu-list menu sm-border" v-for="(item, index) in menuList" style="margin-top: 0;" :key="index">
			<view class="cu-bar solid-bottom bg-white" :data-index="index" @click="foldMenu" style="min-height: 60upx;"
				:hover-class="item.items.length > 5?'press-class':''">
				<view class="action">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-xl text-bold">{{item.title}}</text>
				</view>
				<view class="action" v-if="item.items.length > 5">
					<text :class="(item.fold?'cuIcon-right':'cuIcon-unfold') + ' text-green'"></text>
				</view>
			</view>
			<view class="cu-list grid col-5 no-border text-green line-green" :class="[item.fold && 'fold']" style="padding: 0;">
				<view @click="goPage(index, idx)" class="cu-item" v-for="(itm,idx) in item.items" :key="idx">
					<text :class="'iconfont icon-' + itm.icon" style="color: #39B54A;font-size: 40upx;"></text>
					<text>{{itm.name}}</text>
				</view>
				<block>
					<view class="cu-item" v-for="(itm,idx) in item.items" :key="idx">
						<text :class="'iconfont icon-' + itm.icon" style="color: #39B54A;font-size: 40upx;"></text>
						<text>{{itm.name}}</text>
					</view>
				</block>
			</view>
		</view> -->
		<block v-for="(item, index) in menuList" :key="index">
			<menuGuide :title="item.title" :menuList="item.items"></menuGuide>
		</block>
		
		

		<view class="flex margin">
			<view class="flex-sub margin-right-sm">
				<button class="round bg-default shadow" @click="shareApp()" open-type="share">分享</button>
			</view>
			<navigator v-if="!loginStatus" class="flex-sub margin-left-sm" url="/pages/index/login">
				<button class="round bg-default">登录</button>
			</navigator>
			<button v-else @click="logout()" class="flex-sub margin-left-sm round bg-red">注销退出</button>
		</view>

		<view class="text-center padding"></view>
	</view>
</template>

<script setup>
	import api from '@/request/api.js'
	import { useAppStore } from '@/stores/app.js'
	import { storeToRefs } from 'pinia'
	import { menuList } from './feature.js'
	import menuGuide from './components/menuGuide.vue'
	
	const app = getApp()
	const appStore = useAppStore()
	const { loginStatus, userInfo, edusysAccount } = storeToRefs(appStore)
	const defaultAvatar = 'https://store2018.muapp.cn/images/weapp/defaultAvatar.png'
	const backgroundImageUrl = 'https://store2018.muapp.cn/images/weapp/background/4697920-48dab9eddafb6ce3.webp'
	const waterWaveUrl = 'https://store2018.muapp.cn/images/weapp/water-wave.gif'
	
	function goPage (index, idx) {
		// const page = menuList[index]['items'][idx]
		// uni.navigateTo({ url: page.url })
		// console.log(page)
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
	function foldMenu(e) {
		// const index = e.currentTarget.dataset.index
		// menuList[index].fold = !menuList[index].fold
		// menuList = menuList
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