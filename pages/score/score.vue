<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>成绩查询</view>
		</cu-custom>

		<view class="margin" v-if="isLogined">
			<view class="text-left text bg-white padding-sm text-red card-radius">
				<text><text class="cuIcon-info margin-lr-xs"></text>本应用算术平均分及加权平均分由程序自动计算得来，结果仅供参考！具体准确加权分和GPA绩点建议咨询导员或学校教务处。</text>
			</view>
		</view>

		<!-- 成绩筛选操作区 -->
		<view class="margin">
			<view :class="'cu-list menu sm-border '+(foldOptionsArea?'round':'card-radius')">
				<view class="cu-item press-class" @click="showOptionsArea">
					<view class="content">
						<text class="cuIcon-title text-green"></text> 成绩筛选操作
					</view>
					<view class="action text-right">
						<text :class="'cuIcon-'+(foldOptionsArea?'right':'unfold')"></text>
					</view>
				</view>
				<template v-if="!foldOptionsArea">
					<view class="cu-item">
						<view class="content">
							<text class="text-grey">学年学期</text>
						</view>
						<view class="action">
							<picker @change="semesterChange" :value="semesterIndex" :range="semesterOptionsList"
								range-key="name">
								<view class="picker">
									{{semesterIndex>-1?semesterOptionsList[semesterIndex].name:'全部学期'}}
								</view>
							</picker>
						</view>
					</view>
					<view class="cu-item">
						<view class="content">
							<text class="text-grey">课程性质</text>
						</view>
						<view class="action">
							<picker @change="natureChange" :value="natureIndex" :range="natureOptionsList"
								range-key="name">
								<view class="picker">
									{{natureIndex>-1?natureOptionsList[natureIndex].name:'---请选择---'}}
								</view>
							</picker>
						</view>
					</view>
					<view class="cu-item">
						<view class="content">
							<text class="text-grey">课程名称</text>
						</view>
						<view class="action text-right">
							<input placeholder="请输入课程名称" name="course" v-model="optionForm.course" />
						</view>
					</view>
					<view class="cu-item">
						<view class="content">
							<text class="text-grey">显示方式</text>
						</view>
						<view class="action">
							<picker @change="showChange" :value="showIndex" :range="showOptionsList" range-key="name">
								<view class="picker">
									{{showIndex>-1?showOptionsList[showIndex].name:'显示全部成绩'}}
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
							<button @click="fetchScore" class="cu-btn round bg-green shadow"><text
									class="cuIcon-search"></text> 查询</button>
						</view>
					</view>
				</template>
			</view>
		</view>

		<!-- 广告位 -->
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

		<template v-if="score !== '' && score.data.length === 0">
			<tips tips="没有查询到符合条件的成绩" image="/static/image/nothing.png"></tips>
		</template>

		<!-- 学期成绩图表 -->
		<view class="margin-tb-sm" v-show="showChart">
			<canvas canvas-id="semesterScoreChart" id="semesterScoreChart" class="charts" @touchend="scoreChartTap" />
		</view>

		<!-- 成绩展示区域 -->
		<template v-if="isLogined">
			<view class="cu-list menu sm-border card-menu" v-for="(semester, semesterIdx) in score.data"
				:key="semesterIdx">
				<view class="cu-item press-class" @click="foldSemesterScore(semesterIdx)">
					<view class="content">
						<text class="cuIcon-medal text-blue"></text> {{semester.semester}} 学期
					</view>
					<view class="action text-right">
						<text :class="'text-bold cuIcon-'+(semester.fold?'right':'unfold')"></text>
					</view>
				</view>
				<template v-if="!semester.fold">
					<template v-for="(record, index) in semester.items" :key="index">
						<view @click="showDetail(semesterIdx, index)" class="cu-item press-class arrow">
							<view class="content padding-tb-sm text-cut">
								<view class="text-title">
									<text
										class="text-black text-cut">{{record.courseName}}</text>({{record.courseType}})
								</view>
								<view class="text-gray text-sm">
									<text class="margin-right-xs">{{record.examNature}}</text>
									<text class="margin-lr-xs">{{record.period}}学时</text>
									<text class="margin-lr-xs">{{record.credit}}学分</text>
								</view>
							</view>
							<view class="action text-bold">
								<!-- #ifdef MP -->
								<text v-if="record.score == '请评教'" class="text-lg text-red"><text
										@tap.stop="goEvaluateTeacher"
										class="cuIcon-question">{{record.score}}</text></text>
									<!-- #endif -->
								<!-- #ifndef MP -->
								<text v-if="record.score.includes('评教')" class="text-lg text-red"><text
										@tap.stop="goEvaluateTeacher"
										class="cuIcon-question">{{record.score}}</text></text>
									<!-- #endif -->
								<text v-else-if="record.score >= 90" class="text-lg text-blue">{{record.score}}</text>
								<text v-else-if="record.score < 60" class="text-lg text-red">{{record.score}}</text>
								<text v-else class="text-lg text-black">{{record.score}}</text>
							</view>
						</view>
						<!-- #ifdef MP-WEIXIN -->
						<view v-if="index !== 0 && index % 10 === 0 && !isVip" class="bg-white">
							<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
						</view>
						<!-- #endif -->
						<!-- #ifdef MP-QQ -->
						<view v-if="index !== 0 && index % 10 === 0 && !isVip" class="bg-white">
							<ad unit-id="297c24fcd434022129795daed3f46440"></ad>
						</view>
						<!-- #endif -->
					</template>
				</template>
				<view class="cu-item">
					<view class="content text-left">算术平均分：<text class="text-bold">{{semester.avg}}</text></view>
					<view class="content text-right">加权平均分：<text class="text-bold">{{semester.gpa}}</text></view>
				</view>
			</view>
			<view class="margin-tb-xs"></view>
			<!-- AI总结建议按钮 -->
			<view @click="fetchScoreSuggestion" class="cu-bar bg-gradual-blue foot ai-suggestion-bar">
				<view class="content"><text class="iconfont icon-hunyuan"></text><text>&nbsp;AI总结&建议</text></view>
			</view>
		</template>
		<template v-else>
			<tips tips="查询您的成绩分数需登录账号" image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif" :showButton="true" buttonText="现在登录"
				path="/pages/index/login"></tips>
		</template>

		<view class="padding-xl"></view>

		<!-- 成绩详情模态框 -->
		<view class="cu-modal" :class="displayDetailModal?'show':''">
			<view class="cu-dialog bg-gray">
				<view class="cu-bar justify-end">
					<view class="content">{{detail.courseName}}</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red text-bold"></text>
					</view>
				</view>
				<view class="text-left padding-xs">
					<view class="swiper-item">
						<view class="cu-list menu sm-border">
							<navigator :url="`/pages/course/lesson?keyword=${detail.courseName}`" :render-link="false"
								class="cu-item arrow">
								<view class="content"><text class="text-grey">课程名称</text></view>
								<view class="content"><view>{{detail.courseName}}</view></view>
							</navigator>
							<view class="cu-item">
								<view class="content"><text class="text-grey">课程编号</text></view>
								<view class="content"><view>{{detail.courseCode}}</view></view>
							</view>
							<view class="cu-item">
								<view class="content"><text class="text-grey">课程性质</text></view>
								<view class="content"><view>{{detail.courseNature}}</view></view>
							</view>
							<view class="cu-item">
								<view class="content"><text class="text-grey">开课学期</text></view>
								<view class="content"><view>{{detail.courseSemester}}</view></view>
							</view>
							<view class="cu-item">
								<view class="content"><text class="text-grey">课程属性</text></view>
								<view class="content"><view>{{detail.courseType}}</view></view>
							</view>
							<view class="cu-item" v-if="detail.courseCategory">
								<view class="content"><text class="text-grey">课程类别</text></view>
								<view class="content"><view>{{detail.courseCategory}}</view></view>
							</view>
							<view class="cu-item">
								<view class="content"><text class="text-grey">考核方式</text></view>
								<view class="content"><view>{{detail.accessMethod}}</view></view>
							</view>
							<view class="cu-item">
								<view class="content"><text class="text-grey">学分</text></view>
								<view class="content"><view>{{detail.credit}}</view></view>
							</view>
							<view class="cu-item">
								<view class="content"><text class="text-grey">考试性质</text></view>
								<view class="content"><view>{{detail.examNature}}</view></view>
							</view>
							<view class="cu-item">
								<view class="content"><text class="text-grey">总学时</text></view>
								<view class="content"><view>{{detail.period}}</view></view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">成绩</text>
								</view>
								<view class="content">
									<!-- #ifdef MP -->
									<view v-if="detail.score == '请评教'" @tap="goEvaluateTeacher" class="text-red"><text
											class="cuIcon-question">{{detail.score}}</text></view>
										<!-- #endif -->
									<!-- #ifndef MP -->
									<view v-if="detail.score && detail.score.includes('评教')" @tap="goEvaluateTeacher"
										class="text-red"><text class="cuIcon-question">{{detail.score}}</text></view>
									<!-- #endif -->
									<view v-else>{{detail.score}}</view>
								</view>
							</view>
							<view class="cu-item" v-if="detail.scoreMark">
								<view class="content"><text class="text-grey">成绩标识</text></view>
								<view class="content"><view>{{detail.scoreMark}}</view></view>
							</view>
							<view class="cu-item" v-if="detail.groupName">
								<view class="content"><text class="text-grey">分组名</text></view>
								<view class="content"><view>{{detail.groupName}}</view></view>
							</view>
							<view class="cu-item" v-if="detail.refixTream">
								<view class="content"><text class="text-grey">补重学期</text></view>
								<view class="content"><view>{{detail.refixTream}}</view></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- AI建议底部模态框 -->
		<view :class="`cu-modal bottom-modal ` + (displaySuggestionModal?'show':'')">
			<view class="cu-dialog">
				<view class="cu-bar bg-gradual-blue">
					<view class="action text-white"></view>
					<view class="content"><text class="iconfont icon-hunyuan"></text><text>&nbsp;AI总结&建议</text></view>
					<view @click="showSuggestionModal" class="action text-white"><text class="cuIcon-close"></text></view>
				</view>
				<view class="padding-sm text-left bg-white">
					<view class="text-center text-sm">
						<text class="iconfont icon-hunyuan"></text> 以下内容由腾讯混元AI大模型生成，不代表贝壳小盒子立场！
					</view>
					<scroll-view scroll-y="true" style="height: 480rpx;">
						<template v-for="(sug, index) in suggestion.Choices" :key="index">
							<ua-markdown :source="sug.Message.Content" />
						</template>
					</scroll-view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	const app = getApp()
	import api from '@/request/api.js'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js'
	var uChartsInstance = {}
	let interstitialAd = null
	export default {
		data() {
			return {
				isVip: false,
				isLogined: true,
				foldOptionsArea: true,
				semesterOptionsList: [],
				natureOptionsList: [],
				showOptionsList: [],
				semesterIndex: -1,
				natureIndex: -1,
				showIndex: -1,
				optionForm: {
					semester: '',
					nature: '',
					course: '',
					show: ''
				},
				score: '',
				displayDetailModal: false,
				displaySuggestionModal: false,
				detail: '',
				cWidth: 750,
				cHeight: 500,
				suggestion: '',
				showChart: true
			}
		},
		onLoad() {
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

			this.fetchOptions()
			this.fetchScore()
		},
		onReady() {
			this.cWidth = uni.upx2px(750)
			this.cHeight = uni.upx2px(500)
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			showDetail(semesterIndex, index) {
				const record = this.score.data[semesterIndex].items[index]
				console.log(record)
				this.detail = record
				this.displayDetailModal = true
				this.showChart = false
			},
			hideModal() {
				this.displayDetailModal = !this.displayDetailModal
				this.showChart = true
			},
			foldSemesterScore(semesterIndex) {
				let value = this.score.data[semesterIndex].fold
				if (value == undefined) value = true
				// console.log(value)
				this.score.data[semesterIndex].fold = !value
			},
			semesterChange(e) {
				const index = e.detail.value
				this.semesterIndex = index
				this.optionForm.semester = this.semesterOptionsList[index].value
			},
			natureChange(e) {
				const index = e.detail.value
				this.natureIndex = index
				this.optionForm.nature = this.natureOptionsList[index].value
			},
			showChange(e) {
				const index = e.detail.value
				this.showIndex = index
				this.optionForm.show = this.showOptionsList[index].value
			},
			fetchOptions() {
				if (!this.isLogined) {
					uni.showToast({
						title: '需要登录后才能查询您的成绩～',
						icon: 'none'
					})
					return
				}

				api.fetchScoreOptions().then(res => {
					console.log('获取成绩筛选项', res.data)
					this.semesterOptionsList = res.data.time
					this.natureOptionsList = res.data.nature
					this.showOptionsList = res.data.show
				})
			},
			fetchScore() {
				if (!this.isLogined) {
					uni.showToast({
						title: '需要登录后才能查询您的成绩～',
						icon: 'none'
					})
					return
				}

				uni.showLoading({
					title: '查询中...'
				})
				api.fetchScore(
					this.optionForm.semester,
					this.optionForm.nature,
					this.optionForm.course,
					this.optionForm.show
				).then(res => {
					console.log('成绩查询：', res.data)
					this.score = this.convertScoreFormat(res.data)
					// 成绩列表学期>=2则绘制渲染曲线图
					if (res.data.data && Object.keys(res.data.data).length >= 2) {
						this.drawCharts('semesterScoreChart', this.convertScoreChartFormat(res.data))
					}
					uni.hideLoading()
				}).catch(error => {
					console.log('成绩查询失败', error)
					uni.hideLoading()
				})
			},
			convertScoreFormat(score) {
				for (let semesterIndex in score.data) {
					score.data[semesterIndex].fold = false // 学期成绩列表默认不折叠展示
				}
				return score
			},
			convertScoreChartFormat(score) {
				let res = {
					categories: [],
					series: [{
							name: "算术平均分",
							data: []
						},
						{
							name: "加权平均法",
							data: []
						},
					]
				}
				for (let semesterIndex in score.data) {
					res.categories.push(semesterIndex)
					res.series[0].data.push(score.data[semesterIndex].avg)
					res.series[1].data.push(score.data[semesterIndex].gpa)
				}
				res.categories = res.categories.reverse()
				res.series[0].data.reverse()
				res.series[1].data.reverse()
				return res
			},
			showOptionsArea() {
				this.foldOptionsArea = !this.foldOptionsArea
			},
			resetOptionsForm() {
				this.optionForm = {
					semester: '',
					nature: '',
					course: '',
					show: ''
				}
				this.semesterIndex = -1
				this.natureIndex = -1
				this.showIndex = -1
				this.fetchScore()
			},
			goEvaluateTeacher() {
				const url = 'https://mp.weixin.qq.com/s/lfldxFZlLsVlQCjvWt62hg'
				// #ifdef H5
				uni.showLoading({
					title: '加载中...'
				})
				window.location.href = url
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/webview/webview?url=' + encodeURIComponent(url)
				})
				// #endif
				// #ifdef MP-QQ
				uni.setClipboardData({
					data: url,
					success() {
						qq.showToast({
							title: '已复制到粘贴板,请打开浏览器粘贴访问',
							icon: 'none'
						})
					}
				})
				// #endif
			},
			drawCharts(id, data) {
				const appBaseInfo = uni.getAppBaseInfo()
				const theme = appBaseInfo.theme ? appBaseInfo.theme : appBaseInfo.hostTheme
				const ctx = uni.createCanvasContext(id, this);
				uChartsInstance[id] = new uCharts({
					type: "area",
					context: ctx,
					width: this.cWidth,
					height: this.cHeight,
					categories: data.categories,
					series: data.series,
					animation: true,
					background: theme === 'dark' ? '#000000' : '#ffffff',
					color: ["#1890FF", "#3CA272"],
					padding: [15, 15, 0, 15],
					enableScroll: false,
					legend: {},
					xAxis: {
						disableGrid: true,
						rotateLabel: true,
						rotateAngle: 60
					},
					yAxis: {
						gridType: "dash",
						dashLength: 2
					},
					extra: {
						area: {
							type: "curve",
							opacity: 0.2,
							addLine: true,
							width: 2,
							gradient: true,
							activeType: "hollow"
						}
					}
				});
			},
			scoreChartTap(e) {
				uChartsInstance[e.target.id].touchLegend(e);
				uChartsInstance[e.target.id].showToolTip(e);
			},
			showSuggestionModal() {
				this.displaySuggestionModal = !this.displaySuggestionModal
				this.showChart = !this.displaySuggestionModal
			},
			fetchScoreSuggestion() {
				if (this.suggestion !== '') {
					this.showSuggestionModal()
					return
				}
				
				uni.showLoading({
					title: '大约需要十几秒钟，请您耐心等待...'
				})
				api.fetchScoreSuggestion().then(res => {
					this.suggestion = res.data.data
					uni.hideLoading()
					this.showSuggestionModal()
				}).catch(error => {
					console.log(error)
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>
	.charts {
		width: 750rpx;
		height: 500rpx;
	}

	.ai-suggestion-bar {
		border-top-right-radius: 50rpx;
		border-top-left-radius: 50rpx;
		min-height: 60rpx;
	}
</style>