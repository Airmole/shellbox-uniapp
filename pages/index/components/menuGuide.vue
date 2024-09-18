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
			<view class="cu-item" v-for="(itme,idx) in renderMenu" :key="idx" @click="goPage(itme)" >
				<text :class="'iconfont icon-' + itme.icon" style="color: #39B54A;font-size: 40upx;"></text>
				<text>{{itme.name}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed, ref } from 'vue';
	import { getEdusysAccount } from '@/common/utils/auth.js'
	
	const props = defineProps({
		menuList: Object,
		title: String
	})
	
	const fold = ref(false)
	const renderMenu = computed(() => {
		if (fold.value) {
			return props.menuList
		}
		return props.menuList.slice(0, 5)
	})
	
	function goPage(menu) {
		if (menu.login === true && getEdusysAccount() === false) {
			uni.showToast({ title: '此功能需要登录', icon: 'none' })
			return
		}
		uni.navigateTo({ url: menu.url })
	}
	
</script>

<style>
</style>