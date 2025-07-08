<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>扫码查书</view>
		</cu-custom>
		
		<view class="margin-tb-xl margin padding bg-white card-radius">
			<view class="text-center">
				<text>请扫描图书背面底部的ISBN码</text>
			</view>
			<view class="text-center margin">
				<image style="width: 300rpx;" src="https://r2.airmole.cn/i/2025/04/27/17zht3-w9.jpg" mode="widthFix"></image>
			</view>
			<view class="text-left">
				<text>ISBN（International Standard Book Number，国际标准书号），是国际上通用的图书唯一标识编码，便于出版、销售和库存管理。</text>
			</view>
		</view>
		
		<view class="cu-bar search bg-white margin round">
		    <view class="search-form round">
		        <text class="cuIcon-scan"></text>
		        <input @input="isbnInput" :value="isbn" type="number" :maxlength="13" :placeholder="isWeb?'输入图书ISBN码':'点击「扫描」图书ISBN码'"></input>
		    </view>
		    <view class="action">
		        <button v-if="!isWeb" @click="scanCode" class="cu-btn bg-gradual-blue shadow-blur round">扫描</button>
		        <button v-else @click="search" class="cu-btn bg-gradual-blue shadow-blur round">检索</button>
		    </view>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isVip" class="margin-lr margin-tb-sm radius">
			<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-QQ -->
		<view v-if="!isVip" class="margin-lr margin-tb-sm radius">
			<ad unit-id="297c24fcd434022129795daed3f46440"></ad>
		</view>
		<!-- #endif -->
		
		<tips v-if="list !== '' && list.total === 0" tips="没有找到符合条件的结果~"></tips>
		<template v-if="list !== '' && list.total > 0">			
			<view class="cu-list menu sm-border card-menu margin-top margin-bottom">
			    <navigator :url="`/pages/book/detail?code=${item.marcRecNo}`" class="cu-item arrow" v-for="(item, index) in list.content" :key='index'>
			      <view class="content padding-tb-sm">
			        <view><text user-select="true">{{item.title}}</text></view>
			        <view class="text-gray text-sm">
			          <text :decode="true" user-select="true"><template v-if="item.author"><text class="cuIcon-people text-cyan margin-right-xs"></text>{{item.author}}丨{{item.publisher}}{{item.pubYear}}<text :decode="true">\n</text> </template><template v-if="item.callNo"><text class="cuIcon-barcode text-cyan margin-right-xs"></text>索书号：<text class="text-cyan">{{item.callNo}}</text></template>
			          </text>
			        </view>
			      </view>
			      <view class="action"></view>
			    </navigator>
			</view>
		</template>
		
	</view>
</template>

<script>
	const app = getApp()
	import api from '../../request/api'
	let interstitialAd = null
	export default {
		data() {
			return {
				isVip: false,
				isWeb: false,
				isbn: '',
				list: ''
			}
		},
		onLoad() {
			this.isVip = app.globalData.isVip
			// #ifdef MP-WEIXIN
			if (wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif
			// #ifdef MP-QQ
			if (qq.createInterstitialAd) interstitialAd = qq.createInterstitialAd({ adUnitId: '8fe9b8e7191346a2ffb0c20c6bf3e0cf' })
			this.isMpQQ = true
			// #endif
			
			// #ifdef H5
			this.isWeb = true
			// #endif
		},
		onReady() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		onShow() {
		},
		methods: {
			isbnInput (e) {
				const value = e.detail.value
				this.isbn = value
				if (value.length === 13) {
					uni.hideKeyboard()
					this.search()
				}
			},
			scanCode () {
				const _this = this
				uni.scanCode({
					scanType: 'barCode',
					success (res) {
						console.log(res)
						if (res.scanType !== "EAN_13") {
							uni.showToast({ title: '您扫描的不是标准ISBN码', icon: 'none' })
							return
						}
						_this.isbn = res.result
						_this.search()
					}
				})
			},
			search () {
				if (this.isbn.length === 0) {
					uni.showToast({ title: '请输入正确的ISBN码', icon:'none' })
					return
				}
				
				uni.showLoading({ title: '检索中...' })
				api.fetchBookSearch('05', this.isbn).then(res => {
					console.log(res.data)
					this.list = res.data
				}).catch(error => {
					console.log('fetchBookSearch error', error)
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>

</style>
