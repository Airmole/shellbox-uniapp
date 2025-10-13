<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<view>开具发票</view>
	</cu-custom>
	<view v-if="isLogined">
		<scroll-view scroll-x class="bg-gradual-blue nav">
			<view class="flex text-center">
				<view :class="`cu-item flex-sub ${item.value==tab?'text-white cur':''}`" v-for="(item, index) in tabs"
					:key="index" @click="tabChanged" :data-index="index">{{item.title}}</view>
			</view>
		</scroll-view>

		<template v-if="tab == 'pending'">
			<!-- 查询年份选择区域 -->
			<view class="margin">
				<view class="cu-bar bg-white solid-bottom radius-top">
					<view class="action">
						<text class="cuIcon-title text-cyan"></text> 开票收费年度
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">年份</view>
					<picker mode="date" :value="year" fields="year" :end="year" @change="yearChange">
						<view class="picker"> {{year}} </view>
					</picker>
				</view>
				<view class="flex cu-form-group justify-end radius-bottom">
					<button @click="getDatalist('false', year)" class="cu-btn bg-cyan round shadow text-white">查找</button>
				</view>
			</view>
			<!-- 结果列表 -->
			<template v-for="(item, index) in datalist" :key="index">
				<view class="cu-card dynamic radius" v-if="item">
					<view class="cu-item shadow margin">
						<view class="cu-bar">
							<view class="action">
								<text class="cuIcon-titles text-cyan"></text>
								<text v-if="item.FeeRange" class="text-xl text-bold">{{item.Year}}{{item.FeeRange.Name}}{{item.ChargeProject.Name}}</text>
							</view>
						</view>
						<view class="text-content" style="max-height: unset;">
							<view class="flex">
								<view class="flex-sub"><text class="text-gray">应收金额：</text><text v-if="item.Amount" class="text-price">{{item.Amount.Amount}}</text></view>
								<view class="flex-sub"><text class="text-gray">实缴金额：</text><text class="text-price">{{item.Paid}}</text></view>
							</view>
							<view class="flex">
								<view class="flex-sub"><text class="text-gray">缓交金额：</text><text
										class="text-price">{{item.Delay}}</text>
								</view>
								<view class="flex-sub"><text class="text-gray">可抵扣金额：</text><text
										class="text-price">{{item.Deductible}}</text></view>
							</view>
							<view class="flex">
								<view class="flex-sub"><text class="text-gray">退费金额：</text><text
										class="text-price">{{item.Return}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</template>
		</template>
		<template v-else>
			<!-- 结果列表 -->
			<template v-for="(item, index) in datalist" :key="index">
				<view class="cu-card dynamic radius" v-if="item">
					<view class="cu-item shadow margin">
						<view class="cu-bar">
							<view class="action">
								<text class="cuIcon-titles text-cyan"></text>
								<text class="text-xl text-bold">票据号：{{item.cfinvoicenum}}</text>
							</view>
						</view>
						<view class="text-content" style="max-height: unset;">
							<view class="flex">
								<view class="flex-sub"><text class="text-gray">临时单号：</text><text
										class="">{{item.fnumber}}</text></view>
							</view>
							<view class="flex">
								<view class="flex-sub">
									<text class="text-gray">票据状态：</text>
									<text v-if="item.cfkpsate == '01'">未开票</text>
									<text v-else-if="item.cfkpsate == '02'">已开票</text>
									<text v-else-if="item.cfkpsate == '03'">作废</text>
									<text v-else-if="item.cfkpsate == '03'">红冲</text>
									<text v-else>{{item.cfkpsate}}</text>
								</view>
								<view class="flex-sub"><text class="text-gray">价税合计：</text><text
										class="text-price">{{item.total_money}}</text></view>
							</view>
							<view class="flex">
								<view class="flex-sub">
									<text class="text-gray">发票类型：</text>
									<text v-if="item.open_type == '0'">增值税专用发票</text>
									<text v-else-if="item.open_type == '2'">增值税普通发票</text>
									<text v-else-if="item.open_type == '32'">全电票普票</text>
									<text v-else-if="item.open_type == '51'">电子发票</text>
									<text v-else>{{item.open_type}}</text>
								</view>
							</view>
							<view class="flex">
								<view class="flex-sub"><text class="text-gray">开票日期：</text><text>{{item.showDate}}</text></view>
							</view>
							<view class="flex margin-top justify-end">
								<button @tap="showTargetModal" :data-index="index"
									class="cu-btn bg-cyan round shadow text-white margin-lr"> <text
										class="cuIcon-attention"></text> 查看</button>
								<!-- #ifdef MP-WEIXIN -->
								<button @tap="download" :data-index="index"
									class="cu-btn bg-cyan round shadow text-white margin-lr"> <text class="cuIcon-down"></text>
									下载</button>
								<!-- #endif -->
							</view>
						</view>
					</view>
				</view>
			</template>
		</template>
		<!-- 票据明细模态框 -->
		<view :class="`cu-modal ${showTarget ? 'show' : ''}`">
			<view class="cu-dialog bg-gray" v-if="datalist[target]">
				<view class="cu-bar bg-white justify-end">
					<view class="content">票据明细</view>
					<view class="action" @tap="closeTargetModal">
						<text class="cuIcon-close text-black"></text>
					</view>
				</view>
				<view class="padding-xl text-left">
					<view class="flex-sub">
						<text class="text-gray">发票类型：</text>
						<text v-if="datalist[target].open_type == '0'">增值税专用发票</text>
						<text v-else-if="datalist[target].open_type == '2'">增值税普通发票</text>
						<text v-else-if="datalist[target].open_type == '32'">全电票普票</text>
						<text v-else-if="datalist[target].open_type == '51'">电子发票</text>
						<text v-else>{{datalist[target].open_type}}</text>
					</view>
					<view class="flex">
						<view class="flex-sub"><text class="text-gray">票据号：</text><text
								class="">{{datalist[target].cfinvoicenum}}</text>
						</view>
					</view>
					<view class="flex">
						<view class="flex-sub"><text
								class="text-gray">开票日期：</text><text>{{datalist[target].showDate}}</text>
						</view>
						<view class="flex-sub"><text
								class="text-gray">缴款单位：</text><text>{{datalist[target].cfbuyername}}</text>
						</view>
					</view>
					<view class="flex">
						<view class="flex-sub" v-if="datalist[target].cfbankname"><text
								class="text-gray">购方开户银行：</text><text class="">{{datalist[target].cfbankname}}</text>
						</view>
					</view>
					<view class="flex">
						<view class="flex-sub" v-if="datalist[target].cfbankaccount"><text
								class="text-gray">购方银行账号：</text><text class="">{{datalist[target].cfbankaccount}}</text>
						</view>
					</view>
					<view class="flex">
						<view class="flex-sub" v-if="datalist[target].cfbuyeraddr"><text
								class="text-gray">地址：</text><text class="">{{datalist[target].cfbuyeraddr}}</text>
						</view>
					</view>
					<view class="flex">
						<view class="flex-sub" v-if="datalist[target].cfbuyerphone"><text
								class="text-gray">电话：</text><text class="">{{datalist[target].cfbuyerphone}}</text>
						</view>
					</view>
					<view class="flex">
						<view class="flex-sub" v-if="datalist[target].cfbuyeremail"><text
								class="text-gray">寄送电子邮箱：</text><text class="">{{datalist[target].cfbuyeremail}}</text>
						</view>
					</view>
					<view class="bg-white padding-sm margin-tb-sm" v-for="(item, index) in targetData" :key="index">
						<view class="flex">
							<view class="flex-sub"><text class="text-gray">规格：</text><text>{{item.cfspectype}} -
									{{item.cfgname}}</text>
							</view>
						</view>
						<view class="flex">
							<view class="flex-sub"><text class="text-gray">数量：</text><text>{{item.cfqty}}</text>
							</view>
							<view class="flex-sub"><text class="text-gray">金额：</text><text
									class="text-price">{{item.cfamount}}</text>
							</view>
						</view>
						<view class="flex">
							<view class="flex-sub"><text class="text-gray">税率：</text><text>{{item.cfrate}}%</text>
							</view>
							<view class="flex-sub"><text class="text-gray">税额：</text><text
									class="text-price">{{item.cfrate * 0.01 * item.cfamount}}</text>
							</view>
						</view>
					</view>
					<view class="flex">
						<view class="flex-sub"><text class="text-gray">金额合计：</text><text
								class="text-price">{{datalist[target].total_money}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>


		<view v-if="datalist.length == 0" class="margin-xl padding-xl text-center">
			<tips tips="没有符合条件的数据~"></tips>
		</view>
		<view v-else class="margin-bottom-xl padding-bottom-xl text-center">
			<view class="padding-xl margin-bottom-xl"><text class="text-black">到底啦~什么都没有了</text></view>
		</view>

	</view>
	<template v-else>
		<tips
			tips="开具缴费发票需登录账号"
			image="/static/image/nothing.png"
			:showButton="true"
			buttonText="立即登录"
			path="/pages/index/login"
		></tips>
	</template>
</template>

<script>
	const app = getApp()
	import api from '@/request/api.js'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	import { getPdfViewerUrl } from '@/request/index.js'
	let interstitialAd = null
	export default {
		data() {
			return {
				isVip: false,
				isLogined: true,
				tab: 'finished',
				tabs: [{
					title: '已开票',
					value: 'finished'
				}, {
					title: '待开票',
					value: 'pending'
				}],
				target: 0,
				showTarget: false,
				targetData: [],
				year: '',
				data: '',
				datalist: []
			}
		},
		onLoad() {
			this.isVip = app.globalData.isVip
			// #ifdef MP-WEIXIN
			if(wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif
			// #ifdef MP-QQ
			if (qq.createInterstitialAd) interstitialAd = qq.createInterstitialAd({ adUnitId: '8fe9b8e7191346a2ffb0c20c6bf3e0cf' })
			// #endif
			
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()
			this.inital()
		},
		methods: {
			inital: function(params) {
				const date = new Date()
				const thisYear = date.getFullYear()
				this.year = `${thisYear}`
				this.getDatalist('true', thisYear)
			},
			tabChanged(e) {
				const tab = this.tabs[e.currentTarget.dataset.index].value
				this.tab = tab
				const record = tab == 'pending' ? 'false' : 'true'
				this.getDatalist(record)
			},
			yearChange: function(e) {
				this.year = e.detail.value
			},
			getDatalist(record = 'false', year = '', page = 0, pagesize = 30) {
				uni.showLoading({ title: '等等，我加载下'})

				api.fetchFinasysInvoice(page, pagesize, record, year).then(res => {
					const datalist = record == 'false' ? res.data.data.data : this.formatAllDate(res.data.data.data)
					this.datalist = datalist
					this.data = res.data.data
				}).catch(error => {
					let title = 'error'
					if (error.data && error.data.message) title = error.data.message
					uni.showToast({
						title: title,
						icon: 'none'
					})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			getTargetDetail(cfid = '') {
				uni.showLoading({
					title: '等等，我加载下'
				})

				api.fetchFinasysInvoiceDetail(cfid).then(res => {
					this.targetData = res.data.data
					this.showTarget = true
				}).finally(() =>{
					uni.hideLoading()
				})
			},
			formatAllDate(array) {
				let result = []
				array.forEach(element => {
					const showDate = new Date(parseInt(element.cfkpdate.substr(6, 13))).toLocaleDateString()
					element.showDate = showDate
					result.push(element)
				})
				return result
			},
			showTargetModal(e) {
				const index = e.currentTarget.dataset.index
				const cfid = this.datalist[index].cfid
				this.target = index
				this.getTargetDetail(cfid)
			},
			closeTargetModal: function() {
				this.showTarget = false
			},
			download: function(e) {
				const index = e.currentTarget.dataset.index
				const invoce = this.datalist[index]
				if (invoce.cfinvoicefile.indexOf('dppt.tianjin.chinatax.gov.cn:8443') === -1) {
					uni.showToast({ title: '此电子发票已无法下载', icon: 'none'})
					return
				}
				uni.showLoading({ title: '下载中...'})
				// #ifdef MP-WEIXIN
				const manage = uni.getFileSystemManager()
				const fileName = invoce.cfinvoicecode + '_' + invoce.cfinvoicenum
				uni.downloadFile({
					url: invoce.cfinvoicefile,
					success(res) {
						uni.hideLoading()
						uni.openDocument({
							filePath: res.tempFilePath,
							fileType: 'pdf',
							showMenu: true
						})
					}
				})
				// #endif
			}
		},
		onShareAppMessage() {
			return {
			  title: `财务发票开具 - 贝壳小盒子`,
			  path: `/pages/finasys/invoiceApply`
			}
		},
		onShareTimeline() {
			return {
				title: `财务发票开具 - 贝壳小盒子`,
			}
		}
	}
</script>

<style>

</style>