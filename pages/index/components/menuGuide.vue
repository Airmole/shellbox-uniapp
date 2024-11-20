<template>
	<view class="cu-list menu sm-border" style="margin-top: 0;">
		<view class="cu-bar solid-bottom bg-white" style="min-height: 60rpx;">
			<view class="action">
				<text class="cuIcon-titles text-green"></text>
				<text class="text-xl text-bold">{{title}}</text>
			</view>
			<view class="action" v-if="menuList.length > 5" @click="fold = !fold">
				<text :class="['text-green', fold ? 'cuIcon-right' : 'cuIcon-unfold']"></text>
			</view>
		</view>
		
		<view class="cu-list grid col-5 no-border text-green line-green" :class="[fold && 'fold']" style="padding: 0;">
			<template v-for="(item,idx) in renderMenu" :key="idx">
				<view v-if="isShowIcon(item)" class="cu-item" @click="goPage(item)">
					<text :class="'iconfont icon-' + item.icon" style="color: #39B54A;font-size: 40rpx;"></text>
					<text>{{item.title}}</text>
				</view>
			</template>
		</view>
	</view>
</template>

<script setup>
	import { computed, ref } from 'vue';
	import { getEdusysAccount } from '@/common/utils/auth.js'
	import { useAppStore } from '@/stores/app.js'
	import { storeToRefs } from 'pinia'
	const appStore = useAppStore()
	const { loginStatus, userInfo, edusysAccount, courses } = storeToRefs(appStore)
	
	const props = defineProps({
		menuList: Object,
		title: String
	})
	
	const fold = ref(true)
	const renderMenu = computed(() => {
		if (fold.value) return props.menuList
		return props.menuList.slice(0, 5)
	})
	
	const isTeacher = computed(() => {
		let result = false
		if (loginStatus && edusysAccount.account && edusysAccount.account.length <= 7) result = true
		return result
	})
	
	const isStudent = computed(() => {
		return !isTeacher
	})
	
	const isShowIcon = computed(() => {
		let platform = 'weapp'
		// #ifdef H5
		platform = 'h5'
		// #endif
		// #ifdef MP
		platform = 'weapp'
		// #endif
		// #ifdef APP
		const sysInfo = uni.getSystemInfoSync()
		platform =sysInfo.osName
		// #endif
		
		return function (icon) {
		    // 如果icon.logined为true，则需要检查loginStatus是否也为true
		    if (icon.logined && !loginStatus) return false;
		    
		    // 如果icon.teacher为true，则需要检查isTeacher是否也为true
		    if (icon.teacher && !isTeacher) return false;
		    
		    // 如果icon.student为true，则需要检查isStudent是否也为true
		    if (icon.student && !isStudent) return false;

		    // 如果icon.platform包含platform，则返回true，否则返回false
		    return icon.platform.includes(platform);
		}
	})
	
	function goPage(menu) {
		if (menu.need_login && (getEdusysAccount() === false || !loginStatus)) {
			uni.showToast({ title: '此功能需要登录', icon: 'none' })
			return
		}
		
		let query = ''
		if (menu.menu_id === 'myCourse') {
			// 正则匹配出本周是第几周
			let nowWeek = ''
			const courseWeekText =  '' || (courses && courses.value.nowWeek)
			const nowWeekRegexp = /\d{1,2}/
			const nowWeekRegexpResult = Number(nowWeekRegexp.exec(courseWeekText))
			if (nowWeekRegexp.test(courseWeekText) && nowWeekRegexpResult > 0 && nowWeekRegexpResult < 30) {
				nowWeek = nowWeekRegexpResult
				query = `?week=${nowWeek}`
			}
		}
		
		// #ifdef MP
		if (menu.weapp_id) {
			uni.navigateToMiniProgram({
				appId: menu.weapp_id,
				path: `${menu.weapp_path}${query}`
			})
		} else {
			uni.navigateTo({ url: `${menu.weapp_path}${query}` })
		}
		// #endif
		
		// #ifdef H5
		if (menu.url.indexOf('http://') === 0 || menu.url.indexOf('https://') === 0) {
			window.location.href = `${menu.url}${query}`
			return
		} else if (menu.url.indexOf('/') === 0) {
			uni.navigateTo({ url: `${menu.url}${query}` })
			return
		} else {
			uni.navigateTo({ url: `${menu.url}${query}` })
		}
		// #endif
	}
	
</script>

<style>
</style>