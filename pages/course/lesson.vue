<template>
	<view>
		<template v-if="showSearchArea">
			<cu-custom bgColor="bg-gradual-blue" :isBack="true">
				<view>课程课表</view>
			</cu-custom>
			<view class="margin">
				<view :class="'cu-list menu sm-border '+(foldOptionsArea?'round':'card-radius')">
					<view class="cu-item press-class" @click="showOptionsArea">
						<view class="content">
							<text class="cuIcon-title text-green"></text> 课程课表查询筛选操作
						</view>
						<view class="action text-right">
							<text :class="'cuIcon-'+(foldOptionsArea?'right':'unfold')"></text>
						</view>
					</view>
					<template v-if="!foldOptionsArea">
						<view class="cu-item">
							<view class="content">
								<text class="text-red">*课程名称</text>
							</view>
							<view class="action text-right">
								<input placeholder="请输入课程名称" name="courseName" v-model="optionForm.courseName" />
							</view>
						</view>
						<template v-if="showAllOption">
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">学年学期</text>
								</view>
								<view class="action">
									<picker @change="semesterChange" :value="semesterIndex" :range="semesterOption"
										range-key="name">
										<view class="picker">
											{{semesterIndex>-1?semesterOption[semesterIndex].name:'选择学期'}}
										</view>
									</picker>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">时间模式</text>
								</view>
								<view class="action">
									<picker @change="timeModelChange" :value="timeModelIndex" :range="timeModelOption"
										range-key="name">
										<view class="picker">
											{{timeModelIndex>-1?timeModelOption[timeModelIndex].name:'节次模式'}}
										</view>
									</picker>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">上课院系</text>
								</view>
								<view class="action">
									<picker @change="studyCollegeChange" :value="studyCollegeIndex" :range="studyCollegeOption"
										range-key="name">
										<view class="picker">
											{{studyCollegeIndex>-1?studyCollegeOption[studyCollegeIndex].name:'请选择'}}
										</view>
									</picker>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">开课院系</text>
								</view>
								<view class="action">
									<picker @change="teachCollegeChange" :value="teachCollegeIndex" :range="teachCollegeOption"
										range-key="name">
										<view class="picker">
											{{teachCollegeIndex>-1?teachCollegeOption[teachCollegeIndex].name:'请选择'}}
										</view>
									</picker>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">课程属性</text>
								</view>
								<view class="action">
									<picker @change="courseNatureChange" :value="courseNatureIndex" :range="courseNatureOption"
										range-key="name">
										<view class="picker">
											{{courseNatureIndex>-1?courseNatureOption[courseNatureIndex].name:'请选择'}}
										</view>
									</picker>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">上课周次</text>
								</view>
								<view class="action flex">
									<picker @change="weekStartChange" :value="weekStartIndex" :range="weekOption"
										range-key="name">
										<view class="picker">
											{{weekStartIndex>-1?weekOption[weekStartIndex].name:'开始周次'}} <text class="cuIcon-right"></text>
										</view>
									</picker>
									<view class="margin-lr"><text>~</text></view>
									<picker @change="weekEndChange" :value="weekEndIndex" :range="weekOption"
										range-key="name">
										<view class="picker">
											{{weekEndIndex>-1?weekOption[weekEndIndex].name:'结束周次'}} <text class="cuIcon-right"></text>
										</view>
									</picker>
								</view>
							</view>
							<view class="cu-item">
								<view class="content">
									<text class="text-grey">上课星期</text>
								</view>
								<view class="action flex">
									<picker @change="dayOfWeekStartChange" :value="dayOfWeekStartIndex" :range="dayOfWeekOption"
										range-key="name">
										<view class="picker">
											{{dayOfWeekStartIndex>-1?dayOfWeekOption[dayOfWeekStartIndex].name:'开始星期'}} <text class="cuIcon-right"></text>
										</view>
									</picker>
									<view class="margin-lr"><text>~</text></view>
									<picker @change="dayOfWeekEndChange" :value="dayOfWeekEndIndex" :range="dayOfWeekOption"
										range-key="name">
										<view class="picker">
											{{dayOfWeekEndIndex>-1?dayOfWeekOption[dayOfWeekEndIndex].name:'结束星期'}} <text class="cuIcon-right"></text>
										</view>
									</picker>
								</view>
							</view>
						</template>
						<view class="bg-white text-center padding-tb-sm" @click="foldAllOption">
						  <text :class="`text-blue cuIcon-${showAllOption?'fold':'unfold'}`">{{showAllOption?'收起':'展示'}}更多筛选项</text>
						</view>
						<view class="cu-item">
							<view class="content">
							</view>
							<view class="action">
								<button @click="resetOptionsForm" class="cu-btn round bg-red shadow margin-lr"><text
										class="cuIcon-refresh"></text> 重置</button>
								<button @click="fetchLessonCourse" class="cu-btn round bg-green shadow"><text
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
			
			<view class="cu-list menu-avatar margin card-radius">
				<template v-for="(lessonCourse, lessonIndex) in lessonCourses" :key="lessonIndex">
					<view class="cu-item" @click="clickLessonCourse(lessonIndex)">
						<view class="cu-avatar lg round bg-gradual-green"><text class="iconfont icon-kechengkebiao text-xl text-blod" style="font-size: 60rpx;"></text></view>
						<view class="content text-cut"><view class="padding-lr"><text class="text-xl">{{lessonCourse.courseName}}</text></view></view>
					</view>
					<!-- #ifdef MP-WEIXIN -->
					<view v-if="lessonIndex !== 0 && lessonIndex % 12 === 0" class="bg-white">
						<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
					</view>
					<!-- #endif -->
				</template>
				<tips v-if="lessonCourses !== '' && lessonCourses.length === 0" :tips="'没有符合条件的数据，请进行筛选操作'"></tips>
			</view>
		</template>
		
		<view v-if="!showSearchArea && lessonCourse.courseName">
			<view class="padding-tb bg-gradual-blue"></view>
			<view class="cu-bar bg-gradual-blue">
			    <view class="action" @click="hideSearchArea"><text class="cuIcon-back text-white"></text></view>
			    <view class="content text-bold">{{lessonCourse.courseName}} 课程课表</view>
			</view>
			<courseTable :columnTitles="columnTitle" :table="lessonCourse.course" :tips="''"></courseTable>
		</view>
		
	</view>
</template>

<script>
	import api from '@/request/api.js'
	import courseTable from './components/courseTable.vue'
	let interstitialAd = null
	export default {
		components: { courseTable },
		data() {
			return {
				showSearchArea: true,
				showAllOption: false,
				foldOptionsArea: false,
				semesterIndex: -1,
				semesterOption: [],
				timeModelIndex: -1,
				timeModelOption: [],
				studyCollegeIndex: -1,
				studyCollegeOption: [],
				teachCollegeIndex: -1,
				teachCollegeOption: [],
				courseNatureIndex: -1,
				courseNatureOption: [],
				weekStartIndex: -1,
				weekEndIndex: -1,
				dayOfWeekStartIndex: -1,
				dayOfWeekEndIndex: -1,
				optionForm: {
					semester: '',
					timeModel: '',
					studyCollege: '',
					teachCollege: '',
					courseNature: '',
					courseName: '',
					weekStart: '',
					weekEnd: '',
					dayOfWeekStart: '',
					dayOfWeekEnd: ''
				},
				lessonIndex: 0,
				lessonCourses: '',
				lessonCourse: {},
				columnTitle: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
				weekOption: [],
				dayOfWeekOption: []
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			if(wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif
			this.generateWeekOption()
			this.generateDayOfWeekOption()
			this.fetchOptions()
		},
		onShow() {
			if (interstitialAd) interstitialAd.show()
		},
		methods: {
			generateWeekOption () {
				const weekOption = []
				for (var i = 1; i <= 30; i++) {
					weekOption.push({name: `第${i}周`, value: i})
				}
				this.weekOption = weekOption
			},
			generateDayOfWeekOption () {
				const dayOfWeekOption = []
				for (var i = 0; i < this.columnTitle.length; i++) {
					dayOfWeekOption.push({name: this.columnTitle[i], value: (i+1) })
				}
				this.dayOfWeekOption = dayOfWeekOption
			},
			hideSearchArea () {
				this.showSearchArea = true
			},
			foldAllOption () {
				this.showAllOption = !this.showAllOption
			},
			showOptionsArea() {
				this.foldOptionsArea = !this.foldOptionsArea
			},
			clickLessonCourse (lessonIndex) {
				console.log('clickLessonCourse', this.lessonCourses[lessonIndex])
				if (lessonIndex >= 0) {
					this.lessonIndex = lessonIndex
					this.lessonCourse = this.lessonCourses[lessonIndex]
					this.showSearchArea = false
				}
			},
			fetchLessonCourse () {
				if (this.optionForm.courseName.length <= 0) {
					uni.showToast({ title: '请输入课程名称', icon: 'none'})
					return
				}
				if (this.optionForm.weekStart > this.optionForm.weekEnd) {
					uni.showToast({ title: '请选择正确的上课周次', icon: 'none'})
					return
				}
				if (this.optionForm.dayOfWeekStart > this.optionForm.dayOfWeekEnd) {
					uni.showToast({ title: '请选择正确的上课星期!', icon: 'none'})
					return
				}
				uni.showLoading({ title: '加载中...' })
				console.log('optionForm', this.optionForm)
				api.fetchLessonCourse(
					this.optionForm.semester,
					this.optionForm.timeModel,
					this.optionForm.studyCollege,
					this.optionForm.teachCollege,
					this.optionForm.courseNature,
					this.optionForm.courseName,
					this.optionForm.weekStart.toString(),
					this.optionForm.weekEnd.toString(),
					this.optionForm.dayOfWeekStart.toString(),
					this.optionForm.dayOfWeekEnd.toString()
				).then(res => {
					// console.log('fetchClassCourse', res.data)
					this.lessonCourses = res.data
					uni.hideLoading()
				})
			},
			fetchOptions () {
				api.fetchLessonCourseOptions().then(res => {
					const { semester, timeModel, studyCollege, teachCollege, courseNature } = res.data
					this.semesterOption = semester
					const semesterIndex = semester.findIndex((value) => value.checked === true)
					this.semesterIndex = semesterIndex
					this.optionForm.semester = semester[semesterIndex].value
					
					this.timeModelOption = timeModel
					const timeModelIndex = timeModel.findIndex((value) => value.checked === true)
					this.timeModelIndex = timeModelIndex
					this.optionForm.timeModel = timeModel[timeModelIndex].value
					
					this.studyCollegeOption = studyCollege
					const studyCollegeIndex = studyCollege.findIndex((value) => value.checked === true)
					this.studyCollegeIndex = studyCollegeIndex
					this.optionForm.studyCollege = studyCollege[studyCollegeIndex].value
					
					this.teachCollegeOption = teachCollege
					const teachCollegeIndex = teachCollege.findIndex((value) => value.checked === true)
					this.teachCollegeIndex = teachCollegeIndex
					this.optionForm.teachCollege = teachCollege[teachCollegeIndex].value
					
					this.courseNatureOption = courseNature
					const courseNatureIndex = courseNature.findIndex((value) => value.checked === true)
					this.courseNatureIndex = courseNatureIndex
					this.optionForm.courseNature = courseNature[courseNatureIndex].value
					
					uni.hideLoading()
				})
			},
			semesterChange (e) {
				const index = e.detail.value
				this.semesterIndex = index
				this.optionForm.semester = this.semesterOption[index].value
			},
			timeModelChange (e) {
				const index = e.detail.value
				this.timeModelIndex = index
				this.optionForm.timeModel = this.timeModelOption[index].value
			},
			studyCollegeChange (e) {
				const index = e.detail.value
				this.studyCollegeIndex = index
				this.optionForm.studyCollege = this.studyCollegeOption[index].value
			},
			teachCollegeChange (e) {
				const index = e.detail.value
				this.teachCollegeIndex = index
				this.optionForm.teachCollege = this.teachCollegeOption[index].value
			},
			courseNatureChange (e) {
				const index = e.detail.value
				this.courseNatureIndex = index
				this.optionForm.courseNature = this.courseNatureOption[index].value
			},
			weekStartChange (e) {
				const index = e.detail.value
				this.weekStartIndex = index
				this.optionForm.weekStart = this.weekOption[index].value
			},
			weekEndChange (e) {
				const index = e.detail.value
				this.weekEndIndex = index
				this.optionForm.weekEnd = this.weekOption[index].value
			},
			dayOfWeekStartChange (e) {
				const index = e.detail.value
				this.dayOfWeekStartIndex = index
				this.optionForm.dayOfWeekStart = this.dayOfWeekOption[index].value
			},
			dayOfWeekEndChange (e) {
				const index = e.detail.value
				this.dayOfWeekEndIndex = index
				this.optionForm.dayOfWeekEnd = this.dayOfWeekOption[index].value
			},
			resetOptionsForm() {
				uni.showLoading({ title: '加载中...' })
				this.optionForm = {
					semester: '',
					timeModel: '',
					studyCollege: '',
					teachCollege: '',
					courseNature: '',
					courseName: '',
					weekStart: '',
					weekEnd: '',
					dayOfWeekStart: '',
					dayOfWeekEnd: ''
				}
				this.weekStartIndex = -1
				this.weekEndIndex = -1
				this.dayOfWeekStartIndex = -1
				this.dayOfWeekEndIndex = -1
				this.fetchOptions()
			}
		}
	}
</script>

<style>
	.content {
		width: calc(100% - 96rpx - 60rpx - 20rpx) !important;
		line-height: 1.6em;
	}
</style>