<template>
	<view>
		<view class="padding-top bg-height bg-img bg-mask"
			:style="{backgroundImage: `url(${backgroundImageUrl})`}">
			<!-- #ifdef MP -->
			<view class="text-xl margin-lr text-left margin-top-xl padding-top-sm text-bold"><text @click="moreModal=true" class="cuIcon-more text-white"></text></view>
			<view class="text-white radius bg-card">
				<navigator :url="loginStatus?'/pages/setting/profile':'/pages/index/login'" class="flex justify-center">
					<image class="cu-avatar round avatar"
						:src="(loginStatus && profile && profile.avatar) ? profile.avatar : defaultAvatar" mode="scaleToFill">
					</image>
				</navigator>
				<navigator url="/pages/index/login" v-if="!loginStatus"
					class="text-center margin-tb">
					<text class="bg-gray padding-xs round">您尚未登录</text>
				</navigator>
				<navigator url="/pages/setting/profile" v-else class="text-center margin-tb">
					<text class="bg-gray padding-xs round">{{profile && profile.nickname}}<text v-if="isVip" class="cuIcon-vip text-yellow margin-lr-xs"></text>丨{{edusysAccount.account}}</text>
				</navigator>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP -->
			<view class="text-xl margin-lr text-right text-bold"><text @click="moreModal=true" class="cuIcon-more text-white"></text></view>
			<view class="padding-xl text-white radius bg-card">
				<view class="flex justify-center">
					<image
						class="cu-avatar round avatar"
						@click="goProfileSettingPage()"
						:src="(loginStatus && profile && profile.avatar) ? profile.avatar : defaultAvatar"
						mode="scaleToFill"
					></image>
				</view>
				<navigator url="/pages/index/login" v-if="!loginStatus" class="text-center margin-tb">
					<span class="bg-gray padding-xs round">您尚未登录</span>
				</navigator>
				<view v-else class="text-center margin-tb">
					<span @click="goProfileSettingPage()" class="bg-gray padding-xs round">{{profile && profile.nickname}}<text v-if="isVip" class="cuIcon-vip text-yellow margin-lr-xs"></text>丨{{edusysAccount.account}}</span>
				</view>
			</view>
			<!-- #endif -->
			<image class="gif-wave" :src="waterWaveUrl" mode="scaleToFill"></image>
		</view>
		
		<!-- 我的积分 -->
		<view class="cu-list menu sm-border margin-bottom-sm radius-bottom balance-card">
		    <navigator url="/pages/points/balance" class="cu-item arrow" :render-link="false">
		        <view class="content">
		            <text class="cuIcon-moneybag text-yellow"></text> <text class="text-grey">我的积分</text>
					<view class='cu-tag radius margin-lr line-orange'>积分兑会员</view>
		        </view>
				<view class="action">
					<text class="iconfont icon-shell text-yellow"></text><text v-if="loginStatus" class="text-yellow text-xl">{{balance}}</text><text v-else>***</text>
				</view>
		    </navigator>
		</view>

		<block v-for="(item, index) in menuList" :key="index">
			<menuGuide :title="item.title" :menuList="item.children"></menuGuide>
		</block>
		
		<!-- #ifdef MP-WEIXIN -->
		<view class="margin-lr margin-tb-sm radius">
			<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
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
		
		<!-- 更多 抽屉模态框 -->
		<view class="cu-modal drawer-modal justify-end" :class="moreModal?'show':''" @tap="moreModal = !moreModal">
			<view class="cu-dialog basis-lg padding-top-xl bg-gray" @tap.stop="">
				<!-- #ifdef MP -->
				<view class="margin-tb-xl padding-tb"></view>
				<!-- #endif -->
				<view class="flex justify-center">
					<view class="cu-avatar round xxl" :style="`background-image: url(${(loginStatus && profile && profile.avatar) ? profile.avatar : defaultAvatar});`"></view>
				</view>
				<view class="margin">{{(loginStatus?profile.nickname:'未登录')}} <text class="cuIcon-vip text-yellow"></text> </view>
				<view class="margin">{{(loginStatus?edusysAccount.account:'未登录')}}</view>
				<view class="cu-list menu sm-border card-menu margin-top text-left">
					<navigator v-if="loginStatus" url="/pages/points/balance" class="cu-item arrow" :render-link="false">
					    <view class="content">
					        <text class="cuIcon-people text-blue"></text>
					        <text class="text-grey">我的积分</text>
					    </view>
						<view class="action text-yellow"><text v-if="loginStatus">{{balance}}</text><text v-else>*</text></view>
					</navigator>
					<!-- #ifdef MP-WEIXIN -->
				    <navigator v-if="loginStatus" url="/pages/setting/profile" class="cu-item arrow">
				        <view class="content">
				            <text class="cuIcon-people text-blue"></text>
				            <text class="text-grey">昵称头像设置</text>
				        </view>
				    </navigator>
					<view @click="openWechatAuthSetting" class="cu-item arrow">
					    <view class="content">
					        <text class="cuIcon-settings text-blue"></text>
					        <text class="text-grey">授权管理设置</text>
					    </view>
					</view>
					<!-- #endif -->
					<view @click="goUserGuide" class="cu-item arrow">
					    <view class="content">
					        <text class="cuIcon-read text-blue"></text>
					        <text class="text-grey">使用手册</text>
					    </view>
					</view>
					<navigator url="/pages/index/about" class="cu-item arrow">
					    <view class="content">
					        <text class="cuIcon-info text-blue"></text>
					        <text class="text-grey">关于盒子</text>
					    </view>
					</navigator>
				</view>
			</view>
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
	const profile = ref('')
	const menuList = ref([])
	const moreModal = ref(false)
	const balance = ref('*')
	
	onLoad(() => {
		uni.showLoading({ title: '加载中...' })
		const sysInfo = uni.getSystemInfoSync()
		if (sysInfo.theme === 'dark') waterWaveUrl.value = 'https://shellbox-image.ustb.tj.cn/water-wave-dark.webp'
		fetchMenuList()
	})
	
	onShow(() => {
		fetchProfile()
		fetchBalance()
	})
	
	function fetchMenuList () {
		api.fetchMenuList().then((res) => {
			menuList.value = res.data
			uni.hideLoading()
		})
	}
	
	function fetchProfile () {
		api.fetchProfile().then(res => {
			profile.value = res.data
			if (res.data.isVip) isVip.value = res.data.isVip
		}).catch(error => {
			console.log('fetchProfile error', error)
		})
	}
	
	function fetchBalance () {
		api.fetchUserPointsBalance().then(res => {
			balance.value = res.data.balance
		}).catch(error => {
			console.log('fetchBalance error', error)
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
	
	function goUserGuide () {
		// #ifdef MP-WEIXIN
		try {
			wx.openOfficialAccountArticle({url: 'https://mp.weixin.qq.com/s/XcTFGHHu57y9fw_t7F8A-w'})
		} catch (error) {
			uni.navigateTo({ url: '/pages/webview/webview?url=' + encodeURIComponent('https://mp.weixin.qq.com/s/XcTFGHHu57y9fw_t7F8A-w') })
		}
		// #endif
		
		// #ifdef MP-QQ
		this.copyText('https://mp.weixin.qq.com/s/XcTFGHHu57y9fw_t7F8A-w')
		// #endif
		
		// #ifdef H5
		uni.showLoading({ title: '加载中...' })
		window.location.href = 'https://mp.weixin.qq.com/s/XcTFGHHu57y9fw_t7F8A-w'
		// #endif
	}
	
	function openWechatAuthSetting () {
		wx.openAppAuthorizeSetting()
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
	
	.balance-card {
	}
</style>