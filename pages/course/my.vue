<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">我的课表</block>
		</cu-custom>
		<view class="">
			<scroll-view scroll-y="true" scroll-x="true">
				<view class="flex border-bottom" :style="{width: `${tableWidth}px`}">
					<view class="tb-head-y border-right" :style="{width: `${columnTitleWidth}px`}"></view>
					<view class="tb-head-x" :style="{width: `${itemWidth}px`}">星期一</view>
					<view class="tb-head-x" :style="{width: `${itemWidth}px`}">星期二</view>
					<view class="tb-head-x" :style="{width: `${itemWidth}px`}">星期三</view>
					<view class="tb-head-x" :style="{width: `${itemWidth}px`}">星期四</view>
					<view class="tb-head-x" :style="{width: `${itemWidth}px`}">星期五</view>
					<view class="tb-head-x" :style="{width: `${itemWidth}px`}">星期六</view>
					<view class="tb-head-x" :style="{width: `${itemWidth}px`}">星期日</view>
				</view>
				<view class="flex" :style="{width: `${tableWidth}px`}" v-for="(row, index) in [1,2,3,4,5,6]">
					<view class="border-right tb-height text-center flex justify-center align-center"
						:style="{width: `${columnTitleWidth}px`}">
						<view>8:00<br />~<br />9:35</view>
					</view>
					<view class="bg-grey padding-sm radius tb-head-x tb-height"
						:style="{width: `${itemWidth}px`,height: `${itemHeight}px`}">2
					</view>
					<view class="bg-grey padding-sm radius tb-head-x tb-height"
						:style="{width: `${itemWidth}px`,height: `${itemHeight}px`}">2
					</view>
					<view class="bg-grey padding-sm radius tb-head-x tb-height"
						:style="{width: `${itemWidth}px`,height: `${itemHeight}px`}">2
					</view>
					<view class="bg-grey padding-sm radius tb-head-x tb-height"
						:style="{width: `${itemWidth}px`,height: `${itemHeight}px`}">2
					</view>
					<view class="bg-grey padding-sm radius tb-head-x tb-height"
						:style="{width: `${itemWidth}px`,height: `${itemHeight}px`}">2
					</view>
					<view class="bg-grey padding-sm radius tb-head-x tb-height"
						:style="{width: `${itemWidth}px`,height: `${itemHeight}px`}">2
					</view>
					<view class="bg-grey padding-sm radius tb-head-x tb-height"
						:style="{width: `${itemWidth}px`,height: `${itemHeight}px`}">2
					</view>
				</view>
				<view class="flex padding-tb-sm" :style="{width: `${tableWidth}px`}"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				screenWidth: 375,
				columnTitleWidth: 34,
				tableWidth: 0,
				tableHeight: 0,
				itemWidth: 64,
				itemHeight: 120
			}
		},
		onShow() {
			this.calcTableSize()
		},
		methods: {
			calcTableSize() {
				const res = wx.getSystemInfoSync()
				console.log(res)
				const screenWidth = res.screenWidth
				const screenHeight = res.screenHeight
				const itemWidth = (res.screenWidth - this.columnTitleWidth - (2 * 6)) / 5
				const tableWidth = 30 + (itemWidth * 7) + (2 * 8)
				const itemHeight = (screenHeight - 60) / 6
				const tableHeight = (itemHeight * 6) + (2 * 6)
				this.screenWidth = screenWidth
				this.itemWidth = itemWidth
				this.itemHeight = itemHeight
				this.tableWidth = tableWidth
				this.tableHeight = tableHeight
			}
		}
	}
</script>

<style>
	.tb-head-x {
		margin: 4upx;
		text-align: center;
	}

	.border-bottom {
		border-bottom: 1px solid #ccc;
	}

	.border-right {
		border-right: 1px solid #ccc;
	}
</style>