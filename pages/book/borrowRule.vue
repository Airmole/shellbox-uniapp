<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>借阅规则</view>
		</cu-custom>
		
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

		<view class="margin-top" v-if="isLogined">
			<view class="cu-list menu sm-border card-menu" v-for="(item, index) in rules" :key="index">
				<view class="cu-bar bg-white solid-bottom">
					<view class="action border-title">
						<text class="cuIcon cuIcon-titles text-green"></text>
						<text class="text-xl text-bold">{{item.name}}</text>
					</view>
				</view>
				<view class="cu-item solid-bottom">
					<view class="content"><text class="text-grey">图书流通类型</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.bookType}}</text></view>
				</view>
				<view class="cu-item solid-bottom">
					<view class="content"><text class="text-grey">最大借阅册数</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.canBorrowMax}}</text></view>
				</view>
				<view class="cu-item solid-bottom">
					<view class="content"><text class="text-grey">借期</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.day}}</text></view>
				</view>
				<view class="cu-item solid-bottom">
					<view class="content"><text class="text-grey">预约</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.preorder}}</text></view>
				</view>
				<view class="cu-item solid-bottom">
					<view class="content"><text class="text-grey">续借</text></view>
					<view class="action"><text class="text-grey text-sm">{{item.renew}}</text></view>
				</view>
				<view class="cu-item solid-bottom flex">
					<view class="content flex-sub"><text class="text-grey">适用馆藏地</text></view>
					<view class="action flex-twice padding-sm"><text
							class="text-grey text-sm">{{item.place}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content"></view>
					<view class="action">
						<button @tap="showRuleDetail(item.ruleNo)" class="cu-btn round bg-green shadow">查看借阅规则</button>
					</view>
				</view>
			</view>
			<tips
				v-if="error"
				tips="学校系统当前不稳定，请稍后再试"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
			></tips>
		</view>
		<template v-else>
			<tips
				tips="查看借阅信息需要登录统一认证账号"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
				:showButton="true"
				buttonText="立即登录"
				path="/pages/index/login"
			></tips>
		</template>
		
		<!-- 借阅规则详情模态框 -->
		<view class="cu-modal bottom-modal" :class="displayRuleDetail?'show':''">
			<view class="cu-dialog" style="height: 1000upx;" v-if="ruleDetail">
				<view class="cu-bar bg-white">
					<view class="action"></view>
					<view class="action text-bold">{{ruleDetail[0].content}}</view>
					<view class="action text-red" @tap="hideRuleDetail"><text class="cuIcon-close"></text></view>
				</view>
				<view class="padding-tb">
					<scroll-view scroll-y="true" style="height: 900upx;">
							<view class="cu-list menu card-menu">
								<view class="cu-item" v-for="(item,index) in ruleDetail">
									<view class="content text-left"><text class="text-grey">{{item.title}}</text></view>
									<view class="action text-right"><text class="text-grey text-sm">{{item.content}}</text></view>
								</view>
							</view>
							<view class="margin-tb padding-tb"></view>
					</scroll-view>
				</view>
			</view>
		</view>


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
				ruleId: '',
				rules: '',
				ruleDetail: '',
				displayRuleDetail: false,
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
			this.fetchProfileRule()
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			showRuleDetail(ruleNo) {
				uni.showLoading({ title: '正在加载...' })
				api.fetchOpacsysRuleDetail(ruleNo).then(res => {
					if (res.data.code != 200) {
						uni.showToast({ title: res.data.message })
					} else {
						this.displayRuleDetail = true
						this.ruleDetail = res.data.data
					}
				}).catch(error => {
					console.log('fetchOpacsysRuleDetail', error)
				}).finally(()=> {
					uni.hideLoading()
				})
			},
			hideRuleDetail() {
				this.displayRuleDetail = false
			},
			fetchProfileRule () {
				uni.showLoading({ title: '正在加载' })
				api.fetchOpacsysProfileRule().then(res => {
					this.rules = res.data.data.rules
					console.log('this.rules', this.rules)
				}).catch(error => {
					console.log('fetchProfileRule', error)
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>

</style>