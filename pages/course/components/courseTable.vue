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
						{{rowTitles[rowIdx][0]}}<br/>~<br/>{{rowTitles[rowIdx][1]}}</view>
				</view>
				<view
					v-for="(day, dayIdx) in columnTitles"
					:class="`${table[dayIdx] && table[dayIdx].items[rowIdx].length > 0 ? `bg-${bgColors[table[dayIdx].items[rowIdx][0].courseName.length%bgColors.length]} shadow` : ``} text-white course-item radius tb-head-x tb-height flex justify-center align-center`"
					:style="{
						width: `${itemWidth}px`,
						height: `${itemHeight}px`,
						animation: `show ${((dayIdx+1)*0.2+1)}s 1`
					}"
					:key="dayIdx"
				>
					<template v-if="table[dayIdx] && table[dayIdx].items[rowIdx].length == 0"></template>
					<!-- 一节一门课程 -->
					<view 
						v-else-if="table[dayIdx] && table[dayIdx].items[rowIdx].length == 1" 
						:style="{width: `${itemWidth}px`}"
						:data-dayidx="dayIdx"
						:data-rowidx="rowIdx"
						:data-cellidx="0"
						@click="showDetail"
					>
						<view class="margin-tb-xs place-name">{{table[dayIdx].items[rowIdx][0].place}}</view>
						<view class="margin-tb-xs course-name" :style="{height: `${itemHeight-50}px`}">
							{{table[dayIdx].items[rowIdx][0].courseName}}
						</view>
					</view>
					<!-- 一节三门以下课程 -->
					<template v-else-if="table[dayIdx] && table[dayIdx].items[rowIdx].length > 1 && table[dayIdx].items[rowIdx].length <= 3">
						<view
							v-for="(itm, idx) in table[dayIdx].items[rowIdx]"
							:key="idx"
							:style="{
								height: `${(itemHeight)/table[dayIdx].items[rowIdx].length}px`,
								width: `${itemWidth}px`,
								margin: '1px 0',
								overflow: 'clip',
								borderBottom: idx === table[dayIdx].items[rowIdx].length - 1 ? '' : '1px solid white'
							}"
							:data-dayidx="dayIdx"
							:data-rowidx="rowIdx"
							:data-cellidx="idx"
							@click="showDetail"
						>
							<view class="place-name text-cut" style="height: 1.1rem;">{{itm.place}}</view>
							<view class="course-name">
								{{itm.courseName}}
							</view>
						</view>
					</template>
					<!-- 一节三门以上五门以下课程 -->
					<template v-else-if="table[dayIdx] && table[dayIdx].items[rowIdx].length > 3 && table[dayIdx].items[rowIdx].length <= 5">
						<view
							v-for="(itm, idx) in table[dayIdx].items[rowIdx]"
							:key="idx"
							:style="{
								height: `${(itemHeight)/table[dayIdx].items[rowIdx].length}px`,
								width: `${itemWidth}px`,
								margin: '1px 0',
								overflow: 'clip',
								borderBottom: idx === table[dayIdx].items[rowIdx].length - 1 ? '' : '1px solid white'
							}"
							:data-dayidx="dayIdx"
							:data-rowidx="rowIdx"
							:data-cellidx="idx"
							@click="showDetail"
						>
							<view class="place-name text-cut text-sm" style="height: 1.1rem;">{{itm.place || itm.courseName}}</view>
						</view>
					</template>
					<!-- 一节五门以上课程 -->
					<template v-else>
						<template v-for="(itm, idx) in (table[dayIdx] && table[dayIdx].items[rowIdx])" :key="idx">
							<view
								v-if="idx < 5"
								:style="{
									height: `${(itemHeight)/5}px`,
									width: `${itemWidth}px`,
									margin: '1px 0',
									overflow: 'clip',
									borderBottom:idx === 4 ? '' : '1px solid white'
								}"
								:data-dayidx="dayIdx"
								:data-rowidx="rowIdx"
								:data-cellidx="idx"
								@click="showDetail"
							>
								<view class="place-name text-cut text-sm" style="height: 1.1rem;">{{itm.place || itm.courseName}}</view>
							</view>
						</template>
						<view
							class="text-sm"
							v-if="table[dayIdx] && table[dayIdx].items[rowIdx].length"
							:data-dayidx="dayIdx"
							:data-rowidx="rowIdx"
							:data-cellidx="5"
							@click="showDetail"
						>...共{{table[dayIdx] && table[dayIdx].items[rowIdx].length}}门</view>
					</template>
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
	
	<!-- 课程详情模态框 -->
	<view class="cu-modal" :class="displayDetailModal?'show':''">
		<view class="cu-dialog bg-gray">
			<view class="cu-bar justify-end">
				<view class="content">课程详情（{{details.length}}节）</view>
				<view class="action" @tap="hideModal">
					<text class="cuIcon-close text-red text-bold"></text>
				</view>
			</view>
			<view class="text-left padding-lr-xs">
				<swiper :indicator-dots="true" :autoplay="false" :current="courseCellIndex" style="height: 720rpx;" class="bg-gray">
					<block v-for="(detail, index) in details" :key="index">
						<swiper-item>
							<view class="swiper-item">
								<view class="cu-list menu sm-border">
									<navigator :url="`/pages/course/lesson?keyword=${detail.courseName}`" :render-link="false" class="cu-item arrow">
										<view class="content">
											<text class="cuIcon-activity text-blue"></text><text
												class="text-grey">课程名称</text>
										</view>
										<view class="action">
											<view>{{detail.courseName}}</view>
										</view>
									</navigator>
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
									<view @tap="goCoursePlace(detail.place)" :class="`cu-item ${detail.place?'arrow':''}`">
										<view class="content">
											<text class="cuIcon-locationfill text-blue"></text><text
												class="text-grey">上课地点</text>
										</view>
										<view class="action">
											<view>{{detail.place || '教务系统没写'}}</view>
										</view>
									</view>
									<navigator :url="`/pages/course/teacher?keyword=${detail.teacher}`" :render-link="false" class="cu-item arrow" v-if="detail.teacher">
										<view class="content">
											<text class="cuIcon-people text-blue"></text><text
												class="text-grey">教师</text>
										</view>
										<view class="action">
											<view>{{detail.teacher}}</view>
										</view>
									</navigator>
									<navigator @tap="goClassNameSearchPage(detail.className)" class="cu-item arrow" :render-link="false" v-if="detail.className">
										<view class="content">
											<text class="cuIcon-people text-blue"></text><text
												class="text-grey">上课班级</text>
										</view>
										<view class="action">
											<view>{{detail.className}}</view>
										</view>
									</navigator>
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
				<view v-if="details.length>1" class="padding-sm text-center bg-gray"><text>左右滑动可切换课程</text></view>
				<!-- #ifdef MP-WEIXIN -->
				<view v-if="displayDetailModal && !isVip" class="margin-sm bg-white">
					<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-QQ -->
				<view v-if="displayDetailModal && !isVip" class="margin-sm bg-white">
					<ad unit-id="297c24fcd434022129795daed3f46440"></ad>
				</view>
				<!-- #endif -->
			</view>
		</view>
	</view>
	
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { navigateToPlace } from '@/common/utils/location.js'

	const app = getApp()
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
	let isVip = ref(false)
	let courseCellIndex = ref(0)
	
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
		syncIsVip()
	})
	// 组件挂载时同步一次会员状态（兼容子组件场景页面生命周期不可靠的情况）
	onMounted(() => {
		syncIsVip()
	})

	function syncIsVip() {
		isVip.value = !!(app && app.globalData && app.globalData.isVip)
	}
	
	function hideModal() {
		displayDetailModal.value = false
	}
	
	function showDetail(e) {
		// 每次打开详情弹窗前同步最新会员状态（自动登录可能晚于组件挂载完成）
		syncIsVip()
		const dayIdx = e.currentTarget.dataset.dayidx
		const rowIdx = e.currentTarget.dataset.rowidx
		const cellIdx = e.currentTarget.dataset.cellidx
		const itemCourses = props.table[dayIdx].items[rowIdx]
		if (!itemCourses || itemCourses.length == 0) return
		details.value = itemCourses
		courseCellIndex.value = cellIdx
		displayDetailModal.value = true
	}
	
	function calcTableSize() {
		const res = uni.getSystemInfoSync()
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
	
	function goClassNameSearchPage (className = '') {
		if (!className.includes('[')) uni.navigateTo({ url: `/pages/course/class?keyword=${className}` })
		const index = className.indexOf('[')
		if (index <= 0) return
		if (index >= 4) {
			uni.navigateTo({ url: `/pages/course/class?keyword=` + className.slice(0, 4) })
		} else {
			uni.navigateTo({ url: `/pages/course/class?keyword=` + className.slice(0, index) })
		}
	}
	
	function goCoursePlace (place = '') {
		navigateToPlace(place)
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