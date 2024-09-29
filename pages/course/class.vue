<template>
	<view>
		<template v-if="showSearchArea">
			<cu-custom bgColor="bg-gradual-blue" :isBack="true">
				<view>班级课表</view>
			</cu-custom>
			<view class="margin">
				<view :class="'cu-list menu sm-border '+(foldOptionsArea?'round':'card-radius')">
					<view class="cu-item press-class" @click="showOptionsArea">
						<view class="content">
							<text class="cuIcon-title text-green"></text> 班级课表查询筛选操作
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
								<picker @change="semesterChange" :value="semesterIndex" :range="semesterOption"
									range-key="name">
									<view class="picker">
										{{semesterIndex>-1?semesterOption[semesterIndex].name:'选择学期'}}
									</view>
								</picker>
							</view>
						</view>
						<view class="cu-item arrow">
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
						<view class="cu-item arrow">
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
						<view class="cu-item arrow">
							<view class="content">
								<text class="text-grey">上课年级</text>
							</view>
							<view class="action">
								<picker @change="gradeChange" :value="gradeIndex" :range="gradeOption"
									range-key="name">
									<view class="picker">
										{{gradeIndex>-1?gradeOption[gradeIndex].name:'请选择'}}
									</view>
								</picker>
							</view>
						</view>
						<view class="cu-item arrow">
							<view class="content">
								<text class="text-grey">上课专业</text>
							</view>
							<view class="action">
								<picker @change="professionChange" :value="professionIndex" :range="professionOption"
									range-key="dmmc">
									<view class="picker">
										{{professionIndex>-1?professionOption[professionIndex].dmmc:'请选择'}}
									</view>
								</picker>
							</view>
						</view>
						<view class="cu-item">
							<view class="content">
								<text class="text-grey">上课班级</text>
							</view>
							<view class="action text-right">
								<input placeholder="请输入班级名称" name="className" v-model="optionForm.className" />
							</view>
						</view>
						<view class="cu-item">
							<view class="content">
							</view>
							<view class="action">
								<button @click="resetOptionsForm" class="cu-btn round bg-red shadow margin-lr"><text
										class="cuIcon-refresh"></text> 重置</button>
								<button @click="fetchClassCourse" class="cu-btn round bg-green shadow"><text
										class="cuIcon-search"></text> 查询</button>
							</view>
						</view>
					</template>
				</view>
			</view>
			
			<view class="cu-list menu-avatar margin card-radius">
			    <view class="cu-item" v-for="(classCourse, classIndex) in classCourses" :key="classIndex" @click="clickClassCourse(classIndex)">
					<view class="cu-avatar lg round bg-gradual-green"><text class="text-sm">{{classCourse.className}}</text></view>
			        <view class="content"><view class="padding-lr"><text class="text-xl">{{classCourse.className}}</text></view></view>
			    </view>
			</view>
		</template>
		
		<view v-if="!showSearchArea && classCourse.className">
			<view class="cu-bar bg-gradual-blue fixed">
			    <view class="action" @click="hideSearchArea"><text class="cuIcon-back text-gray"></text></view>
			    <view class="content text-bold">{{classCourse.className}} 班级课表</view>
			  </view>
			<scroll-view scroll-y="true" scroll-x="true" class="margin-top-xl padding-top-xl">
				<view class="flex border-bottom" :style="{width: `${tableWidth}px`}">
					<view class="tb-head-y border-right" :style="{width: `${columnTitleWidth}px`}"></view>
					<view v-for="(day, dayIdx) in columnTitle" class="tb-head-x text-gray"
						:style="{width: `${itemWidth}px`}" :key="dayIdx">{{day}}</view>
				</view>
				<view class="flex" :style="{width: `${tableWidth}px`}" v-for="(row, rowIdx) in [0,1,2,3,4,5]"
					:key="rowIdx">
					<view class="border-right tb-height text-center flex justify-center align-center"
						:style="{width: `${columnTitleWidth}px`}">
						<view class="text-gray">
							{{rowTitle[rowIdx][0]}}<br />~<br />{{rowTitle[rowIdx][1]}}</view>
					</view>
					<view v-for="(day, dayIdx) in columnTitle"
						:class="(classCourse.course[dayIdx].items[rowIdx].length>0?`shadow-warp bg-${bgColors[classCourse.course[dayIdx].items[rowIdx][0].courseName.length%bgColors.length]}`:'') + ' text-white course-item radius tb-head-x tb-height justify-center align-center'"
						:style="{width: `${itemWidth}px`,height: `${itemHeight}px`}" :key="dayIdx" :data-dayidx="dayIdx"
						:data-rowidx="rowIdx" @click="showDetail">
						<template v-if="classCourse.course[dayIdx].items[rowIdx].length == 1">
							<view class="margin-tb-xs">{{classCourse.course[dayIdx].items[rowIdx][0].place}}</view>
							<view class="margin-tb-xs course-name">
								{{classCourse.course[dayIdx].items[rowIdx][0].courseName}}
							</view>
						</template>
						<template v-else-if="classCourse.course[dayIdx].items[rowIdx].length > 1">
							{{`${classCourse.course[dayIdx].items[rowIdx].length}门课程`}}
						</template>
						<template v-else></template>
					</view>
				</view>
				
				<view class="flex padding-tb-sm" :style="{width: `${tableWidth}px`}"></view>
			</scroll-view>
		</view>
		
		<view class="cu-modal" :class="displayDetailModal?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">课程详情（{{details.length}}节）</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red text-bold"></text>
					</view>
				</view>
				<view class="text-left">
					<swiper :indicator-dots="true" :autoplay="false" style="height: 720rpx;">
						<block v-for="(detail, index) in details" :key="index">
							<swiper-item>
								<view class="swiper-item">
									<view class="cu-list menu sm-border">
										<view class="cu-item">
											<view class="content">
												<text class="cuIcon-activity text-blue"></text><text
													class="text-grey">课程名称</text>
											</view>
											<view class="action">
												<view>{{detail.courseName}}</view>
											</view>
										</view>
										<view class="cu-item">
											<view class="content">
												<text class="cuIcon-calendar text-blue"></text><text
													class="text-grey">周数</text>
											</view>
											<view class="action">
												<view>{{detail.teachWeek}}</view>
											</view>
										</view>
										<view class="cu-item">
											<view class="content">
												<text class="cuIcon-locationfill text-blue"></text><text
													class="text-grey">上课地点</text>
											</view>
											<view class="action">
												<view>{{detail.place || '教务系统没写'}}</view>
											</view>
										</view>
										<view class="cu-item" v-if="detail.teacher">
											<view class="content">
												<text class="cuIcon-people text-blue"></text><text
													class="text-grey">教师</text>
											</view>
											<view class="action">
												<view>{{detail.teacher}}</view>
											</view>
										</view>
										<view class="cu-item">
											<view class="content">
												<text class="cuIcon-remind text-blue"></text><text
													class="text-grey">上课时间</text>
											</view>
											<view class="action">
												<view>{{detail.startAt}}</view>
											</view>
										</view>
										<view class="cu-item">
											<view class="content">
												<text class="cuIcon-remind text-blue"></text><text
													class="text-grey">下课时间</text>
											</view>
											<view class="action">
												<view>{{detail.endAt}}</view>
											</view>
										</view>
									</view>
								</view>
							</swiper-item>
						</block>
					</swiper>
					<view  v-if="details.length>1" class="padding-sm text-center"><text>左右滑动可切换</text></view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import api from '@/request/api.js'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	export default {
		data() {
			return {
				showSearchArea: true,
				foldOptionsArea: false,
				collegeIndex: -1,
				collegeOption: [],
				gradeIndex: -1,
				gradeOption: [],
				semesterIndex: -1,
				semesterOption: [],
				timeModelIndex: -1,
				timeModelOption: [],
				professionIndex: -1,
				professionOption: [],
				optionForm: {
					semester: '',
					timeModel: '',
					college: '',
					grade: '',
					profession: '',
					className: ''
				},
				classIndex: 0,
				classCourses: [],
				classCourse: {},
				screenWidth: 375,
				columnTitleWidth: 42,
				tableWidth: 0,
				tableHeight: 0,
				itemWidth: 64,
				itemHeight: 120,
				bgColors: ['red', 'orange', 'yellow', 'olive', 'green', 'cyan', 'blue', 'purple', 'mauve', 'pink', 'brown','grey'],
				columnTitle: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
				rowTitle:  [["08:00","09:35"], ["09:55","11:30"], ["13:10","14:45"], ["15:00","16:35"], ["16:50","18:25"], ["19:10","21:35"]],
				displayDetailModal: false,
				details: []
			}
		},
		onLoad() {
			if (getEdusysAccount() === false) {
				uni.redirectTo({
					url: '/pages/index/login'
				})
				return
			}
			this.fetchOptions()
			this.fetchProfessionOptions()
			this.calcTableSize()
		},
		methods: {
			hideSearchArea () {
				this.showSearchArea = true
			},
			calcTableSize() {
				const res = wx.getSystemInfoSync()
				console.log(res)
				const screenWidth = res.screenWidth
				const screenHeight = res.screenHeight
				const itemWidth = (res.screenWidth - this.columnTitleWidth - (2 * 6)) / 5
				const tableWidth = 30 + (itemWidth * 7) + (2 * 8)
				const itemHeight = (screenHeight - 60) / 6
				const tableHeight = (itemHeight * 6) + (2 * 6)
				this.screenWidth = screenWidth
				this.itemWidth = itemWidth
				this.itemHeight = itemHeight
				this.tableWidth = tableWidth
				this.tableHeight = tableHeight
				
			},
			showOptionsArea() {
				this.foldOptionsArea = !this.foldOptionsArea
			},
			clickClassCourse (classIndex) {
				console.log('clickClassCourse', this.classCourses[classIndex])
				if (classIndex >= 0) {
					this.classIndex = classIndex
					this.classCourse = this.classCourses[classIndex]
					this.showSearchArea = false
				}
			},
			fetchClassCourse () {
				uni.showLoading({ title: '加载中...' })
				console.log('optionForm', this.optionForm)
				api.fetchClassCourse(
					this.optionForm.semester,
					this.optionForm.timeModel,
					this.optionForm.college,
					this.optionForm.grade,
					this.optionForm.profession,
					this.optionForm.className
				).then(res => {
					// console.log('fetchClassCourse', res.data)
					this.classCourses = res.data
					uni.hideLoading()
				})
			},
			fetchOptions () {
				api.fetchClassCourseOptions().then(res => {
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
					this.gradeOption = grade
					this.gradeIndex = grade.findIndex((value) => value.checked === true)
					uni.hideLoading()
				})
			},
			fetchProfessionOptions (collegeCode = '', grade = '') {
				api.fetchClassCourseProfessionOptions(collegeCode, grade).then(res => {
					this.professionOption = res.data
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
				this.fetchProfessionOptions(this.optionForm.college, this.optionForm.grade)
			},
			gradeChange (e) {
				const index = e.detail.value
				this.gradeIndex = index
				this.optionForm.grade = this.gradeOption[index].value
				this.fetchProfessionOptions(this.optionForm.college, this.optionForm.grade)
			},
			professionChange (e) {
				const index = e.detail.value
				this.professionIndex = index
				this.optionForm.profession = this.professionOption[index].dm
			},
			resetOptionsForm() {
				uni.showLoading({ title: '加载中...' })
				this.optionForm = {
					semester: '',
					timeModel: '',
					college: '',
					grade: '',
					profession: '',
					className: ''
				}
				this.professionIndex = -1
				this.fetchOptions()
			},
			showDetail(e) {
				const dayIdx = e.currentTarget.dataset.dayidx
				const rowIdx = e.currentTarget.dataset.rowidx
				const itemCourses = this.classCourse.course[dayIdx].items[rowIdx]
				if (!itemCourses || itemCourses.length == 0) return
				this.details = itemCourses
				// console.log(itemCourses)
				this.displayDetailModal = true
			},
			hideModal() {
				this.displayDetailModal = false
			}
		}
	}
</script>

<style>
	.tb-head-x {
		margin: 4upx;
		text-align: center;
	}

	.border-bottom {
		border-bottom: 1px solid #ccc;
	}

	.border-right {
		border-right: 1px solid #ccc;
	}

	.course-item {
		padding: 6upx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.content {
		min-width: 200rpx;
	}

	.course-name {}
</style>