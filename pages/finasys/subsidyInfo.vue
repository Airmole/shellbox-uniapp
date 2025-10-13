<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<view>学生补助信息</view>
	</cu-custom>
	<view v-if="isLogined">
		
		<scroll-view scroll-x class="bg-gradual-blue nav">
		  <view class="flex text-center">
		    <view :class="`cu-item flex-sub ${item.value==tab?'text-white cur':''}`" v-for="(item, index) in tabs" :key="index"
		      @click="tabChanged" :data-index="index">{{item.title}}</view>
		  </view>
		</scroll-view>
		
		<view class="cu-card dynamic radius" v-for="(item, index) in datalist" :key="index">
		  <view class="cu-item shadow margin">
		    <view class="cu-bar">
		      <view class="action">
		        <text class="cuIcon-titles text-cyan"></text>
		        <text class="text-xl text-bold">{{item.GrantDate}}{{item.SubsidyType}}</text>
		      </view>
		    </view>
		    <view class="text-content" style="max-height: unset;">
		      <view class="flex">
		        <view class="flex-sub"><text class="text-gray">发放金额：</text><text class="text-price">{{item.Payable}}</text></view>
		      </view>
		      <view class="flex">
		        <view class="flex-sub"><text class="text-gray">抵扣项目：</text><text class="">{{item.DiKouItems[0].DYear}}{{item.DiKouItems[0].DFeeRange}}{{item.DiKouItems[0].DBaseChargeProject}}</text></view>
		      </view>
		      <view class="flex">
		        <view class="flex-sub"><text class="text-gray">抵扣金额：</text><text class="text-price">{{item.DiKouItems[0].DDeductible}}</text></view>
		        <view class="flex-sub"><text class="text-gray">实际发放金额：</text><text class="text-price">{{item.Paid}}</text></view>
		      </view>
		      <view class="flex">
		        <view class="flex-sub"><text class="text-gray">状态：</text><text class="">{{item.State}}</text></view>
		      </view>
		      <view class="flex">
		        <view class="flex-sub" wx:if="{{item.Remark}}"><text class="text-gray">发放说明：</text><text class="">{{item.Remark ? item.Remark : ''}}</text></view>
		      </view>
		    </view>
		  </view>
		</view>
		
		<view v-if="datalist.length == 0" class="margin-xl padding-xl text-center">
		  <tips tips="没有符合条件的数据~"></tips>
		</view>
		<view v-else class="margin-bottom-xl padding-bottom-xl text-center">
		  <view class="padding-xl margin-bottom-xl"><text class="text-black">到底啦~什么都没有了</text></view>
		</view>

	</view>
	<template v-else>
		<tips
			tips="查询缴费缓缴记录需登录账号"
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
				tab: 'finished',
				tabs: [{
					title: '已发放',
					value: 'finished'
				}, {
					title: '待发放',
					value: 'pending'
				}],
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
			tabChanged(e) {
				const tab = this.tabs[e.currentTarget.dataset.index].value
				this.tab = tab
				const unrelease = tab == 'pending' ? 'true' : 'false'
				this.getDatalist(unrelease)
			},
			getDatalist(unrelease = 'false', page = 0, pagesize = 30) {
				uni.showLoading({
					title: '等等，我加载下'
				})

				api.fetchFinasysSubsidy(page, pagesize, unrelease).then(res => {
					this.datalist = res.data.data.data
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
			  title: `财务补助信息 - 贝壳小盒子`,
			  path: `/pages/finasys/subsidyInfo`
			}
		},
		onShareTimeline() {
			return {
				title: `财务补助信息 - 贝壳小盒子`,
			}
		}
	}
</script>

<style>

</style>