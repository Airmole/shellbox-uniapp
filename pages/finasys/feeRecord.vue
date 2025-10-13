<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<view>学校缴费记录</view>
	</cu-custom>
	<view v-if="isLogined">

		<view class="cu-card dynamic radius" v-for="(item, index) in datalist" :key="index">
			<view class="cu-item shadow padding margin">
				<view class="cu-bar bg-white" @click="fold" :data-index="index">
					<view class="action">
						<text class="cuIcon-titles text-cyan"></text>
						<text class="text-xl text-bold">{{item.xmmc}}</text>
					</view>
					<view class="action">
						<text :class="`cuIcon-${item.unfold?'unfold':'right'} text-cyan`"></text>
					</view>
				</view>
				<view class="text-content" style="max-height: unset;">
					<view class="flex">
						<view class="flex-sub"><text class="text-gray">应收：</text><text
								class="text-price">{{item.xysje}}</text></view>
						<view class="flex-sub"><text class="text-gray">实收：</text><text
								class="text-price">{{item.sjje}}</text></view>
					</view>
					<view class="flex">
						<view class="flex-sub"><text class="text-gray">抵扣金额：</text><text
								class="text-price">{{item.dkje}}</text></view>
						<view class="flex-sub"><text class="text-gray">退费金额：</text><text
								class="text-price">{{item.tfje}}</text></view>
					</view>
					<view class="flex">
						<view class="flex-sub"><text class="text-gray">减免金额：</text><text
								class="text-price">{{item.jmje}}</text></view>
						<view class="flex-sub"><text class="text-gray">缴费次数：</text><text class="">{{item.jfcs}}次</text>
						</view>
					</view>
				</view>
				<view :style="`display:${item.unfold?'block':'none'};`">
					<view class="cu-list menu-avatar comment solids-top" v-for="(sitem, sindex) in item.children"
						:key="sindex">
						<view class="cu-item">
							<view class="content">
								<view class="text-content" style="display: block;">
									<view class="text-bold"><text
											class="cuIcon-title text-cyan"></text>{{sitem.sfnd}}{{sitem.sfqjmc}}</view>
									<view class="flex">
										<view class="flex-sub"><text class="text-gray">应收：</text><text
												class="text-price">{{sitem.xysje}}</text>
										</view>
										<view class="flex-sub"><text class="text-gray">实收：</text><text
												class="text-price">{{sitem.sjje}}</text>
										</view>
									</view>
									<view class="flex">
										<view class="flex-sub"><text class="text-gray">抵扣金额：</text><text
												class="text-price">{{sitem.dkje}}</text></view>
										<view class="flex-sub"><text class="text-gray">退费金额：</text><text
												class="text-price">{{sitem.tfje}}</text></view>
									</view>
									<view class="flex">
										<view class="flex-sub"><text class="text-gray">减免金额：</text><text
												class="text-price">{{sitem.jmje}}</text></view>
										<view class="flex-sub"><text class="text-gray">缴费次数：</text><text
												class="">{{sitem.jfcs}}次</text></view>
									</view>
								</view>
								<view class="bg-gray padding-sm radius margin-top-sm margin-left-sm text-sm"
									v-for="(ssitem, ssindex) in sitem.children" :key="ssindex">
									<view>
										<view><text class="cuIcon-title text-cyan"></text><text
												class="text-black">实收金额：</text><text
												class="text-price text-xl text-cyan">{{ssitem.sjje}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
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
			tips="查询缴费记录需登录账号"
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
				datalist: '',
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
			formatDatalist: function(array = []) {
				let result = []
				// 一级目录
				array.forEach(element => {
					if (element.ParentTaskUID == -1) {
						element.unfold = true
						result.push(element)
					}
				})
				// 二级目录
				array.forEach(element => {
					result.forEach(function(subele, subidx) {
						if (!subele.children) {
							result[subidx].children = []
						}
						if (element.ParentTaskUID == subele.UID) {
							result[subidx].children.push(element)
						}
					})
				})
				// 三级目录
				array.forEach(element => {
					result.forEach(function(subele, subidx) {
						subele.children.forEach(function(ssubele, ssubidx) {
							if (!ssubele.children) {
								result[subidx].children[ssubidx].children = []
							}
							if (element.ParentTaskUID == ssubele.UID) {
								result[subidx].children[ssubidx].children.push(element)
							}
						})
					})
				})
				// console.log(result)
				return result.reverse()
			},
			fold: function(e) {
				const index = e.currentTarget.dataset.index
				let datalist = this.datalist
				datalist[index].unfold = !datalist[index].unfold
				this.datalist = datalist
			},
			getDatalist: function(page = 0, pagesize = 30) {
				uni.showLoading({ title: '等等，我加载下'})

				api.fetchFinasysTreePaidRecords(page, pagesize).then(res => {
					this.datalist = this.formatDatalist(res.data.data)
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
			  title: `财务缴费记录 - 贝壳小盒子`,
			  path: `/pages/finasys/feeRecord`
			}
		},
		onShareTimeline() {
			return {
				title: `财务缴费记录 - 贝壳小盒子`,
			}
		}
	}
</script>

<style>

</style>