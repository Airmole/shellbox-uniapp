<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<view>缴费缓交申请</view>
	</cu-custom>
	
	<view v-if="isLogined">
		<scroll-view scroll-x class="bg-gradual-blue nav">
			<view class="flex text-center">
				<template v-for="(item, index) in tabs" :key="index">
					<view :class="`cu-item flex-sub ${item.value==tab?'text-white cur':''}`" @click="tabChanged"
						:data-index="index">{{item.title}}</view>
				</template>
			</view>
		</scroll-view>
		
		<view class="cu-card dynamic radius" v-for="(item, index) in datalist" :key="index">
		  <view class="cu-item shadow margin">
		    <view class="cu-bar">
		      <view class="action">
		        <text class="cuIcon-titles text-cyan"></text>
		        <text class="text-xl text-bold">{{item.Year}}{{item.FeeRange.Name}}{{item.ChargeProject.Name}}</text>
		      </view>
		    </view>
		    <view class="text-content" style="max-height: unset;">
		      <view class="flex">
		        <view class="flex-sub" v-if="tab=='pending'"><text class="text-gray">欠费金额：</text><text class="text-price">{{item.Overdue}}</text></view>
		        <view class="flex-sub" v-if="tab=='finished'"><text class="text-gray">应收金额：</text><text class="text-price">{{item.ShowReceivable}}</text></view>
		        <view class="flex-sub"><text class="text-gray">缓交金额：</text><text class="text-price">{{tab == 'pending' ? item.Defer : item.Amount.Amount}}</text></view>
		      </view>
		      <view class="flex">
		        <view class="flex-sub"><text class="text-gray">到期日期：</text><text class="">{{item.showDate}}</text></view>
		      </view>
		      <view class="flex">
		        <view class="flex-sub" wx:if="{{tab == 'pending'}}"><text class="text-gray">上传附件：</text><text class="">{{item.EnableAttachment}}</text></view>
		        <view class="flex-sub" wx:else><text class="text-gray">申请附件：</text><text class="">{{item.FileName}}</text></view>
		      </view>
		      <view class="flex" v-if="item.Zxdkhzjym">
		        <view class="flex-sub"><text class="text-gray">助学贷款回执校验码：</text><text class="">{{item.Zxdkhzjym}}</text></view>
		      </view>
		    </view>
		  </view>
		</view>
		
		
		<view v-if="datalist.length == 0" class="margin-xl padding-xl text-center">
		  <tips tips="没有符合条件的数据记录~"></tips>
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
					title: '可缓交',
					value: 'pending'
				}, {
					title: '已缓交',
					value: 'finished'
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
			tabChanged: function(e) {
				const tab = this.tabs[e.currentTarget.dataset.index].value
				this.tab = tab
				const record = tab == 'pending' ? 'false' : 'true'
				this.getDatalist(record)
			},
			getDatalist: function(record = 'true', page = 0, pagesize = 30) {
				uni.showLoading({ title: '等等，我加载下' })
				api.fetchFinasysDefer(page, pagesize, record).then(res => {
					if (res.data && res.data.data && res.data.data.data) {
						const datalist = this.formatAllDate(res.data.data.data)
						this.datalist = datalist
					}
					this.data = res.data
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
			},
			formatAllDate: function(array) {
				let result = []
				array.forEach(element => {
					const showDate = new Date(parseInt(element.DelayEndTime.substr(6, 13)))
					.toLocaleDateString()
					element.showDate = showDate
					result.push(element)
				})
				return result
			}
		},
		onShareAppMessage() {
			return {
			  title: `财务缓交申请记录 - 贝壳小盒子`,
			  path: `/pages/finasys/deferApply`
			}
		},
		onShareTimeline() {
			return {
				title: `财务缓交申请记录 - 贝壳小盒子`,
			}
		}
	}
</script>

<style>

</style>