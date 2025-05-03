<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>我的积分</view>
		</cu-custom>
		
		<template v-if="!isLogined">
			<tips tips="需要登录才能查看您的积分" image="https://r2.airmole.net/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"></tips>
		</template>
		<template v-else>
			<!-- 积分余额 -->
			<view class="bg-gradual-blue flex padding-bottom flex-direction text-center justify-center radius-bottom">
				<view class="flex justify-end margin-top-sm">
					<view @click="showPointsDocument" style="margin-right: -10rpx;" class='cu-tag round bg-white padding-right sm'>积分规则</view>
				</view>
				<view class="text-xl">
					<text class="iconfont icon-shell"></text><text class="text-xxl margin-lr-xs">{{data.balance}}</text><text class="text-df">金贝壳</text>
				</view>
				<view class="margin-top">
					做任务得积分&nbsp;积分兑会员
				</view>
			</view>
			<!-- 明细 -->
			<view class="cu-list menu sm-border card-menu margin-top-lg">
			    <navigator url="/pages/points/history" class="cu-item arrow" :render-link="false">
			        <view class="content">
			            <text class="cuIcon-list text-blue"></text>
			            <text class="text-grey">查看积分明细</text>
			        </view>
			    </navigator>
			</view>
			<!-- 积分任务 -->
			<template v-if="data !== ''">
				<view class="margin-top-xl text-center"><text>积分任务</text></view>
				<view class="cu-list menu sm-border card-menu margin-tb">
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-squarecheck text-blue"></text>
							<text class="text-grey" :decode="true">1.&nbsp;每日签到得积分</text>
						</view>
						 <view class="action">
							<button v-if="!data.todayCheckin" @click="goCheckin" class="cu-btn round bg-gradual-blue shadow sm"><text>去签到</text></button>
							<button v-else @click="goCheckin" class="cu-btn round bg-grey shadow sm"><text class="text-black">已签到</text></button>
						</view>
					</view>
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-video text-blue"></text>
							<text class="text-grey" :decode="true">2.&nbsp;看视频广告得积分</text>（{{data.videoAds.finished}}/{{data.videoAds.total}}）
						</view>
						 <view class="action">
							<button v-if="data.videoAds.finished<data.videoAds.total" @click="showVideoAds" class="cu-btn round bg-gradual-blue shadow sm"><text></text>看视频</button>
							<button v-else :disabled="true" class="cu-btn round bg-grey shadow sm"><text>已完成</text></button>
						</view>
					</view>
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-profile text-blue"></text>
							<text class="text-grey" :decode="true">3.&nbsp;补充完善资料得积分</text>
						</view>
						 <view class="action">
							<button v-if="!data.profileUpdated" @click="goProfileUpdate" class="cu-btn round bg-gradual-blue shadow sm"><text></text>去补充</button>
							<button v-else class="cu-btn round bg-grey shadow sm"><text></text>已完成</button>
						</view>
					</view>
				</view>
			</template>
			<!-- 积分兑换权益 -->
			<template v-if="data.pointsGoods">
				<view class="margin-top-xl text-center"><text>积分兑换权益</text></view>
				<view class="bg-gray margin">
					<view class="flex margin-tb" v-for="(item, index) in data.pointsGoods" :key="index">
						<view class="basis-xl flex padding-sm radius bg-white coupon-content">
							<view class='cu-avatar radius lg' :style="`background-image: url(${item.image});`"></view>
							<view class="margin-lr">
								<view class="text-lg">{{item.title}}</view>
								<view class="margin-tb-xs"><text class="iconfont icon-shell text-yellow"></text><text class="text-yellow">{{item.price}} 金贝壳</text>可兑换</view>
							</view>
						</view>
						<view class="basis-xs bg-white radius flex align-center coupon-action">
							<button class="cu-btn round bg-gradual-blue margin-lr-xs">兑换</button>
						</view>
					</view>
				</view>
			</template>
		</template>
		
		<!-- 金贝壳积分规则说明 -->
		<view class="cu-modal bottom-modal" :class="showDocument?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green"></view>
					<view class="action text-blue" @tap="showPointsDocument"><text class="cuIcon-close text-red"></text></view>
				</view>
				<scroll-view class="padding-lg text-left bg-white" style="height: 800rpx;" :scroll-y="true">
					<ua-markdown :source="pointsDocument"/>
				</scroll-view>
			</view>
		</view>

		
	</view>
</template>

<script>
	import { getEdusysAccount } from '@/common/utils/auth.js'
	import api from '../../request/api'
	export default {
		data() {
			return {
				isLogined: true,
				pointsDocument: '',
				showDocument: false,
				data: ''
			}
		},
		onLoad() {
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
		},
		onShow() {
			this.fetchData()
		},
		methods: {
			fetchData () {
				uni.showLoading({ title: '加载中...'})
				api.fetchUserPointsBalanceIndex().then(res => {
					this.data = res.data
				}).catch(error=> {
					console.log('fetchData error', error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			goCheckin () {
				uni.navigateTo({ url: '/pages/points/checkin' })
			},
			showVideoAds () {
				// #ifndef MP-WEIXIN
				uni.showToast({ title: '仅支持微信小程序端看视频得积分' , icon: 'none'})
				return
				// #endif
				// #ifdef MP-WEIXIN
				// TODO...
				// #endif
			},
			goProfileUpdate () {
				// #ifndef MP-WEIXIN
				uni.showToast({ title: '仅支持微信小程序端更新设置头像昵称' , icon: 'none'})
				return
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateTo({ url: '/pages/setting/profile'})
				// #endif
			},
			showPointsDocument () {
				if (!this.pointsDocument) {
					uni.showLoading({ title: '加载中...' })
					api.fetchUserPointsDocument().then(res => {
						this.pointsDocument = res.data
						this.showDocument = true
					}).catch(error => {
						console.log('showPointsDocument error', error)
					}).finally(() => {
						uni.hideLoading()
					})
				} else {
					this.showDocument = !this.showDocument
				}
			}
		}
	}
</script>

<style>
.radius-bottom {
	border-bottom-left-radius: 20rpx;
	border-bottom-right-radius: 20rpx;
}

.coupon-content {
	border-top-right-radius: 16rpx;
	border-bottom-right-radius: 16rpx;
}

.coupon-action {
	border-top-left-radius: 16rpx;
	border-bottom-left-radius: 16rpx;
}
</style>
