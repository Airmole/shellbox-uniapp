<template>
	<view class="margin-lg">
		<view class="flex" style="gap: 40rpx;">
			<view class="flex flex-direction flex-1 box-card text-center shadow-blur">
				<view class="padding-sm text-white" style="background: #ed6663;">{{nowYMD[0]}}年{{nowYMD[1]}}月</view>
				<view class="flex-1 flex flex-direction text-center padding-tb-sm padding-lr-lg bg-white">
					<view class="margin-bottom-sm text-bold text-xsl line-height-1">{{nowYMD[2]}}</view>
					<view class="margin-top-auto text-gray text-df">第{{nowDays}}天 第{{nowWeek}}周</view>
					<view class="margin-top-sm">{{calendarDate.IMonthCn}}{{calendarDate.IDayCn}} {{calendarDate.ncWeek}}</view>
				</view>
			</view>
			<view v-if="holidaysRef" class="flex-1 box-card text-white" style="background: linear-gradient(to right, #0e151c, #272d36);">
				<view class="flex flex-direction height-full justify-center padding-tb-sm padding-lr-sm opacity-9">
					<template v-for="(holiday, index) in holidaysRef.slice(0, 2)" :key="holiday.holiday">
						<view :class="[`flex justify-between align-center padding-tb-sm border-bottom-dashed border-xs`, index === 0 ? 'border-top-dashed':'' ]">
							<view>
								<text class="block">{{ holiday.name }}</text>
								<text class="text-sm opacity-7">{{getHolidayShowText(holiday.start)}}-{{getHolidayShowText(holiday.end)}}</text>
							</view>
							<view>
								<text>{{getHolidayDays(holiday.start)}}</text>天
							</view>
						</view>
					</template>
				</view>
			</view>
		</view>
		<view class="flex margin-top-lg" style="gap: 40rpx;">
			<view v-if="movieRef" class="box-card flex-1 text-white padding-sm bg-img" :style="movieStyle">
				<view class="text-right">
					<text class="block text-xxl">{{movieRef?.date?.[0]}}</text>
					<text class="text-lg opacity-9 ">{{+movieRef?.date?.[1]}}月/{{getWeekNameByDayNumber(movieRef?._date?.getDay())}}</text>
				</view>
				<view class="margin-top-sm">
					<text class="block text-lg">《{{movieRef.mov_title}}》</text>
					<text class="margin-sm cu-tag round bg-yellow">豆瓣 {{movieRef.mov_rating}}</text>
					<text class="block overflow-ellipsis-2">{{movieRef.mov_text}}</text>
				</view>
			</view>
			<view v-if="famousSayingRef" class="flex flex-direction flex-1 box-card text-white padding-sm bg-img" :style="`background-color: #433728;background-image: url(${famousSayingRef.thumb});`">
				<text class="text-lg opacity-6">每日一言</text>
				<view class="flex-1 flex align-center text-center margin-top-sm">
					<text class="">{{famousSayingRef?.content}}</text>
				</view>
			</view>
		</view>
	</view>
	
</template>


<script setup>
	import calendar from '@/common/utils/calendar.js'
	import api from '@/request/api.js'
	import { computed, reactive, ref } from 'vue'
	import { getYMDByDateString, getWeekNameByDayNumber } from '@/common/utils/tools.js'

	const now = new Date();
	const nowYMD = [now.getFullYear(), now.getMonth(), now.getDate()] // 当前年月日
	const nowDays = Math.ceil((now - new Date(nowYMD[0].toString())) / 86400000) // 当前是今年的第几天
	const nowWeek = Math.ceil(nowDays/7) // 当前是今年的第几周
	const calendarDate = calendar.solar2lunar(...nowYMD) // 农历
	
	const movieRef = ref(null) // 今日电影
	const holidaysRef = ref(null) // 节假日
	const famousSayingRef = ref(null) // 每日一言
	
	const movieStyle = computed(() => {
		const style = {
			'flex': 1, 
			'background': '#201f18',
		}
		if (movieRef.value.mov_pic) {
			style.background = `#201f18 url("${movieRef.value.mov_pic}") no-repeat center/cover`
		}
		return style
	})
	
	
	function getHolidayShowText(dateStr) {
		 return dateStr.split('-').slice(1).map(item => +item).join('.')
	}
	function getHolidayDays(start) {
		 return Math.ceil((new Date(start) - now)/86400000)
	}
	
	api.fetchHomeWidget([`todayMovie`, `famousSayings`, `nextHoliday`]).then(({ data: resData }) => {
		const { todayMovie, nextHoliday, famousSayings } = resData
		console.log('dddd:>>', todayMovie, resData);
		todayMovie.data.date = getYMDByDateString(todayMovie.data.date)
		todayMovie.data._date = new Date(todayMovie.data.date.join('-'))
		movieRef.value = todayMovie.data
		holidaysRef.value = nextHoliday.data.filter(item => new Date(item.holiday) > now)
		famousSayingRef.value = famousSayings.data
		console.log(`famousSayings.value:>>>`, famousSayingRef.value);
	})
	
</script>

<style lang="scss">
</style>