<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>馆藏图书检索</view>
		</cu-custom>
		
		<!-- 搜索栏 -->
		<view class="margin-lr-sm margin-top bg-white card-radius">
			<view class="padding-top padding-left text-xl">
				<text class="cuIcon-title text-green margin-right-xs"></text>馆藏图书检索
			</view>
			<view class="cu-bar search bg-white card-radius">
			    <view class="search-form round">
			        <text class="cuIcon-search"></text>
			        <input @input="keywordChange" :adjust-position="false" type="text" :auto-focus="true" placeholder="输入要检索的图书关键词" confirm-type="search"></input>
					<text @click="goScanBook" class="cuIcon-scan"></text>
			    </view>
			    <view class="action">
			        <button @tap="search" class="cu-btn bg-green shadow-blur round">检索</button>
			    </view>
			</view>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isVip" class="margin-lr margin-tb-sm radius">
			<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
		</view>
		<!-- #endif -->
		
		<!-- 热读推荐 -->
		<view v-if="hotBooks.length > 0" class="margin-top margin-lr-sm cu-list menu sm-border card-radius bg-white">
			<navigator url="/pages/book/rank" class="cu-item press-class" :render-link="false">
				<view class="text-bold text-xl"><text class="cuIcon-title text-green"></text> 热读推荐</view>
				<view class="action text-right">更多<text class="cuIcon-right"></text></view>
			</navigator>
			<template v-for="(book, index) in hotBooks">
				<bookItem
				    :recordId="book.recordId"
					:title="book.title"
					:cover="book.countAndCover.duxiuImageUrl"
					:author="book.author"
					:publisher="book.publish"
					:publishYear="book.pubDate"
					:isbn="book.isbn"
					:callNo="book.callNo"
				></bookItem>
			</template>
		</view>
		
		<!-- 新书通报 -->
		<view v-if="newBooks.length > 0" class="margin-top margin-lr-sm cu-list menu sm-border card-radius bg-white">
			<navigator url="/pages/book/newBook" class="cu-item press-class" :render-link="false">
				<view class="text-bold text-xl"><text class="cuIcon-title text-green"></text> 新书通报</view>
				<view class="action text-right">更多<text class="cuIcon-right"></text></view>
			</navigator>
			<template v-for="(book, index) in newBooks">
				<bookItem
				    :recordId="book.recordId"
					:title="book.title"
					:cover="book.countAndCover.duxiuImageUrl"
					:author="book.author"
					:publisher="book.publisher"
					:publishYear="book.publishYear"
					:isbn="book.isbn"
					:callNo="book.callNoOne"
				></bookItem>
			</template>
		</view>
		
	</view>
</template>

<script>
	const app = getApp()
	import api from '../../request/api'
	import bookItem from './components/bookItem.vue'
	export default {
		components:{ bookItem },
		data() {
			return {
				isVip: false,
				bookDefaultCover: 'https://r2.airmole.cn/i/2026/04/06/7po4-ll.jpg',
				hotBooks: [],
				newBooks: [],
				keyword: ''
			}
		},
		onLoad() {
			this.isVip = app.globalData.isVip
			
			this.fetchHotBook()
			this.fetchNewBook()
		},
		onShow() {
		},
		methods: {
			fetchHotBook () {
				api.fetchBookHotBorrow(1, 10, '', 30, 1).then(async(res) => {
					if (res.data.data.result.length > 0) {
						let hotBooks = res.data.data.result.slice(0, 5)
						for (var i = 0; i < hotBooks.length; i++) {
							const element = hotBooks[i]
							hotBooks[i].countAndCover = await this.fetchBookCountAndCover(element.recordId, element.title, element.isbn)
						}
						// console.log(hotBooks)
						this.hotBooks = hotBooks
					}
				}).catch(error => {
					console.log(error)
				})
			},
			fetchNewBook () {
				api.fetchBookNew(1, 6).then(async(res) => {
					if (res.data.data.searchResult.length > 0) {
						let newBooks = res.data.data.searchResult
						for (var i = 0; i < newBooks.length; i++) {
							const element = newBooks[i]
							newBooks[i].countAndCover = await this.fetchBookCountAndCover(element.recordId, element.title, element.isbn)
						}
						console.log(newBooks)
						this.newBooks = newBooks
					}
				}).catch(error => {
					console.log(error)
				})
			},
			async fetchBookCountAndCover(recordId, title, isbn) {
				const result = await api.fetchBookCountAndCover(recordId, title, isbn)
				return result.data.data
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
			}
		},
		onShareAppMessage() {
			let data = {
			  title: `馆藏图书检索 - 贝壳小盒子`,
			  path: `/pages/book/index`
			}
			return data
		},
		onShareTimeline() {
			let query = ``
			let data = {
				title: `馆藏图书检索 - 贝壳小盒子`,
				query: query
			}
			return data
		}
	}
</script>

<style>

</style>