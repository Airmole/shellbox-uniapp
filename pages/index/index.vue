<template>
	<view class="index-page">
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
		  <block slot="content">贝壳小盒子</block>
		</cu-custom>
		<!-- 教学周日期显示 -->
		<block v-if="!!calendar">
			<block v-if="calendar?.nowWeek != 'N/A'">
			  <navigator url="/pages/index/feature" class="padding-lr-sm bg-white margin radius padding-bottom">
			    <view class="padding-top"><text class="cuIcon-title text-green"></text><text>{{ calendar.nowWeek }} {{getDayByDateStr(calendar.date)}}</text></view>
			    <!-- <view class="padding-top praise"><text class="text-black">{{praise}}</text></view> -->
			  </navigator>
			</block>
			<block v-else>
			  <navigator url="/pages/index/feature" class="padding-lr-sm bg-white margin radius padding-bottom">
			    <view class="padding-top"><text class="cuIcon-titles text-green"></text>{{calendar.date}} {{getDayByDateStr(calendar.date)}}</view>
			    <text class="text-black">{{praise}}</text>
			  </navigator>
			</block>
		</block>
		
		<view class="remind-box" v-if="isLoading">
		  <image class="remind-img" src="https://store2018.muapp.cn/images/weapp/loading_cat.gif"></image>
		</view>
		
		<view v-else>
			<!-- 下节课卡片 -->
			<block v-if="nextCourseArray?.courseName">
			  <view class="cu-list menu sm-border card-menu margin">
				<view class="cu-bar bg-white solid-bottom">
				  <view class="action"><text class="cuIcon-title text-green"></text>下节课</view>
				  <view class="action padding-right"><text class="cuIcon-creative line-wegreen"></text></view>
				</view>
				<navigator url="../course/my" class="cu-item">
				  <view class="content padding-tb-sm text-cut">
					<view class="text-black text-cut">{{nextCourseArray.courseName}}</view>
					<view class="text-gray">{{nextCourseArray.teachWeek}} <text class="text-green">{{nextCourseArray.startAt}}</text>上课 ~ {{nextCourseArray.endAt}}下课</view>
				  </view>
				  <view class="action padding-right">
					<text class="text-xl text-black">{{nextCourseArray.place}}</text>
				  </view>
				</navigator>
				<view v-if="!isShowTodayCourse" class="padding bg-white text-center" @click="isShowTodayCourse = true">
				  <text class="text-center">展示全天课表👇</text>
				</view>
				<view v-else class="padding bg-white text-center" @click="isShowTodayCourse = false">
				  <text class="text-center">朕知道了，赶紧收起来吧😂</text>
				</view>
			  </view>
			</block>
		</view>
		
		<!-- 今日全天课程卡片 -->
		<block v-if="isShowTodayCourse">
		  <view class="cu-list menu sm-border card-menu margin">
			<navigator url="../course/my" class="cu-bar bg-white solid-bottom">
			  <view class="action">
				<text class="cuIcon-title text-green"></text>今日课程
			  </view>
			  <view class="action padding-right">
				<text class="cuIcon-activity line-wegreen"></text>
			  </view>
			</navigator>
			<block v-for="(item, todayCourseKey) in todayCourses" :key="todayCourseKey"> 
				<navigator url="../course/my" class="cu-item" v-if="item.courseName!=''" >
				  <view class="content padding-tb-sm text-cut">
					<view class="text-black text-cut">{{item.courseName}}</view>
					<view class="text-gray">{{item.teachWeek}} {{item.startAt}}上课 ~ {{item.endAt}}下课</view>
				  </view>
				  <view class="action padding-right">
					<text class="text-xl text-black">{{item.place}}</text>
				  </view>
				</navigator>
			</block>
			
		  </view>
		</block>
		
		
		<!-- 首页小组件 -->
		<box-home-widgets></box-home-widgets>
		
		<block v-if="!loginStatus">
			<view class="padding margin text-xxl">尚未登录</view>
		</block>
		<block v-else>
			<view class="padding margin text-xxl">登录成功</view>
			<navigator class="flex-sub margin-left-sm" url="/pages/course/my">
				<button class="round bg-default">我的课表</button>
			</navigator>
		</block>
		
	</view>
</template>

<script setup>
	import { computed, onMounted, reactive, ref, unref, shallowRef, watchEffect } from 'vue';
	import { onShow } from '@dcloudio/uni-app'
	import BoxHomeWidgets from './components/homeWidgets.vue'
	import { getWeekNameByDayNumber } from '@/common/utils/tools.js'
	import api from '@/request/api.js'
	import { useAppStore } from '@/stores/app';
	import { storeToRefs } from 'pinia';
	
	const app = getApp()
	const praise = ref('') // 
	const nextCourseArray = ref([]) // 当前时间以后的课表
	const isLoading = ref(false)
	const isShowTodayCourse = ref(false)
	const now = ref(new Date())
	
	const appStore = useAppStore()
	const { courses, calendar, loginStatus } = storeToRefs(appStore)
	
	onShow(() => {
		now.value = new Date('2024 09:00') // new Date()
	})
	
	// 周几
	function getDayByDateStr(str = '') {
		return getWeekNameByDayNumber(new Date(str).getDay())
	}
	
	const todayCourses = computed(() => {
		const index = now.value.getDay() === 0 ? 6 : now.value.getDay()-1
		return (courses.value.table)[index]?.items.filter(item => !!item.courseName) || []
	})
	
	// 计算下节课
	watchEffect(() => {
		if (todayCourses.value.legth === 0) {
			return
		}
		console.log("todayCourses.value:>>", todayCourses.value);
		nextCourseArray.value = todayCourses.value.filter(item => {
			const startDate = new Date(`${now.value.getFullYear()} ${item.startAt}`)
			return  now.value - startDate  < 0
		})?.[0] || []
	}, {
		flush: 'post'
	})
</script>

<style>
	.index-page {
		background: #f1f1f1;
	}
</style>
