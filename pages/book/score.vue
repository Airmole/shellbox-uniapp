<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>借阅积分</view>
		</cu-custom>
		
		<template v-if="isLogined">
			<view class="margin-top"></view>
			<view class="cu-list menu sm-border card-menu">
				<view class="cu-item" v-for="(item, index) in data.data" :key="index">
					<view class="content padding-tb-sm">
						<view>
							{{item.typeName}}
						</view>
						<view class="text-gray text-sm">
							{{item.datetime}} | {{item.comment}}
						</view>
					</view>
					<view class="action">
						{{item.action}}{{item.value}}分
					</view>
				</view>
			</view>
			
			
			<!-- 分页器 -->
			<view class="flex margin-right-sm margin-top justify-end">
			  <button
			    class="cu-btn bg-black round shadow">上一页</button>
			  <view class="text-black margin-sm">1 /
			    2</view>
			  <button class="cu-btn bg-black round shadow">下一页</button>
			</view>
			
			<tips
				v-if="data && data.bookList && data.bookList.length == 0"
				tips="当前没有任何积分记录"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
			></tips>
			<tips
				v-if="error"
				tips="学校系统当前不稳定，请稍后再试"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
			></tips>
		</template>
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
			
			this.fetchScoreRecord()
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			fetchScoreRecord () {
				uni.showLoading({ title: '正在加载...'})
				api.fetchOpacsysScoreRecord().then(res => {
					console.log('fetchOpacsysScoreRecord', res.data)
					this.data = res.data
				}).catch(error => {
					console.log('fetchOpacsysScoreRecord', error)
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