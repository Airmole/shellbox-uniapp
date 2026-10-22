<template>
	<view>
		<scroll-view scroll-y="true" scroll-x="true">
			<view class="ct-head ct-head-line" :style="{width: `${tableWidth}px`}">
				<view class="ct-head-gutter border-right" :style="{width: `${columnTitleWidth}px`}"></view>
				<view
					v-for="(day, dayIdx) in columnTitles"
					class="ct-head-day text-gray"
					:class="dayIdx === todayIndex ? 'ct-today-head' : ''"
					:style="{width: `${itemWidth}px`}"
					:key="dayIdx"
				>{{day}}</view>
			</view>
			<view class="ct-row" :style="{width: `${tableWidth}px`}" v-for="(courses, rowIdx) in sectionItems" :key="rowIdx">
				<view
					class="border-right ct-time text-center flex justify-center align-center"
					:style="{width: `${columnTitleWidth}px`, height: `${itemHeight}px`}"
				>
					<view class="text-gray">{{rowTitles[rowIdx][0]}}<br/>~<br/>{{rowTitles[rowIdx][1]}}</view>
				</view>
				<view
					v-for="(dayCourses, dayIdx) in courses"
					class="ct-item tb-head-x"
					:class="[
						dayCourses.length ? `bg-${bgColors[dayCourses[0].courseName.length % bgColors.length]} shadow course-item radius` : '',
						dayIdx === todayIndex ? 'ct-today-column' : ''
					]"
					:style="columnStyle(dayIdx)"
					:key="dayIdx"
				>
					<!-- 当前节次指针：只画在今天所在列、当前正在上的那一节 -->
					<view
						v-if="pointer && dayIdx === todayIndex && rowIdx === pointer.section"
						class="ct-pointer"
						:style="{top: `${pointer.top}px`}"
					></view>
					<!-- 一节一门课程 -->
					<view
						v-if="dayCourses.length === 1"
						class="ct-course"
						v-bind="cellAttrs(dayIdx, rowIdx, 0)"
						@click="showDetail"
					>
						<view class="margin-tb-xs place-name">{{dayCourses[0].place}}</view>
						<view class="margin-tb-xs course-name" :style="{height: `${itemHeight - 50}px`}">
							{{dayCourses[0].courseName}}
						</view>
					</view>
					<!-- 一节多门课程：按门数均分单元格，最后一门吃掉剩余高度 -->
					<template v-else-if="dayCourses.length">
						<view
							v-for="(itm, idx) in dayCourses.slice(0, 5)"
							:key="idx"
							class="ct-course"
							:class="dayCourses.length > 3 ? 'text-sm' : ''"
							:style="subItemStyle(dayCourses.length, idx === Math.min(dayCourses.length, 5) - 1)"
							v-bind="cellAttrs(dayIdx, rowIdx, idx)"
							@click="showDetail"
						>
							<view class="place-name ct-sub text-cut">{{dayCourses.length > 3 ? (itm.place || itm.courseName) : itm.place}}</view>
							<view v-if="dayCourses.length <= 3" class="course-name">{{itm.courseName}}</view>
						</view>
						<view
							v-if="dayCourses.length > 5"
							class="text-sm ct-sub"
							v-bind="cellAttrs(dayIdx, rowIdx, 5)"
							@click="showDetail"
						>...共{{dayCourses.length}}门</view>
					</template>
				</view>
			</view>
			
			<view class="ct-footer" :style="{width: `${tableWidth}px`}"></view>
		</scroll-view>
		
		<view class="flex" v-if="tips">
			<view class="text-center flex justify-center align-center">
				<view class="padding-tb-sm margin-lr-xs text-gray">{{tips}}</view>
			</view>
		</view>
	</view>
	
	<!-- 课程详情模态框 -->
	<view class="cu-modal" :class="displayDetailModal?'show':''" @touchmove.stop.prevent>
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
	import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
	import { onHide, onLoad, onShow, onUnload } from '@dcloudio/uni-app'
	import { getGlobalDataRef } from '@/common/store/globalData.js'
	import { navigateToPlace } from '@/common/utils/location.js'

	// 节次与上课时间的对应关系，数组下标即节次（0-5）
	const rowTitles = ref([["08:00","09:35"], ["09:55","11:30"], ["13:10","14:45"], ["15:00","16:35"], ["16:50","18:25"], ["19:10","21:35"]])
	const bgColors = ref(['red', 'orange', 'yellow', 'olive', 'green', 'cyan', 'blue', 'purple', 'mauve', 'pink', 'brown','grey'])
	
	let screenWidth = ref(375)
	let columnTitleWidth = ref(42)
	let tableWidth = ref(500)
	let tableHeight = ref(732)
	let itemWidth = ref(64)
	let itemHeight = ref(120)
	let displayDetailModal = ref(false)
	let details = ref([])
	// 会员状态使用全局响应式引用，会员身份异步到达时自动刷新
	let isVip = getGlobalDataRef('isVip')
	let courseCellIndex = ref(0)
	
	// 当前时间：驱动 todayIndex 与课表指针
	const now = ref(new Date())
	let clockTimer = null
	
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
	
	// 表体固定 6 行（与 rowTitles 一一对应），每格统一尺寸，边框才能对齐
	const SECTION_COUNT = rowTitles.value.length
	
	// 今天对应的列下标：周一为 0，周日为 6
	const todayIndex = computed(() => (now.value.getDay() + 6) % 7)
	
	// 全天对应的分钟数
	function toMinutes(time = '') {
		const [hour, minute] = time.split(':').map(Number)
		if (isNaN(hour) || isNaN(minute)) return null
		return hour * 60 + minute
	}
	
	// 时间指针位置：落在哪一节就在那一列的格子里画线，课间或课后不显示
	const pointer = computed(() => {
		const current = now.value.getHours() * 60 + now.value.getMinutes()
		for (let idx = 0; idx < rowTitles.value.length; idx++) {
			const [start, end] = rowTitles.value[idx]
			const startAt = toMinutes(start)
			const endAt = toMinutes(end)
			if (startAt === null || endAt === null) continue
			if (current < startAt || current > endAt) continue
			const ratio = Math.min(Math.max((current - startAt) / (endAt - startAt), 0), 1)
			// 限制在单元格内部，避免指针压到边框或相邻格子
			return {
				section: idx,
				top: Math.min(Math.max(ratio * itemHeight.value, 2), itemHeight.value - 4)
			}
		}
		return null
	})
	
	// 表体：按 [节][天] 组织成二维数组，模板只需两层循环，并做空数组兜底
	const sectionItems = computed(() => {
		const days = props.columnTitles.length
		const result = []
		for (let rowIdx = 0; rowIdx < SECTION_COUNT; rowIdx++) {
			const row = []
			for (let dayIdx = 0; dayIdx < days; dayIdx++) {
				const day = props.table[dayIdx]
				const items = day && day.items && day.items[rowIdx]
				row.push(Array.isArray(items) ? items : [])
			}
			result.push(row)
		}
		return result
	})
	
	// 每格固定宽高（高度必须写在本格上，节次栏才会与课程格严格等高）
	function columnStyle(dayIdx) {
		return {
			width: `${itemWidth.value}px`,
			height: `${itemHeight.value}px`,
			animation: `show ${((dayIdx + 1) * 0.2 + 1)}s 1`
		}
	}
	
	// 多门课程的子块：按门数均分高度，再各减掉自身 2px 的上下间距，
	// 保证「块高 + 间距」之和不超过单元格高度——超出会把格子撑高，节次栏的右边框就断了
	function subItemStyle(count, isLast) {
		const units = count > 5 ? 5.6 : count
		const height = Math.max(itemHeight.value / units - 2, 14)
		return {
			width: `${itemWidth.value}px`,
			height: `${height}px`,
			borderBottom: isLast ? '' : '1px solid white'
		}
	}
	
	function cellAttrs(dayIdx, rowIdx, cellIdx) {
		return {
			'data-dayidx': dayIdx,
			'data-rowidx': rowIdx,
			'data-cellidx': cellIdx
		}
	}
	
	// 每分钟刷新一次，跨天后 todayIndex 与指针自动跟随
	function startClock() {
		stopClock()
		now.value = new Date()
		clockTimer = setInterval(() => { now.value = new Date() }, 60 * 1000)
	}
	
	function stopClock() {
		if (clockTimer) {
			clearInterval(clockTimer)
			clockTimer = null
		}
	}
	
	onLoad(() => {
		calcTableSize()
	})
	
	// 页面切后台/卸载时停表，回到前台重新对齐时间，避免长期驻留的小程序空转
	onShow(() => { startClock() })
	onHide(() => { stopClock() })
	onUnload(() => { stopClock() })
	
	onMounted(() => { startClock() })
	onBeforeUnmount(() => { stopClock() })
	
	function hideModal() {
		displayDetailModal.value = false
	}
	
	function showDetail(e) {
		const dayIdx = e.currentTarget.dataset.dayidx
		const rowIdx = e.currentTarget.dataset.rowidx
		const cellIdx = e.currentTarget.dataset.cellidx
		const itemCourses = props.table[dayIdx] && props.table[dayIdx].items[rowIdx]
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
	/* 表头：与表体列宽严格一致（节次栏 42 + 每天 itemWidth），分隔线由整行拉通 */
	.ct-head {
		display: flex;
		flex-wrap: nowrap;
	}
	
	.ct-head-gutter {
		flex: 0 0 auto;
	}
	
	/* 只留水平间距，垂直方向不加 margin，避免表头各行高度被 margin 累加而错位 */
	.ct-head-day {
		flex: 0 0 auto;
		margin-left: 4rpx;
		margin-right: 4rpx;
		text-align: center;
	}
	
	.ct-head-line {
		border-bottom: 1px solid #ccc;
	}
	
	/* 今日列高亮 */
	.ct-today-head {
		background-color: rgba(39, 125, 255, 0.12);
		border-radius: 8rpx;
		color: #277dff;
		font-weight: bold;
	}
	
	.ct-today-column {
		background-color: rgba(39, 125, 255, 0.06);
		box-shadow: inset 0 0 0 1px rgba(39, 125, 255, 0.28);
	}
	
	/* 表体行：不换行，行高由单元格固定高度决定 */
	.ct-row {
		display: flex;
		flex-wrap: nowrap;
		align-items: stretch;
	}
	
	/* 节次栏：高度必须显式等于课程格高度（见模板 style），两栏才能严格等高 */
	.ct-time {
		flex: 0 0 auto;
		line-height: 1.2;
	}
	
	/* 课程格：相对定位，供时间指针绝对定位；行高由 style 里的 height 决定 */
	.ct-item {
		position: relative;
		flex: 0 0 auto;
		margin: 4rpx;
		box-sizing: border-box;
	}
	
	/* 多课程子块：高度与间距由 JS 精确分配，保证总高不超出单元格 */
	.ct-course {
		flex: 0 0 auto;
		overflow: clip;
	}
	
	/* 时间指针：小程序里 view 默认不是定位元素、position:fixed 支持也差，这里显式绝对定位 */
	.ct-pointer {
		position: absolute !important;
		left: 2px;
		right: 2px;
		height: 3px;
		border-radius: 3px;
		background-color: #277dff;
		box-shadow: 0 0 4px rgba(39, 125, 255, 0.6);
		z-index: 2;
	}
	
	.ct-footer {
		padding: 20rpx 0;
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
