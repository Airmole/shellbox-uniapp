<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>我的积分</view>
		</cu-custom>
		
		<template v-if="!isLogined">
			<tips tips="需要登录才能查看您的积分" image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"></tips>
		</template>
		<template v-else>
			<!-- 积分余额 -->
			<view class="bg-gradual-blue flex padding-bottom flex-direction text-center justify-center radius-bottom">
				<view class="flex justify-end margin-top-sm">
					<view @click="showPointsDocument" style="margin-right: -10rpx;" class='cu-tag round bg-white padding-right sm'>积分规则</view>
				</view>
				<view class="text-xxl">
					<text class="iconfont icon-shell"></text><text class="margin-lr-xs">{{data.balance}}</text><text class="text-xxl">金贝壳</text>
				</view>
				<view class="flex margin-top justify-center">
					<view>做任务得积分&nbsp;积分兑会员</view>
				</view>
			</view>
			<!-- 明细 -->
			<view class="cu-list menu sm-border card-menu margin-top-lg">
				<navigator v-if="isReleaseEnv" url="/pages/points/mall" class="cu-item arrow" :render-link="false">
				    <view class="content">
				        <text class="cuIcon-shop text-blue"></text>
				        <text class="text-grey">积分兑换商场</text>
				    </view>
				</navigator>
			    <view v-if="isReleaseEnv" class="cu-item arrow" @click="goRecharge">
			        <view class="content">
			            <text class="cuIcon-moneybag text-blue"></text>
			            <text class="text-grey">金贝壳积分充值</text>
			        </view>
			    </view>
			    <navigator url="/pages/points/history" class="cu-item arrow" :render-link="false">
			        <view class="content">
			            <text class="cuIcon-list text-blue"></text>
			            <text class="text-grey">查看金贝壳积分明细</text>
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
							<button v-else @click="goCheckin" class="cu-btn round bg-grey shadow sm"><text>已签到</text></button>
						</view>
					</view>
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-video text-blue"></text>
							<text class="text-grey" :decode="true">2.&nbsp;看视频广告得积分</text>（{{data.videoAds.finished}}/{{data.videoAds.total}}）
						</view>
						 <view class="action">
							<button v-if="fetchVideoAdFinished && data.videoAds.finished<data.videoAds.total" @click="showVideoAds" class="cu-btn round bg-gradual-blue shadow sm"><text></text>看视频</button>
							<view v-else-if="data.videoAds.finished==data.videoAds.total" class="cu-btn round bg-grey shadow sm"><text>已完成</text></view>
							<view v-else class="cu-btn round bg-grey shadow sm"><text>不可用</text></view>
						</view>
					</view>
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-profile text-blue"></text>
							<text class="text-grey" :decode="true">3.&nbsp;完善资料得积分(仅限首次)</text>
						</view>
						 <view class="action">
							<button v-if="!data.profileUpdated" @click="goProfileUpdate" class="cu-btn round bg-gradual-blue shadow sm"><text></text>去补充</button>
							<view v-else class="cu-btn round bg-grey shadow sm"><text>已完成</text></view>
						</view>
					</view>
				</view>
			</template>
			<!-- 积分兑换权益 -->
			<template v-if="isReleaseEnv && data.pointsGoods">
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
							<button @click="exchangeGoods(item)" class="cu-btn round bg-gradual-blue margin-lr-xs">兑换</button>
						</view>
					</view>
				</view>
				<navigator url="/pages/points/mall" class="text-center text-blue"><text>更多积分商品兑换...</text></navigator>
			</template>
		</template>
		
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isVip" class="margin margin-tb-xl radius">
			<ad-custom unit-id="adunit-3d7f1704631ec7ea" ad-intervals="30"></ad-custom>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-QQ -->
		<view v-if="!isVip" class="margin margin-tb-xl radius">
			<ad unit-id="f0256a9d11d62920007be2d67178cdd3" type="card"></ad>
		</view>
		<!-- #endif -->
		
		<!-- 金贝壳积分规则说明 -->
		<view class="cu-modal bottom-modal" :class="showDocument?'show':''">
			<view class="cu-dialog padding-sm bg-gray">
				<view class="text-right">
					<view class="action text-blue text-xxl" @tap="showPointsDocument"><text class="cuIcon-close text-red"></text></view>
				</view>
				<scroll-view class="padding text-left bg-white radius" style="height: 800rpx;" :scroll-y="true">
					<ua-markdown :source="pointsDocument"/>
				</scroll-view>
			</view>
		</view>

		
	</view>
</template>

<script>
	const app = getApp()
	import { getEdusysAccount } from '@/common/utils/auth.js'
	import api from '../../request/api'
	let videoAd = null
	export default {
		data() {
			return {
				isReleaseEnv: false,
				isVip: false,
				isLogined: true,
				pointsDocument: '',
				showDocument: false,
				data: '',
				fetchVideoAdFinished: false,
				usercode: ''
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			this.isReleaseEnv = (app.globalData.env === 'release')
			// #endif
			// #ifdef H5
			this.isReleaseEnv = true
			// #endif
			this.isVip = app.globalData.isVip = app.globalData.isVip
			const usercode = getEdusysAccount()
			this.usercode = usercode
			if (usercode === false) {
				this.isLogined = false
				return
			}
			// #ifdef MP-WEIXIN
			const adUnitId = 'adunit-6eaa05f3467dce0c'
			// #endif
			// #ifdef MP-QQ
			const adUnitId = 'dd90320609f722f9c6f37135eb404a71'
			// #endif
			
			// #ifdef MP
			const _this = this
			if (uni.createRewardedVideoAd) {
				videoAd = uni.createRewardedVideoAd({ adUnitId: adUnitId })
			    videoAd.onLoad(() => { this.fetchVideoAdFinished = true })
			    videoAd.onError((err) => {
				    this.fetchVideoAdFinished = false
				    console.error('激励视频广告加载失败', err)
				    uni.showModal({ title: err, showCancel: false })
			    })
			    videoAd.onClose((res) => {
					if (res.isEnded) {
						uni.showLoading({ title: '正在为您下发积分奖励...'})
						api.pointsVideoAdsPlayEnd().then(endRes => {
							_this.fetchData()
							uni.hideLoading()
							uni.showModal({ title: endRes.data.message, showCancel: false })
						}).catch(error => {
							console.log('pointsVideoAdsPlayEnd error', error)
							uni.showModal({ title: error, showCancel: false })
						}).finally(() => {
							uni.hideLoading()
						})
					} else {
						uni.showToast({ title: '广告中断，无法获得金贝壳奖励', icon: 'none'})
					}
				})
			}
			// #endif
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
				// #ifndef MP
				uni.showToast({ title: '仅支持小程序端看视频得积分' , icon: 'none'})
				return
				// #endif
				// #ifdef MP
				if (videoAd) {
				  videoAd.show().catch(() => {
				    // 失败重试
				    videoAd.load()
				      .then(() => videoAd.show()).catch(err => {
				        console.error('激励视频 广告显示失败', err)
						uni.showModal({ title: err, showCancel: false })
				      })
				  })
				}
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
			},
			exchangeGoods (goods) {
				if (parseInt(goods.price) > parseInt(this.data.balance)) {
					uni.showModal({ title: '提示', content: `您的金贝壳余额不足，需要${goods.price}金贝壳,您的金贝壳仅剩${this.data.balance}`, showCancel: false })
					return
				}
				var _this = this
				uni.showModal({
					title: '提示',
					content: `确认要兑换【${goods.title}】吗？`,
					success: function (confirmRes) {
						if (confirmRes.confirm) {
							uni.showLoading({ title: '正在为你兑换中...' })
							api.userPointsExchaneGoods(goods.id).then(res => {
								uni.hideLoading()
								if (res.data.balance) _this.data.balance = res.data.balance
								uni.showModal({ content: res.data.message, showCancel: false})
							}).catch(error => {
								console.log('exchangeGoods error', error)
								uni.showModal({ content: error.data.message, showCancel: false })
							}).finally(() => {
								uni.hideLoading()
							})
						}
					}
				})
			},
			goRecharge () {
				// #ifdef MP-WEIXIN
				uni.showModal({
					content: '在打开公众号页面的服务或菜单中点击【充值使用】->【会员丨充值】',
					success(res) {
						if (res.confirm) wx.openOfficialAccountProfile({ username: 'gh_0a3884f25944' })
					}
				})
				return
				// #endif				
				
				// #ifdef H5
				window.open('https://ifdian.net/a/Airmole?tab=shop')
				return
				// #endif
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
