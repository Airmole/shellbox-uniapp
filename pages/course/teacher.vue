<template>
	<view>
		<template v-if="showSearchArea">
			<cu-custom bgColor="bg-gradual-blue" :isBack="true">
				<view>教师课表</view>
			</cu-custom>
			<view class="margin">
				<view :class="'cu-list menu sm-border '+(foldOptionsArea?'round':'card-radius')">
					<view class="cu-item press-class" @click="showOptionsArea">
						<view class="content">
							<text class="cuIcon-title text-green"></text> 教师课表查询筛选操作
						</view>
						<view class="action text-right">
							<text :class="'cuIcon-'+(foldOptionsArea?'right':'unfold')"></text>
						</view>
					</view>
					<template v-if="!foldOptionsArea">
						<view class="cu-item">
							<view class="content">
								<text class="text-red">*授课教师</text>
							</view>
							<view class="action text-right">
								<input placeholder="请输入教师姓名" name="teacherName" v-model="optionForm.teacherName" />
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
									<picker @change="collegeChange" :value="collegeIndex" :range="collegeOption"
										range-key="name">
										<view class="picker">
											{{collegeIndex>-1?collegeOption[collegeIndex].name:'请选择'}}
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
								<button @click="fetchTeacherCourse" class="cu-btn round bg-green shadow"><text
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
			
			<view class="cu-list menu-avatar margin card-radius">
				<template v-for="(teacherCourse, teacherIndex) in teacherCourses" :key="teacherIndex">
					<view class="cu-item" @click="clickTeacherCourse(teacherIndex)">
						<view class="cu-avatar lg round bg-gradual-green"><text class="text-sm">{{teacherCourse.teacherName}}</text></view>
						<view class="content text-cut"><view class="padding-left-xs"><text class="text-xl">{{teacherCourse.teacherName}}</text></view></view>
						<view class="action"><text class="cuIcon-right"></text></view>
					</view>
					<!-- #ifdef MP-WEIXIN -->
					<view v-if="teacherIndex !== 0 && teacherIndex % 12 === 0 && !isVip" class="bg-white">
						<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
					</view>
					<!-- #endif -->
					<!-- #ifdef MP-QQ -->
					<view v-if="teacherIndex !== 0 && teacherIndex % 12 === 0 && !isVip" class="bg-white">
						<ad unit-id="297c24fcd434022129795daed3f46440"></ad>
					</view>
					<!-- #endif -->
				</template>
				<tips v-if="teacherCourses !== '' && teacherCourses.length === 0" :tips="'没有符合条件的数据，请进行筛选操作'"></tips>
			</view>
		</template>
		
		<view v-if="!showSearchArea && teacherCourse.teacherName">
			<view class="padding-tb bg-gradual-blue"></view>
			<view class="cu-bar bg-gradual-blue">
			    <view class="action" @click="hideSearchArea"><text class="cuIcon-back text-white"></text></view>
			    <view class="content text-bold">{{teacherCourse.teacherName}} 教师课表</view>
			</view>
			<courseTable :columnTitles="columnTitle" :table="teacherCourse.course" :tips="''"></courseTable>
		</view>
		
	</view>
</template>

<script>
	const app = getApp()
	import api from '@/request/api.js'
	import courseTable from './components/courseTable.vue'
	let interstitialAd = null
	export default {
		components: { courseTable },
		data() {
			return {
				isVip: false,
				showSearchArea: true,
				showAllOption: false,
				foldOptionsArea: false,
				collegeIndex: -1,
				collegeOption: [],
				semesterIndex: -1,
				semesterOption: [],
				timeModelIndex: -1,
				timeModelOption: [],
				weekStartIndex: -1,
				weekEndIndex: -1,
				dayOfWeekStartIndex: -1,
				dayOfWeekEndIndex: -1,
				optionForm: {
					semester: '',
					timeModel: '',
					college: '',
					teacherName: '',
					weekStart: '',
					weekEnd: '',
					dayOfWeekStart: '',
					dayOfWeekEnd: ''
				},
				teacherIndex: 0,
				teacherCourses: '',
				teacherCourse: {},
				columnTitle: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
				weekOption: [],
				dayOfWeekOption: []
			}
		},
		onLoad(options) {
			this.isVip = app.globalData.isVip
			// #ifdef MP-WEIXIN
			if(wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif
			// #ifdef MP-QQ
			if (qq.createInterstitialAd) interstitialAd = qq.createInterstitialAd({ adUnitId: '8fe9b8e7191346a2ffb0c20c6bf3e0cf' })
			// #endif
			
			if (options && options.keyword) {
				uni.showLoading({ title: '加载中...' })
				this.optionForm.teacherName = options.keyword
			}
			
			this.generateWeekOption()
			this.generateDayOfWeekOption()
			this.fetchOptions(options.keyword)
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()	
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
			clickTeacherCourse (teacherIndex) {
				console.log('clickTeacherCourse', this.teacherCourses[teacherIndex])
				if (teacherIndex >= 0) {
					this.teacherIndex = teacherIndex
					this.teacherCourse = this.teacherCourses[teacherIndex]
					this.showSearchArea = false
				}
			},
			fetchTeacherCourse () {
				this.optionForm.teacherName = this.optionForm.teacherName.replace(/\s/g, "")
				if (this.optionForm.teacherName.length <= 0) {
					uni.showToast({ title: '请输入授课教师姓名', icon: 'none'})
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
				api.fetchTeacherCourse(
					this.optionForm.semester,
					this.optionForm.timeModel,
					this.optionForm.college,
					this.optionForm.teacherName,
					this.optionForm.weekStart.toString(),
					this.optionForm.weekEnd.toString(),
					this.optionForm.dayOfWeekStart.toString(),
					this.optionForm.dayOfWeekEnd.toString()
				).then(res => {
					// console.log('fetchClassCourse', res.data)
					this.teacherCourses = res.data
					uni.hideLoading()
				}).catch((res) => {
					uni.showToast({ title: res.data.message, icon: 'none'})
				})
			},
			fetchOptions (teacherName = null) {
				api.fetchTeacherCourseOptions().then(res => {
					const { semester, timeModel, college, grade } = res.data
					this.semesterOption = semester
					const semesterIndex = semester.findIndex((value) => value.checked === true)
					this.semesterIndex = semesterIndex
					this.optionForm.semester = semester[semesterIndex].value
					this.timeModelOption = timeModel
					const timeModelIndex = timeModel.findIndex((value) => value.checked === true)
					this.timeModelIndex = timeModelIndex
					this.optionForm.timeModel = timeModel[timeModelIndex].value
					this.collegeOption = college
					this.collegeIndex = college.findIndex((value) => value.checked === true)
					uni.hideLoading()
					if (teacherName !== null) this.fetchTeacherCourse()
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
			collegeChange (e) {
				const index = e.detail.value
				this.collegeIndex = index
				this.optionForm.college = this.collegeOption[index].value
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
					college: '',
					teacherName: '',
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
		},
		onShareAppMessage() {
			let text = ''
			let query = ''
			if (this.optionForm.teacherName) {
				text = `【${this.optionForm.teacherName}...】相关`
				query = `?keyword=${this.optionForm.teacherName}`
			}
			let data = {
			  title: `${text}教师课表 - 贝壳小盒子`,
			  path: `/pages/course/teacher${query}`
			}
			return data
		},
		onShareTimeline() {
			let text = ''
			let query = ''
			if (this.optionForm.teacherName) {
				text = `【${this.optionForm.teacherName}...】相关`
				query = `keyword=${this.optionForm.teacherName}`
			}
			let data = {
				title: `${text}教师课表 - 贝壳小盒子`,
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
</style>