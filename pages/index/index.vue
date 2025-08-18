<template>
	<view class="index-page">
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<view>贝壳小盒子</view>
		</cu-custom>
		
		<!-- 图书检索 -->
		<view class="cu-bar search bg-white" @tap="goBookSearch">
		    <view class="search-form round">
		        <text class="cuIcon-search"></text>
		        <input type="text" placeholder="馆藏图书检索：输入图书关键字"></input>
		    </view>
		</view>

		<!-- 教学周日期显示 -->
		<template v-if="!!calendar">
			<template v-if="calendar && calendar.title">
				<navigator url="/pages/school/calendar"
					class="padding-lr-sm bg-white margin round padding-bottom flex justify-between"
					:render-link="false"
				>
					<view class="padding-top"><text class="cuIcon-title text-green"></text><text>{{ calendar.title }}
						</text></view>
					<view class="padding-top"><text>{{ courses.nowWeek }} / {{courses.endWeek}} </text></view>
				</navigator>
			</template>
			<template v-else>
				<view class="padding-lr-sm bg-white margin round padding-bottom">
					<view class="padding-top"><text class="cuIcon-titles text-green"></text>{{calendar.date}}
						{{getDayByDateStr(calendar.date)}}</view>
					<text class="text-black">{{praise}}</text>
				</view>
			</template>
		</template>

		<!-- 首页小组件 -->
		<box-home-widgets></box-home-widgets>
		
		<view v-if="!loginStatus" :style="[{animation: 'show ' + ((0+1)*0.2+1) + 's 1'}]">
			<tips
				tips="哎呀~还没登录嘛？"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
				:showButton="true"
				buttonText="立即登录"
				path="/pages/index/login"
			></tips>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="isVip" class="margin-lr margin-tb-sm radius">
			<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-QQ -->
		<view v-if="!isVip" class="margin-lr margin-tb-sm radius">
			<ad unit-id="297c24fcd434022129795daed3f46440"></ad>
		</view>
		<!-- #endif -->

		<!-- 今日课程列表 -->
		<navigator url="/pages/course/calendar" class="cu-list menu sm-border card-menu" v-if="todayCourses.length">
			<view class="cu-bar bg-white">
				<view class="action border-title">
					<text class="text-title">今日课程</text>
					<text class="bg-grey" style="width:2rem"></text>
				</view>
			</view>
			<template v-for="(item, index) in todayCourses" :key="index">
				<view class="padding-xs bg-white border-radius solids-bottom" v-if="item && item.courseName">
					<view class="flex radius">
						<view class="basis-xl padding-xs margin-tb-xs text-cut flex flex-direction">
							<view class="margin-tb-xs text-cut" style="height: 1.2rem;"><text
									class="cuIcon-calendar text-blue margin-right-xs"></text><text>{{item.teachTime}}</text></view>
							<view class="text-cut"  style="height: 1.2rem;"><text
									class="cuIcon-activity text-blue margin-right-xs"></text><text>{{item.courseName}}</text>
							</view>
						</view>
						<view class="basis-xs text-lg margin-tb-xs padding-xs text-center">
							<view class="margin-tb-xs">
								{{item.startAt}}~{{item.endAt}}
							</view>
							<view>{{item.place}}</view>
						</view>
					</view>
				</view>
			</template>
		</navigator>

	</view>
</template>

<script setup>
	import { ref, watch } from 'vue'
	import { onShow, onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
	import BoxHomeWidgets from './components/homeWidgets.vue'
	import { getWeekNameByDayNumber } from '@/common/utils/tools.js'
	import { useAppStore } from '@/stores/app'
	import { storeToRefs } from 'pinia'
	const app = getApp()
	const appStore = useAppStore()
	const { courses, calendar, loginStatus } = storeToRefs(appStore)
	const praise = ref('')
	const isLoading = ref(true)
	const isShowTodayCourse = ref(false)
	const now = ref(new Date())
	let todayCourses = ref([])

	watch(loginStatus, (newValue, oldValue) => {
		if (newValue === true) uni.hideLoading()
	})

	watch(courses, (newValue) => {
		const dayIndex = (new Date()).getDay() > 0 ? ((new Date()).getDay() - 1) : (newValue.table.length - 1)
		if (newValue.table[dayIndex]) {
			todayCourses.value = newValue.table[dayIndex].items.filter((item) => item && item.courseName)
		}
	})

	const isVip = ref(false)
	onLoad(() => {
		isVip.value = app.globalData.isVip
		uni.showLoading({ title: '加载中...'})
		// #ifdef MP
		uni.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] })
		// #endif
	})

	onShow(() => {
		if (loginStatus) uni.hideLoading()
	})

	// 周几
	function getDayByDateStr(str = '') {
		return getWeekNameByDayNumber(new Date(str).getDay())
	}
	
	function goBookSearch () {
		uni.navigateTo({ url: '/pages/book/search' })
	}
	
	
	onShareAppMessage (() => {
		return {
		  title: '贝壳小盒子 - 贝壳田园校园生活小助手',
		  path: '/pages/index/index'
		}
	})
	
	onShareTimeline(() => {
		return { title: '贝壳小盒子 - 贝壳田园校园生活小助手' }
	})
</script>

<style>
	.index-page {
		background: #f1f1f1;
	}
	@media (prefers-color-scheme: dark) {
		/* DarkMode 下的样式 start */
		.index-page {
			background: #1b1b1b;
		}
		/* DarkMode 下的样式 end */
	}
</style>