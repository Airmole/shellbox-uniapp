<template>
	<view class="cu-list menu sm-border" style="margin-top: 0;">
		<view class="cu-bar solid-bottom bg-white" style="min-height: 60upx;">
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
				<view class="cu-item"  @click="goPage(item)" v-if="!item.logined || (item.logined === true && loginStatus) &&  (item.teacher === isTeacher || item.student === isStudent)">
					<text :class="'iconfont icon-' + item.icon" style="color: #39B54A;font-size: 40upx;"></text>
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
	const { loginStatus, userInfo, edusysAccount } = storeToRefs(appStore)
	
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
	
	function goPage(menu) {
		if (menu.need_login === true && (getEdusysAccount() === false || !loginStatus)) {
			uni.showToast({ title: '此功能需要登录', icon: 'none' })
			return
		}
		// #ifdef MP
		if (menu.weapp_id) {
			uni.navigateToMiniProgram({
				appId: menu.weapp_id,
				path: menu.weapp_path
			})
		} else {
			uni.navigateTo({ url: menu.weapp_path })
		}
		// #endif
		// #ifdef H5
		if (menu.url.indexOf('http://') === 0 || menu.url.indexOf('https://') === 0) {
			window.location.href = menu.url
			return
		} else if (menu.url.indexOf('/') === 0) {
			uni.navigateTo({ url: menu.url })
			return
		} else {
			uni.navigateTo({ url: menu.url })
		}
		// #endif
	}
	
</script>

<style>
</style>