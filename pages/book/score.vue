<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>借阅积分</view>
		</cu-custom>

	<view class="cu-list menu sm-border card-menu shadow margin-top shadow">
		<view class="cu-bar bg-white solid-bottom" @click="showOptionsArea">
			<view class="action">
				<text class="cuIcon-title text-green"></text> 筛选操作
			</view>
			<view class="action text-right">
				<text :class="'cuIcon-'+(foldOptionsArea?'right':'unfold')"></text>
			</view>
		</view>
			<template v-if="!foldOptionsArea">
				<view class="cu-form-group">
					<view class="title">类别</view>
					<picker @change="scoreTypeChange" :value="scoreTypeIndex" :range="scoreTypeOptions" range-key="label">
						<view class="picker">
							{{scoreTypeIndex!==null?scoreTypeOptions[scoreTypeIndex].label:'全部'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">开始日期</view>
					<picker mode="date" :value="optionsForm.startDate" @change="startDateChange">
						<view class="picker">
							{{optionsForm.startDate?optionsForm.startDate:'不限'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">结束日期</view>
					<picker mode="date" :value="optionsForm.endDate" @change="endDateChange">
						<view class="picker">
							{{optionsForm.endDate?optionsForm.endDate:'不限'}}
						</view>
					</picker>
				</view>
				<view class="cu-item">
					<view class="content"></view>
					<view class="action">
						<button @click="resetOptionsForm" class="cu-btn round bg-red shadow margin-lr"><text
								class="cuIcon cuIcon-refresh"></text> 重置</button>
						<button @click="fetchScore" class="cu-btn round bg-green shadow"><text
								class="cuIcon cuIcon-search"></text> 查询</button>
					</view>
				</view>
			</template>
		</view>
		
		<!-- 广告位 -->
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isVip" class="margin margin-tb-xl radius">
			<ad-custom unit-id="adunit-3d7f1704631ec7ea" ad-intervals="30"></ad-custom>
		</view>
		<!-- #endif -->
		
		<!-- 积分列表 -->
		<template v-if="!isLogined">
			<tips tips="查询读者积分需登录账号" image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif" :showButton="true" buttonText="现在登录"
				path="/pages/index/login"></tips>
		</template>
		<template v-else>
			<template v-if="scoreList !== '' && scoreList.ret.length === 0">
				<tips tips="没有查询到符合条件的记录" image="/static/image/nothing.png"></tips>
			</template>
			<view class="cu-list menu sm-border card-menu shadow margin-top shadow" v-if="scoreList">
				<view class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="cuIcon-title text-green"></text> 当前积分总额
					</view>
					<view class="action"><text class="text-xxl text-bold">{{scoreList.currentScore}}</text></view>
				</view>
				<view class="bg-white padding-sm solid-bottom" v-for="(item, index) in scoreList.ret" :key="index">
					<view class="flex">
						<view class="flex-sub">积分名称</view>
						<view class="flex-sub text-right">{{item.scoreName}}</view>
					</view>
					<view class="flex">
						<view class="flex-sub">操作状态</view>
						<view class="flex-sub text-right">{{item.sysDetailName}}</view>
					</view>
					<view class="flex">
						<view class="flex-sub">积分值</view>
						<view class="flex-sub text-right">
							<text v-if="item.scoreSign==0" class="text-green">+{{item.scoreNum}}</text>
							<text v-if="item.scoreSign==1" class="text-red">-{{item.scoreNum}}</text>分
						</view>
					</view>
					<view class="flex">
						<view class="flex-sub">操作时间</view>
						<view class="flex-sub text-right">{{item.createDate}}</view>
					</view>
				</view>
			</view>
			<!-- 分页器 -->
			<view class="flex justify-between padding-lr-sm margin-top align-center" v-if="scoreList && scoreList.ret">
				<view class="flex-sub"><button @tap="lastPage" v-if="optionsForm.page>1" class="cu-btn round bg-gradual-blue">上一页</button></view>
				<view class="flex-twice text-center"><text>第{{optionsForm.page}}页丨共{{scoreList.lastPage}}页</text></view>
				<view class="flex-sub text-right"><button @tap="nextPage" v-if="optionsForm.page<scoreList.lastPage" class="cu-btn round bg-gradual-blue">下一页</button></view>
			</view>
		</template>
		
		<template v-if="errorMessage">
			<tips :tips="errorMessage" image="/static/image/nothing.png" :showButton="true" buttonText="返回"
				path="/pages/index/feature"></tips>
		</template>
		
	</view>
</template>

<script>
	const app = getApp()
	import api from '@/request/api.js'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	export default {
		data() {
			return {
				isVip: false,
				isLogined: true,
				foldOptionsArea: false,
				scoreTypeIndex: null,
				scoreTypeOptions: [
					{ label: '全部', value: null },
					{ label: '增加', value: 0 },
					{ label: '扣除', value: 1 }
				],
				optionsForm: {
					page: 1,
					rows: 10,
					scoreSign: null,
					startDate: '',
					endDate: ''
				},
				scoreList: '',
				errorMessage: '',
			}
		},
		onLoad() {
			this.isVip = app.globalData.isVip
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
			
			
			this.fetchScore()
		},
		methods: {
			showOptionsArea () {
				this.foldOptionsArea = !this.foldOptionsArea
			},
			scoreTypeChange (e) {
				const index = e.detail.value
				this.scoreTypeIndex = index
				this.optionsForm.scoreSign = this.scoreTypeOptions[index].value
			},
			startDateChange (e) {
				const value = e.detail.value
				this.optionsForm.startDate = value
			},
			endDateChange (e) {
				const value = e.detail.value
				this.optionsForm.endDate = value
			},
			resetOptionsForm () {
				this.scoreTypeIndex = null
				this.optionsForm = {
					page: 1,
					rows: 10,
					scoreSign: null,
					startDate: '',
					endDate: ''
				}
			},
			fetchScore () {
				if (!this.isLogined) {
					uni.showToast({ title: '需要登录', icon: 'none' })
					return
				}
				
				uni.showLoading({ title: '加载中...'})
				api.fetchLibspScoreList(
					this.optionsForm.page,
					this.optionsForm.rows,
					this.optionsForm.scoreSign,
					this.optionsForm.startDate,
					this.optionsForm.endDate
				).then(res => {
					const lastPage = Math.ceil(res.data.data.totalCount / this.optionsForm.rows)
					res.data.data.lastPage = lastPage
					this.scoreList = res.data.data
				}).catch(error => {
					this.errorMessage = error.data.message
				}).finally(() => {
					uni.hideLoading()
				})
			},
			lastPage () {
				let page = this.optionsForm.page - 1
				if (page <= 1) page = 1
				this.optionsForm.page = page
				this.fetchScore()
			},
			nextPage () {
				let page = parseInt(this.optionsForm.page) + 1
				if (page >= this.scoreList.lastPage) page = this.scoreList.lastPage
				this.optionsForm.page = page
				this.fetchScore()
			}
		}
	}
</script>

<style>

</style>