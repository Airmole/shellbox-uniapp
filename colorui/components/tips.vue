<template>
	<view class="flex justify-center align-center margin flex-direction">
		<image src="../../static/image/nothing.png" class="image-height" mode="heightFix"></image>
		<view class="text-center margin-sm">
			<text>{{tips}}</text>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		tips: String
	})
</script>

<style>
	.image-height {
		height: 180rpx;
	}
</style>
