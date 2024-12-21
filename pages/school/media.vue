<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>校园媒体</view>
		</cu-custom>
		
		<scroll-view scroll-x class="bg-gradual-blue nav text-center">
			<view
				class="cu-item"
				:class="index===currentTab?'text-white cur':''"
				v-for="(item, index) in Object.assign({'全部': []}, dataList)"
				:key="index"
				@tap="tabChange"
				:data-index="index"
			>{{index}}</view>
		</scroll-view>
		
		<view class="margin-lr-sm margin-tb bg-white padding-sm card-radius">
			<view>
				<text class="cuIcon-info"></text> 本页信息来源于网络搜集整理，如有遗漏、变更或您的公众号也想友情链接，欢迎 <text @tap="selectedAccount('USTBShellBox')" class="text-blue">联系我们</text>
			</view>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view class="margin margin-tb-xl radius">
			<ad-custom unit-id="adunit-3d7f1704631ec7ea" ad-intervals="30"></ad-custom>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-QQ -->
		<view class="margin margin-tb-xl radius">
			<ad unit-id="f0256a9d11d62920007be2d67178cdd3" type="card"></ad>
		</view>
		<!-- #endif -->
		
		<view class="margin-lr-sm flex flex-direction">
			<view v-for="(items, category) in dataList" :key="`key${category}`" class="justify-center">
				<template v-if="currentTab==='全部' || currentTab===category">
					<view class="text-title text-center text-bold text-lg margin-tb-xs">{{category}}</view>
					<view class="flex flex-wrap justify-center">
						<view
							@tap.stop="goPage(item)"
							v-for="(item, index) in items"
							class="radius padding-sm margin-tb-sm margin-lr-xs card-view bg-blue shadow flex flex-wrap justify-between"
							:style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]"						>
							<view class="text-sm flex flex-direction basis-lg text-cut" style="height: 100rpx">
								<view class="text-title text-df margin-bottom-xs">{{item.title}}</view>
								<view @tap.stop="copyAccount(item.account)" class="text-xs">账号:{{item.account}}</view>
							</view>
							<view class="basis-xs card-qrcode">
								<image @tap.stop="showQrcode(item.qr_code)" class="radius" style="width: 100rpx;" :src="item.qr_code" :show-menu-by-longpress="true" mode="widthFix"></image>
							</view>
							<view class="card-desc text-sm margin-top-sm">
								{{item.description}}
							</view>
						</view>
						<!-- 占位，以免落单卡片居中 -->
						<view v-if="items.length%2===1" class="card-view margin-tb-sm margin-lr-xs"></view>
					</view>
				</template>
			</view>
		</view>
		
		<view class="cu-modal" :class="isShowModal&&detail ? 'show' : ''">
			<view class="cu-dialog bg-gray">
				<view class="cu-bar bg-gray justify-end">
					<view class="content">{{detail.title}}</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view> 
				</view>
				<view class="padding margin-sm bg-white">
					<view class="flex justify-start">
						<view class="cu-avatar round xl margin-lr" :style="`background-image:url(${detail.logo});`"></view>
						<view class="margin-left text-left">
							<view class="margin-tb-xs">
								<text class="text-xl ">{{detail.title}}</text>
							</view>
							<view @tap="copyAccount(detail.account)" class="text-df">账号：{{detail.account}}</view>
						</view>
					</view>
					<view class="margin-tb flex justify-around">
						<view class="text-left margin-lr-xs">
							{{detail.description}}
						</view>
						<view class="margin-lr-xs">
							<image @tap="showQrcode(detail.qr_code)" :src="detail.qr_code" :show-menu-by-longpress="true" mode="widthFix" style="width: 200rpx;"></image>
							<!-- #ifdef MP-WEIXIN -->
							<view>长按识别关注</view>
							<!-- #endif -->
						</view>
					</view>
				</view>
			</view>
		</view>

		
	</view>
</template>

<script>
	import api from '@/request/api.js'
	let interstitialAd = null
	export default {
		data() {
			return {
				dataList: '',
				currentTab: '全部',
				isShowModal: true,
				detail: ''
			}
		},
		onLoad(options) {
			// #ifdef MP-WEIXIN
			if(wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif
			// #ifdef MP-QQ
			if (qq.createInterstitialAd) interstitialAd = qq.createInterstitialAd({ adUnitId: '8fe9b8e7191346a2ffb0c20c6bf3e0cf' })
			// #endif
			
			let account = ''
			if (options && options.account) account = options.account
			
			this.fetchData(account)
		},
		onShow() {
			if (interstitialAd) interstitialAd.show()	
		},
		methods: {
			fetchData (account = '') {
				api.fetchSchoolMediaList().then(res => {
					const dataList = this.convertData(res.data.data)
					this.dataList = dataList
					if (account) this.selectedAccount(account)
				})
			},
			tabChange (e) {
				const index = e.currentTarget.dataset.index
				this.currentTab = index
			},
			showQrcode (url) {
				uni.previewImage({ urls: [url] })
			},
			copyAccount(account) {
				uni.setClipboardData({
					data: account,
					success() {
						uni.showToast({ title: '已复制到粘贴板' })
					}
				})
			},
			goPage (data) {
				// #ifdef H5
				const isWechat = /micromessenger/i.test(navigator.userAgent)
				if (isWechat && data.url) { // 微信内置浏览器访问
					uni.showLoading({ title: '加载中...' })
					window.location.href = data.url
					return
				}
				// #endif
				
				this.detail = data
				this.isShowModal = true
			},
			selectedAccount (account) {
				let exist = false
				for (let category in this.dataList) {
					if (exist) break
					const items = this.dataList[category]
					for (let item of items) {
						if (exist) break
						if (account.toLowerCase() === item.account.toLowerCase()) {
							exist = true
							this.detail = item
							this.isShowModal = true
							break
						}
					}
				}
			},
			convertData (data) {
				if (!data) return
				let result = {}
				for (let item of data) {
					if (!Object.keys(result).includes(item.category)) result[item.category] = []
					result[item.category].push(item)
				}
				return result
			},
			hideModal () {
				this.isShowModal = !this.isShowModal
			}
		},
		onShareAppMessage() {
			let data = {
			  title: `校园媒体 - 贝壳小盒子`,
			  path: `/pages/school/media`
			}
			
			return data
		},
		onShareTimeline() {
			let data = {
			  title: `校园媒体 - 贝壳小盒子`
			}
			return data
		}
	}
</script>

<style>
.card-view {
	width: 330rpx;
	overflow: hidden;
}

.card-qrcode {
	width: 100rpx;
	height: 100rpx;
}

.card-desc {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
