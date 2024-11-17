<template>
	<view @tap="navigate" class="flex justify-center align-center margin-xs flex-direction">
		<image :src="props.image" :style="`height: ${height}rpx;`" mode="heightFix"></image>
		<view class="text-center margin-sm">
			<text>{{tips || props.tips}}</text>
		</view>
		<view v-if="showButton || props.showButton">
			<button class="cu-btn round bg-gradual-blue">{{buttonText || props.buttonText}}</button>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		tips: String,
		image: {
		  type: String,
		  required: false,
		  default: 'https://r2.airmole.net/gif/BrunoError.gif'
		},
		height: {
		  type: [Number, String],
		  required: false,
		  default: 200
		},
		showButton: {
			type: Boolean,
			required: false,
			default: false
		},
		buttonText: {
			type: String,
			required: false,
			default: ''
		},
		path: {
			type: String,
			required: false,
			default: ''
		}
	})
	
	function navigate () {
		const path = props.path || this.path
		console.log('navigate path', path)
		if (path === '' || !path) return
		uni.navigateTo({ url: path })
	}
</script>

<style>
</style>
