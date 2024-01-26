<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">我的课表</block>
		</cu-custom>
		<view class="flex justify-center">
			<picker @change="semesterChange" :value="semesterIndex" :range="semesterOptions" range-key="name">
				<view class="picker cu-tag line-blue round margin-lr-sm margin-tb-xs">
					{{(semesterOptions.length>0&&semesterIndex>-1)?semesterOptions[semesterIndex].name:''}} 学年 <text
						class="cuIcon-right"></text>
				</view>
			</picker>
			<picker @change="weekChange" :value="weekIndex" :range="weekOptions" range-key="name">
				<view class="picker cu-tag line-blue round margin-lr-sm margin-tb-xs">
					{{(weekOptions.length>0&&weekIndex>-1)?weekOptions[weekIndex].name:'整学期'}} <text
						class="cuIcon-right"></text>
				</view>
			</picker>
		</view>
		<view v-if="courseData">
			<scroll-view scroll-y="true" scroll-x="true">
				<view class="flex border-bottom" :style="{width: `${tableWidth}px`}">
					<view class="tb-head-y border-right" :style="{width: `${columnTitleWidth}px`}"></view>
					<view v-for="(day, dayIdx) in courseData.columnTitle" class="tb-head-x text-gray"
						:style="{width: `${itemWidth}px`}" :key="dayIdx">{{day}}</view>
				</view>
				<view class="flex" :style="{width: `${tableWidth}px`}" v-for="(row, rowIdx) in [0,1,2,3,4,5]"
					:key="rowIdx">
					<view class="border-right tb-height text-center flex justify-center align-center"
						:style="{width: `${columnTitleWidth}px`}">
						<view class="text-gray">
							{{courseData.rowTitle[rowIdx][0]}}<br />~<br />{{courseData.rowTitle[rowIdx][1]}}</view>
					</view>
					<view v-for="(day, dayIdx) in courseData.columnTitle"
						:class="(courseData.table[dayIdx].items[rowIdx].length>0?`shadow-warp bg-${bgColors[courseData.table[dayIdx].items[rowIdx][0].courseName.length%bgColors.length]}`:'') + ' text-white course-item radius tb-head-x tb-height justify-center align-center'"
						:style="{width: `${itemWidth}px`,height: `${itemHeight}px`}" :key="dayIdx" :data-dayidx="dayIdx"
						:data-rowidx="rowIdx" @click="showDetail">
						<template v-if="courseData.table[dayIdx].items[rowIdx].length == 1">
							<view class="margin-tb-xs">{{courseData.table[dayIdx].items[rowIdx][0].place}}</view>
							<view class="margin-tb-xs course-name">
								{{courseData.table[dayIdx].items[rowIdx][0].courseName}}
							</view>
						</template>
						<template v-else-if="courseData.table[dayIdx].items[rowIdx].length > 1">
							{{`${courseData.table[dayIdx].items[rowIdx].length}门课程`}}
						</template>
						<template v-else></template>
					</view>
				</view>
				<view class="flex" :style="{width: `${tableWidth}px`}">
					<view class="tb-height text-center flex justify-center align-center">
						<view class="padding-tb-sm margin-lr-xs">{{courseData.tips}}</view>
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
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="text-left">
					<swiper :indicator-dots="true" :autoplay="false" style="height: 760upx;">
						<block v-for="(detail, index) in details">
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
												<view>{{detail.teachWeek}} 周</view>
											</view>
										</view>
										<view class="cu-item">
											<view class="content">
												<text class="cuIcon-remind text-blue"></text><text
													class="text-grey">节次</text>
											</view>
											<view class="action">
												<view>{{detail.teachNo}} 节</view>
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
										<view class="cu-item">
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
	export default {
		data() {
			return {
				screenWidth: 375,
				columnTitleWidth: 42,
				tableWidth: 0,
				tableHeight: 0,
				itemWidth: 64,
				itemHeight: 120,
				courseData: '',
				semesterIndex: 0,
				semesterOptions: [],
				weekIndex: 0,
				weekOptions: [],
				bgColors: ['red', 'orange', 'yellow', 'olive', 'green', 'cyan', 'blue', 'purple', 'mauve', 'pink', 'brown',
					'grey'
				],
				displayDetailModal: false,
				details: []
			}
		},
		onLoad() {
			this.calcTableSize()
			this.fetchCourseOptions()
			this.fetchCourse()
		},
		methods: {
			showDetail(e) {
				const dayIdx = e.currentTarget.dataset.dayidx
				const rowIdx = e.currentTarget.dataset.rowidx
				const itemCourses = this.courseData.table[dayIdx].items[rowIdx]
				if (!itemCourses || itemCourses.length == 0) return
				this.details = itemCourses
				console.log(itemCourses)
				this.displayDetailModal = true
			},
			hideModal() {
				this.displayDetailModal = false
			},
			semesterChange(e) {
				const index = e.detail.value
				const semester = this.semesterOptions[index].value
				this.semesterIndex = index
				const week = this.weekOptions[this.weekIndex].value
				console.log(semester, week)
				this.fetchCourse(semester, week)
			},
			weekChange(e) {
				const index = e.detail.value
				const week = this.weekOptions[index].value
				this.weekIndex = index
				const semester = this.semesterOptions[this.semesterIndex].value
				console.log(semester, week)
				this.fetchCourse(semester, week)
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
			fetchCourseOptions() {
				this.$api.fetchSemesterCourseOptions().then(res => {
					console.log('fetchCourseOptions', res.data)
					this.weekOptions = res.data.week
					this.semesterOptions = res.data.semester
				}).catch(error => {
					console.log('获取学期课表筛选项失败', error)
				})
			},
			fetchCourse(semester = '', week = '') {
				uni.showLoading({
					title: '加载中...'
				})
				this.$api.fetchSemesterCourse(semester, week).then(res => {
					this.courseData = this.convertFormatCourse(res.data)
					console.log(this.courseData)
					uni.hideLoading()
				}).catch(error => {
					uni.hideLoading()
					console.log('获取学期课表失败', error)
				})
			},
			convertFormatCourse(data) {
				// 分隔上下课时间列值
				for (var i = 0; i < data.rowTitle.length; i++) {
					const item = data.rowTitle[i]
					data.rowTitle[i] = item.split('-')
				}
				return data
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

	.course-name {}
</style>