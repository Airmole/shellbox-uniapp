<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>历史借阅</view>
		</cu-custom>
		
		<view class="margin-top" v-if="isLogined">
			<view class="cu-list menu sm-border card-menu bg-white" v-for="(item, index) in data.bookList" :key="index">
				<view class="text-center margin-top-sm text-bold text-lg">{{item.title}}</view>
				<view class="cu-item">
					<view class="content"><text class="text-grey">责任者</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.author}}</text></view>
				</view>
				<view class="cu-item">
					<view class="content"><text class="text-grey">条码号</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.barcode}}</text></view>
				</view>
				<view class="cu-item">
					<view class="content"><text class="text-grey">馆藏地</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.place}}</text></view>
				</view>
				<view class="cu-item">
					<view class="content text-left">借阅：<text>{{item.borrowDate}}</text></view>
					<view class="content text-right">归还：<text>{{item.returnDate}}</text></view>
				</view>
			</view>
			
			<!-- 分页器 -->
			<view class="flex margin-right-sm margin-top justify-end" v-if="data">
			  <button @tap="lastPage" v-if="data.page > 1"
			    class="cu-btn bg-black round shadow">上一页</button>
			  <view v-if="data.page > 0" class="text-black margin-sm">{{data.page}} / {{data.totalPage}}</view>
			  <button @tap="nextPage" v-if="data.page < data.totalPage && data.page > 0" class="cu-btn bg-black round shadow">下一页</button>
			</view>
			
			<tips
				v-if="data && data.bookList.length == 0"
				tips="没有借阅过任何图书"
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
			this.fetchHistoryBooks()
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			fetchHistoryBooks (page = 1) {
				uni.showLoading({ title: '正在加载...'})
				api.fetchOpacsysBorrowedHistory(page).then(res => {
					this.data = res.data
					console.log('fetchOpacsysBorrowedHistory', res.data)
				}).catch(error => {
					console.log('fetchOpacsysBorrowedHistory', error)
					this.error = true
				}).finally(() => {
					uni.hideLoading()
				})
			},
			  // 上一页
			  lastPage: function () {
				const current = this.data.page
				const targetPage = current > 1 ? Number(current) - 1 : 2
				this.fetchHistoryBooks(targetPage)
			  },
			  // 下一页
			  nextPage: function () {
				const current = this.data.page
				const last = this.data.totalPage
				const targetPage = current < last ? Number(current) + 1 : last
				this.fetchHistoryBooks(targetPage)
			}
		}
	}
</script>

<style>

</style>
