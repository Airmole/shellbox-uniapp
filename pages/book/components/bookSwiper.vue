	<template>
		<view>
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" style="height: 360rpx;">
				<swiper-item class="grid col-4">
					<template v-for="(book, index) in books">
						<view @tap="goDetail(book.recordId)" v-if="index<4" class="padding-xs">
							<image v-if="book.countAndCover && book.countAndCover.duxiuImageUrl" class="book-cover" :src="book.countAndCover.duxiuImageUrl"></image>
							<view v-else class="bg-img text-center padding-tb-xs book-cover" :style="`background-image: url(${bookDefaultCover});`">
								<text class="text-sm text-black">{{book.title}}</text>
							</view>
							<view class="swiper-item">{{book.title}}</view>
						</view>
					</template>
				</swiper-item>
				<swiper-item class="grid col-4">
					<template v-for="(book, index) in books">
						<view @tap="goDetail(book.recordId)" v-if="index>3 && index<8" class="padding-xs">
							<image v-if="book.countAndCover && book.countAndCover.duxiuImageUrl" class="book-cover" :src="book.countAndCover.duxiuImageUrl"></image>
							<view v-else class="bg-img text-center padding-tb-xs book-cover" :style="`background-image: url(${bookDefaultCover});`">
								<text class="text-sm text-black">{{book.title}}</text>
							</view>
							<view class="swiper-item padding-bottom">{{book.title}}</view>
						</view>
					</template>
				</swiper-item>
			</swiper>
		</view>
	</template>
	<script>
		export default {
			props: {
				books: {
					type: [Array],
					default: [],
					required: true
				}
			},
			data() {
				return {
					bookDefaultCover: 'https://r2.airmole.cn/i/2026/04/06/7po4-ll.jpg',
				}
			},
			methods: {
				goDetail(recordId) {
					uni.navigateTo({ url: `/pages/book/detail?recordId=${recordId}`})
				}
			}
		}
	</script>
	
<style>
	.book-cover {
		height: 200rpx;
		width: 160rpx;
		overflow: clip;
	}
	.swiper-item {
		line-height: 1.5;
		max-height: 3.3em;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
