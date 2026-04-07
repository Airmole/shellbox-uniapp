<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>{{ bookDetail.clearTitle || '图书详情'}}</view>
		</cu-custom>
		
		<!-- 书籍信息 -->
		<view v-if="bookDetail" class="bg-white margin card-radius padding-sm">
			<view @tap="showInfoArea" class="padding-lr-sm text-xl flex justify-between">
				<view>
					<text class="cuIcon-title text-green margin-right-xs"></text>{{bookDetail.clearTitle}}
				</view>
				<view class="action text-right">
					<text :class="'cuIcon-'+(foldInfoArea?'right':'unfold')"></text>
				</view>
			</view>
			<template v-if="!foldInfoArea">
				<view class="flex margin-sm">
					<view class="flex-sub">
						<image v-if="countAndCover && countAndCover.duxiuImageUrl" @tap="previewCover" class="book-cover" :src="countAndCover.duxiuImageUrl"></image>
						<view v-else class="bg-img text-center padding-tb-xs book-cover" :style="`background-image: url(${bookDefaultCover});`">
							<text class="text-sm text-black">{{bookDetail.clearTitle}}</text>
						</view>
					</view>
					<view class="flex-twice">
						<template v-for="(item, index) in bookDetail.bean2List">
							<view v-if="index<2"><text>{{item.description}}：</text><ua-markdown style="display: inline-block;" :source="item.fieldVal"/></view>
						</template>
					</view>
				</view>
				<view>
					<template v-for="(item, index) in bookDetail.bean2List">
						<view v-if="index>=2" class="padding-lr-sm"><text>{{item.description}}：</text><ua-markdown style="display: inline-block;margin: 0 0 -6px;" :source="item.fieldVal"/></view>
					</template>
				</view>
			</template>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isVip" class="margin-lr margin-tb-sm radius">
			<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
		</view>
		<!-- #endif -->
		
		<!-- 馆藏信息 -->
		<view class="bg-white card-radius margin-top margin" v-if="collectionData">
			<scroll-view scroll-x class="bg-white nav card-radius" scroll-with-animation :scroll-left="scrollLeft">
				<view class="cu-item" :class="index==currentTab?'text-blue cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index">
					{{item}}
				</view>
			</scroll-view>
			<!-- 馆藏信息 -->
			<collectionList v-if="currentTab==0" :collection="collectionData"></collectionList>
			<view v-if="currentTab==1" class="padding-sm"><text v-if="bookAbstract">{{bookAbstract}}</text></view>
		</view>
		
		<!-- 相关借阅 -->
		<view class="bg-white card-radius margin-top margin" v-if="relatedBooks">
			<view class="padding-lr-sm text-xl flex justify-between">
				<view class="margin-top-sm">
					<text class="cuIcon-title text-green margin-right-xs"></text>相关借阅
				</view>
				<view class="action text-right"></view>
			</view>
			<bookSwiper :books="relatedBooks"></bookSwiper>
		</view>
				
				
	</view>
</template>

<script>
	const app = getApp()
	import api from '../../request/api'
	import collectionList from './components/collectionList.vue'
	import bookSwiper from './components/bookSwiper.vue'
	let interstitialAd = null
	export default {
		components: { collectionList, bookSwiper },
		data() {
			return {
				isVip: false,
				bookDefaultCover: 'https://r2.airmole.cn/i/2026/04/06/7po4-ll.jpg',
				recordId: '',
				bookDetail: '',
				countAndCover: '',
				foldInfoArea: false,
				tabList: ['馆藏信息', '详细书目'],
				currentTab: 0,
				scrollLeft: 0,
				collectionData: '',
				bookAbstract: '',
				relatedBooks: []
			}
		},
		onLoad(options) {
			this.isVip = app.globalData.isVip
			// #ifdef MP-WEIXIN
			if (wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-c142eaf344ea8f4b'
			})
			// #endif
			
			if (options.recordId) {
				this.recordId = options.recordId
				this.fetchBookDetail(options.recordId)
				this.fetchBookCollection(options.recordId)
			} else {
				uni.redirectTo({ url: '/pages/book/index' })
			}
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			fetchBookDetail (recordId) {
				uni.showLoading({ title: '加载中...' })
				api.fetchBookDetail(recordId).then(res => {
					console.log(res.data.data)
					this.bookDetail = res.data.data
					const baseInfo = res.data.data.baseMarcInfoDto
					this.getBookAbstract(res.data.data)
					this.fetchBookCountAndCover(recordId, baseInfo.title, baseInfo.isbn)
					this.fetchRelatedBooks(recordId, baseInfo.subject)
				}).catch(error => {
					uni.showToast({ title: '加载失败' })
					console.log(error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			fetchBookCountAndCover (recordId, title, isbn) {
				api.fetchBookCountAndCover(recordId, title, isbn).then(res => {
					this.countAndCover = res.data.data
				})
			},
			fetchBookCollection (recordId) {
				api.fetchBookCollection(recordId).then(res => {
					this.collectionData = res.data.data
				})
			},
			previewCover () {
				uni.previewImage({ urls: [this.countAndCover.duxiuImageUrl] })
			},
			showInfoArea () { this.foldInfoArea = !this.foldInfoArea },
			tabSelect(e) {
				this.currentTab = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			getBookAbstract (bookDetail) {
				for (var index = 0; index < bookDetail.bean2List.length; index++) {
					var element = this.bookDetail.bean2List[index]
					if (element.key == 'cnb96' || element.description == '提要文摘附注') {
						this.bookAbstract = element.fieldVal
						break
					}
				}
			},
			fetchRelatedBooks (recordId, subject) {
				api.fetchBookDetailRelated(recordId, subject, 1, 8).then(res => {
					this.relatedBooks = res.data.data.searchResult
					for (var index = 0; index < res.data.data.searchResult.length; index++) {
						let book = res.data.data.searchResult[index]
						api.fetchBookCountAndCover(book.recordId, book.title, book.isbn).then(rres => {
							book.countAndCover = rres.data.data
							this.relatedBooks[index] = book
							this.$set(this.relatedBooks[index], 'countAndCover', rres.data.data)
						})
					}
				})
			}
		},
		onShareAppMessage() {
			let title = this.bookDetail.clearTitle
			let query = `?recordId=${this.recordId}`
			let data = {
			  title: `图书【${title}】 - 贝壳小盒子`,
			  path: `/pages/book/detail${query}`
			}
			return data
		},
		onShareTimeline() {
			let title = this.bookDetail.clearTitle
			let query = `recordId=${this.recordId}`
			let data = {
				title: `图书【${title}】 - 贝壳小盒子`,
				query: query
			}
			return data
		}
	}
</script>

<style>
	.book-cover {
		height: 240rpx;
		width: 180rpx;
		overflow: clip;
	}
</style>