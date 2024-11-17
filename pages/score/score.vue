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
					<view class="cu-item arrow">
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
					<view class="cu-item arrow">
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
					<view class="cu-item arrow">
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

		<!-- #ifdef MP-WEIXIN -->
		<view class="margin margin-tb-xl radius">
			<ad-custom unit-id="adunit-3d7f1704631ec7ea" ad-intervals="30"></ad-custom>
		</view>
		<!-- #endif -->
	
		<!-- 成绩展示区域 -->
		<template v-if="isLogined">
			<view class="cu-list menu sm-border card-menu" v-for="(semester, semesterIdx) in score.data" :key="semesterIdx">
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
						<view @click="showDetail(semesterIdx, index)" class="cu-item press-class">
							<view class="content padding-tb-sm text-cut">
								<view class="text-title">
									<text class="text-black text-cut">{{record.courseName}}</text>({{record.courseType}})
								</view>
								<view class="text-gray text-sm">
									<text class="margin-right-xs">{{record.examNature}}</text>
									<text class="margin-lr-xs">{{record.period}}学时</text>
									<text class="margin-lr-xs">{{record.credit}}学分</text>
								</view>
							</view>
							<view class="action text-bold">
								<text v-if="record.score >= 90" class="text-lg text-blue">{{record.score}}</text>
								<text v-else-if="record.score < 60" class="text-lg text-red">{{record.score}}</text>
								<text v-else class="text-lg text-black">{{record.score}}</text>
							</view>
						</view>
						<!-- #ifdef MP-WEIXIN -->
						<view v-if="index !== 0 && index % 10 === 0" class="bg-white">
							<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
						</view>
						<!-- #endif -->
					</template>
				</template>
				<view class="cu-item">
					<view class="content text-left">
						算术平均分：<text class="text-bold">{{semester.avg}}</text>
					</view>
					<view class="content text-right">
						加权平均分：<text class="text-bold">{{semester.gpa}}</text>
					</view>
				</view>
			</view>
		</template>
		<template v-else>
			<tips
				tips="查询您的成绩分数需登录账号"
				image="https://r2.airmole.net/i/2024/11/16/su6jl-zd.png"
				:showButton="true"
				buttonText="现在登录"
				path="/pages/index/login"
			></tips>
		</template>
		
		<view class="padding-xl"></view>
		
		<!-- 成绩详情模态框 -->
		<view class="cu-modal" :class="displayDetailModal?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{detail.courseName}}</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red text-bold"></text>
					</view>
				</view>
				<view class="text-left">
					<view class="swiper-item">
						<view class="cu-list menu sm-border">
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">课程名称</text>
								</view>
								<view class="content">
									<view>{{detail.courseName}}</view>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">课程编号</text>
								</view>
								<view class="content">
									<view>{{detail.courseCode}}</view>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">课程性质</text>
								</view>
								<view class="content">
									<view>{{detail.courseNature}}</view>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">开课学期</text>
								</view>
								<view class="content">
									<view>{{detail.courseSemester}}</view>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">课程属性</text>
								</view>
								<view class="content">
									<view>{{detail.courseType}}</view>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">考核方式</text>
								</view>
								<view class="content">
									<view>{{detail.accessMethod}}</view>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">学分</text>
								</view>
								<view class="content">
									<view>{{detail.credit}}</view>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">考试性质</text>
								</view>
								<view class="content">
									<view>{{detail.examNature}}</view>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">总学时</text>
								</view>
								<view class="content">
									<view>{{detail.period}}</view>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">成绩</text>
								</view>
								<view class="content">
									<view>{{detail.score}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import api from '@/request/api.js'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	let interstitialAd = null
	export default {
		data() {
			return {
				isLogined: true,
				foldOptionsArea: false,
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
				detail: ''
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			if(wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif
			
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
			
			this.fetchOptions()
			this.fetchScore()
		},
		onShow() {
			if (interstitialAd) interstitialAd.show()	
		},
		methods: {
			showDetail (semesterIndex, index) {
				const record = this.score.data[semesterIndex].items[index]
				console.log(record)
				this.detail = record
				this.displayDetailModal = true
			},
			hideModal () { this.displayDetailModal = !this.displayDetailModal },
			foldSemesterScore (semesterIndex) {
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
					uni.showToast({ title: '需要登录后才能查询您的成绩～', icon: 'none' })
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
					uni.showToast({ title: '需要登录后才能查询您的成绩～', icon: 'none' })
					return
				}
				
				uni.showLoading({ title: '查询中...' })
				api.fetchScore(
					this.optionForm.semester,
					this.optionForm.nature,
					this.optionForm.course,
					this.optionForm.show
				).then(res => {
					console.log('成绩查询：', res.data)
					// this.score = res.data
					this.score = this.convertScoreFormat(res.data)
					uni.hideLoading()
				}).catch(error => {
					console.log('成绩查询失败', error)
					uni.hideLoading()
				})
			},
			convertScoreFormat (score) {
				for (let semesterIndex in score.data) {
					// 学期成绩列表默认不折叠展示
					score.data[semesterIndex].fold = false
				}
				return score
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
			}
		}
	}
</script>

<style>

</style>