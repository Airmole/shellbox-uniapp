<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>馆藏图书检索</view>
		</cu-custom>
		
		<!-- 关键字检索 -->
		<view class="padding-lr-sm bg-white margin-sm margin-tb-xl  shadow card-radius padding-bottom">
		  <view class="padding-top">
		    <text class="cuIcon-titles text-green"></text>馆藏图书检索
		  </view>
		  <view class="cu-bar bg-white search">
		    <view class="search-form round">
		      <text class="cuIcon-search"></text>
		      <input type="text" placeholder="输入要检索的图书关键词" v-model="keyword" confirm-type="search"  @confirm="searchBook" :auto-focus="true"></input>
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
		
		<tips v-if="searchResult !== '' && searchResult.total === 0" tips="没有找到符合条件的结果~"></tips>
		
		<template v-if="searchResult !== '' && searchResult.total > 0">			
			<view class="cu-list menu sm-border card-menu margin-top margin-bottom">
			    <navigator :url="`/pages/book/detail?code=${item.marcRecNo}`" class="cu-item arrow" v-for="(item, index) in searchResult.content" :key='index'>
			      <view class="content padding-tb-sm">
			        <view><text user-select="true">{{item.title}}</text></view>
			        <view class="text-gray text-sm">
			          <text decode="true" user-select="true"><text class="cuIcon-people text-cyan"></text>{{item.author}} \n <text class="cuIcon-barcode text-cyan"></text>索书号：<text class="text-cyan">{{item.callNo}}</text>
			          </text>
			        </view>
			      </view>
			      <view class="action"></view>
			    </navigator>
			</view>
		</template>
		
		<!-- #ifdef MP-WEIXIN -->
		<view class="margin margin-tb-xl radius">
			<ad-custom unit-id="adunit-3d7f1704631ec7ea" ad-intervals="30"></ad-custom>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-QQ -->
		<view class="margin margin-tb-xl radius">
			<ad unit-id="f0256a9d11d62920007be2d67178cdd3" type="card"></ad>
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
				searchType: '02',
				radioItems: [
				  { name: '书名', value: '02', checked: true },
				  { name: '作者', value: '03' },
				  { name: '主题', value: '04' },
				  { name: '出版社', value: '09' }
				],
				keyword: '',
				searchResult: ''
			}
		},
		onLoad(options) {
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
		},
		onShow() {
			if (interstitialAd) interstitialAd.show()
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

</style>
