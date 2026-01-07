<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>当前借阅</view>
		</cu-custom>
		
		<view v-if="isLogined">
			<view class="bg-white margin padding-xs card-radius">
				<view class="text-center text-lg text-bold">当前借阅</view>
				<view class="flex justify-around padding-lr solid-bottom">
					<view class="flex-sub text-left">当前借阅：<text class="text-blue">{{data.nowBorrow}}</text></view>
					<view class="flex-sub text-right">最多借阅：<text class="text-blue">{{data.maxBorrow}}</text></view>
				</view>
			</view>
		
			<view class="flex justify-center margin-tb" v-if="data.tips">
				<view class="cu-info">
					<text class="cuIcon-roundclosefill text-red "></text> {{data.tips}}
				</view>
			</view>
			
			<view class="cu-list menu sm-border card-menu bg-white" v-for="(item, index) in data.bookList">
				<view class="text-center margin-top-sm text-bold text-lg">item.title</view>
				<view class="cu-item">
					<view class="content"><text class="text-grey">条码号</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.barcode}}</text></view>
				</view>
				<view class="cu-item">
					<view class="content"><text class="text-grey">题名/责任者</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.title}}/{{item.author}}</text></view>
				</view>
				<view class="cu-item">
					<view class="content"><text class="text-grey">借阅日期</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.borrowedAt}}</text></view>
				</view>
				<view class="cu-item">
					<view class="content"><text class="text-grey">应还日期</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.needReturnAt}}</text></view>
				</view>
				<view class="cu-item">
					<view class="content"><text class="text-grey">续借量</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.renewCount}}</text></view>
				</view>
				<view class="cu-item">
					<view class="content"><text class="text-grey">馆藏地</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.place}}</text></view>
				</view>
				<view class="cu-item">
					<view class="content"><text class="text-grey">附件</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.attachment}}</text></view>
				</view>
			</view>
			<tips
				v-if="data.bookList.length == 0"
				tips="当前没有借阅的图书"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
			></tips>
			<tips
				v-if="error"
				tips="学校系统当前不稳定，请稍后再试"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
			></tips>
		</view>
		<template v-else>
			<tips
				tips="查看借阅图书需要登录统一认证账号"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
				:showButton="true"
				buttonText="立即登录"
				path="/pages/index/login"
			></tips>
		</template>
		
	</view>
</template>

<script>
	const app = getApp()
	import api from '@/request/api.js'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	let interstitialAd = null
	export default {
		data() {
			return {
				isVip: false,
				isLogined: true,
				error: false,
				data: '',
			}
		},
		onLoad () {
			this.isVip = app.globalData.isVip
			// #ifdef MP-WEIXIN
			if (wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-5a3621a7eb4da121'
			})
			// #endif
			// #ifdef MP-QQ
			if (qq.createInterstitialAd) interstitialAd = qq.createInterstitialAd({
				adUnitId: '7be7a448772d36a43560aabf2b2a1a0c'
			})
			// #endif
		
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
			
			this.fetchReadingBooks()
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			fetchReadingBooks () {
				uni.showLoading({ title: '正在加载...'})
				api.fetchOpacsysReadingBooks().then(res => {
					console.log('fetchOpacsysReadingBooks', res.data)
					if (res.data.code != 200) {
						uni.showToast({ title: res.data.message })
					} else {
						this.data = res.data
					}
				}).catch(error => {
					console.log('fetchOpacsysReadingBooks', error)
					this.error = true
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>

</style>
