<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>热门推荐</view>
		</cu-custom>

		<!-- 热门类别导航栏 -->
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view
					class="cu-item flex-sub"
					:class="index==currentHotType?'text-blue cur':''"
					v-for="(item,index) in hotTypes"
					:key="index"
					@tap="hotTypeSelect"
					:data-id="index"
				>
					{{item.title}}
				</view>
			</view>
		</scroll-view>

		<!-- 统计方式展示 -->
		<view class="margin-sm bg-white card-radius flex flex-direction justify-around padding-sm"
			v-if="booklist && booklist.statistics">
			<view class="flex justify-between">
				<view class="text-gray">统计范围：<text class="text-black">{{booklist.statistics.range}}</text></view>
				<view class="text-gray">统计方式：<text class="text-black">{{booklist.statistics.sortBy}}</text></view>
			</view>
			<view class="text-gray">分类：<text class="text-black">{{booklist.statistics.class}}</text></view>
		</view>
		
		<!-- 中图法分类筛选 -->
		<view class="cu-list menu margin-sm card-radius padding-xs bg-white" v-if="booklist.class">
			<view class="cu-item">
				<view class="action">
					<text class="cuIcon-title text-cyan"></text> 图书分类筛选
				</view>
				<view class="action">
					<button @tap="displayBookTypeChange" class="cu-btn bg-white"><text :class="`cuIcon-${showBookType?'unfold':'right'}`"></text></button>
				</view>
			</view>
			<template v-if="showBookType">
				<view
					v-for="(item, index) in (Array.isArray(booklist.class)?booklist.class:booklist.class.list)"
					:class="`${currentBookType==item.value?'bg-blue round':'radius text-black bg-gray'} cu-tag margin-xs`"
					:key="index"
					@click="bookTypeChange(item.value)"
				>
					{{item.name}}
				</view>
			</template>
		</view>
		
		<!-- 仅热门评分可用的sortBy -->
		<template v-if="currentHotType == 1 && booklist.sort">
			<view class="cu-form-group margin-sm card-radius">
				<view class="title">显示方式</view>
				<picker @change="sortByChange" :value="sortIndex" :range="booklist.sort" range-key="name">
					<view class="picker">
						{{sortIndex>-1?booklist.sort[sortIndex].name:'评价人次'}}
					</view>
				</picker>
			</view>
		</template>
		
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
		
		<!-- 图书列表 -->
		<tips v-if="booklist.books && booklist.books.length === 0" tips="没有符合条件的内容" image="/static/image/nothing.png"></tips>
		<view class="cu-list menu sm-border card-menu">
			<navigator :url="`/pages/book/detail?code=${book.marcNo}`" class="cu-item arrow" v-for="(book, index) in booklist.books" :key="index">
				<view class="content padding-tb-sm text-cut" style="line-height: 1.4em;">
					<view><text class="cuIcon-read text-blue margin-right-xs"></text> <text :decode="true">{{book.no}}.&nbsp;</text>{{book.title}}</view>
					<view class="text-gray text-sm">
						<view class="text-cut"><text class="cuIcon-people text-cyan margin-right-xs"></text> <text>{{book.author}}丨{{book.publisher}}{{book.publishDate}}</text></view>
						<view v-if="book.lendRatio" class="text-sm"> <text class="cuIcon-newshot text-cyan margin-right-xs"></text> 馆藏{{book.collectionNum}}册丨借阅{{book.lendCount}}册次丨借阅比：{{book.lendRatio}}</view>
						<view v-if="book.evaluatorNum || book.score" class="text-sm"> <text class="cuIcon-favorfill text-yellow" v-for="(itm, idx) in Number(book.score)" :key="idx"></text>丨{{book.evaluatorNum}}人评价</view>
						<view v-if="book.starNum" class="text-sm"> <text class="cuIcon-goodsfavor text-cyan margin-right-xs"></text> {{book.starNum}}人次收藏过</view>
						<view v-if="book.viewNum" class="text-sm"> <text class="cuIcon-attention text-cyan margin-right-xs"></text> {{book.viewNum}}次浏览量</view>
						<view class="text-black text-df"><text class="cuIcon-barcode text-cyan margin-right-xs"></text>索书号：<text class="text-cyan">{{book.callNo}}</text></view>
					</view>
				</view>
			</navigator>
		</view>

	</view>
</template>

<script>
	import api from '../../request/api'
	let interstitialAd = null
	export default {
		data() {
			return {
				currentHotType: 0,
				hotTypes: [{
						title: '热门借阅',
						value: 'hotLend'
					},
					{
						title: '热门评分',
						value: 'hotScore'
					},
					{
						title: '热门收藏',
						value: 'hotStar'
					},
					{
						title: '热门图书',
						value: 'hotBook'
					}
				],
				currentBookType: 'ALL',
				showBookType: true,
				booklist: '',
				sortIndex: -1,
			}
		},
		onLoad(options) {
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
			
			let bookType = 'ALL'
			if (options.bookType) {
				this.currentBookType = options.bookType
				bookType = options.bookType
			}
			if (options.hotType) {
				const hotType = options.hotType
				this.hotTypes.forEach((element, index) => {
					if (element.value == hotType) this.currentHotType = index
				})
				if (hotType === 'hotLend') this.fetchHotLendBooks(bookType)
				if (hotType === 'hotScore') this.fetchHotScoreBooks(bookType)
				if (hotType === 'hotStar') this.fetchHotStarBooks(bookType)
				if (hotType === 'hotBook') this.fetchHotBooks(bookType)
			}
			if (!options.hotType) this.fetchHotLendBooks(bookType)
		},
		onShow() {
			if (interstitialAd) interstitialAd.show()
		},
		methods: {
			fetchHotLendBooks(classType = 'ALL') {
				uni.showLoading({
					title: '正在加载...'
				})
				api.fetchOpacsysHotLendBooks(classType).then(res => {
					this.booklist = res.data
				}).catch(error => {
					console.log('fetchHotLendBooks error', error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			fetchHotScoreBooks(classType = 'ALL', sort = '') {
				uni.showLoading({
					title: '正在加载...'
				})
				api.fetchOpacsysHotScoreBooks(classType, sort).then(res => {
					this.booklist = res.data
					if (res.data && res.data.sort) {
						for (var index = 0; index < res.data.sort.length; index++) {
							var element = res.data.sort[index]
							if (element.checked) this.sortIndex = index
						}
					}
					console.log('this.sortIndex', this.sortIndex)
				}).catch(error => {
					console.log('fetchHotScoreBooks error', error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			fetchHotStarBooks(classType = 'ALL') {
				uni.showLoading({
					title: '正在加载...'
				})
				api.fetchOpacsysHotStarBooks(classType).then(res => {
					this.booklist = res.data
				}).catch(error => {
					console.log('fetchHotStarBooks error', error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			fetchHotBooks(classType = 'ALL') {
				uni.showLoading({
					title: '正在加载...'
				})
				api.fetchOpacsysHotBooks(classType).then(res => {
					this.booklist = res.data
				}).catch(error => {
					console.log('fetchHotBooks error', error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			displayBookTypeChange () {
				this.showBookType = !this.showBookType
			},
			bookTypeChange (classType) {
				this.currentBookType = classType
				const sort = (this.booklist && this.booklist.sort && this.sortIndex > -1) ? this.booklist.sort[this.sortIndex].value : 'person'
				if (this.currentHotType == 0) this.fetchHotLendBooks(classType)
				if (this.currentHotType == 1) this.fetchHotScoreBooks(classType, sort)
				if (this.currentHotType == 2) this.fetchHotStarBooks(classType)
				if (this.currentHotType == 3) this.fetchHotBooks(classType)
			},
			hotTypeSelect(e) {
				const index = e.currentTarget.dataset.id
				this.currentHotType = index
				this.currentBookType = 'ALL'
				const sort = (this.booklist && this.booklist.sort && this.sortIndex > -1) ? this.booklist.sort[this.sortIndex].value : 'person'
				if (this.currentHotType == 0) this.fetchHotLendBooks(this.currentBookType)
				if (this.currentHotType == 1) this.fetchHotScoreBooks(this.currentBookType, sort)
				if (this.currentHotType == 2) this.fetchHotStarBooks(this.currentBookType)
				if (this.currentHotType == 3) this.fetchHotBooks(this.currentBookType)
			},
			sortByChange (e) {
				const index = e.detail.value
				this.sortIndex = index
				const sort = this.booklist.sort[index].value
				this.fetchHotScoreBooks(this.currentBookType, sort)
			}
		},
		onShareAppMessage() {
			let title = this.hotTypes[this.currentHotType].title
			let query = `?hotType=${this.hotTypes[this.currentHotType].value}&bookType=${this.currentBookType}`
			let data = {
			  title: `图书馆${title}榜单 - 贝壳小盒子`,
			  path: `/pages/book/hotbook${query}`
			}
			return data
		},
		onShareTimeline() {
			let title = this.hotTypes[this.currentHotType].title
			let query = `hotType=${this.hotTypes[this.currentHotType].value}&bookType=${this.currentBookType}`
			let data = {
				title: `图书馆${title}榜单 - 贝壳小盒子`,
				query: query
			}
			return data
		}
	}
</script>

<style>

</style>