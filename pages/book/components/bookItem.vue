	<template>
		<navigator :url="`/pages/book/detail?recordId=${recordId}`" class="flex margin-tb solid-bottom align-center" :render-link="false">
			<view class="margin-sm">
				<image v-if="cover" style="height: 200rpx; width: 150rpx;" :src="cover"></image>
				<view v-else class="bg-img text-center padding-tb-xs" :style="`background-image: url(${bookDefaultCover});height: 200rpx;width: 150rpx;overflow: clip;`">
					<text class="text-sm text-black">{{title}}</text>
				</view>
			</view>
			<view class="flex flex-direction margin-tb-xs margin-lr-sm">
				<view class="text-lg text-bold text-cut'">{{title}}</view>
				<view class="text-cut">{{author}}</view>
				<view class="text-cut">{{publisher}}{{publishYear}}</view>
				<view class="text-cut">{{isbn}}</view>
				<view v-if="callNo">索书号：{{callNo}}</view>
				<view v-else><view class="margin-xs cu-tag radius line-red">暂无馆藏</view></view>
				<view v-if="bottomText">{{bottomText}}</view>
			</view>
		</navigator>
	</template>
	<script>
		export default {
			props: {
				recordId: {
					type: [String, Number],
					default: '',
					required: true
				},
				title: {
					type: [String, Number],
					default: '',
					required: true
				},
				cover: {
					type: [String, null],
					default: null,
					required: false
				},
				author: {
					type: [String],
					default: '',
					required: false
				},
				publisher: {
					type: [String],
					default: '',
					required: false
				},
				publishYear: {
					type: [String, Number],
					default: '',
					required: false
				},
				isbn: {
					type: [String, Number],
					default: '',
					required: false
				},
				callNo: {
					type: [String, Number],
					default: '',
					required: false
				},
				bottomText: {
					type: [String, Number],
					default: '',
					required: false
				},
				bookDefaultCover: {
					type: String,
					default: 'https://r2.airmole.cn/i/2026/04/06/7po4-ll.jpg',
					required: false
				}
			}
		}
	</script>
