<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>热门借阅排行</view>
		</cu-custom>
		
		<view class="margin">
			<view :class="'cu-list menu sm-border '+(foldOptionsArea?'round':'card-radius')">
				<view class="cu-item press-class" @click="showOptionsArea">
					<view class="content">
						<text class="cuIcon-title text-green"></text> 筛选查询
					</view>
					<view class="action text-right">
						<text :class="'cuIcon-'+(foldOptionsArea?'right':'unfold')"></text>
					</view>
				</view>
				<template v-if="!foldOptionsArea">
					<view class="cu-item">
						<view class="content"><text class="text-grey">学科分类</text></view>
						<view class="action">
							<picker @change="discodeChange" :value="discodeIndex" :range="discodeListOptions"
								range-key="name">
								<view class="picker">
									{{discodeIndex>-1?discodeListOptions[discodeIndex].name:'全部'}} <text class="cuIcon cuIcon-right"></text>
								</view>
							</picker>
						</view>
					</view>
					<view class="cu-item">
						<view class="content"><text class="text-grey">统计时间范围</text></view>
						<view class="action">
							<picker @change="statRangeChange" :value="statRangeIndex" :range="statRangeOptions"
								range-key="name">
								<view class="picker">
									{{statRangeIndex>-1?statRangeOptions[statRangeIndex].name:''}} <text class="cuIcon cuIcon-right"></text>
								</view>
							</picker>
						</view>
					</view>
					<view class="cu-item">
						<view class="content"><text class="text-grey">排序依据</text></view>
						<view class="action basis-lg">
							<radio-group class="block" @change="sortTypeChange">
								<view class="grid col-2 margin-top-sm text-right">
									<view v-for="(item, index) in sortTypeOptions" :key="index">
										<label>
											<view class="text-sm">
											  <radio :value="item.value" :checked="item.value == optionsForm.sortType"></radio> {{item.name}}
											</view>
										</label>
									</view>
								</view>
							  </radio-group>
						</view>
					</view>
					<view class="cu-item">
						<view></view>
						<view class="action">
							<button @tap="resetOptionsForm" class="cu-btn round bg-red shadow margin-lr"><text
									class="cuIcon cuIcon-refresh"></text> 重置</button>
							<button @tap="search" class="cu-btn round bg-green shadow"><text
									class="cuIcon cuIcon-search"></text> 查询</button>
						</view>
					</view>
				</template>
			</view>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isVip" class="margin-lr margin-tb-sm radius">
			<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
		</view>
		<!-- #endif -->
		
		<view class="bg-white margin card-radius">
			<template v-for="(book, index) in books">
				<bookItem
				    :recordId="book.recordId"
					:title="`${index+1}. ${book.title}`"
					:cover="book.countAndCover ? book.countAndCover.duxiuImageUrl : bookDefaultCover"
					:author="book.author"
					:publisher="book.publish"
					:publishYear="book.pubDate"
					:isbn="book.isbn"
					:callNo="book.callNo"
					:bottomText="`借阅次数：${book.loanCount} 丨 借阅比：${book.loanRate}`"
				></bookItem>
			</template>
		</view>
		
		
	</view>
</template>

<script>
	const app = getApp()
	import api from '../../request/api'
	import bookItem from './components/bookItem.vue'
	let interstitialAd = null
	export default {
		components: { bookItem },
		data() {
			return {
				isVip: false,
				bookDefaultCover: 'https://r2.airmole.cn/i/2026/04/06/7po4-ll.jpg',
				books: [],
				foldOptionsArea: false,
				optionsForm: {
					disCode: '',
					statRange: 30,
					sortType: 1
				},
				discodeIndex: -1,
				discodeListOptions: [],
				statRangeIndex: 1,
				statRangeOptions: [
					{ name: '最近一周', value: 7 },
					{ name: '最近一月', value: 30 },
					{ name: '最近一季', value: 90 },
					{ name: '最近一年', value: 365 }
				],
				sortTypeOptions: [
					{ name: '借阅次数', value: '1' },
					{ name: '借阅比', value: '2' }
				]
			}
		},
		onLoad() {
			this.isVip = app.globalData.isVip
			// #ifdef MP-WEIXIN
			if (wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-c142eaf344ea8f4b'
			})
			// #endif
			
			this.fetchRankList()
			this.fetchDictList()
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			fetchDictList () {
				api.fetchLibspDictList().then(res => {
					this.discodeListOptions = res.data.data.discode1
				})
			},
			search () {
				this.fetchRankList(1, 10, this.optionsForm.disCode, this.optionsForm.statRange, this.optionsForm.sortType)
			},
			fetchRankList (page = 1, rows = 10, disCode = '', statRange = 30, sortType = 1) {
				uni.showLoading({ title: '加载中...' })
				api.fetchBookHotBorrow(page, rows, disCode, statRange, 0, '', sortType).then(res => {
					// console.log(res.data)
					this.books = res.data.data.result
					for (var index = 0; index < this.books.length; index++) {
						let book = this.books[index]
						api.fetchBookCountAndCover(book.recordId, book.title, book.isbn).then(rres => {
							book.countAndCover = rres.data.data
							this.books[index] = book
							this.$set(this.books[index], 'countAndCover', rres.data.data)
						})
					}
				}).catch(error => {
					uni.showToast({ title: '获取失败', icon: 'none'})
					console.log(error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			showOptionsArea () { this.foldOptionsArea = !this.foldOptionsArea },
			resetOptionsForm () {
				this.optionsForm =  {
					disCode: '',
					statRange: 30,
					sortType: '1'
				}
				this.search()
			},
			discodeChange (e) {
				const index = e.detail.value
				this.discodeIndex = index
				this.optionsForm.disCode = this.discodeListOptions[index].code
			},
			statRangeChange (e) {
				const index = e.detail.value
				this.statRangeIndex = index
				this.optionsForm.statRange = this.statRangeOptions[index].value
			},
			sortTypeChange (e) {
				const sortType = e.detail.value
				this.optionsForm.sortType = sortType
			}
		},
		onShareAppMessage() {
			let data = {
			  title: `图书馆热门借阅书单 - 贝壳小盒子`,
			  path: `/pages/book/rank`
			}
			return data
		},
		onShareTimeline() {
			let query = ``
			let data = {
				title: `图书馆热门借阅书单 - 贝壳小盒子`,
				query: query
			}
			return data
		}
	}
</script>

<style>

</style>