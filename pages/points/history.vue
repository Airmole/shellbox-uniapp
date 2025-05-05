<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>积分明细</view>
		</cu-custom>
		
		<view class="margin">
			<view :class="'cu-list menu sm-border '+(foldOptionsArea?'round':'card-radius')">
				<view class="cu-item press-class" @click="showOptionsArea">
					<view class="content"><text class="cuIcon-title text-green"></text>明细记录筛选</view>
					<view class="action text-right"><text :class="'cuIcon-'+(foldOptionsArea?'right':'unfold')"></text></view>
				</view>
				<template v-if="!foldOptionsArea">
					<view class="cu-item">
						<view class="content"><text class="text-grey">收支类型</text></view>
						<view class="action">
							<picker @change="typeChange" :value="typeIndex" :range="typeOptionsList" range-key="name">
								<view class="picker">
									{{typeIndex>-1?typeOptionsList[typeIndex].name:'全部'}}
								</view>
							</picker>
						</view>
					</view><view class="cu-item">
						<view class="content"><text class="text-grey">积分来源</text></view>
						<view class="action">
							<picker @change="bizTypeChange" :value="bizTypeIndex" :range="bizTypeOptionsList" range-key="name">
								<view class="picker">
									{{bizTypeIndex>-1?bizTypeOptionsList[bizTypeIndex].name:'全部'}}
								</view>
							</picker>
						</view>
					</view>
					<view class="cu-item">
						<view class="content">
						</view>
						<view class="action">
							<button @click="resetOptionsForm" class="cu-btn round bg-red shadow margin-lr"><text
									class="cuIcon-refresh"></text> 重置</button>
							<button @click="fetchData()" class="cu-btn round bg-green shadow"><text
									class="cuIcon-search"></text> 查询</button>
						</view>
					</view>
				</template>
			</view>
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
		
		<template v-if="!isLogined">
			<tips tips="查看积分明细，需先登录~" image="https://r2.airmole.net/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"></tips>
		</template>
		<template v-else>
			<view class="cu-list menu sm-border card-menu margin-top-xl">
				<view class="cu-item" v-for="(item, index) in data.data" :key="index">
					<view class="content padding-tb-sm">
						<view><text class="cuIcon-title text-green margin-right-xs"></text> {{item.remark}}</view>
						<view class="text-gray text-sm">
							<view>
								<text class="cuIcon-activityfill margin-right-xs text-blue"></text> {{bizTypes[item.biz_type]}}{{item.type === '1' ? '发放':'扣除'}}{{item.amount}}金贝壳丨金贝壳数：{{item.balance}}<text :decode="true">\n</text>
								<text class="cuIcon-time text-blue margin-right-xs"></text> {{item.created_at}}		
							</view>
						</view>
					</view>
					<view class="action">
						<text class="iconfont icon-shell text-yellow"></text><text class="text-yellow">{{item.amount}}</text>
					</view>
				</view>
			</view>
			<!-- 无数据 -->
			<template v-if="data && data.pager && data.pager.total==0"><tips tips="还没有符合条件的数据" image="https://r2.airmole.net/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"></tips></template>
			<!-- 分页器 -->
			<view v-if="data && data.pager" class="flex margin align-center text-center">
				<view class="flex-sub"><button v-if="data.pager.currentPage!=1" @click="lastPage" class="cu-btn round bg-gradual-blue">上一页</button></view>
				<view class="flex-sub">第{{data.pager.currentPage}}页丨共{{data.pager.pageCount}}页</view>
				<view class="flex-sub"><button v-if="data.pager.currentPage!=data.pager.pageCount" @click="nextPage" class="cu-btn round bg-gradual-blue">下一页</button></view>
			</view>
		</template>
		
	</view>
</template>

<script>
	const app = getApp()
	import api from '../../request/api'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	export default {
		data() {
			return {
				isVip: false,
				isLogined: true,
				bizTypes: {
					'order': '订单',
					'videoAds': '视频广告',
					'recharge': '充值兑换',
					'checkin': '签到',
					'activity': '活动',
					'profile': '更新资料'
				},
				typeIndex: -1,
				typeOptionsList: [
					{ name: '全部', value: '' },
					{ name: '收入', value: '1' },
					{ name: '支出', value: '2' },
				],
				bizTypeIndex: -1,
				bizTypeOptionsList: [
					{ name: '全部', value: '' },
					{ name: '订单', value: 'order' },
					{ name: '视频广告', value: 'videoAds' },
					{ name: '充值兑换', value: 'recharge' },
					{ name: '签到', value: 'checkin' },
					{ name: '活动', value: 'activity' },
					{ name: '更新资料', value: 'profile' },
				],
				form: {
					type: '',
					bizType: ''
				},
				data: '',
				foldOptionsArea: true,
			}
		},
		onLoad() {
			this.isVip = app.globalData.isVip
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
			this.fetchData()
		},
		methods: {
			fetchData(page = 1) {
				uni.showLoading({ title: '正在加载中...' })
				api.fetchUserPointsBalanceHistory(page, this.form.type, this.form.bizType).then(res => {
					this.data = res.data
					console.log(res.data)
				}).catch(error => {
					console.log('fetchUserPointsBalanceHistory error', error)
					uni.showModal({ content: error.data.message, showCancel: false})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			showOptionsArea() {
				this.foldOptionsArea = !this.foldOptionsArea
			},
			typeChange (e) {
				const index = e.detail.value
				this.typeIndex = index
				this.form.type = this.typeOptionsList[index].value
			},
			bizTypeChange (e) {
				const index = e.detail.value
				this.bizTypeIndex = index
				this.form.bizType = this.bizTypeOptionsList[index].value
			},
			resetOptionsForm () {
				this.typeIndex = -1
				this.bizTypeIndex = -1
				this.form = {
					type: '',
					bizType: ''
				}
				this.fetchData()
			},
			lastPage () {
				this.fetchData(this.data.pager.currentPage - 1)
			},
			nextPage () {
				this.fetchData(this.data.pager.currentPage + 1)
			}
		}
	}
</script>

<style>

</style>
