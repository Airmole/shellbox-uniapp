<template>
	<view class="index-page">
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
		  <block slot="content">贝壳小盒子</block>
		</cu-custom>
		
		<box-calendar></box-calendar>
		
		
		<template v-if="!loginStatus">
			<view class="padding margin text-xxl">尚未登录</view>
		</template>
		<template v-else>
			<view class="padding margin text-xxl">登录成功</view>
			<navigator class="flex-sub margin-left-sm" url="/pages/course/my">
				<button class="round bg-default">我的课表</button>
			</navigator>
		</template>
		
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import BoxCalendar from './components/calendar.vue'
	const app = getApp()
	
	const loginStatus = ref(app.getLoginStatus())
	function onLoad() {
		loginStatus = app.getLoginStatus()
	}
	function onShow() {
		loginStatus = app.getLoginStatus()
	}
</script>

<style>
	.index-page {
		background: #f1f1f1;
	}
</style>
