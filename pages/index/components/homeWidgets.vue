<template>
	<view class="cu-list card-menu">
		<view class="flex margin-top-sm" style="gap: 40rpx;">
			<view class="flex flex-direction flex-1 box-card text-center shadow-blur">
				<view class="padding-sm text-white" style="background: #ed6663;">{{nowYMD[0]}}年{{nowYMD[1]}}月</view>
				<view class="flex-1 flex flex-direction text-center padding-tb-sm padding-lr-lg bg-white">
					<view class="margin-bottom-sm text-bold text-xsl line-height-1">{{nowYMD[2]}}</view>
					<view class="margin-top-auto text-gray text-df">今年{{nowDays}}天 第{{nowWeek}}周</view>
					<view class="margin-top-sm">{{calendarDate.IMonthCn}}{{calendarDate.IDayCn}} {{calendarDate.ncWeek}}</view>
				</view>
			</view>
			<view v-if="holidaysRef" class="flex-1 box-card text-white" style="background: linear-gradient(to right, #0e151c, #272d36);">
				<view class="flex flex-direction height-full justify-center padding-tb-sm padding-lr-sm opacity-9">
					<template v-for="(holiday, index) in holidaysRef.slice(0, 2)" :key="holiday.holiday">
						<view :class="[`flex justify-between align-center padding-tb-sm border-bottom-dashed border-xs`, index === 0 ? 'border-top-dashed':'' ]">
							<view>
								<text class="block">{{ holiday.name }}</text>
								<text class="text-sm opacity-7" v-if="holiday.start && holiday.end">{{getHolidayShowText(holiday.start)}}-{{getHolidayShowText(holiday.end)}}</text>
								<text class="text-sm opacity-7" v-else>{{holiday.holiday}}</text>
							</view>
							<view v-if="holiday.start">
								<text>{{getHolidayDays(holiday.start)}}</text>天
							</view>
							<view v-else><text></text></view>
						</view>
					</template>
				</view>
			</view>
		</view>
		<view class="flex margin-top-lg" style="gap: 40rpx;">
			<view v-if="movieRef" class="box-card flex-1 text-white padding-sm bg-img bg-mask" :style="movieStyle" @tap="displayMovieModal">
				<view class="text-right">
					<text class="block text-xxl">{{nowYMD[0]}}</text>
					<text class="text-lg opacity-9 ">{{nowYMD[1]}}月/{{calendarDate.ncWeek}}</text>
				</view>
				<view class="margin-top-sm">
					<text class="block text-lg">《{{movieRef.mov_title}}》</text>
					<text class="margin-tb-sm cu-tag round bg-yellow">豆瓣 {{movieRef.mov_rating}}</text>
					<text class="block overflow-ellipsis-2">{{movieRef.mov_text}}</text>
				</view>
			</view>
			<view v-if="famousSayingRef" @tap="displaySayingModal" class="flex flex-direction flex-1 box-card text-white padding-sm bg-img bg-mask" :style="`background-color: #433728;background-image: url(${famousSayingRef.thumb});`">
				<text class="text-lg opacity-6">每日一言</text>
				<view class="flex-1 flex align-center text-center margin-top-sm">
					<text class="">{{famousSayingRef?.content}}</text>
				</view>
			</view>
		</view>
		
		<view class="cu-modal" :class="showMovieModal?'show':''">
			<view class="cu-dialog" v-if="movieRef">
				<view class="bg-img bg-mask" :style="movieModalStyle"></view>
				<view style="position: absolute;top: 0;left: 0;height: 800rpx;width: 680rpx;">
					<view class="flex padding-tb padding-lr-sm">
					    <view class="flex-sub">
							<image :src="movieRef.poster_url" mode="widthFix" style="width: 160rpx;"></image>
						</view>
					    <view class="flex-twice margin-sm text-left">
							<view class="margin-tb-xs text-cut">
								<text class="text-xxl title-color margin-right-sm">{{movieRef.mov_title}}</text><text class="title-color text-sm">({{movieRef.mov_director}})</text>
							</view>
							<view class="margin-tb-xs text-cut">
								<text class="title-color margin-left-sm">{{movieRef.mov_year}}年</text>
								<text class="title-color margin-left-sm">{{movieRef.mov_area}}</text>
							</view>
							<view class="margin-tb-xs text-cut">
								<text class="title-color margin-lr-sm">评分:{{movieRef.mov_rating}}</text>
								<template v-for="(typeItem, typeIndex) in movieRef.mov_type" :key="typeIndex">
									<text class="title-color">{{typeItem}}</text> <text class="title-color" v-if="typeIndex !== movieRef.mov_type.length-1">/</text>
								</template>
							</view>
						</view>
					</view>
					<view class="text-left margin-left" style="width: 660rpx;">
						<text class="text-xl title-color">"{{movieRef.mov_text}}"</text>
					</view>
					<view class="padding" style="height: 400rpx;width: 680rpx; overflow-y: scroll;">
						<text class="text-sm content-color">{{movieRef.mov_intro}}</text>
					</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub solid-left" @tap="hideMovieModal">关闭</view>
				</view>
			</view>
		</view>
		
		<view class="cu-modal" :class="showSayingModal?'show':''">
			<view class="cu-dialog" v-if="famousSayingRef">
				<view class="bg-img bg-mask" :style="sayingModalStyle"></view>
				<view style="position: absolute;top: 0;left: 0;" class="padding-top-xl flex justify-center align-center flex-direction">
					<view class="flex padding-xl text-center">
					  <text class="text-xl text-white">{{famousSayingRef.content}}</text>
					</view>
					<view class="text-center text-white" style="opacity: 0.4;">
						—— {{famousSayingRef.from}} {{famousSayingRef.author}} ——
					</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left" @tap="hideSayingModal">关闭</view>
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
	const nowYMD = [now.getFullYear(), now.getMonth()+1, now.getDate()] // 当前年月日
	const nowDays = Math.ceil((now - new Date(nowYMD[0].toString())) / 86400000) // 当前是今年的第几天
	const nowWeek = Math.ceil(nowDays/7) // 当前是今年的第几周
	const calendarDate = calendar.solar2lunar(...nowYMD) // 农历
	
	const movieRef = ref(null) // 今日电影
	const holidaysRef = ref(null) // 节假日
	const famousSayingRef = ref(null) // 每日一言
	
	const showMovieModal = ref(false)
	const showSayingModal = ref(false)
	
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
	
	const movieModalStyle = computed(() => {
		const style = {
			'background': '#4c4c45',
			'height': '800rpx',
			'width': '680rpx',
			'filter': 'blur(2px)'
		}
		if (movieRef.value?.mov_pic) {
			style.background = `${movieRef.value.bgColor} url("${movieRef.value.mov_pic}") no-repeat center/cover`
		}
		return style
	})
	
	 const sayingModalStyle = computed(() => {
		 	const style = {
		 		'background': '#4c4c45',
		 		'height': '520rpx',
				'width': '680rpx',
		 		'filter': 'blur(2px)'
		 	}
		 	if (famousSayingRef.value?.thumb) {
		 		style.background = `#201f18 url("${famousSayingRef.value.thumb}") no-repeat center/cover`
		 	}
		 	return style
	 })
	
	
	function getHolidayShowText(dateStr) {
		if (!dateStr) return ''
		return dateStr.split('-').slice(1).map(item => +item).join('.')
	}
	function getHolidayDays(start) {
		 return Math.ceil((new Date(start) - now)/86400000)
	}
	
	api.fetchHomeWidget([`todayMovie`, `famousSayings`, `nextHoliday`]).then(({ data: resData }) => {
		const { todayMovie, nextHoliday, famousSayings } = resData
		todayMovie.data.date = getYMDByDateString(todayMovie.data.date)
		todayMovie.data._date = new Date(todayMovie.data.date.join('-'))
		movieRef.value = todayMovie.data
		holidaysRef.value = nextHoliday.data.filter(item => new Date(item.holiday) > now)
		famousSayingRef.value = famousSayings.data
	})
	
	function goDoubanMovie () {
		const doubanUrl = movieRef.value.mov_link
		// window.location.href = doubanUrl
	}
	
	function hideMovieModal () {
		showMovieModal.value = false
	}
	
	function displayMovieModal () {
		showMovieModal.value = true
	}
	
	function displaySayingModal () {
		showSayingModal.value = true
	}
	
	function hideSayingModal () {
		showSayingModal.value = false
	}
	
</script>

<style>
	.title-color {
		color: #f9d5ad;
	}
	.content-color {
		color: rgb(209, 208, 208);
	}
</style>