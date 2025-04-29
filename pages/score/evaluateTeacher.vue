<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>教学评价</view>
		</cu-custom>
		
		<template v-if="!isLogined">
			<tips tips="评教操作需要登录" image="/static/image/nothing.png" :showButton="true" buttonText="现在登录"
				path="/pages/index/login"></tips>
		</template>
		<template v-else>
			<view class="flex flex-direction">
				<view :style="`height: ${pageHeight-(pageHeight-200)}px;`">
					<view class="text-center text-title margin-xs"><text class="cuIcon-title text-green"></text>评教学期批次</view>
					<template v-if="semesters==='' || (semesters.pagination&&semesters.pagination.total==0)">
						<tips tips="未查询到评教批次" image="/static/image/nothing.png"></tips>
					</template>
					<template v-else>
						<scroll-view :style="`height: ${pageHeight-(pageHeight-200)-10}px;`" :scroll-y="true">
							<template v-for="(semester, index) in semesters.data" :key="index">
								<view @click="checkSemester(index)" :class="`${semesterIndex==index?'selected':''} padding-xs margin-xs shadow`">
									<view class="flex justify-around bg-gradual-blue text-lg radius">
										<view>{{semester.no}}</view>
										<view>{{semester.evaluateBatch}}</view>
										<view>{{semester.evaluateType}}</view>
									</view>
									<view class="cu-list menu sm-border">
										<view class="cu-item list-height">
											<view class="content"><text class="text-grey">评教学年学期</text></view>
											<view class="action"><text class="text-grey text-df">{{semester.semester}}</text></view>
										</view>
										<view class="cu-item list-height">
											<view class="content"><text class="text-grey">评教开始时间</text></view>
											<view class="action"><text class="text-grey text-df">{{semester.startAt}}</text></view>
										</view>
										<view class="cu-item list-height">
											<view class="content"><text class="text-grey">评教结束时间</text></view>
											<view class="action"><text class="text-grey text-df">{{semester.endAt}}</text></view>
										</view>
									</view>
								</view>
							</template>
							<view class="flex justify-between padding-lr">
								<view>第{{semesters.pagination.currentPage}}页</view>
								<view><text>共{{semesters.pagination.totalPage}}页丨{{semesters.pagination.total}}条</text></view>
							</view>
						</scroll-view>
					</template>
				</view>
				<view :style="`height: ${pageHeight-200}px;`" class="top-border">
					<view class="text-center text-title margin-xs"><text class="cuIcon-title text-green"></text>评教课程</view>
					<template v-if="semesters.pagination && semesters.pagination.total==0">
						<tips tips="暂无可评教课程" image="/static/image/nothing.png"></tips>
					</template>
					<template v-else-if="courses==='' || (courses.pagination&&courses.pagination.total==0)">
						<tips tips="请先点击选择上方评教学期批次" image="/static/image/nothing.png"></tips>
					</template>
					<scroll-view :style="`height: ${pageHeight-200-20}px;`" :scroll-y="true" v-else>
						<template v-for="(course, index) in courses.data" :key="index">
							<view @click="checkCourse(index)" :class="`${courseIndex==index?'selected':''} margin-xs padding-xs shadow`">
								<view class="flex justify-between bg-gradual-blue text-lg radius padding-lr-sm align-center">
									<view>{{course.no}}</view>
									<view>{{course.courseName}}</view>
								</view>
								<view class="cu-list menu sm-border">
									<view class="cu-item list-height">
										<view class="content"><text class="text-grey">课程编号</text></view>
										<view class="action"><text class="text-grey text-df">{{course.courseCode}}</text></view>
									</view>
									<view class="cu-item list-height">
										<view class="content"><text class="text-grey">授课教师</text></view>
										<view class="action"><text class="text-grey text-df">{{course.teacher}}</text></view>
									</view>
									<view class="cu-item list-height">
										<view class="content"><text class="text-grey">评教类别</text></view>
										<view class="action"><text class="text-grey text-df">{{course.evaluateType}}</text></view>
									</view>
									<view class="cu-item list-height">
										<view class="content"><text class="text-grey">总评分</text></view>
										<view class="action"><text class="text-grey text-df">{{course.score}}</text></view>
									</view>
									<view class="cu-item list-height">
										<view class="content"><text class="text-grey">已评教：<text :class="course.evaluated==='是'?'text-green':''">{{course.evaluated}}</text></text></view>
										<view class="action"><text class="text-grey text-df">已提交：<text :class="course.submited==='是'?'text-green':''">{{course.submited}}</text></text></view>
									</view>
								</view>
							</view>
						</template>
						
						<view class="flex justify-between padding-lr">
							<view>第{{courses.pagination.currentPage}}页</view>
							<view><text>共{{courses.pagination.totalPage}}页丨{{courses.pagination.total}}条</text></view>
						</view>
						
						<view class="padding"></view>
					</scroll-view>
				</view>
			</view>
		</template>
		
		<view class="cu-modal bottom-modal" :class="showModal?'show':''" v-if="detail">
			<view class="cu-dialog">
				<view class="cu-bar bg-gradual-blue">
					<view class="action text-white"></view>
					<view class="content">{{courseIndex===null?'':courses.data[courseIndex].courseName}}</view>
					<view @click="displayModal" class="action"><text class="cuIcon-close text-white"></text></view>
				</view>
				<scroll-view :scroll-y="true" class="padding-sm bg-white" :style="`height: ${pageHeight-200-20}px;`">
					<view class="flex justify-between">
						<view>{{detail.courseName}}({{detail.evaluateCategory}})</view><view>总评分：{{detail.score}}</view>
					</view>
					<template v-for="(question, index) in detail.form" :key="index">
						<view class="margin-tb">
							<view class="text-left margin-lr-sm"><text>{{index+1}}、{{question.text}}</text></view>
							<radio-group class="block">
								<view class="grid col-3">
									<view v-for="(option,optionIndex) in question.options" :key="optionIndex" class="padding-xs">
										<label>
											<view class="text-sm">
											  <radio :value="option.radio.value" :checked="option.radio.checked"></radio> <text class="text-lg">&nbsp;{{option.text}}</text>
											</view>
										</label>
									</view>
								</view>
							</radio-group>
						</view>
					</template>
					
					<view class="flex justify-between align-center margin-lr-sm">
						<view class="text-left text-xl"><text class="cuIcon-title text-green"></text>意见反馈</view>
						<view><button class="cu-btn sm round bg-gradual-blue"><text class="iconfont icon-hunyuan margin-right-xs"></text>AI生成</button></view>
					</view>
					<view class="cu-form-group bg-gray margin-top text-left">
						<textarea maxlength="144" @input="suggestionInput" placeholder="请输入意见建议"></textarea>
					</view>
					
					<view class="flex justify-around margin-top">
						<view><button @click="displayModal" class="cu-btn round bg-grey">返回</button></view>
						<view><button class="cu-btn round bg-green">提交</button></view>
					</view>
					
					<view class="padding"></view>
				</scroll-view>
			</view>
		</view>

		
		
	</view>
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
				pageHeight: 0,
				semesterIndex: null,
				semesters: '',
				courseIndex: null,
				courses: '',
				showModal: false,
				detail: '',
				suggestion: ''
			}
		},
		onLoad() {
			this.isVip = app.globalData.isVip
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
			
			this.pageHeight = app.globalData.screenHeight
			this.fetchSemester()
		},
		onShow() {
		},
		methods: {
			checkSemester (index) {
				if (index == this.semesterIndex) return
				this.semesterIndex = index
				const url = this.semesters.data[index].url
				console.log(url)
				this.fetchCourses(url)
			},
			checkCourse (index) {
				this.courseIndex = index
				const item = this.courses.data[index]
				console.log(item)
				this.fetchDetail(item.url)
			},
			fetchSemester () {
				uni.showLoading({ title: '加载中...' })
				api.fetchEvaluateTeacherSemester().then(res => {
					this.semesters = res.data
					if (res.data.pagination && res.data.pagination.total > 0) this.checkSemester(0)
					console.log(this.semesters)
					uni.hideLoading()
				}).catch(error => {
					console.log(error)
					uni.hideLoading()
				})
			},
			fetchCourses (url) {
				uni.showLoading({ title: '加载中...' })
				api.fetchEvaluateTeacherCourse(url).then(res => {
					this.courses = res.data
					console.log(this.courses)
					uni.hideLoading()
				}).catch(error => {
					console.log(error)
					uni.hideLoading()
				})
			},
			fetchDetail (url) {
				uni.showLoading({ title: '加载中...' })
				api.fetchEvaluateTeacherDetail(url).then(res => {
					this.detail = res.data
					console.log(this.detail)
					uni.hideLoading()
					this.displayModal()
				}).catch(error => {
					console.log(error)
					uni.hideLoading()
				})
			},
			displayModal () {
				this.showModal = !this.showModal
			},
			suggestionInput (e) {
				this.suggestion = e.detail.value
				console.log(this.suggestion)
			}
		}
	}
</script>

<style>
.top-border {
	border-top: 1px solid #ccc;
}
.list-height {
	min-height: 60rpx !important;
}
.selected {
	border: 1px solid #29A3C1;
	border-radius: 14rpx;
}
</style>
