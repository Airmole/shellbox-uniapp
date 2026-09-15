<template>
	<view class="bg-white margin card-radius padding-lr-xs padding-tb" v-if="data">
		<view class="text-center text-title text-bold">{{data.title}}</view>
		
		<view class="card-radius">
			<view class="flex margin-top-sm text-bold bg-blue light text-center card-radius-top padding-top-xs" style="width: 654rpx;">
				<view class="text-center text-black" style="width: 412rpx;">
					<text>{{data.headTitle[0]}}</text>
				</view>
				<view class="head-cell text-black">{{data.headTitle[1]}}</view>
				<view class="head-cell text-black">{{data.headTitle[2]}}</view>
			</view>
				
			<template v-for="(item, index) in data.content" :key="index">
				<view class="flex text-black" v-if="!isFold || (isFold&&index<1)">
					<view style="width: 50rpx;" class="flex align-center border text-center bg-blue light"><view class="text-black">{{item.title}}</view></view>
					<view class="border">
						<template v-for="(itm, idx) in item.items">
							<view class="flex justify-between text-center" v-if="!isFold || (isFold&&idx<foldShowNum)">
								<view style="width: 360rpx;" class="text-left padding-left-xs bg-blue light text-cut"><text class="text-black">{{itm.right}}</text></view>
								<view v-if="itm.free==='V'" class="value-cell bg-green light">√</view>
								<view v-if="itm.free==='C'" class="value-cell bg-yellow light"><text class="text-black">需看广告</text></view>
								<view v-if="itm.free==='X'" class="value-cell bg-red light">×</view>
								<view v-if="itm.vip==='V'" class="value-cell bg-green light">√</view>
								<view v-if="itm.vip==='C'" class="value-cell bg-yellow light"><text class="text-black">需看广告</text></view>
								<view v-if="itm.vip==='X'" class="value-cell bg-red light">×</view>
							</view>
						</template>
					</view>
				</view>
			</template>
			<view class="bg-blue light padding-tb-xs text-center card-radius-bottom" style="width: 654rpx;">
				<text class="margin-left-sm text-black">{{data.tips}}</text>
			</view>
		</view>
		
		<view class="padding-tb-xs">
			<template v-if="isFold">
				<view @click="showFoldContent" class="text-blue text-center"> <text class="cuIcon-unfold"></text> 查看完整功能权益</view>
			</template>
			<template v-else>
				<view @click="showFoldContent" class="text-blue text-center"><text class="cuIcon-fold"></text>收起</view>
			</template>
		</view>
	</view>
</template>

<script>
	import api from '../../../request/api';
	export default {
		props: {
			foldShowNum: {
				type: [Number, String],
				default: 16,
				required: false
			}
		},
		data() {
			return {
				data: '',
				isFold: true
			}
		},
		created() {
			this.fetchVipRights()
		},
		methods: {
			fetchVipRights () {
				api.fetchVipRights().then(res => {
					this.data = res.data
					console.log(this.data)
				})
			},
			showFoldContent () {
				this.isFold = !this.isFold
			}
		}
	}
</script>

<style>
	.head-cell {
		width: 119rpx;
	}
	.value-cell {
		width: 120rpx;
	}
	.border {
		border: 1px solid #888;
	}
	
	@media (prefers-color-scheme: dark) {
		/* DarkMode 下的样式 start */
		.text-black {
			color: #ffffff;
		}
		.bg-blue.light {
			background-color: #888;
		}
		.bg-yellow.light {
			background-color: #f4cf2b;
		}
		/* DarkMode 下的样式 end */
	}
</style>