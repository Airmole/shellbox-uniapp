<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>签到任务</view>
		</cu-custom>
		<view class="bg-gradual-blue" v-if="data !==''">
			<view class="flex justify-between padding-top-xs">
				<view class="margin-tb-sm"><view class="bg-gray padding-left-xl padding-right-xs round" style="margin-left: -46rpx;">已连续签到{{data.consecutiveDays}}天</view></view>
				<view><view @click="showCheckinDocument" class='cu-tag round line-white margin-sm'>签到规则</view></view>
			</view>
			<view class="flex flex-direction align-center justify-center">
				<button v-if="!data.todayCheckin" @click="checkIn" class='cu-avatar round xxl bg-gradual-green shadow'><text class="text-xl">签到</text></button>
				<button v-else :disabled="true" class='cu-avatar round xxl bg-grey shadow'><text class="text-xl text-black">已签到</text></button>
				<view class="margin-top">签到累积获得 <text class="iconfont icon-shell margin-lr-xs" :decode="true">{{data.sum}}&nbsp;</text>金贝壳</view>
			</view>
			<image class="gif-wave" :src="waterWaveUrl" mode="scaleToFill"></image>
		</view>
		<view>
			<wu-calendar
				:date="date"
				:type="type"
				:mode="mode"
				:color="color"
				:insert="insert"
				:fold="fold"
				:startWeek="startWeek"
				:slideSwitchMode="slideSwitchMode"
				:monthShowCurrentMonth="monthShowCurrentMonth"
				:lunar="lunar"
				:rangeEndRepick="rangeEndRepick"
				:rangeSameDay="rangeSameDay"
				:rangeHaveDisableTruncation="rangeHaveDisableTruncation"
				:showMonth="showMonth"
				:clearDate="clearDate"
				:useToday="useToday"
				:selected="checkedDates"
				@change="calendarChange"
				@monthSwitch="monthChange"
			></wu-calendar>	 
		</view>
		
		<view v-if="!isLogined"><tips tips="需先登录，方可签到~" image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"></tips></view>
		<view v-else>
			<view class="margin-top-xl margin">
				<text class="cuIcon-title text-green"></text> <text class="text-title text-lg text-bold">连续签到奖励</text>
			</view>
			<scroll-view :scroll-x="true">
				<view class="flex">
					<template v-for="(item, index) in 10" :key="index">
						<view class="padding-tb-sm bg-gradual-blue reward-item radius margin-lr-xs flex align-center">
							<view class="text-xxl margin-xs"><text class="bg-white round padding-xs text-blue cuIcon-redpacket_fill"></text></view>
							<view class="margin-xs flex justify-center flex-direction align-center">
								<view>连续签到第{{item}}天</view>
								<view v-if="index < 1" class="margin-top-xs"><view class='cu-tag round line-white'>送10金贝壳</view></view>
								<view v-else-if="index < 7" class="margin-top-xs"><view class='cu-tag round line-white'>送{{10+(5*index)}}金贝壳</view></view>
								<view v-else class="margin-top-xs"><view class='cu-tag round line-white'>送{{40}}金贝壳</view></view>
							</view>
						</view>					
					</template>
				</view>
			</scroll-view>
		</view>
		
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
		
		<!-- 签到规则 -->
		<view class="cu-modal bottom-modal" :class="showDocument?'show':''">
			<view class="cu-dialog padding-sm bg-gray">
				<view class="text-right">
					<view class="action text-blue text-xxl" @tap="showCheckinDocument"><text class="cuIcon-close text-red"></text></view>
				</view>
				<scroll-view class="padding text-left bg-white radius" style="height: 800rpx;" :scroll-y="true">
					<ua-markdown :source="checkinDocument"/>
				</scroll-view>
			</view>
		</view>
		
	</view>
</template> 
<script>
	const app = getApp()
	import api from '../../request/api'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	import { getTodayDateString } from '../../common/utils/tools'
	export default {
		data() {
			return {
				isVip: false,
				waterWaveUrl: 'https://shellbox-image.ustb.tj.cn/water-wave-light.webp',
				date: "",
				type: "week",
				mode: "single",
				color: "#3c9cff",
				insert: true,
				fold: true,
				startWeek: "mon",
				slideSwitchMode: "horizontal",
				monthShowCurrentMonth: false,
				lunar: false,
				rangeEndRepick: false,
				rangeSameDay: false,
				rangeHaveDisableTruncation: false,
				showMonth: true,
				clearDate: true,
				useToday: false,
				isLogined: true,
				checkedDates: [],
				data: '',
				showDocument: false,
				checkinDocument: ''
			}
		},
		onLoad () {
			this.isVip = app.globalData.isVip
			this.date = getTodayDateString()
			const sysInfo = uni.getSystemInfoSync()
			if (sysInfo.theme === 'dark') this.waterWaveUrl = 'https://shellbox-image.ustb.tj.cn/water-wave-dark.webp'
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
			this.fetchPointsCheckinIndex()
		},
		methods: {
			checkIn () {
				uni.showLoading({ title: '正在签到中...'})
				api.userPointsCheckin().then(res => {
					console.log(res)
					uni.showModal({ title: '签到成功', content: res.data.message, showCancel: false })
					this.fetchPointsCheckinIndex()
				}).catch(error => {
					console.log('checkIn error', error)
					uni.showToast({ title: error.data.message, icon: 'none' })
				}).finally(() => {
					uni.hideLoading()
				})
			},
			calendarChange(e) {
				console.log(e);
			},
			monthChange(e) {
				this.fetchPointsCheckinIndex(e.fullDate)
			},
			fetchPointsCheckinIndex (month = '') {
				uni.showLoading({ title: '加载中...'})
				api.fetchUserPointsCheckinIndex(month).then(res => {
					this.data = res.data
					const checkedDates = []
					for (var i = 0; i < res.data.calendar.length; i++) {
						const element = res.data.calendar[i]
						checkedDates.push({
							date: element,
							info: '已签到',
							infoColor: '#6ac695'
						})
					}
					this.checkedDates = checkedDates
				}).catch(error => {
					console.log('fetchPointsCheckinIndex error', error)
				}).finally(() =>{
					uni.hideLoading()
				})
			},
			showCheckinDocument () {
				if (!this.checkinDocument) {
					uni.showLoading({ title: '加载中...' })
					api.fetchPointsCheckinDocument().then(res => {
						this.checkinDocument = res.data
						this.showDocument = true
					}).catch(error => {
						console.log('showCheckinDocument error', error)
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
	.gif-wave {
		position: relative;
		width: 100%;
		bottom: -10rpx;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}
	
	.reward-item {
		min-width: 310rpx;
		height: 150rpx;
	}
</style>