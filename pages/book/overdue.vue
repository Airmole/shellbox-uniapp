<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>超期欠款</view>
		</cu-custom>
		
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==currentTab?'text-blue cur':''" v-for="(item,index) in tabs" :key="index" @tap="tabChange" :data-id="index">
					{{item}}
				</view>
			</view>
		</scroll-view>
		
		<!-- 超期查询输入 -->
		<view class="cu-list menu margin-sm card-radius padding-xs bg-white">
			<view class="cu-item">
				<view class="action">
					<text class="cuIcon-search text-blue margin-right-xs"></text> 检索超期信息
				</view>
				<view class="action">
					<button @tap="displaySearchChange" class="cu-btn bg-white"><text :class="`cuIcon-${showSearch?'unfold':'right'}`"></text></button>
				</view>
			</view>
			<view class="flex justify-between align-center" v-if="showSearch">
				 <view class="cu-form-group">
					<view class="title">证件号</view>
					<input v-model="usercode" type="number" maxlength="9" placeholder="请输入学号或工号" name="usercode"></input>
				</view>
				<view class="padding-right-xs"><button @click="searchOverdue" class="cu-btn round bg-green shadow"><text class="cuIcon-search"></text>查询</button></view>
			</view>
		</view>
		<!-- 超期查询结果 -->
		<template v-if="searchResult!=='' && searchResult.length===0">
			<tips tips="用户不存在" image="/static/image/nothing.png"></tips>
		</template>
		<view v-if="searchResult.user" class="margin-sm bg-white card-radius">
			<view class="padding-sm">
				<text :decode="true">{{searchResult.type}}：{{searchResult.user}}&nbsp;的读者您好：\n</text>
				<text :decode="true" class="padding-left-xl">您有<text class="text-red">{{searchResult.fineCount}}</text>条欠款记录，共计<text class="text-red">{{searchResult.fineSum}}</text>元，</text>
				<text :decode="true"><text class="text-red">{{searchResult.overdueCount}}</text>条图书超期记录\n</text>
				<text>具体信息，请到图书馆进行核实！</text>
			</view>
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
	
		<view v-if="currentTab==0" class="text-center margin-top"><text>有欠款未缴纳</text></view>
		<view v-if="currentTab==1" class="text-center margin-top"><text>书已经超期，请及时归还</text></view>
		<view class="cu-list menu-avatar margin-lr-sm margin-top-xs card-radius">
			<view class="cu-item" v-for="(item, index) in list.data" :key="index">
				<view class="cu-avatar lg round bg-gradual-green"><text class="text-lg">{{item.name[0]}}</text></view>
				<!-- <view class="content text-cut"><view class="padding-left-xs"><text class="text-xl">{{item.name}}</text></view></view> -->
				<view class="content">
					<view class="text-grey">{{item.name}}</view>
					<view class="text-gray text-sm">
						<view class="text-cut">证件号：{{item.code}}丨单位：{{item.department}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 分页器 -->
		<view v-if="list && list.pagination" class="flex margin align-center text-center">
			<view class="flex-sub"><button v-if="list.pagination.current!=1" @click="lastPage" class="cu-btn round bg-gradual-blue">上一页</button></view>
			<view class="flex-sub">第{{list.pagination.current}}页丨共{{list.pagination.total}}页</view>
			<view class="flex-sub"><button v-if="list.pagination.current!=list.pagination.total" @click="nextPage" class="cu-btn round bg-gradual-blue">下一页</button></view>
		</view>
		
	</view>
</template>

<script>
	const app = getApp()
	import api from '../../request/api'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	let interstitialAd = null
	export default {
		data() {
			return {
				isVip: false,
				currentTab: 0,
				tabs: ['超期欠款', '超期催还'],
				showSearch: true,
				usercode: '',
				searchResult: '',
				list: ''
			}
		},
		onLoad() {
			this.isVip = app.globalData.isVip
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
			
			const userAccount = getEdusysAccount()
			this.usercode = userAccount ? userAccount.account : ''
			this.fetchFineList()
		},
		onReady() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
		},
		methods: {
			searchOverdue () {
				uni.showLoading({ title: '查找中...' })
				api.fetchOpacsysOverdueSearch(this.usercode).then(res => {
					this.searchResult = res.data
				}).catch(error => {
					uni.showToast({ title: '查询出错', icon: 'none' })
					console.log('searchOverdue error', error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			tabChange (e) {
				this.currentTab = e.currentTarget.dataset.id
				if (this.currentTab == 0) this.fetchOverdueList()
				if (this.currentTab == 1) this.fetchFineList()
			},
			displaySearchChange () {
				this.showSearch = !this.showSearch
			},
			fetchOverdueList (page = 1) {
				uni.showLoading({ title: '正在努力加载...' })
				api.fetchOpacsysOverdueList(page).then(res => {
					this.list = res.data
				}).catch(error => {
					uni.showToast({ title: '获取失败' })
					console.log('fetchOverdueList error', error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			fetchFineList (page = 1) {
				uni.showLoading({ title: '正在努力加载...' })
				api.fetchOpacsysExceedFine(page).then(res => {
					this.list = res.data
				}).catch(error => {
					uni.showToast({ title: '获取失败' })
					console.log('fetchFineList error', error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			lastPage () {
				const page = Number(this.list.pagination.current)
				if (page == 1) return
				if (this.currentTab == 0) this.fetchFineList(page-1)
				if (this.currentTab == 1) this.fetchOverdueList(page-1)
			},
			nextPage () {
				const page = Number(this.list.pagination.current)
				if (page == this.list.pagination.total) return
				if (this.currentTab == 0) this.fetchFineList(page+1)
				if (this.currentTab == 1) this.fetchOverdueList(page+1)
			}
		},
		onShareAppMessage() {
			let data = {
			  title: `图书超期欠款查询 - 贝壳小盒子`,
			  path: `/pages/book/overdue`
			}
			return data
		},
		onShareTimeline() {
			let data = {
				title: `图书超期欠款查询 - 贝壳小盒子`
			}
			return data
		}
	}
</script>

<style>
.cu-list.menu-avatar>.cu-item .content {
	position: absolute;
	left: 146upx;
	width: calc(100% - 96upx - 60upx - 20upx);
	line-height: 1.6em;
}
</style>
