<template>
	<view class="box-features">
		<view class="flex" style="gap: 10px;">
			<view class="flex flex-direction box-card text-center" style="flex-shrink: 0;width: 50%;">
				<view class="padding-sm text-white" style="background: #ed6663;">{{now.getFullYear()}}年{{now.getMonth()}}月</view>
				<view class="flex-1 flex flex-direction text-center padding-tb-sm padding-lr-lg bg-white">
					<view class="margin-bottom-sm text-bold text-sl">{{now.getDay()}}</view>
					<view class="margin-top-auto text-gray text-df">第60天 第九周</view>
					<view class="margin-top-sm">正月二十 周四</view>
				</view>
			</view>
			<view class="box-card text-white padding-sm" style="flex: 1; background-color: #201f18;">
				<view class="text-right">
					<text class="block text-sl">29</text>
					<text class="text-lg opacity-9">2月/周四</text>
				</view>
				<view class="margin-top-sm">
					<text class="block text-lg">《狗咬狗》</text>
					<text class="margin-sm cu-tag round bg-yellow">豆瓣 8.1</text>
					<text class="block text-df">要生存就要靠自己</text>
				</view>
			</view>
		</view>
		<view class="box-card margin-top-sm text-white" style="background: linear-gradient(to right, #0e151c, #272d36);">
			<view class="padding-tb-lg padding-lr-sm opacity-9">
				<view class="flex justify-between align-center padding-tb-sm border-top-dashed border-bottom-dashed border-xs">
					<view>
						<text class="block">清明节</text>
						<text class="text-lg opacity-7">4.4-4.6</text>
					</view>
					<view>
						<text>35</text>天
					</view>
				</view>
				<view class="flex justify-between align-center padding-tb-sm border-bottom-dashed border-xs">
					<view>
						<text class="block">清明节</text>
						<text class="text-lg opacity-7">4.4-4.6</text>
					</view>
					<view>
						<text>35</text>天
					</view>
				</view>
				<view class="flex justify-between align-center padding-tb-sm border-bottom-dashed border-xs">
					<view>
						<text class="block">清明节</text>
						<text class="text-lg opacity-7">4.4-4.6</text>
					</view>
					<view>
						<text>35</text>天
					</view>
				</view>
			</view>
		</view>
		<view class="box-card margin-top-sm text-white padding-sm" style="background-color: #433728;">
			<text class="text-lg opacity-6">每日一言</text>
			<view class="text-center margin-top-sm">
				<text class="">这世上的事，到最后是微不足道的。这世上的事，到最后是微不足道的。这世上的事，到最后是微不足道的。这世上的事，到最后是微不足道的。</text>
			</view>
		</view>
	</view>
	
</template>


<script setup>
	const now = new Date();
	console.log(LunarCalendar);
	// const lunar = new LunarCalendar(now);
	// console.log(lunar.toString());

	// console.log(now, now.getDate())
	
</script>

<style lang="scss">
	.box-features {
		margin: 20rpx 20rpx;
		// display: flex;
		// flex-wrap: wrap;
		// gap: 20rpx;
		.box-feature--item {
		}
	}
</style>