<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>{{title}}</view>
		</cu-custom>
		
		<template v-if="jsonStr !== ''">
			<!-- 图书信息 -->
			<view class="cu-list menu sm-border card-menu margin-top">
				<view class="cu-item">
					<view class="action">
						<text class="cuIcon-title text-cyan"></text> 图书信息
					</view>
					<view class="action">
						<text class="cuIcon-attentionfill line-cyan"> {{jsonStr.viewed}}次</text>
						<button @tap="showBookInfoChanged" class="cu-btn bg-white margin-left-xs"><text
								:class="`cuIcon-${showBookInfo?'unfold':'right'}`"></text></button>
					</view>
				</view>
				<template v-if="showBookInfo">
					<template v-for="(item, index) in jsonStr.intro" :key="index">
						<view class="cu-item"  v-if="item.content.length>0">
							<view class="content" style="min-width:220rpx;"><text class="text-grey">{{item.title}}</text></view>
							<view class="action"><text class="text-grey text-sm text-left">{{item.content}}</text></view>
						</view>
					</template>
				</template>
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
			
			<!-- 馆藏借阅信息 -->
			<view class="cu-list menu sm-border card-menu margin-top margin-bottom">
				<view class="cu-item">
					<view class="action">
						<text class="cuIcon-title text-cyan"></text> 馆藏信息(共{{jsonStr.collection.length}}本)
					</view>
					<view class="action">
						<button @tap="showCollectionChanged" class="cu-btn bg-white margin-left-xs"><text
								:class="`cuIcon-${showCollection?'unfold':'right'}`"></text></button>
					</view>
				</view>
				<template v-if="showCollection">
					<view class="cu-item" v-for="(item, index) in jsonStr.collection" :key="index">
						<view class="content padding-sm" style="color: #8B99A3;">
							<!-- 书刊状态 -->
							<view class="flex padding-tb-xs justify-between" v-if="item.status">
								<view class="basis-xxs"><text>书刊状态: </text></view>
								<view class="cu-capsule radius">
									<view :class="`cu-tag line-${item.status==='可借'?'cyan':'red'}`">
										<text :class="`cuIcon-${item.status==='可借'?'check':'close'}`"></text>
									</view>
									<view :class="`cu-tag bg-${item.status==='可借'?'cyan':'red'}`">{{item.status}}</view>
								</view>
							</view>
							<!-- 索书号 -->
							<view class="flex padding-tb-xs justify-between" v-if="item.callNo">
								<view class="basis-xxs"><text>索书号: </text></view>
								<view class="cu-capsule radius">
									<view class="cu-tag line-grey"><text class="cuIcon-tag"></text></view>
									<view class="cu-tag bg-grey">{{item.callNo}}</view>
								</view>
							</view>
							<!-- 馆藏地 -->
							<view class="flex padding-tb-xs justify-between" v-if="item.location">
								<view class="basis-xxs"><text>馆藏地: </text></view>
								<view class="cu-capsule radius" :data-place="item.location" @tap="goLibrary">
									<view class="cu-tag line-grey"><text class="cuIcon-locationfill"></text></view>
									<view class="cu-tag bg-grey">{{item.location}}</view>
								</view>
							</view>
							<!-- 条码号 -->
							<view class="flex padding-tb-xs justify-between" v-if="item.barCode">
								<view class="basis-xxs"><text>条码号: </text></view>
								<view class="fbasis-llg">{{item.barCode}}</view>
							</view>
							<!-- 年卷期 -->
							<view class="flex padding-tb-xs justify-between" v-if="item.volume">
								<view class="basis-xxs"><text>年卷期: </text></view>
								<view class="fbasis-llg">{{item.volume}}</view>
							</view>
							<!-- 还书位置 -->
							<view class="flex padding-tb-xs justify-between" v-if="item.returnLocation">
								<view class="basis-xxs"><text>还书位置: </text></view>
								<view class="cu-capsule radius" :data-place="item.returnLocation" @tap="goLibrary">
									<view class="cu-tag line-grey"><text class="cuIcon-locationfill"></text></view>
									<view class="cu-tag bg-grey">{{item.returnLocation}}</view>
								</view>
							</view>
						</view>
					</view>
				</template>
			</view>
			
			<!-- 期刊列表 -->
			<view class="cu-list menu sm-border card-menu margin-tb" v-if="jsonStr.journals.length">
				<view class="cu-item">
					<view class="action"><text class="cuIcon-title text-cyan"></text> 期刊列表</view>
					<view class="action">
						<button @tap="showJournalsChanged" class="cu-btn bg-white"><text
								:class="`cuIcon-${showJournals?'unfold':'right'}`"></text></button>
					</view>
				</view>
				<template v-if="showJournals">
					<template v-for="(item, index) in jsonStr.journals" :key="index">
						<view @click="showJournalList(index)" class="bg-gradual-blue text-center padding-xs">{{item.name}}<text v-if="!item.show">（点击展开查看）</text></view>
						<view class="bg-white" v-if="item.show || (index===0&&item.show==null)">
							<view class="solid-bottom padding-tb-xs text-gray" v-for="(itm, idx) in item.list" :key="idx">
								<view class="flex justify-between padding-lr">
									<view class="">{{itm.volume}}卷丨{{itm.period}}期</view>
									<view>总期：{{itm.totalPeriod?itm.totalPeriod:'/'}}</view>
								</view>
								<view class="flex justify-between padding-lr">
									<view class="">馆藏地：{{itm.location}}</view>
									<view>排架：{{itm.shelfPosition}}</view>
								</view>
								<view class="flex justify-between padding-lr">
									<view class="">状态：</view>
									<view class="">
										<view class='cu-tag line-red sm radius'>{{itm.status}}</view>
									</view>
								</view>
							</view>
						</view>
					</template>
				</template>
			</view>
			
			<!-- 借阅趋势图标 -->
			<view class="cu-list menu card-menu margin-tb">
				<view class="cu-item">
					<view class="action">
						<text class="cuIcon-title text-cyan"></text> 借阅趋势
					</view>
					<view class="action">
						<button @tap="showChartChanged" class="cu-btn bg-white"><text
								:class="`cuIcon-${showChart?'unfold':'right'}`"></text></button>
					</view>
				</view>
				<canvas v-show="showChart" canvas-id="lendTrendChart" id="lendTrendChart" class="charts bg-white" @touchend="tapChart" />
			</view>
			
			<!-- 相关书架图书 -->
			<view class="cu-list menu sm-border card-menu margin-tb" v-if="jsonStr.shelf.length > 0">
				<view class="cu-item">
				  <view class="action">
					<text class="cuIcon-title text-cyan"></text> 相关书架
				  </view>
				</view>
				<navigator :url="`/pages/book/shelf?id=${item.id}`" class="cu-item arrow" v-for="(item, index) in jsonStr.shelf" :key="index" :render-link="false">
				  <view class="content">
					<text class="cuIcon-goodsfavor text-cyan"></text>
					<text class="text-grey">{{item.name}}</text>
				  </view>
				  <view class="action">
					<text class="text-grey text-sm">{{item.count}}册书刊</text>
				  </view>
				</navigator>
			</view>

			
			<!-- 同名作者的其他书籍 -->
			<view class="cu-list menu sm-border card-menu margin-tb" v-if="sameAuthors && sameAuthors.length">
				<view class="cu-item">
					<view class="action">
						<text class="cuIcon-title text-cyan"></text> 同名作者其他著作
					</view>
					<view class="action">
						<button @tap="showSameAuthorChanged" class="cu-btn bg-white"><text
								:class="`cuIcon-${showSameAuthor?'unfold':'right'}`"></text></button>
					</view>
				</view>
				<template v-if="showSameAuthor">
					<navigator class="cu-item arrow" v-for="(sameAuthor, idx) in sameAuthors"
						:url="`./detail?code=${sameAuthor.marcNo}`" :key="idx" :render-link="false">
						<view class="content padding-tb-sm">
							<view class="text-cut" style="max-width: 600rpx;"><text class="cuIcon-read text-blue margin-right-xs"></text>{{sameAuthor.title}}</view>
							<view class="text-gray text-sm text-cut">
							  <text decode="true" user-select="true"><text class="cuIcon-people text-cyan margin-right-xs"></text>{{sameAuthor.publisher}}丨{{sameAuthor.publishDate}} \n <template v-if="sameAuthor.callNo"><text class="cuIcon-barcode text-cyan margin-right-xs"></text>索书号：<text class="text-cyan">{{sameAuthor.callNo}}</text></template>
							  </text>
							</view>
						</view>
					</navigator>
				</template>
			</view>
			
			<!-- 豆瓣、当当、微信读书 -->
			<view class="cu-list menu sm-border card-menu margin-tb" v-if="jsonStr.isbn && !isMpQQ">
			    <view class="cu-item">
			      <view class="action">
			        <text class="cuIcon-title text-cyan"></text> 其他相关资源
			      </view>
			    </view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="cu-item arrow" @click="goWechatBook">
				  <view class="content">
				    <image src="https://r2.airmole.cn/i/2025/04/27/17ndig-v8.jpg" class="png radius" mode="aspectFit"></image>
				    <text class="text-black">微信读书</text>
				  </view>
				  <view class="action">前往阅读</view>
				</view>
				<!-- #endif -->
			    <view class="cu-item arrow" @click="goToDouban">
			      <view class="content">
			        <image src="https://r2.airmole.cn/i/2025/04/27/s3qy1-93.ico" class="png radius" mode="aspectFit"></image>
			        <text class="text-black">豆瓣评分</text>
			      </view>
			      <view class="action">查看热评</view>
			    </view>
			    <view class="cu-item arrow" @click="goToDangdang">
			      <view class="content">
			        <image src="https://r2.airmole.cn/i/2025/04/27/s3uey-7d.ico" class="png radius" mode="aspectFit"></image>
			        <text class="text-black">当当图书</text>
			      </view>
			      <view class="action">前往购买</view>
			    </view>
			</view>
			
		</template>

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
				code: "",
				codeType: '',
				jsonStr: "",
				doubanStr: '',
				title: '',
				isbn: '',
				place: '',
				placeType: 0,
				showCollection: true,
				showBookInfo: true,
				showSameAuthor: true,
				showJournals: true,
				sameAuthors: '',
				lendTrend: '',
				cWidth: 750,
				cHeight: 300,
				showChart: true,
				isMpQQ: false,
			}
		},
		onLoad(options) {
			// #ifdef MP-WEIXIN
			if (wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif
			// #ifdef MP-QQ
			if (qq.createInterstitialAd) interstitialAd = qq.createInterstitialAd({ adUnitId: '8fe9b8e7191346a2ffb0c20c6bf3e0cf' })
			this.isMpQQ = true
			// #endif
			
			this.isVip = app.globalData.isVip
			uni.showLoading({ title: "等我加载一下~" })
			let codeType = options.codeType ? options.codeType : 'marc'
			this.code = options.code
			this.codeType = codeType
			if (codeType === 'marc') {
				this.getBookDetailByMarc(options.code)
				this.getSameAuthorBooks(options.code)
				this.getBookLendTrend(options.code)
			}
		},
		onReady() {
			this.cWidth = uni.upx2px(750)
			this.cHeight = uni.upx2px(300)
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			getBookDetailByMarc(marc) {
				api.fetchBookDetailByMarcNo(marc).then(res => {
					this.jsonStr = res.data
					this.title = this.getTitleFromBookInfo(res.data.intro)
					uni.hideLoading()
				}).catch(error => {
					console.log('fetchBookDetailByMarcNo catch', error)
					uni.showToast({
						title: '出错，暂不可用',
						icon: 'info'
					})
				}).finally(res => {
					uni.hideLoading()
				})
			},
			getSameAuthorBooks (marcNo) {
				api.fetchSameAuthorBooks(marcNo).then(res => {
					this.sameAuthors = res.data
				}).catch(error => {
					console.log('getSameAuthorBooks catch', error)
				})
			},
			getBookLendTrend (marcNo) {
				api.fetchBookLendTrend(marcNo).then(res => {
					this.lendTrend = res.data
					if (res.data && res.data.length) {
						const categories = []
						const data = []
						res.data.forEach((item, index) => {
							categories.push(item.year)
							data.push(item.y)
						})
						let chartOptionData = { categories: categories, series: [ { name: "借阅次数", data: data } ] }
						this.drawCharts('lendTrendChart', chartOptionData)
					}
				}).catch(error => {
					console.log('getBookLendTrend error', error)
				})
			},
			goLibrary(e) {
				console.log(e.currentTarget.dataset.place)
				var placeArr = ["理工馆", "社科馆"]
				var markerIdArr = [15, 14]
				var result = placeArr.indexOf(e.currentTarget.dataset.place.substr(0, 3))
				console.log(result)
				uni.navigateTo({
					url: `/pages/school/map?id=${markerIdArr[result]}`
				})
			},
			getTitleFromBookInfo(intro) {
				let title = ''
				let pattern = /(.*?)\//
				for (let index = 0; index < intro.length; index++) {
					const element = intro[index]
					if (element.title.indexOf('题名') >= 0) {
						let titleMatched = pattern.exec(element.content)
						title = titleMatched == null ? element.content : titleMatched[1]
						break
					}
				}
				return title
			},
			showCollectionChanged() {
				const currentValue = this.showCollection
				this.showCollection = !currentValue
			},
			showBookInfoChanged() {
				const currentValue = this.showBookInfo
				this.showBookInfo = !currentValue
			},
			showSameAuthorChanged() {
				const currentValue = this.showSameAuthor
				this.showSameAuthor = !currentValue
			},
			showJournalsChanged () {
				const currentValue = this.showJournals
				this.showJournals = !currentValue
			},
			showChartChanged () {
				const currentValue = this.showChart
				this.showChart = !currentValue
			},
			showJournalList (index) {
				const currentValue = (this.jsonStr.journals[index]&&this.jsonStr.journals[index].show) ? true : false
				if (currentValue) return
				this.jsonStr.journals[index].show = !currentValue
				const journals = this.jsonStr.journals
				for (var i = 0; i < journals.length; i++) {
					journals[i].show = index === i ? true : false
				}
				this.jsonStr.journals = journals
			},
			drawCharts(id,data) {
				// #ifndef MP-QQ
				const appBaseInfo = uni.getAppBaseInfo()
				const theme = appBaseInfo.theme ? appBaseInfo.theme : appBaseInfo.hostTheme
				// #endif
				// #ifdef MP-QQ
				const appBaseInfo = qq.getSystemInfoSync()
				const theme = appBaseInfo.theme ? appBaseInfo.theme : 'light'
				// #endif
				const min = Math.min(...data.series[0].data)
				const max = Math.max(...data.series[0].data)
			    const ctx = uni.createCanvasContext(id, this);
			    uChartsInstance[id] = new uCharts({
			        type: "area",
			        context: ctx,
			        width: this.cWidth,
			        height: this.cHeight,
			        categories: data.categories,
			        series: data.series,
					dataLabel: false,
			        animation: true,
			        background: theme === 'dark' ? '#000000' : '#ffffff',
			        padding: [15,50,0,0],
			        enableScroll: false,
			        legend: { show: false },
			        xAxis: { disableGrid: true},
			        yAxis: {
						gridType: "dash",
						splitNumber: 5,
						data: [{
							tofix: 1
						}]
					},
			        extra: {
			          area: {
			            type: "curve",
			            opacity: 0.2,
			            addLine: true,
			            width: 2,
			            gradient: true,
			            activeType: "hollow"
			          }
			        }
			    });
			},
			tapChart(e){
			  uChartsInstance[e.target.id].touchLegend(e)
			  uChartsInstance[e.target.id].showToolTip(e)
			},
			goToDouban () {
				if (!this.jsonStr.isbn) return
				uni.showLoading({ title: '加载中...' })
				api.fetchDoubanIdByISBN(this.jsonStr.isbn).then(res => {
					if (!res.data.doubanId) {
						uni.showToast({ title: '豆瓣未收录'})
						return
					}
					// #ifdef MP-WEIXIN
					wx.navigateToMiniProgram({
						appId: 'wx2f9b06c1de1ccfca', // 豆瓣评分
						path: `pages/subject/subject?id=${res.data.doubanId}&type=book`
					})
					// #endif
					// #ifdef H5
					window.open(`https://book.douban.com/subject/${res.data.doubanId}/`)
					// #endif
				}).catch(error => {
					uni.showToast({ title: '豆瓣未收录'})
					console.log('fetchDoubanIdByISBN', error)
				}).finally(() =>{
					uni.hideLoading()
				})
			},
			goToDangdang () {
				const keyword = (this.jsonStr.intro && this.jsonStr.intro[0].content) ? this.jsonStr.intro[0].content : this.jsonStr.isbn;
				// #ifdef MP-WEIXIN
				wx.navigateToMiniProgram({
				  appId: 'wx7bb576902363f4ff', // 当当购物
				  path: `pages/search/index?keyword=${keyword}`
				})
				return
				// #endif
				
				// #ifdef H5
				window.open(`https://search.dangdang.com/?key=${keyword}`)
				// #endif
			},
			goWechatBook () {
				const keyword = (this.jsonStr.intro && this.jsonStr.intro[0].content) ? this.jsonStr.intro[0].content : '';
				// #ifdef MP-WEIXIN
				wx.navigateToMiniProgram({
				  appId: 'wx8a5d6f9fad07544e', // 微信读书
				  path: `pages/search/main?keyword=${keyword}`
				})
				// #endif
			}
		}
	}
</script>

<style>
  .charts{
    width: 750rpx;
    height: 300rpx;
  }
</style>