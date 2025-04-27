<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>{{shelf?shelf.title:''}}</view>
		</cu-custom>
		
		<view class="bg-white margin flex justify-between padding-sm card-radius" v-if="shelf">
			<view><text class="cuIcon-title text-green"></text>{{shelf.title}}</view><view>{{shelf.total}}条</view>
		</view>
		
		<!-- 图书列表 -->
		<tips v-if="shelf.books && shelf.books.length === 0" tips="没有符合条件的内容" image="/static/image/nothing.png"></tips>
		<view class="cu-list menu sm-border card-menu">
			<navigator :url="`/pages/book/detail?code=${book.marcNo}`" class="cu-item arrow" v-for="(book, index) in shelf.books" :key="index">
				<view class="content padding-tb-sm text-cut" style="line-height: 1.4em;">
					<view><text class="cuIcon-read text-blue margin-right-xs"></text> <text :decode="true">{{book.no}}.&nbsp;</text>{{book.title}}</view>
					<view class="text-gray text-sm">
						<view class="text-cut"><text class="cuIcon-people text-cyan margin-right-xs"></text> <text>{{book.author}}丨{{book.publisher}}{{book.publishDate}}</text></view>
						<view v-if="book.lendRatio" class="text-sm"> <text class="cuIcon-newshot text-cyan margin-right-xs"></text> 馆藏{{book.collectionNum}}册丨借阅{{book.lendCount}}册次丨借阅比：{{book.lendRatio}}</view>
						<view class="text-black text-df"><text class="cuIcon-barcode text-cyan margin-right-xs"></text>索书号：<text class="text-cyan">{{book.callNo}}</text></view>
					</view>
				</view>
			</navigator>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view class="margin-lr margin-tb-sm radius">
			<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-QQ -->
		<view class="margin-lr margin-tb-sm radius">
			<ad unit-id="297c24fcd434022129795daed3f46440"></ad>
		</view>
		<!-- #endif -->
		
	</view>
</template>

<script>
	import api from '../../request/api'
	let interstitialAd = null
	export default {
		data() {
			return {
				shelfId: '',
				shelf: ''
			}
		},
		onLoad(option) {
			// #ifdef MP-WEIXIN
			if (wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-c142eaf344ea8f4b'
			})
			// #endif
			// #ifdef MP-QQ
			if (qq.createInterstitialAd) interstitialAd = qq.createInterstitialAd({
				adUnitId: '8fe9b8e7191346a2ffb0c20c6bf3e0cf'
			})
			// #endif
			
			this.shelfId = option.id
			this.fetchShelfBooks(option.id)
		},
		onShow() {
			if (interstitialAd) interstitialAd.show()
		},
		methods: {
			fetchShelfBooks (shelfId) {
				uni.showLoading({ title: '等我加载一下...' })
				api.fetchOpacsysShelfBooks(shelfId).then(res => {
					this.shelf = res.data
					console.log(res.data)
				}).catch(error => {
					console.log('fetchShelfBooks', error)
				}).finally(() =>{
					uni.hideLoading()
				})
			}
		},
		onShareAppMessage() {
			let title = this.shelf.title
			let query = `?id=${this.shelfId}`
			let data = {
			  title: `${title}书单 - 贝壳小盒子`,
			  path: `/pages/book/shelf${query}`
			}
			return data
		},
		onShareTimeline() {
			let title = this.shelf.title
			let query = `id=${this.shelfId}`
			let data = {
				title: `${title}书单 - 贝壳小盒子`,
				query: query
			}
			return data
		}
	}
</script>

<style>

</style>
