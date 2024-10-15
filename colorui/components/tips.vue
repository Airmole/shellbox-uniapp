<template>
	<view class="flex justify-center align-center margin-xs flex-direction">
		<image :src="props.image" :style="`height: ${height}rpx;`" mode="heightFix"></image>
		<view class="text-center margin-sm">
			<text>{{tips || props.tips}}</text>
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
		}
	})
</script>

<style>
</style>
