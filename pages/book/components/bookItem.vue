	<template>
		<view @click="click" class="flex margin-tb solid-bottom align-center">
			<view class="margin-sm">
				<image v-if="cover" style="height: 200rpx; width: 150rpx;" :src="cover"></image>
				<view v-else class="bg-img text-center padding-tb-xs" :style="`background-image: url(${bookDefaultCover});height: 200rpx;width: 150rpx;overflow: clip;`">
					<text class="text-sm text-black">{{title}}</text>
				</view>
			</view>
			<view class="flex flex-direction margin-tb-xs margin-lr-sm" style="width: 100%;">
				<view class="text-lg text-bold text-cut'">{{title}}</view>
				<view class="text-cut">{{author}}</view>
				<view class="text-cut">{{publisher}}丨{{publishYear}}出版</view>
				<view v-if="isbn" class="text-cut">ISBN：{{isbn}}</view>
				<view v-if="callNo">索书号：{{callNo}}</view>
				<view v-if="loanDate || normReturnDate || returnDate" class="flex flex-direction">
					<view v-if="loanDate" class="flex-sub margin-top-xs">借阅：{{loanDate}}</view>
					<view v-if="normReturnDate" class="flex-sub text-blue  flex justify-between">
						<text>应还：{{normReturnDate}}</text>
						<view v-if="showRenew" @tap.stop="renewBook" class="cu-tag round margin-left-sm bg-green">续借</view>
					</view>
					<view v-if="returnDate" class="flex-sub margin-top-xs">归还：{{returnDate}}</view>
				</view>
				<view v-if="bottomText">{{bottomText}}</view>
			</view>
		</view>
	</template>
	<script>
		export default {
			emits:['click', 'renewBook'],
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
				loanId: {
					type: [String, Number],
					default: '',
					required: false
				},
				loanDate: {
					type: [String],
					default: '',
					required: false
				},
				normReturnDate: {
					type: [String],
					default: '',
					required: false
				},
				returnDate: {
					type: [String],
					default: '',
					required: false
				},
				bottomText: {
					type: [String, Number],
					default: '',
					required: false
				},
				showRenew: {
					type: [Boolean],
					default: false,
					required: false
				},
				goBookDetail: {
					type: [Boolean],
					default: true,
					required: false
				},
				book: {
					type: [Object, null],
					default: null,
					required: false
				}
			},
			data() {
				return {
					bookDefaultCover: 'https://r2.airmole.cn/i/2026/04/06/7po4-ll.jpg'
				}
			},
			methods:{
				click (){
					if (this.goBookDetail) {
						uni.navigateTo({
							url: `/pages/book/detail?recordId=${this.recordId}`
						})
					} else {
						this.$emit('click', this.book)
					}
				},
				renewBook () {
					this.$emit('renewBook', this.book)
				}
			}
		}
	</script>
