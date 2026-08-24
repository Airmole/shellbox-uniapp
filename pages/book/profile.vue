<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>借阅信息</view>
		</cu-custom>
		
		<view class="grid margin-bottom text-center col-3 cu-list margin bg-white card-radius shadow">
			<view class="padding"><view class="text-bold text-xxl margin-bottom-xs">{{userLimitData.userRequestNum}}</view><view>请求到书</view></view>
			<view class="padding"><view class="text-bold text-xxl margin-bottom-xs">{{userLimitData.userLoanExpiredNum}}</view><view>借书超期</view></view>
			<view class="padding"><view class="text-bold text-xxl margin-bottom-xs">{{userLimitData.userBehavierNotDealNum}}</view><view>未处理行为</view></view>
		</view>
		
		<!-- 广告位 -->
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isVip" class="margin margin-tb-xl radius">
			<ad-custom unit-id="adunit-3d7f1704631ec7ea" ad-intervals="30"></ad-custom>
		</view>
		<!-- #endif -->
		
		<template v-if="isLogined">
			<!-- 读者信息 -->
			<view class="cu-list menu sm-border card-menu shadow" v-if="readerInfo">
				<view class="cu-bar bg-white solid-bottom" @click="showReaderInfo">
					<view class="action">
						<text class="cuIcon-title text-green"></text> 读者信息
					</view>
					<view class="action text-right">
						<text :class="'cuIcon-'+(foldReaderInfo?'right':'unfold')"></text>
					</view>
				</view>
				<template v-if="!foldReaderInfo">
					<view class="cu-item">
					    <view class="content">
							<text class="cuIcon-peoplefill text-grey"></text>
					        <text class="text-grey">姓名</text>
					    </view>
						<view class="action">{{readerInfo.user.name}}</view>
					</view>
					<view class="cu-item">
					    <view class="content">
							<text class="cuIcon-vipcard text-grey"></text>
					        <text class="text-grey">学号</text>
					    </view>
						<view class="action">{{readerInfo.user.primaryId}}</view>
					</view>
					<view class="cu-item">
					    <view class="content">
							<text class="cuIcon-barcode text-grey"></text>
					        <text class="text-grey">借阅证号</text>
					    </view>
						<view class="action">{{readerInfo.user.userBarcode}}</view>
					</view>
					<view class="cu-item">
					    <view class="content">
							<text class="cuIcon-timefill text-grey"></text>
					        <text class="text-grey">有效期</text>
					    </view>
						<view class="action">{{readerInfo.user.startDate}} ~ {{readerInfo.user.endDate}}</view>
					</view>
				</template>
			</view>
			
			<!-- 借阅饼图 -->
			 <view class="charts-box bg-white margin card-radius" v-show="showChart">
				 <view class="cu-bar bg-white solid-bottom card-radius" @click="showChartArea">
				 	<view class="action">
				 		<text class="cuIcon-title text-green"></text> 借阅统计
				 	</view>
					<view class="action text-right">
						<text :class="'cuIcon-'+(foldChart?'right':'unfold')"></text>
					</view>
				 </view>
			    <qiun-data-charts
				  v-show="!foldChart"
			      type="ring"
			      :opts="chartOpts"
			      :chartData="chartData"
			    />
			</view>
			
			<!-- 借阅规则 -->
			<view class="text-center margin-top text-xl">读者借阅规则</view>
			
			<view class="bg-white shadow margin card-radius" v-for="(item, index) in loanRules" :key="index">
				<view class="cu-bar bg-white solid-bottom card-radius" @click="showRuleFold" :data-index="index">
					<view class="action">
						<text class="cuIcon-title text-green"></text> {{item.ruleName}}
					</view>
					<view class="action text-right">
						<text :class="'cuIcon-'+(item.fold?'right':'unfold')"></text>
					</view>
				</view>
				<template v-if="!item.fold">
					<view class="flex justify-around padding-xs">
						<view class="flex-sub">适用流通政策</view>
						<view class="flex-twice"><text :decode="true">{{item.applicablePolicy}}</text></view>
					</view>
					<view class="flex justify-around padding-sm">
						<view class="flex-sub">最大借阅册数</view>
						<view class="flex-twice">{{item.maxBorrowingNumber}}</view>
					</view>
					<view class="flex justify-around padding-sm">
						<view class="flex-sub">最大续借次数</view>
						<view class="flex-twice">{{item.maxRenewalTime}}</view>
					</view>
					<view class="flex justify-around padding-sm">
						<view class="flex-sub">最大逾期费用</view>
						<view class="flex-twice">{{item.maxPenalty}}</view>
					</view>
					<view class="flex justify-around padding-sm">
						<view class="flex-sub">正常借期</view>
						<view class="flex-twice">{{item.normalLoanPeriod}}</view>
					</view>
					<view class="flex justify-around padding-sm">
						<view class="flex-sub">保留本数</view>
						<view class="flex-twice">{{item.keepBookNum}}</view>
					</view>
					<view class="flex justify-around padding-sm">
						<view class="flex-sub">适用馆藏地</view>
						<view class="flex-twice">{{item.applicableLocation}}</view>
					</view>
				</template>
			</view>
		</template>
		<template v-else>
			<tips tips="查询读者信息需登录账号" image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif" :showButton="true" buttonText="现在登录"
				path="/pages/index/login"></tips>
		</template>
		
		
	</view>
</template>

<script>
	const app = getApp()
	import api from '@/request/api.js'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	export default {
		data () {
			return {
				isVip: false,
				isLogined: true,
				foldReaderInfo: false,
				foldChart: false,
				showChart: false,
				chartData: {},
				chartOpts: {
					rotate: false,
					rotateLock: false,
					color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
					padding: [5,5,5,5],
					dataLabel: true,
					enableScroll: false,
					legend: {
					  show: true,
					  position: "bottom",
					  lineHeight: 25
					},
					title: { name: "" },
					subtitle: { name: "" },
					extra: {
					  ring: {
						ringWidth: 60,
						activeOpacity: 0.5,
						activeRadius: 10,
						offsetAngle: 0,
						labelWidth: 15,
						border: true,
						borderWidth: 3,
						borderColor: "#FFFFFF"
					  }
					}
				},
				userLimitData: {
					userRequestNum: 0,
					userLoanExpiredNum: 0,
					userBehavierNotDealNum: 0
				},
				readerInfo: '',
				loanRules: ''
			}
		},
		onLoad() {
			this.isVip = app.globalData.isVip
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
			
			this.getLoanChartData()
			this.getUserLimt()
			this.getReaderInfo()
			this.getReaderLoanRule()
		},
		onReady() {
		},
		methods: {
			getUserLimt () {
				api.fetchLibspUserLimit().then(res => {
					this.userLimitData = res.data.data
					// console.log(this.userLimitData)
				})
			},
			getReaderInfo () {
				api.fetchLibspUserInfo().then(res => {
					this.readerInfo = res.data.data
				})
			},
			getReaderLoanRule () {
				api.fetchLibspLoanRules().then(res => {
					let loanRules = res.data.data
					for (var index = 0; index < loanRules.length; index++) {
						loanRules[index].fold = false						
					}
					this.loanRules = loanRules
				})
			},
			getLoanChartData () {
				api.fetchLibspLoanChart().then(res => {
					let callNoMap = {}
					for (let i = 0; i < res.data.data.classNo.length; i++) {
						const callNoItem = res.data.data.classNo[i]
						callNoMap[callNoItem.code] = callNoItem.name
					}
					let chartData = []
					for (var i = 0; i < res.data.data.callNoMapDtos.length; i++) {
						const chartDataItem = res.data.data.callNoMapDtos[i]
						let callNoText = callNoMap[chartDataItem.callNo]
						if (!callNoText) callNoText = '' // 索书号字母是其他
						if (callNoText.length > 6) callNoText = callNoText.substring(6) + '...'
						chartData.push({
							name: `${chartDataItem.callNo}${callNoText}`,
							value: chartDataItem.num,
							labelText: `${chartDataItem.callNo}${callNoText}:${chartDataItem.num}`
						})
					}
					// console.log(chartData)
					this.chartData =  { series: [{ data: chartData }] }
					this.showChart = chartData.length > 0 ? true : false
				})
			},
			showRuleFold  (e) {
				const index = e.currentTarget.dataset.index
				this.loanRules[index].fold = !this.loanRules[index].fold
			},
			showReaderInfo () {
				this.foldReaderInfo = !this.foldReaderInfo
			},
			showChartArea () {
				this.foldChart = !this.foldChart
			}
		}
	}
</script>

<style>
	.charts-box {
	    width: 92%;
	  }
</style>
