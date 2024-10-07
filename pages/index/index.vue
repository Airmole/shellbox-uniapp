<template>
	<view class="index-page">
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
		  <view>贝壳小盒子</view>
		</cu-custom>
		<!-- 教学周日期显示 -->
		<block v-if="!!calendar">
			<block v-if="calendar?.title">
			  <navigator url="/pages/school/calendar" class="padding-lr-sm bg-white margin card-radius padding-bottom flex justify-between">
			    <view class="padding-top"><text class="cuIcon-title text-green"></text><text>{{ calendar.title }} </text></view>
			    <view class="padding-top"><text>{{ courses.nowWeek }} / {{courses.endWeek}} </text></view>
			  </navigator>
			</block>
			<block v-else>
			  <view class="padding-lr-sm bg-white margin card-radius padding-bottom">
			    <view class="padding-top"><text class="cuIcon-titles text-green"></text>{{calendar.date}} {{getDayByDateStr(calendar.date)}}</view>
			    <text class="text-black">{{praise}}</text>
			  </view>
			</block>
		</block>
		
		<!-- 首页小组件 -->
		<box-home-widgets></box-home-widgets>
		
		
		<navigator url="/pages/course/my" class="cu-list menu sm-border card-menu" v-if="todayCourses.length">
			<view class="cu-bar bg-white">
				<view class="action border-title">
					<text class="text-title">今日课程</text>
					<text class="bg-grey" style="width:2rem"></text>
				</view>
			</view>
			<block v-for="(item, index) in todayCourses">
				<view class="padding-xs bg-white border-radius solids-bottom" v-if="item && item.courseName">
					<view class="flex radius">
					    <view class="basis-xl padding-xs margin-tb-xs">
							<view class="margin-bottom-xs"><text class="cuIcon-calendar text-blue margin-right-xs"></text>{{item.teachTime}}</view>
							<view class="text-cut" style="height: 1rem;"><text class="cuIcon-activity text-blue margin-right-xs"></text><text>{{item.courseName}}</text></view>
						</view>
					    <view class="basis-xs text-xl margin-tb-xs padding-xs text-center">
							<view class="text-sm">
								{{item.startAt}}~{{item.endAt}}
							</view>
							<view>{{item.place}}</view>
						</view>
					</view>
				</view>
			</block>
		</navigator>
		
		<block v-if="!loginStatus">
			<navigator class="flex-sub margin" url="/pages/index/login">
				<button class="round bg-default">立即登录</button>
			</navigator>
		</block>
		
	</view>
</template>

<script setup>
	import { ref, watch } from 'vue'
	import { onShow, onLoad } from '@dcloudio/uni-app'
	import BoxHomeWidgets from './components/homeWidgets.vue'
	import { getWeekNameByDayNumber } from '@/common/utils/tools.js'
	import { useAppStore } from '@/stores/app';
	import { storeToRefs } from 'pinia';
	
	const app = getApp()
	const praise = ref('')
	const isLoading = ref(true)
	const isShowTodayCourse = ref(false)
	const now = ref(new Date())
	let todayCourses = ref([])
	
	const appStore = useAppStore()
	const { courses, calendar, loginStatus } = storeToRefs(appStore)
	
	watch(loginStatus, (newValue, oldValue) => {
		if (newValue === true) uni.hideLoading()
	})
	
	watch(courses, (newValue) => {
		const dayIndex = (new Date()).getDay() > 0 ? ((new Date()).getDay() - 1) : (newValue.table.length - 1)
		todayCourses.value = newValue.table[dayIndex].items.filter((item) => item && item.courseName)
		console.log('todayCourses',todayCourses)
	})
	
	onLoad(() => {
		uni.showLoading({ title: '加载中...' })
	})
	
	onShow(() => {
		if (loginStatus) uni.hideLoading()
	})
	
	// 周几
	function getDayByDateStr(str = '') {
		return getWeekNameByDayNumber(new Date(str).getDay())
	}
</script>

<style>
	.index-page {
		background: #f1f1f1;
	}
</style>
