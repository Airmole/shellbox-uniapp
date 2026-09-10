<template>
	<view>
		<template v-if="!showCourseDetail">
			<cu-custom bgColor="bg-gradual-blue" :isBack="true">
				<view>课程课表</view>
			</cu-custom>
			<scroll-view scroll-x class="bg-white nav">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="index==viewTabIndex?'text-blue cur':''" v-for="(item,index) in viewTabs" :key="index" @tap="viewChange" :data-id="index">
						{{item}}
					</view>
				</view>
			</scroll-view>
			<view class="cu-bar search bg-white" v-if="showCardView">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input v-model="lessonKeywordSearch" :adjust-position="false" type="text" placeholder="搜索课程名称"
						confirm-type="search"></input>
				</view>
				<view class="action">
					<button @click="keywordSearch" class="cu-btn bg-gradual-blue shadow-blur round">搜索</button>
				</view>
			</view>
		</template>
		
		<template v-if="showCardView">
			<letterIndexSelectorVue :list="lessonKeywordList" @change="letterChange"></letterIndexSelectorVue>
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
			<template v-for="(item, index) in lessonKeywordList" :key="index">
				<view class="flex justify-center flex-direction" v-if="item.length">
					<view class="text-left margin padding-left" :id="index" @click="goTop">{{index}}</view>
					<view class="flex flex-wrap justify-center">
						<template v-for="(lessonName, cindex) in item" :key="cindex">
							<view
							  @click="checkLessonName(lessonName)"
							  :id="`${index}${cindex}`"
							  class="bg-gradual-blue padding-sm margin-sm basis-sm shadow radius lesson-card text-center"
							  :style="[{animation: 'show ' + ((cindex+1)*0.2+1) + 's 1'}]"
							>
							    <view class="text-center"><text>{{lessonName}}</text></view>
							</view>
						</template>
						<!-- 占位，以免落单卡片居中 -->
						<view v-if="item.length%2===1" class="margin-sm basis-sm"></view>
					</view>
				</view>
			</template>
		</template>
			
		<!-- 筛选检索区域 -->
		<template v-if="showSearchArea">
			<!-- 课程筛选面板 -->
			<view class="margin">
				<view :class="'cu-list menu sm-border '+(foldOptionsArea?'round':'card-radius')">
					<view class="cu-item press-class" @click="showOptionsArea">
						<view class="content">
							<text class="cuIcon-title text-green"></text> 课程查询筛选
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
								<button v-if="lessonCourses !== ''" @click="exportXlsx" class="cu-btn round bg-gradual-blue shadow"><text
										class="cuIcon cuIcon-down"></text> 下载</button>
							</view>
							<view class="action">
								<button @click="resetOptionsForm" class="cu-btn round bg-red shadow margin-lr"><text
										class="cuIcon cuIcon-refresh"></text> 重置</button>
								<button @click="fetchLessonCourse" class="cu-btn round bg-green shadow"><text
										class="cuIcon cuIcon-search"></text> 查询</button>
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
				
			<!-- 课程检索结果列表 -->
			<view class="cu-list menu-avatar margin card-radius">
				<template v-for="(lessonCourse, lessonIndex) in lessonCourses" :key="lessonIndex">
					<view class="cu-item" @click="clickLessonCourse(lessonIndex)">
						<view class="cu-avatar lg round bg-gradual-green"><text class="iconfont icon-kechengkebiao text-xl text-blod" style="font-size: 60rpx;"></text></view>
						<view class="content text-cut"><view class="padding-left-xs"><text class="text-xl">{{lessonCourse.courseName}}</text></view></view>
						<view class="action"><text class="cuIcon-right"></text></view>
					</view>
					<!-- #ifdef MP-WEIXIN -->
					<view v-if="lessonIndex !== 0 && lessonIndex % 12 === 0 && !isVip" class="bg-white">
						<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
					</view>
					<!-- #endif -->
					<!-- #ifdef MP-QQ -->
					<view v-if="lessonIndex !== 0 && lessonIndex % 12 === 0 && !isVip" class="bg-white">
						<ad unit-id="297c24fcd434022129795daed3f46440"></ad>
					</view>
					<!-- #endif -->
				</template>
				<tips v-if="lessonCourses !== '' && lessonCourses.length === 0" :tips="'没有符合条件的数据，请进行筛选操作'"></tips>
			</view>
		</template>
		
		<view v-if="showCourseDetail">
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
	import { getGlobalData } from '@/common/store/globalData.js'
	import api from '@/request/api.js'
	import courseTable from './components/courseTable.vue'
	import letterIndexSelectorVue from './components/letterIndexSelector.vue'
	import { initalVideoAd, startPlayVideoAd } from '../../common/utils/mpAd.js'
	let interstitialAd = null
	let videoAd = null
	export default {
		components: { courseTable, letterIndexSelectorVue },
		data() {
			return {
				isVip: false,
				viewTabs: ['卡片视图', '查询检索'],
				viewTabIndex: 0,
				showCardView: true,
				lessonKeywordList: {},
				lessonKeywordSearch: '',
				showSearchArea: false,
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
				dayOfWeekOption: [],
				showCourseDetail: false
			}
		},
		onLoad(options) {
			this.isVip = getGlobalData('isVip', false)
			// #ifdef MP-WEIXIN
			if(wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif
			// #ifdef MP-QQ
			if (qq.createInterstitialAd) interstitialAd = qq.createInterstitialAd({ adUnitId: '8fe9b8e7191346a2ffb0c20c6bf3e0cf' })
			// #endif
			
			if (options && options.keyword) {
				uni.showLoading({ title: '加载中...' })
				this.optionForm.courseName = options.keyword
				this.showCardView = false
				this.showSearchArea = true
				this.viewTabIndex = 1
			}
			
			this.fetchLessonList()
			this.generateWeekOption()
			this.generateDayOfWeekOption()
			this.fetchOptions(options.keyword)			
		},
		onReady() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			viewChange (e) {
				const viewTabIndex = e.currentTarget.dataset.id
				this.showCardView = !this.showCardView
				this.showSearchArea = !this.showSearchArea
				this.viewTabIndex = viewTabIndex
				this.resetOptionsForm()
			},
			letterChange (e) {
				uni.pageScrollTo({
				  selector: `#${e.letter}`,
				  offsetTop: -100
				})
			},
			goTop () {
				uni.pageScrollTo({ scrollTop: 0 })
			},
			keywordSearch () {
				const keyword = this.lessonKeywordSearch
				let targetId = false
				for (var letter in this.lessonKeywordList) {
					const letterLessons = this.lessonKeywordList[letter]
					for (var i = 0; i < letterLessons.length; i++) {
						const item = letterLessons[i]
						if (item.indexOf(keyword) === 0) {
							targetId = `#${letter}${i}`
							break
						}
					}
				}
				if (!targetId) {
					uni.showToast({ title: '未找到匹配数据', icon: 'none'})
					return
				}
				uni.pageScrollTo({
					selector: targetId,
					offsetTop: -100
				})
			},
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
				if (this.viewTabIndex == 0) this.showCardView = true
				if (this.viewTabIndex == 1) this.showSearchArea = true
				this.showCourseDetail = false
			},
			foldAllOption () {
				this.showAllOption = !this.showAllOption
			},
			showOptionsArea() {
				this.foldOptionsArea = !this.foldOptionsArea
			},
			fetchLessonList () {
				uni.showLoading({ title: '加载中...'})
				api.fetchLessonKeywordList().then(res => {
					this.lessonKeywordList = res.data
				}).finally(() =>{
					uni.hideLoading()
				})
			},
			checkLessonName(lessonName) {
				uni.showLoading({ title: '加载中...' })
				this.optionForm.courseName = lessonName
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
					this.lessonCourse = res.data[0]
					this.showCardView = false
					this.showSearchArea = false
					this.showCourseDetail = true
				}).catch((res) => {
					uni.showToast({ title: res.data.message, icon: 'none'})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			clickLessonCourse (lessonIndex) {
				if (lessonIndex >= 0) {
					this.lessonIndex = lessonIndex
					this.lessonCourse = this.lessonCourses[lessonIndex]
					this.showSearchArea = false
					this.showCourseDetail = true
				}
			},
			fetchLessonCourse () {
				this.optionForm.courseName = this.optionForm.courseName.replace(/\s/g, "")
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
					this.lessonCourses = res.data
					videoAd = initalVideoAd(api.exportLessonCourse, res.data, '导出课程课表')
					uni.hideLoading()
				})
			},
			fetchOptions (courseName = null) {
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
					if (courseName !== null) this.fetchLessonCourse()
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
			},
			exportXlsx () {
				startPlayVideoAd(videoAd, api.exportLessonCourse, this.lessonCourses, '非VIP会员导出课程课表需要观看广告！', this.isVip)
			}
		},
		onShareAppMessage() {
			let text = ''
			let query = ''
			if (this.optionForm.courseName) {
				text = `【${this.optionForm.courseName}...】相关`
				query = `?keyword=${this.optionForm.courseName}`
			}
			let data = {
			  title: `${text}课程课表 - 贝壳小盒子`,
			  path: `/pages/course/lesson${query}`
			}
			return data
		},
		onShareTimeline() {
			let text = ''
			let query = ''
			if (this.optionForm.courseName) {
				text = `【${this.optionForm.courseName}...】相关`
				query = `keyword=${this.optionForm.courseName}`
			}
			let data = {
				title: `${text}课程课表 - 贝壳小盒子`,
				query: query
			}
			return data
		}
	}
</script>

<style>
	.content {
		width: calc(100% - 96rpx - 60rpx - 60rpx) !important;
		line-height: 1.6em;
	}
	.lesson-card {
		height: 110rpx;
		overflow: hidden;
		text-align: center;
	}
</style>