<template>
	<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
		<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
			<view class="action" @tap="BackPage" v-if="isBack">
				<text class="cuIcon-back"></text>
				<slot name="backText"></slot>
			</view>
			<view class="content" :style="[{top:StatusBar + 'px'}]">
				<slot></slot>
			</view>
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script setup>
	import menuBarInfo from '@/common/use/useMenuBarInfo.js'
	import { computed, ref } from "vue"
	const { statusBarHeight, customBarHeight } = menuBarInfo

	const props = defineProps({
		bgColor: String,
		isBack: [Boolean, String],
		bgImage: String
	})
	
	const StatusBar = ref(statusBarHeight)
	const CustomBar = ref(customBarHeight)
	
	const style = computed(() => {
		const style = `height:${CustomBar.value}px;padding-top:${StatusBar.value}px;`;
		return style
	})
	
	const BackPage = () => {
		try {
			if (getCurrentPages().length < 2 && 'undefined' !== typeof __wxConfig) {
				const url = '/' + __wxConfig.pages[0]
				return uni.redirectTo({
					url
				})
			}
			if (getCurrentPages().length === 1) {
				return uni.switchTab({
					url: '/pages/index/index'
				})
			}
			uni.navigateBack({
				delta: 1
			});
		} catch (e) {
			try{
				return uni.redirectTo({
					url: '/pages/index/index'
				})
			}catch(e){
				const url = '/' + __wxConfig.pages[0]
				return uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style>

</style>