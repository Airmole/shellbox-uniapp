<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>检索结果</view>
		</cu-custom>
		
		<!-- 搜索栏 -->
		<view class="margin-lr-sm margin-top bg-white card-radius">
			<view class="padding-top padding-left text-xl">
				<text class="cuIcon-title text-green margin-right-xs"></text>馆藏图书检索
			</view>
			<view class="cu-bar search bg-white">
			    <view class="search-form round">
			        <text class="cuIcon-search"></text>
			        <input @input="keywordChange" :value="keyword" :adjust-position="false" type="text" placeholder="输入要检索的图书关键词" confirm-type="search"></input>
					<text @click="goScanBook" class="cuIcon-scan"></text>
			    </view>
			    <view class="action">
			        <button @tap="search" class="cu-btn bg-gradual-blue shadow-blur round">检索</button>
			    </view>
			</view>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isVip" class="margin-lr margin-tb-sm radius">
			<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
		</view>
		<!-- #endif -->
		
		<!-- 搜索结果列表 -->
		<template v-if="result">
			<view class="bg-white margin-sm margin-top card-radius">			
				<view class="padding-top padding-lr-sm text-lg flex justify-between">
					<view>
						<text class="cuIcon-title text-green margin-right-xs"></text>【{{keyword}}】图书检索结果
					</view>
					<view>共{{result.data.numFound}}条</view>
				</view>
				<template v-if="result.data.numFound==0"><tips tips="没有找到符合要求的图书"></tips></template>
				<template v-for="(book, index) in result.data.searchResult">
					<bookItem
					    :recordId="book.recordId"
						:title="book.title"
						:cover="book.countAndCover ? book.countAndCover.duxiuImageUrl : null"
						:author="book.author"
						:publisher="book.publisher"
						:publishYear="book.publishYear"
						:isbn="book.isbn"
						:callNo="book.callNoOne"
					></bookItem>
				</template>
			</view>
			<!-- 分页器 -->
			<view class="flex justify-between padding-lr-sm margin-top align-center">
				<view class="flex-sub"><button @tap="lastPage" v-if="page>1" class="cu-btn round bg-gradual-blue">上一页</button></view>
				<view class="flex-twice text-center"><text>第{{page}}页丨共{{totalPage}}页</text></view>
				<view class="flex-sub text-right"><button @tap="nextPage" v-if="page<totalPage" class="cu-btn round bg-gradual-blue">下一页</button></view>
			</view>
		</template>
		
	</view>
</template>

<script>
	const app = getApp()
	import api from '../../request/api'
	import bookItem from './components/bookItem.vue'
	let interstitialAd = null
	export default {
		components:{ bookItem },
		data() {
			return {
				isVip: false,
				page: 1,
				rows: 10,
				totalPage: '',
				keyword: '',
				result: ''
			}
		},
		onLoad(options) {
			this.isVip = app.globalData.isVip
			// #ifdef MP-WEIXIN
			if (wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-c142eaf344ea8f4b'
			})
			// #endif
			
			if (options.page) this.page = parseInt(options.page)
			if (options.rows) this.rows = parseInt(options.rows)
			if (options.keyword) {
				this.keyword = options.keyword
				this.fetchSearchResult(this.keyword, this.page, this.rows)
			}
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			fetchSearchResult (keyword, page=1, rows=10) {
				uni.showLoading({ title: '在找了...' })
				api.fetchBookUnifySearch(keyword, 'keyWord',page, rows).then(res => {
					// console.log(res.data)
					this.result = res.data
					this.totalPage = res.data.data.numFound == 0 ? 0 : Math.ceil((res.data.data.numFound / this.rows))
					this.fetchBooksCovers(res.data)
				}).catch(error => {
					uni.showToast({ title: '检索失败' })
					console.log(error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			keywordChange (e) {
				this.keyword = e.detail.value
			},
			goScanBook () {
				uni.navigateTo({ url: '/pages/book/scan' })
			},
			search () {
				if(this.keyword.length == 0) {
					uni.showToast({ title: '请输入检索关键字', icon: 'none' })
					return
				}
				uni.navigateTo({ url: `/pages/book/searchList?keyword=${this.keyword}` })
			},
			fetchBooksCovers (result) {
				for (var index = 0; index < result.data.searchResult.length; index++) {
					let book = result.data.searchResult[index]
					api.fetchBookCountAndCover(book.recordId, book.title, book.isbn).then(res => {
						book.countAndCover = res.data.data
						this.result.data.searchResult[index] = book
						this.$set(this.result.data.searchResult[index], 'countAndCover', res.data.data)
					})
				}
			},
			lastPage () {
				let page = this.page - 1
				if (page <= 1) page = 1
				uni.navigateTo({ url: `/pages/book/searchList?keyword=${this.keyword}&page=${page}` })
			},
			nextPage () {
				let page = parseInt(this.page) + 1
				if (page >= this.totalPage) page = this.totalPage
				uni.navigateTo({ url: `/pages/book/searchList?keyword=${this.keyword}&page=${page}` })
			}
		},
		onShareAppMessage() {
			let query = `?keyword=${this.keyword}&page=${this.page}`
			let data = {
			  title: `【${this.keyword}】相关图书 - 贝壳小盒子`,
			  path: `/pages/book/searchList{query}`
			}
			return data
		},
		onShareTimeline() {
			let query = `keyword=${this.keyword}&page=${this.page}`
			let data = {
			  title: `【${this.keyword}】相关图书 - 贝壳小盒子`,
				query: query
			}
			return data
		}
	}
</script>

<style>

</style>