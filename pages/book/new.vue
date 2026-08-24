<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>新书通报</view>
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
						<view class="content"><text class="text-grey">分类依据</text></view>
						<view class="action basis-lg">
							<radio-group class="block" @change="categoryTypeChange">
								<view class="grid col-2 margin-top-sm text-right">
									<view v-for="(item, index) in categoryTypes" :key="index">
										<label>
											<view class="text-sm">
											  <radio :value="item.value" :checked="item.value == categoryType"></radio> {{item.name}}
											</view>
										</label>
									</view>
								</view>
							  </radio-group>
						</view>
					</view>
					<view class="cu-item" v-if="categoryType=='0'">
						<view class="content"><text class="text-grey">学科分类</text></view>
						<view class="action">
							<picker @change="discodeChange" :value="discodeIndex" :range="discodeListOptions"
								range-key="name">
								<view class="picker">
									{{discodeIndex>-1?discodeListOptions[discodeIndex].name:'不限'}} <text class="cuIcon cuIcon-right"></text>
								</view>
							</picker>
						</view>
					</view>
					<view class="cu-item" v-if="categoryType=='1'">
						<view class="content"><text class="text-grey">图书分类</text></view>
						<view class="action">
							<picker @change="callNoChange" :value="callNoIndex" :range="callNoListOptions"
								range-key="name">
								<view class="picker">
									{{callNoIndex>-1?callNoListOptions[callNoIndex].name:'不限'}} <text class="cuIcon cuIcon-right"></text>
								</view>
							</picker>
						</view>
					</view>
					<view class="cu-item">
						<view class="content"><text class="text-grey">馆藏地</text></view>
						<view class="action">
							<picker @change="locationChange" :value="locationIndex" :range="locationListOptions"
								range-key="name">
								<view class="picker">
									{{locationIndex>-1?locationListOptions[locationIndex].name:'不限'}} <text class="cuIcon cuIcon-right"></text>
								</view>
							</picker>
						</view>
					</view>
					<view class="cu-item">
						<view class="content"><text class="text-grey">时间范围</text></view>
						<view class="action">
							<picker @change="timeRangeChange" :value="timeRangeIndex" :range="timeRangeOptions"
								range-key="name">
								<view class="picker">
									{{timeRangeIndex>-1?timeRangeOptions[timeRangeIndex].name:'不限'}} <text class="cuIcon cuIcon-right"></text>
								</view>
							</picker>
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
		
		<template v-if="booksList">
			<view class="bg-white margin card-radius">
				<template v-for="(book, index) in booksList.searchResult">
					<bookItem
					    :recordId="book.recordId"
						:title="`${book.title}`"
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
				<view class="flex-sub"><button @tap="lastPage" v-if="optionsForm.page>1" class="cu-btn round bg-gradual-blue">上一页</button></view>
				<view class="flex-twice text-center"><text>第{{optionsForm.page}}页丨共{{totalPage}}页</text></view>
				<view class="flex-sub text-right"><button @tap="nextPage" v-if="optionsForm.page<totalPage" class="cu-btn round bg-gradual-blue">下一页</button></view>
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
		components: { bookItem },
		data() {
			return {
				isVip: false,
				totalPage: '',
				booksList: '',
				foldOptionsArea: false,
				categoryType: 0,
				categoryTypes: [{ name: '学科分类', value: '0'}, { name: '中图法分类', value: '1'}],
				discodeIndex: -1,
				discodeListOptions: [],
				callNoIndex: -1,
				callNoListOptions: [],
				locationIndex: -1,
				locationListOptions: [],
				timeRangeIndex: -1,
				timeRangeOptions: [
					{ name: '最近一周', value: '1'},
					{ name: '最近一月', value: '2'},
					{ name: '最近两月', value: '3'},
					{ name: '最近三月', value: '4'},
					{ name: '最近半年', value: '5'},
					{ name: '最近一年', value: '6'},
					{ name: '最近两年', value: '7'},
				],
				optionsForm: {
					page: 1,
					rows: 10,
					callNo: '',
					disCode: '',
					locationId: '',
					time: '2'
				}
			}
		},
		onLoad(options) {
			this.isVip = app.globalData.isVip
			// #ifdef MP-WEIXIN
			if (wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-c142eaf344ea8f4b'
			})
			// #endif
			
			
			if (options.page) this.optionsForm.page = options.page
			if (options.rows) this.optionsForm.rows = options.rows
			if (options.callNo) this.optionsForm.callNo = options.callNo
			if (options.disCode) this.optionsForm.disCode = options.disCode
			if (options.locationId) this.optionsForm.locationId = options.locationId
			if (options.time) this.optionsForm.time = options.time
			this.fetchNewBooks(
				this.optionsForm.page,
				this.optionsForm.rows,
				this.optionsForm.disCode,
				this.optionsForm.callNo,
				this.optionsForm.time,
				this.optionsForm.locationId
			)
			this.fetchDictList()
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			fetchDictList () {
				api.fetchLibspDictList().then(res => {
					this.discodeListOptions = res.data.data.discode1
					this.callNoListOptions = res.data.data.classNo
					this.locationListOptions = res.data.data.locationId
				})
			},
			fetchNewBooks(page = 1, rows = 20, disCode, callNo, time = '2', locationId = '') {
				uni.showLoading({title: '加载中...'})
				api.fetchBookNew(page, rows, time, '1', disCode, callNo, locationId).then(res => {
					this.booksList = res.data.data
					this.totalPage = res.data.data.numFound == 0 ? 0 : Math.ceil((res.data.data.numFound / this.optionsForm.rows))
					// console.log(this.booksList)
					this.fetchBooksCovers(res.data)
				}).catch(error => {
					console.log(error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			fetchBooksCovers (result) {
				for (var index = 0; index < result.data.searchResult.length; index++) {
					let book = result.data.searchResult[index]
					api.fetchBookCountAndCover(book.recordId, book.title, book.isbn).then(res => {
						book.countAndCover = res.data.data
						this.booksList.searchResult[index] = book
						this.$set(this.booksList.searchResult[index], 'countAndCover', res.data.data)
					})
				}
			},
			showOptionsArea () { this.foldOptionsArea = !this.foldOptionsArea },
			resetOptionsForm () {
				this.optionsForm =  {
					page: 1,
					rows: 10,
					callNo: '',
					disCode: '',
					locationId: '',
					time: '2'
				}
				this.fetchNewBooks(
					this.optionsForm.page,
					this.optionsForm.rows,
					this.optionsForm.disCode,
					this.optionsForm.callNo,
					this.optionsForm.time,
					this.optionsForm.locationId
				)
			},
			categoryTypeChange (e) {
				this.categoryType = e.detail.value
			},
			discodeChange (e) {
				const index = e.detail.value
				this.discodeIndex = index
				this.optionsForm.disCode = this.discodeListOptions[index].code
			},
			callNoChange (e) {
				const index = e.detail.value
				this.callNoIndex = index
				this.optionsForm.callNo = this.callNoListOptions[index].code
			},
			locationChange (e) {
				const index = e.detail.value
				this.locationIndex = index
				this.optionsForm.locationId = this.locationListOptions[index].code
			},
			timeRangeChange (e) {
				const index = e.detail.value
				this.timeRangeIndex = index
				this.optionsForm.time = this.timeRangeOptions[index].value
			},
			search () {
				// 学科分类筛选
				if (this.categoryType == '0') this.optionsForm.callNo = ''
				// 中图法分类筛选
				if (this.categoryType == '1') this.optionsForm.disCode = ''
				this.fetchNewBooks(
					this.optionsForm.page,
					this.optionsForm.rows,
					this.optionsForm.disCode,
					this.optionsForm.callNo,
					this.optionsForm.time,
					this.optionsForm.locationId
				)
			},
			lastPage () {
				let page = this.optionsForm.page - 1
				if (page <= 1) page = 1
				this.optionsForm.page = page
				const obj2Query = obj => Object.entries(obj).map(([k, v]) => `${k}=${v}`).join('&')
				const queryString = obj2Query(this.optionsForm)
				uni.navigateTo({ url: `/pages/book/newBook?${queryString}` })
			},
			nextPage () {
				let page = parseInt(this.optionsForm.page) + 1
				if (page >= this.totalPage) page = this.totalPage
				this.optionsForm.page = page
				const obj2Query = obj => Object.entries(obj).map(([k, v]) => `${k}=${v}`).join('&')
				const queryString = obj2Query(this.optionsForm)
				uni.navigateTo({ url: `/pages/book/newBook?${queryString}` })
			}
		},
		onShareAppMessage() {
			const obj2Query = obj => Object.entries(obj).map(([k, v]) => `${k}=${v}`).join('&')
			const queryString = obj2Query(this.optionsForm)
			let query = `?${queryString}`
			let data = {
			  title: `新书榜 - 贝壳小盒子`,
			  path: `/pages/book/newBook${query}`
			}
			return data
		},
		onShareTimeline() {
			const obj2Query = obj => Object.entries(obj).map(([k, v]) => `${k}=${v}`).join('&')
			const queryString = obj2Query(this.optionsForm)
			let query = `${queryString}`
			let data = {
				title: `新书榜 - 贝壳小盒子`,
				query: query
			}
			return data
		}
	}
</script>

<style>

</style>