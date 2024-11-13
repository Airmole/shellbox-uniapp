<template>
	<view>
		<scroll-view scroll-y="true" scroll-x="true">
			<view class="flex border-bottom" :style="{width: `${tableWidth}px`}">
				<view class="tb-head-y border-right" :style="{width: `${columnTitleWidth}px`}"></view>
				<view v-for="(day, dayIdx) in columnTitles" class="tb-head-x text-gray"
					:style="{width: `${itemWidth}px`}" :key="dayIdx">{{day}}</view>
			</view>
			<view class="flex" :style="{width: `${tableWidth}px`}" v-for="(row, rowIdx) in [0,1,2,3,4,5]"
				:key="rowIdx">
				<view class="border-right tb-height text-center flex justify-center align-center"
					:style="{width: `${columnTitleWidth}px`}">
					<view class="text-gray">
						{{rowTitles[rowIdx][0]}}<br />~<br />{{rowTitles[rowIdx][1]}}</view>
				</view>
				<view v-for="(day, dayIdx) in columnTitles"
					:class="(table[dayIdx].items[rowIdx].length>0?`shadow-warp bg-${bgColors[table[dayIdx].items[rowIdx][0].courseName.length%bgColors.length]}`:'') + ' text-white course-item radius tb-head-x tb-height justify-center align-center'"
					:style="{width: `${itemWidth}px`,height: `${itemHeight}px`}" :key="dayIdx" :data-dayidx="dayIdx"
					:data-rowidx="rowIdx" @click="showDetail">
					<template v-if="table[dayIdx].items[rowIdx].length == 1">
						<view class="margin-tb-xs place-name">{{table[dayIdx].items[rowIdx][0].place}}</view>
						<view class="margin-tb-xs course-name" :style="{height: `${itemHeight-50}px`}">
							{{table[dayIdx].items[rowIdx][0].courseName}}
						</view>
					</template>
					<template v-else-if="table[dayIdx].items[rowIdx].length > 1">
						{{`${table[dayIdx].items[rowIdx].length}门课程`}}
					</template>
					<template v-else></template>
				</view>
			</view>
			
			<view class="flex padding-tb-sm" :style="{width: `${tableWidth}px`}"></view>
		</scroll-view>
		
		<view class="flex" v-if="tips">
			<view class="tb-height text-center flex justify-center align-center">
				<view class="padding-tb-sm margin-lr-xs text-gray">{{tips}}</view>
			</view>
		</view>
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
									<view class="cu-item" v-if="detail.teachWeek">
										<view class="content">
											<text class="cuIcon-calendar text-blue"></text><text
												class="text-grey">周数</text>
										</view>
										<view class="action">
											<view>{{detail.teachWeek}}</view>
										</view>
									</view>
									<view class="cu-item" v-if="detail.teachNo">
										<view class="content">
											<text class="cuIcon-sort text-blue"></text><text
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
									<view class="cu-item" v-if="detail.teacher">
										<view class="content">
											<text class="cuIcon-people text-blue"></text><text
												class="text-grey">教师</text>
										</view>
										<view class="action">
											<view>{{detail.teacher}}</view>
										</view>
									</view>
									<view class="cu-item" v-if="detail.className">
										<view class="content">
											<text class="cuIcon-people text-blue"></text><text
												class="text-grey">上课班级</text>
										</view>
										<view class="action">
											<view>{{detail.className}}</view>
										</view>
									</view>
									<view class="cu-item" v-if="detail.startAt">
										<view class="content">
											<text class="cuIcon-remind text-blue"></text><text
												class="text-grey">上课时间</text>
										</view>
										<view class="action">
											<view>{{detail.startAt}}</view>
										</view>
									</view>
									<view class="cu-item" v-if="detail.endAt">
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
</template>

<script setup>
	import { ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'

	let screenWidth = ref(375)
	let columnTitleWidth = ref(42)
	let tableWidth = ref(500)
	let tableHeight = ref(732)
	let itemWidth = ref(64)
	let itemHeight = ref(120)
	const bgColors = ref(['red', 'orange', 'yellow', 'olive', 'green', 'cyan', 'blue', 'purple', 'mauve', 'pink', 'brown','grey'])
	let displayDetailModal = ref(false)
	let details = ref([])
	let newRowTitles = ref([])
	const rowTitles = ref([["08:00","09:35"], ["09:55","11:30"], ["13:10","14:45"], ["15:00","16:35"], ["16:50","18:25"], ["19:10","21:35"]])
	
	const props = defineProps({
		columnTitles: {
			type: Array,
			default: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			required: false
		},
		table: {
			type: Array,
			default: [],	
			required: true
		},
		tips: {
			type: String,
			default: '',
			required: false
		},
	})
	
	onLoad(() => {
		calcTableSize()
	})
	
	function hideModal() {
		displayDetailModal.value = false
	}
	
	function showDetail(e) {
		const dayIdx = e.currentTarget.dataset.dayidx
		const rowIdx = e.currentTarget.dataset.rowidx
		const itemCourses = props.table[dayIdx].items[rowIdx]
		if (!itemCourses || itemCourses.length == 0) return
		details.value = itemCourses
		console.log(itemCourses)
		displayDetailModal.value = true
	}
	
	function calcTableSize() {
		const res = wx.getSystemInfoSync()
		// console.log(res)
		const scrWidth = res.screenWidth
		const screenHeight = res.screenHeight
		const itmWidth = (res.screenWidth - columnTitleWidth.value - (2 * 6)) / 5
		const tablWidth = 30 + (itmWidth * 7) + (2 * 8)
		const itmHeight = (screenHeight - 60) / 6
		const tablHeight = (itmHeight * 6) + (2 * 6)
		screenWidth.value = scrWidth
		itemWidth.value = itmWidth
		itemHeight.value = itmHeight
		tableWidth.value = tablWidth
		tableHeight.value = tablHeight
	}
	
</script>

<style>
	.tb-head-x {
		margin: 4rpx;
		text-align: center;
	}
	
	.border-bottom {
		border-bottom: 1px solid #ccc;
	}
	
	.border-right {
		border-right: 1px solid #ccc;
	}
	
	.course-item {
		padding: 6rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.content {
		min-width: 200rpx;
	}
	
	.course-name {
		overflow-y: clip;
		text-overflow: ellipsis;
	}
	
	.place-name {
		/* min-height: 20rpx; */
	}
</style>