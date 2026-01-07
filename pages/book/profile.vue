<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<view>借阅信息</view>
	</cu-custom>
	<view class="padding-bottom" v-if="isLogined">
		<!-- 读者证信息卡 -->
		<view class="bg-white margin-sm padding-sm card-radius" v-if="!error">
			<view class="text-center margin-bottom solid-bottom" v-if="profile"><text class="text-black">{{profile.name}}</text></view>
			<view class="solid-bottom" v-if="indexProfile">
				<view class="flex justify-around">
					<view class="flex-sub text-gray">借阅证有效期</view>
					<view class="flex-twice text-right text-black">{{indexProfile.licenceStart}} ~ {{indexProfile.licenceEnd}}</view>
				</view>
				<view class="flex justify-around">
					<view class="flex-sub text-gray">e-mail</view>
					<view class="flex-twice text-right text-black">{{indexProfile.email}}</view>
				</view>
				<template v-if="showProfileAll">
					<view class="flex justify-around" v-if="opacProfile.profile.idCardNO">
						<view class="flex-sub text-gray">身份证号码</view>
						<view class="flex-twice text-right text-black">{{opacProfile.profile.idCardNO}}</view>
					</view>
					<view class="flex justify-around" v-if="opacProfile">
						<view class="flex-sub text-gray">系别</view>
						<view class="flex-twice text-right text-black">{{opacProfile.profile.college}}</view>
					</view>	
					<view class="flex justify-around" v-if="opacProfile">
						<view class="flex-sub text-gray">职业/职称</view>
						<view class="flex-twice text-right text-black">{{opacProfile.profile.majorProfession}}</view>
					</view>
					<view class="flex justify-around" v-if="opacProfile">
						<view class="flex-sub text-gray">最多可借图书</view>
						<view class="flex-twice text-right text-black">{{indexProfile.canBorrowMax}}册</view>
					</view>
					<view class="flex justify-around" v-if="opacProfile">
						<view class="flex-sub text-gray">最多可预约图书</view>
						<view class="flex-twice text-right text-black">{{indexProfile.canPreorderMax}}册</view>
					</view>
					<view class="flex justify-around" v-if="opacProfile">
						<view class="flex-sub text-gray">最多可委托图书</view>
						<view class="flex-twice text-right text-black">{{indexProfile.canEntrustMax}}册</view>
					</view>
					<view class="flex justify-around" v-if="opacProfile">
						<view class="flex-sub text-gray margin-right-sm">证件号</view>
						<view class="flex-sub text-right text-black">{{opacProfile.profile.cardNO}}</view>
						<view class="flex-sub text-gray margin-left-sm">条码号</view>
						<view class="flex-sub text-right text-black">{{opacProfile.profile.barCodeNO}}</view>
					</view>
					<view class="flex justify-around" v-if="opacProfile">
						<view class="flex-sub text-gray margin-right-sm">生效日期</view>
						<view class="flex-sub text-right text-black">{{opacProfile.profile.effectiveDate}}</view>
						<view class="flex-sub text-gray margin-left-sm">失效日期</view>
						<view class="flex-sub text-right text-black">{{opacProfile.profile.expirationDate}}</view>
					</view>
					<view class="flex justify-around" v-if="opacProfile">
						<view class="flex-sub text-gray margin-right-sm">读者类型</view>
						<view class="flex-sub text-right text-black">{{opacProfile.profile.readerType}}</view>
						<view class="flex-sub text-gray margin-left-sm">借阅等级</view>
						<view class="flex-sub text-right text-black">{{opacProfile.profile.borrowRank}}</view>
					</view>
					<view class="flex justify-around" v-if="opacProfile">
						<view class="flex-sub text-gray margin-right-sm">累计借书</view>
						<view class="flex-sub text-right text-black">{{opacProfile.profile.borrowedBooksSum}}</view>
						<view class="flex-sub text-gray margin-left-sm">违章次数</view>
						<view class="flex-sub text-right text-black">{{opacProfile.profile.violationNum}}</view>
					</view>
					<view class="flex justify-around" v-if="opacProfile">
						<view class="flex-sub text-gray margin-right-sm">欠款金额</view>
						<view class="flex-sub text-right text-black">{{opacProfile.profile.overdraft}}</view>
						<view class="flex-sub text-gray margin-right-sm">工作单位</view>
						<view class="flex-sub text-right text-black">{{opacProfile.profile.workDept}}</view>
					</view>
					<!-- <view class="flex justify-around">
						<view class="flex-sub text-gray margin-right-sm">职位</view>
						<view class="flex-sub text-right text-black"></view>
						<view class="flex-sub text-gray margin-left-sm">性别</view>
						<view class="flex-sub text-right text-black">{{opacProfile.gender}}</view>
					</view>
					<view class="flex justify-around">
						<view class="flex-sub text-gray margin-right-sm">住址</view>
						<view class="flex-sub text-right text-black">3456789</view>
						<view class="flex-sub text-gray margin-left-sm">邮编</view>
						<view class="flex-sub text-right text-black">3456789</view>
					</view>
					<view class="flex justify-around">
						<view class="flex-sub text-gray margin-right-sm">电话</view>
						<view class="flex-sub text-right text-black">3456789</view>
						<view class="flex-sub text-gray margin-left-sm">手机</view>
						<view class="flex-sub text-right text-black">3456789</view>
					</view>
					<view class="flex justify-around">
						<view class="flex-sub text-gray margin-right-sm">出生日期</view>
						<view class="flex-sub text-right text-black">3456789</view>
						<view class="flex-sub text-gray margin-left-sm">文化程度</view>
						<view class="flex-sub text-right text-black">3456789</view>
					</view>
					<view class="flex justify-around">
						<view class="flex-sub text-gray margin-right-sm">押金</view>
						<view class="flex-sub text-right text-black">3456789</view>
						<view class="flex-sub text-gray margin-left-sm">手续费</view>
						<view class="flex-sub text-right text-black">3456789</view>
					</view> -->
				</template>
			</view>
			<view class="text-center margin-top-xs">
				<template v-if="!showProfileAll">
					<view @tap="displayMoreProfile" class="text-blue"><text class="cuIcon cuIcon-pulldown"></text>展开更多</view>
				</template>
				<template v-else>
					<view @tap="hideMoreProfile" class="text-blue"><text class="cuIcon cuIcon-pullup"></text>收起</view>
				</template>
			</view>
		</view>
		
		<!-- 数据卡片 -->
		<view class="bg-white margin-sm card-radius padding-tb-xs" v-if="indexProfile && !error">
			<view class="grid text-center col-4 cu-list">
				<view @tap="goBookReadingPage" class="padding-xs padding-tb-xs solid-right solid-bottom">
					<view><text v-if="indexProfile" class="text-xl text-bold">{{indexProfile.overdated}}</text><text v-else>0</text></view>
					<view><text class="text-xs"><text class="cuIcon-info"></text>超期图书</text></view>
				</view>
				<view class="padding-xs padding-tb-xs solid-right solid-bottom">
					<view><text v-if="indexProfile" class="text-xl text-bold">{{indexProfile.entrusted}}</text><text v-else>0</text></view>
					<view><text class="text-xs">委托到书</text></view>
				</view>
				<view class="padding-xs padding-tb-xs solid-right solid-bottom">
					<view><text v-if="indexProfile" class="text-xl text-bold">{{indexProfile.preordered}}</text><text v-else>0</text></view>
					<view><text class="text-xs">预约到书</text></view>
				</view>
				<view @tap="goBookBorrowHistory" class="padding-xs padding-tb-xs solid-right solid-bottom">
					<view><text v-if="opacProfile" class="text-xl text-bold">{{opacProfile.profile.borrowedBooksSum}}</text><text v-else>0</text></view>
					<view><text class="text-xs"><text class="cuIcon-info"></text>累计借书</text></view>
				</view>
			</view>
			<view class="grid text-center col-5 cu-list">
				<view class="padding-xs padding-tb-xs solid-right">
					<view><text v-if="indexProfile" class="text-xl text-bold">{{indexProfile.canBorrowMax}}</text><text v-else>0</text></view>
					<view><text class="text-xs">最多可借</text></view>
				</view>
				<view class="padding-xs padding-tb-xs solid-right">
					<view><text v-if="indexProfile" class="text-xl text-bold">{{indexProfile.canPreorderMax}}</text><text v-else>0</text></view>
					<view><text class="text-xs">最多可预约</text></view>
				</view>
				<view class="padding-xs padding-tb-xs solid-right">
					<view><text v-if="indexProfile" class="text-xl text-bold">{{indexProfile.canEntrustMax}}</text><text v-else>0</text></view>
					<view><text class="text-xs">最多可委托</text></view>
				</view>
				<view @tap="goBookScoreRecord" class="padding-xs padding-tb-xs solid-right">
					<view><text v-if="indexProfile" class="text-xl text-bold">{{indexProfile.scoreSum}}</text><text v-else>0</text></view>
					<view><text class="text-xs"><text class="cuIcon-info"></text>总积分</text></view>
				</view>
				<view @tap="goBookScoreRecord" class="padding-xs padding-tb-xs solid-right">
					<view><text v-if="indexProfile" class="text-xl text-bold">{{indexProfile.scoreUseful}}</text><text v-else>0</text></view>
					<view><text class="text-xs"><text class="cuIcon-info"></text>可用积分</text></view>
				</view>
			</view>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isVip" class="margin-lr margin-tb-sm radius">
			<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-QQ -->
		<view v-if="!isVip" class="margin-lr margin-tb-sm radius">
			<ad unit-id="297c24fcd434022129795daed3f46440"></ad>
		</view>
		<!-- #endif -->
		
		<view class="cu-list menu sm-border card-radius margin-lr-sm" v-if="!error">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="/pages/book/borrowRule">
					<text class="cuIcon cuIcon-title text-green margin-lr-xs"></text>
					<text class="text-grey">查看适用借阅规则</text>
				</navigator>
			</view>
		</view>

		<!-- 借阅分类饼图 -->
		<view class="margin-sm bg-white card-radius" v-if="pieData">
			<view class="cu-bar">
				<view class="action border-title">
					<text class="cuIcon cuIcon-titles text-green"></text><text class="text-xl text-bold">借阅分类分布</text>
				</view>
			</view>
			<view class="pie-charts-box"><qiun-data-charts type="pie" :opts="pieOpts" :chartData="pieData"/></view>
		</view>
		
		<!-- 借阅时间分布柱状图 -->
		<view class="margin-sm bg-white card-radius" v-if="columnData">
			<view class="cu-bar">
				<view class="action border-title">
					<text class="cuIcon cuIcon-titles text-green"></text><text class="text-xl text-bold">借阅时间分布</text>
				</view>
			</view>
			<view class="column-charts-box"><qiun-data-charts type="column" :opts="columnOpts" :chartData="columnData"/></view>
		</view>
		
		<!-- 借阅趋势线图 -->
		<view class="margin-sm bg-white card-radius" v-if="lineData">
			<view class="cu-bar">
				<view class="action border-title">
					<text class="cuIcon cuIcon-titles text-green"></text><text class="text-xl text-bold">借阅趋势</text>
				</view>
			</view>
			<view class="line-charts-box"><qiun-data-charts type="line" :opts="lineOpts" :chartData="lineData"/></view>
		</view>
		
		<!-- 借阅分析 -->
		<view class="margin-sm bg-white card-radius padding-bottom" v-if="indexProfile">
			<view class="cu-bar">
				<view class="action border-title">
					<text class="cuIcon cuIcon-titles text-green"></text><text class="text-xl text-bold">借阅分析</text>
				</view>
			</view>
			<view class="padding-lr">
				<view class="cu-progress round bg-gray">
					<view class="bg-gradual-blue" :style="`width: ${indexProfile.rankPercent};`">{{indexProfile.rankPercent}}</view>
				</view>
			</view>
			<view class="margin-xs text-center">在所有读者中，排在<text class="text-xxl text-orange margin-lr-xs">{{indexProfile.rankPercent}}</text>的人之前</view>
		</view>
		<tips
			v-if="error"
			tips="学校系统当前不稳定，请稍后再试"
			image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
		></tips>
	</view>
	<template v-else>
		<tips
			tips="查看借阅信息需要登录统一认证账号"
			image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
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
				error: false,
				showProfileAll: false,
				profile: '',
				indexProfile: '',
				opacProfile: '',
				pieData: '',
				pieOpts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"],
					padding: [5, 5, 5, 5],
					enableScroll: false,
					extra: {
						pie: {
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
				columnOpts: {
					color: ["#FAC858"],
					padding: [15,15,0,5],
					enableScroll: false,
					legend: {},
					xAxis: { disableGrid: true},
					yAxis: {
					  data: [{ min: 0 }]
					},
					extra: {
					  column: {
						type: "group",
						width: 30,
						activeBgColor: "#000000",
						activeBgOpacity: 0.08,
						linearType: "custom",
						seriesGap: 5,
						linearOpacity: 0.5,
						barBorderCircle: true,
						customColor: [ "#FA7D8D", "#EB88E2"]
					  }
					}
				},
				columnData: '',
				lineOpts: {
					color: ["#1890FF"],
					padding: [15,10,0,15],
					enableScroll: false,
					legend: {},
					xAxis: { disableGrid: true},
					yAxis: { gridType: "dash", dashLength: 2, data: [{ min: -10 }] },
					extra: { line: { type: "straight", width: 2, activeType: "hollow" } }
				},
				lineData: ''
			}
		},
		onLoad () {
			this.isVip = app.globalData.isVip
			// #ifdef MP-WEIXIN
			if (wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-5a3621a7eb4da121'
			})
			// #endif
			// #ifdef MP-QQ
			if (qq.createInterstitialAd) interstitialAd = qq.createInterstitialAd({
				adUnitId: '7be7a448772d36a43560aabf2b2a1a0c'
			})
			// #endif

			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
			
			app.globalData.loginPromise.then(res => {
				this.profile = res
				console.log('app.globalData.profile', res)
			})
			this.fetchProfile()
			this.fetchStatistics()
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			displayMoreProfile() {
				this.showProfileAll = true
			},
			hideMoreProfile() {
				this.showProfileAll = false
			},
			fetchProfile () {
				uni.showLoading({ title: '正在加载'})
				api.fetchOpacsysIndexProfile().then(res => {
					if (res.data.code != 200) {
						console.log('fetchOpacsysIndexProfile', res.data)
						this.error = true
					} else {
						this.indexProfile = res.data.data
					}
				}).catch(error => {
					console.log('fetchOpacsysIndexProfile', error)
					this.error = true
				}).finally(() => {
					uni.hideLoading()
				})
				api.fetchOpacsysProfileRule().then(res => {
					if (res.data.code != 200) {
						console.log('fetchOpacsysProfileRule', res.data)
					} else {
						this.opacProfile = res.data.data
					}
					console.log('opacProfile', res.data.data)
				}).catch(error => {
					console.log('fetchOpacsysProfileRule', error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			fetchStatistics () {
				// 借阅分类图数据
				api.fetchOpacsysStatistics('class').then(res => {
					if (!res.data.code) {
						let pieData = { series: [{ data: [] }] }
						for (let i = 0; i < res.data.length; i++) {
							const item = res.data[i]
							pieData.series[0].data.push({
								name: item.legendText,
								value: item.y,
								labelText: item.indexLabel
							})
						}
						this.pieData = pieData
					}
				})
				// 借阅时间分布数据
				api.fetchOpacsysStatistics('year').then(res => {
					console.log('fetchOpacsysStatistics year')
					if (!res.data.code) {
						let columnData = { categories: [],series: [ { name: "借阅册次", data: [] }] }
						for (let i = 0; i < res.data.length; i++) {
							const item = res.data[i]
							columnData.categories.push(`${item.x}年`)
							columnData.series[0].data.push(item.y)
						}
						this.columnData = columnData
					}
				})
				// 借阅趋势数据
				api.fetchOpacsysStatistics('month').then(res => {
					if (!res.data.code) {
						let lineData = { categories: [], series: [ { name: "借阅册次",data: [] }] }
						for (var i = 0; i < res.data.length; i++) {
							const item = res.data[i]
							lineData.categories.push((parseInt(item.month) + 1) + `月`)
							lineData.series[0].data.push(item.y)
						}
						this.lineData = lineData
					}
				})
			},
			goBookScoreRecord () {
				uni.navigateTo({ url: '/pages/book/score' })
			},
			goBookReadingPage () {
				uni.navigateTo({ url: '/pages/book/reading' })
			},
			goBookBorrowHistory () {
				uni.navigateTo({ url: '/pages/book/history' })
			},
		}
	}
</script>

<style>
	.pie-charts-box {
		width: 100%;
		height: 300px;
	}
	.column-charts-box {
		width: 100%;
		height: 200px;
	}
	.line-charts-box {
		width: 100%;
		height: 200px;
	}
</style>