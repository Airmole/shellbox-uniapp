<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">{{courseData.semester}} 学期</block>
		</cu-custom>
		<view v-if="courseData">
			<scroll-view scroll-y="true" scroll-x="true">
				<view class="flex border-bottom" :style="{width: `${tableWidth}px`}">
					<view class="tb-head-y border-right" :style="{width: `${columnTitleWidth}px`}"></view>
					<view v-for="(day, dayIdx) in courseData.columnTitle" class="tb-head-x text-gray"
						:style="{width: `${itemWidth}px`}" :key="dayIdx">{{day}}</view>
				</view>
				<view class="flex" :style="{width: `${tableWidth}px`}" v-for="(row, rowIdx) in [0,1,2,3,4,5]"  :key="rowIdx">
					<view class="border-right tb-height text-center flex justify-center align-center"
						:style="{width: `${columnTitleWidth}px`}">
						<view class="text-gray">{{courseData.rowTitle[rowIdx][0]}}<br />~<br />{{courseData.rowTitle[rowIdx][1]}}</view>
					</view>
					<view v-for="(day, dayIdx) in courseData.columnTitle"
						:class="(courseData.table[dayIdx].items[rowIdx].length>0?'bg-grey':'') + ' course-item radius tb-head-x tb-height justify-center align-center'"
						:style="{width: `${itemWidth}px`,height: `${itemHeight}px`}"
						:key="dayIdx"
						>
						<template v-if="courseData.table[dayIdx].items[rowIdx].length == 1">
							<view class="margin-tb-xs">{{courseData.table[dayIdx].items[rowIdx][0].place}}</view>
							<view class="margin-tb-xs course-name">
								{{courseData.table[dayIdx].items[rowIdx][0].courseName}}</view>
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
				courseData: ''
			}
		},
		onLoad() {
			this.calcTableSize()
			this.fetchCourse()
		},
		methods: {
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
			fetchCourse() {
				this.$api.fetchSemesterCourse({}).then(res => {
					this.courseData = this.convertFormatCourse(res.data)
					console.log(this.courseData)
				}).catch(error => {
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