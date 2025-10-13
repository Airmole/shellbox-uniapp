<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<view>缴费订单记录</view>
	</cu-custom>
	<view v-if="isLogined">
		
		<view class="cu-card dynamic radius" v-for="(item, index) in datalist" :key="index">
		  <view class="cu-item shadow margin">
		    <view class="cu-bar">
		      <view class="action">
		        <text class="cuIcon-titles text-cyan"></text>
		        <text class="text-xl text-bold">{{item.OrderDetailList[0].Year}}{{item.OrderDetailList[0].FeeRange.Name}}{{item.OrderDetailList[0].Project.Name}}</text>
		      </view>
		    </view>
		    <view class="text-content" style="max-height: unset;">
		      <view class="flex">
		        <view class="flex-sub"><text class="text-gray">订单编号：</text><text class="text-price">{{item.OrderNo}}</text></view>
		      </view>
		      <view class="flex">
		        <view class="flex-sub"><text class="text-gray">订单金额：</text><text class="text-price">{{item.Amount}}</text></view>
		        <view class="flex-sub"><text class="text-gray">支付金额：</text><text class="text-price">{{item.PayAmount}}</text></view>
		      </view>
		      <view class="flex">
		        <view class="flex-sub"><text class="text-gray">收费方式：</text><text class="">{{item.ChargeType.Name}}</text></view>
		      </view>
		      <view class="flex">
		        <view class="flex-sub"><text class="text-gray">订单状态：</text><text class="">{{item.OrderStatus}}</text></view>
		      </view>
		      <view class="flex">
		        <view class="flex-sub"><text class="text-gray">订单时间：</text><text class="">{{item.CreateDate}}</text></view>
		      </view>
		    </view>
		  </view>
		</view>
		
		<view v-if="datalist.length == 0" class="margin-xl padding-xl text-center">
		  <tips tips="这里是空的，什么都没有~"></tips>
		</view>
		<view v-else class="margin-bottom-xl padding-bottom-xl text-center">
		  <view class="padding-xl margin-bottom-xl"><text class="text-black">到底啦~什么都没有了</text></view>
		</view>
		
	</view>
	<template v-else>
		<tips
			tips="查询缴费订单记录需登录账号"
			image="/static/image/nothing.png"
			:showButton="true"
			buttonText="立即登录"
			path="/pages/index/login"
		></tips>
	</template>
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
				data: '',
				datalist: []
			}
		},
		onLoad() {
			this.isVip = app.globalData.isVip
			// #ifdef MP-WEIXIN
			if(wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif
			// #ifdef MP-QQ
			if (qq.createInterstitialAd) interstitialAd = qq.createInterstitialAd({ adUnitId: '8fe9b8e7191346a2ffb0c20c6bf3e0cf' })
			// #endif
			
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
			this.getDatalist()	
		},
		methods: {
			getDatalist: function(page = 0, pagesize = 30) {
				uni.showLoading({ title: '等等，我加载下' })
				
				api.fetchFinasysOrder(page, pagesize).then(res => {
					this.datalist = res.data.data.data
					console.log('this.datalist', this.datalist)
					this.data = res.data.data
				}).catch(error => {
					let title = 'error'
					if (error.data && error.data.message) title = error.data.message
					uni.showToast({
						title: title,
						icon: 'none'
					})
				}).finally(() => {
					uni.hideLoading()
				})
			}
		},
		onShareAppMessage() {
			return {
			  title: `财务订单记录 - 贝壳小盒子`,
			  path: `/pages/finasys/orderRecord`
			}
		},
		onShareTimeline() {
			return {
				title: `财务订单记录 - 贝壳小盒子`,
			}
		}
	}
</script>

<style>

</style>