<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>馆藏图书检索</view>
		</cu-custom>
		
		<!-- 关键字检索 -->
		<view class="padding-lr-sm bg-white margin-sm margin-tb  shadow card-radius padding-bottom">
		  <view class="padding-top">
		    <text class="cuIcon-titles text-green"></text>馆藏图书检索
		  </view>
		  <view class="cu-bar bg-white search">
		    <view class="search-form round">
		      <text class="cuIcon-search"></text>
		      <input type="text" placeholder="输入要检索的图书关键词" v-model="keyword" confirm-type="search"  @confirm="searchBook" :auto-focus="true"></input>
		      <text @click="goScanBook" class="cuIcon-scan"></text>
		    </view>
		  </view>
		  <radio-group class="block" @change="radioChange">
		    <view class="grid col-5 text-center margin-top-sm align-center">
				<view v-for="(item, index) in radioItems" :key="index">
					<label>
						<view class="text-sm">
						  <radio :value="item.value" :checked="item.checked"></radio> {{item.name}}
						</view>
					</label>
				</view>
		      <view><button class="cu-btn round bg-green shadow" @tap="searchBook">搜索</button></view>
		    </view>
		  </radio-group>
		</view>
	
		<view class="margin-tb-sm flex justify-center" v-show="searchResult === ''">
			<canvas canvas-id="keywordCloud" id="keywordCloud" class="charts" @touchend="tap"/>
		</view>
		<template v-if="searchResult === ''">
			<view class="bg-white margin-sm card-radius shadow" v-if="hotSimpleList">
				<scroll-view scroll-x class="bg-white nav card-radius">
					<view class="flex text-center">
						<view class="cu-item flex-sub" :class="index==currentHot?'text-blue cur':''" v-for="(item,index) in hotSimpleList" :key="index" @tap="hotTabChange" :data-id="index">
							{{hotSimpleList[index].title}}
						</view>
					</view>
				</scroll-view>
				<view class="cu-list menu sm-border card-radius">
				    <navigator class="cu-item arrow" v-for="(item, index) in hotSimpleList[currentHot].books" :url="`/pages/book/detail?code=${item.marcNo}`" :key="index" :render-link="false">
				        <view class="content text-cut"><text class="cuIcon-read text-grey"></text>{{item.title}}</view>
				    </navigator>
				</view>
			</view>
		</template>
		
		<tips v-if="searchResult !== '' && searchResult.total === 0" tips="没有找到符合条件的结果~"></tips>
		
		<template v-if="searchResult !== '' && searchResult.total > 0">			
			<view class="cu-list menu sm-border card-menu margin-top margin-bottom">
			    <navigator :url="`/pages/book/detail?code=${item.marcRecNo}`" class="cu-item arrow" v-for="(item, index) in searchResult.content" :key='index'>
			      <view class="content padding-tb-sm">
			        <view><text user-select="true">{{item.num}}.{{item.title}}</text></view>
			        <view class="text-gray text-sm">
			          <text :decode="true" user-select="true"><template v-if="item.author"><text class="cuIcon-people text-cyan margin-right-xs"></text>{{item.author}}丨{{item.publisher}}{{item.pubYear}}<text :decode="true">\n</text> </template><template v-if="item.callNo"><text class="cuIcon-barcode text-cyan margin-right-xs"></text>索书号：<text class="text-cyan">{{item.callNo}}</text></template>
			          </text>
			        </view>
			      </view>
			      <view class="action"></view>
			    </navigator>
			</view>
		</template>
		
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isVip" class="margin margin-tb-xl radius">
			<ad-custom unit-id="adunit-3d7f1704631ec7ea" ad-intervals="30"></ad-custom>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-QQ -->
		<view v-if="!isVip" class="margin margin-tb-xl radius">
			<ad unit-id="f0256a9d11d62920007be2d67178cdd3" type="card"></ad>
		</view>
		<!-- #endif -->
		
		<view class="padding"></view>
		
	</view>
</template>

<script>
	const app = getApp()
	import api from '../../request/api'
	import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js'
	var uChartsInstance = {}
	let interstitialAd = null
	export default {
		data() {
			return {
				isVip: false,
				cWidth: 750,
				cHeight: 500,
				searchType: '02',
				radioItems: [
				  { name: '书名', value: '02', checked: true },
				  { name: '作者', value: '03' },
				  { name: '主题', value: '04' },
				  { name: '出版社', value: '09' }
				],
				keyword: '',
				searchResult: '',
				keywordCloud: '',
				hotSimpleList: '',
				currentHot: 'lend',
			}
		},
		onLoad(options) {
			this.isVip = app.globalData.isVip
			// #ifdef MP-WEIXIN
			if(wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif
			// #ifdef MP-QQ
			if (qq.createInterstitialAd) interstitialAd = qq.createInterstitialAd({ adUnitId: '8fe9b8e7191346a2ffb0c20c6bf3e0cf' })
			// #endif

			if (options && options.type) {
				this.radioChange({ detail: { value: options.type } })
			}
			if (options && options.keyword) {
				this.keyword = options.keyword
				this.searchBook()
			}
			
			this.fetchKeywordCloud()
			this.fetchPopluarSimple()
		},
		onReady() {
			//这里的 750 对应 css .charts 的 width
			this.cWidth = uni.upx2px(750)
			//这里的 500 对应 css .charts 的 height
			this.cHeight = uni.upx2px(500)
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			searchBook: function () {
			    const searchType = this.searchType;
			    const keyword = this.keyword;
			    console.log(searchType, keyword);
			    if(keyword.length == 0){
			      uni.showToast({ title: '请输入检索关键字', icon: 'none' });
			      return
			    }
			    uni.showLoading({ title: '在找了在找了' })
				api.fetchBookSearch(searchType, keyword).then(res => {
					if (res.data.toString().indexOf('503 Service Unavailable') >= 0) {
						uni.showToast({ title: '学校系统不稳定，请稍后再试~', icon: 'none'})
						return
					}
					this.searchResult = res.data
					uni.hideLoading()
				}).catch(error => {
					uni.hideLoading()
					console.log('fetchBookSearch catch', error)
					uni.showToast({
						title: '哎呀~出错了~'
					})
				}).finally(res => {
					uni.hideLoading()
				})
			},
			radioChange: function (e) {
			    this.searchType = e.detail.value
			    var radioItems = this.radioItems;
			    for (var i = 0, len = radioItems.length; i < len; ++i) {
			      radioItems[i].checked = radioItems[i].value == e.detail.value
			    }
			    this.radioItems = radioItems
			},
			fetchKeywordCloud () {
				api.fetchOpacsysKeywordCloud().then(res => {
					this.keywordCloud = res.data
					let keywords = []
					if (res.data && res.data.list) {
						res.data.list.forEach((item) => {
							keywords.push({ name: item[0], textSize: item[1], data: null })
						})
					}
					this.drawKeywordCloudCharts('keywordCloud', keywords)
				}).catch(error => {
					console.log('fetchOpacsysKeywordCloud', error)
				})
			},
			fetchPopluarSimple () {
				api.fetchOpacsysHotRankSimple().then(res => {
					this.hotSimpleList = res.data
					console.log(res.data)
				}).catch(error => {
					console.log('fetchPopluarSimple error', error)
				})
			},
			drawKeywordCloudCharts(id, keywords) {
				// #ifndef MP-QQ
				const appBaseInfo = uni.getAppBaseInfo()
				const theme = appBaseInfo.theme ? appBaseInfo.theme : appBaseInfo.hostTheme
				// #endif
				// #ifdef MP-QQ
				const appBaseInfo = qq.getSystemInfoSync()
				const theme = appBaseInfo.theme ? appBaseInfo.theme : 'light'
				// #endif
				const ctx = uni.createCanvasContext(id, this)
				const _this = this
				uChartsInstance[id] = new uCharts({
			        type: "word",
			        context: ctx,
			        width: _this.cWidth,
			        height: _this.cHeight,
			        series: keywords,
			        animation: true,
			        enableScroll: false,
					background: theme === 'dark' ? '#000000' : '#ffffff',
			        extra: {
			          word: { type: "normal", autoColors: true }
			        }
			    });
			},
			tap(e){
			  const index = uChartsInstance[e.target.id].getCurrentDataIndex(e)
			  const keyword = this.keywordCloud.list[index][0]
			  console.log(keyword)
			  this.radioChange({ detail: { value: '02' } })
			  this.keyword = keyword
			  this.searchBook()
			},
			hotTabChange (e) {
				const index = e.currentTarget.dataset.id
				this.currentHot = index
			},
			goScanBook () {
				uni.navigateTo({ url: '/pages/book/scan' })
			}
		},
		onShareAppMessage() {
			let title = ''
			let query = `?type=${this.searchType}`
			if (this.keyword) {
				query = `${query}&keyword=${this.keyword}`
				title = `【${this.keyword}...】相关`
			}
			let data = {
			  title: `${title}馆藏图书检索 - 贝壳小盒子`,
			  path: `/pages/book/search${query}`
			}
			return data
		},
		onShareTimeline() {
			let title = ''
			let query = `type=${this.searchType}`
			if (this.keyword) {
				query = `${query}&keyword=${this.keyword}`
				title = `【${this.keyword}...】相关`
			}
			let data = {
				title: `${title}馆藏图书检索 - 贝壳小盒子`,
				query: query
			}
			return data
		}
	}
</script>

<style>
	.charts {
		width: 720rpx;
		height: 500rpx;
	}
</style>
