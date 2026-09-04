<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>当前借阅</view>
		</cu-custom>
		<scroll-view scroll-x class="bg-gradual-blue nav text-center">
			<view class="cu-item" :class="index==typeIndex?'text-black cur':''" v-for="(item, index) in typeTabs" :key="index" @tap="typeTabChange" :data-id="index">
				{{item}}
			</view>
		</scroll-view>
		
		<!-- 筛选面板 -->
		<view :class="`cu-list menu sm-border card-menu shadow margin-top shadow ${foldOptionsArea?'round':'card-radius'}`">
			<view :class="`cu-bar bg-white solid-bottom ${foldOptionsArea?'round':''}`" @click="showOptionsArea">
				<view class="action">
					<text class="cuIcon-title text-green"></text> 筛选操作
				</view>
				<view class="action text-right">
					<text :class="'cuIcon-'+(foldOptionsArea?'right':'unfold')"></text>
				</view>
			</view>
			<template v-if="!foldOptionsArea">
				<view class="cu-form-group">
					<view class="title">搜索类别</view>
					<picker @change="searchTypeChange" :value="searchTypeIndex" :range="searchTypeOptions" range-key="label">
						<view class="picker">
							{{searchTypeIndex!==null?searchTypeOptions[searchTypeIndex].label:'题名'}}
						</view>
					</picker>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">搜索关键字</text>
					</view>
					<view class="action text-right">
						<input placeholder="请输入筛选检索关键字" name="course" v-model="optionsForm.searchContent" />
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">开始日期</view>
					<picker mode="date" :value="optionsForm.startDate" @change="startDateChange">
						<view class="picker">
							{{optionsForm.startDate?optionsForm.startDate:'不限'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">结束日期</view>
					<picker mode="date" :value="optionsForm.endDate" @change="endDateChange">
						<view class="picker">
							{{optionsForm.endDate?optionsForm.endDate:'不限'}}
						</view>
					</picker>
				</view>
				<view class="cu-item">
					<view class="content"></view>
					<view class="action">
						<button @click="resetOptionsForm" class="cu-btn round bg-red shadow margin-lr"><text
								class="cuIcon cuIcon-refresh"></text> 重置</button>
						<button @click="fetchLoanList" class="cu-btn round bg-green shadow"><text
								class="cuIcon cuIcon-search"></text> 查询</button>
					</view>
				</view>
			</template>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isVip" class="margin-lr margin-tb-sm radius">
			<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
		</view>
		<!-- #endif -->
				
		<view class="cu-bar bg-white solid-bottom margin round margin-top-xl" v-if="loanList && loanList.loanNum">
			<view class="action">
				<text class="cuIcon-title text-green"></text> 当前剩余可借阅书
			</view>
			<view class="action text-right">
				<text class="text-green">{{loanList.loanNum}}</text>本
			</view>
		</view>
		
		<template v-if="!isLogined">
			<tips tips="查询借阅图书需登录账号" image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif" :showButton="true" buttonText="现在登录"
				path="/pages/index/login"></tips>
		</template>
		<template v-else>
			<template v-if="loanList !== '' && loanList.numFound == 0">
				<tips :tips="`当前没有正在借阅的${typeTabs[typeIndex]}`" image="/static/image/nothing.png"></tips>
			</template>
			<template v-if="loanList !== '' && loanList.numFound > 0">
				<view class="flex justify-start margin">
					<button @click="showBatchRenewModal=true" class="cu-btn round bg-green" :disabled="!loanList || !loanList.searchResult">批量续借</button>
				</view>
				<view class="cu-list menu sm-border card-menu shadow margin-top shadow bg-white" v-if="loanList && loanList.numFound">
					<view class="cu-bar bg-white solid-bottom">
						<view class="action">
							<text class="cuIcon-title text-green"></text> 当前借阅
						</view>
						<view class="action"><text class="text-xl margin-lr-xs">{{loanList.numFound}}</text>条</view>
					</view>
					<template class="bg-white" v-for="(book, index) in loanList.searchResult" :key="index">
						<bookItem
						    :recordId="book.recordId"
							:title="book.title"
							:author="book.author"
							:publisher="book.publisher"
							:publishYear="book.publishYear"
							:loanDate="book.loanDate"
							:normReturnDate="book.normReturnDate"
							:book="book"
							:showRenew="true"
							:goBookDetail="false"
							@click="clickBookItem"
							@renewBook="renewBookItem"
						></bookItem>
					</template>
				</view>
			</template>
			<!-- 分页器 -->
			<view class="flex justify-between padding-lr-sm margin-top align-center" v-if="loanList && loanList.searchResult">
				<view class="flex-sub"><button @tap="lastPage" v-if="optionsForm.page>1" class="cu-btn round bg-gradual-blue">上一页</button></view>
				<view class="flex-twice text-center"><text>第{{optionsForm.page}}页丨共{{loanList.lastPage}}页</text></view>
				<view class="flex-sub text-right"><button @tap="nextPage" v-if="optionsForm.page<loanList.lastPage" class="cu-btn round bg-gradual-blue">下一页</button></view>
			</view>
		</template>
		
		<!-- 借阅详情模态框 -->
		<view class="cu-modal" :class="loanDetailIndex!==null?'show':''">
			<view class="cu-dialog bg-gray">
				<view class="cu-bar bg-gray justify-end">
					<view class="content">当前借阅</view>
					<view class="action" @tap="hideDetail">
						<text class="cuIcon-close text-red"></text>
					</view> 
				</view>
				<view class="text-left padding-sm bg-gray">
					<swiper :indicator-dots="true" :autoplay="false" :current="loanDetailIndex" style="height: 1000rpx;" class="bg-white">
							<swiper-item v-for="(detail, detailIndex) in loanList.searchResult" :key="detailIndex">
								<view class="swiper-item">
									<view class="cu-list menu sm-border">
										<view class="cu-item arrow">
											<view class="content" style="min-width: 30%;"><text class="text-grey">题名</text></view>
											<view @tap="goBookDetail" class="action text-blue text-right" style="max-width: 500rpx;"><view>{{detail.title}}</view></view>
										</view>
										<view class="cu-item">
											<view class="content" style="min-width: 30%;"><text class="text-grey">责任者</text></view>
											<view class="action" style="max-width: 500rpx;"><view>{{detail.author}}</view></view>
										</view>
										<view class="cu-item">
											<view class="content" style="min-width: 30%;"><text class="text-grey">借阅日期</text></view>
											<view class="action" style="max-width: 500rpx;"><view>{{detail.loanDate}}</view></view>
										</view>
										<view class="cu-item arrow">
											<view class="content" style="min-width: 30%;"><text class="text-grey">应还日期</text></view>
											<view @click="checkAddCalendarPermisson" class="action text-right text-blue" style="max-width: 500rpx;"><view>{{detail.normReturnDate}}</view></view>
										</view>
										<view class="cu-item" v-if="detail.yearVol">
											<view class="content" style="min-width: 30%;"><text class="text-grey">年卷期</text></view>
											<view class="action" style="max-width: 500rpx;"><view>{{detail.yearVol}}</view></view>
										</view>
										<view class="cu-item arrow" v-if="detail.yearVol">
											<view class="content" style="min-width: 30%;"><text class="text-grey">馆藏地</text></view>
											<view @click="goLibrary" class="action text-blue" style="max-width: 500rpx;"><view>{{detail.locationName}}</view></view>
										</view>
										<view class="cu-item" v-if="detail.yearVol">
											<view class="content" style="min-width: 30%;"><text class="text-grey">索书号</text></view>
											<view class="action" style="max-width: 500rpx;"><view>{{detail.callNo}}</view></view>
										</view>
										<view class="cu-item" v-if="detail.yearVol">
											<view class="content" style="min-width: 30%;"><text class="text-grey">ISBN</text></view>
											<view class="action" style="max-width: 500rpx;"><view>{{detail.isbn}}</view></view>
										</view>
										<view class="cu-item" v-if="detail.yearVol">
											<view class="content" style="min-width: 30%;"><text class="text-grey">条码号</text></view>
											<view class="action" style="max-width: 500rpx;"><view>{{detail.barcode}}</view></view>
										</view>
										<view class="cu-item" v-if="detail.yearVol">
											<view class="content" style="min-width: 30%;"><text class="text-grey">续借次数</text></view>
											<view class="action" style="max-width: 500rpx;"><view>{{detail.renewTimes}}</view></view>
										</view>
										<view class="cu-item" v-if="detail.yearVol">
											<view class="content" style="min-width: 30%;"><text class="text-grey">被预约</text></view>
											<view class="action" style="max-width: 500rpx;"><view>{{detail.isRequested}}</view></view>
										</view>
									</view>
								</view>
							</swiper-item>
						</swiper>
						<view v-if="loanList && loanList.searchResult.length>1" class="padding-top-sm text-center"><text>左右滑动可切换</text></view>
				</view>
			</view>
		</view>
		
		<!-- 续借结果模态框 -->
		<view class="cu-modal" :class="renewResult!==''?'show':''">
			<view class="cu-dialog bg-gray">
				<view class="cu-bar bg-gray justify-end">
					<view class="content">续借结果</view>
					<view class="action" @tap="renewResult=''">
						<text class="cuIcon-close text-red"></text>
					</view> 
				</view>
				<view class="bg-gray">
					<view class="bg-white margin card-radius padding">
						<view class="text-center text-xl flex justify-around">
							<view>续借成功：<text class="text-green margin-lr-xs">{{renewResult.success}}</text>条</view>
							<view>续借失败：<text class="text-red margin-lr-xs">{{renewResult.fail}}</text>条</view>
						</view>
						<view v-for="(item, index) in renewResult.result" class="flex flex-direction margin-tb-sm">
							<view>《{{index}}》</view>
							<view class="text-red">{{item}}</view>
						</view>
					</view>
					<view class="margin">
						<button @click="renewResult=''" class="cu-btn round bg-green">确认</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 批量续借模态框 -->
		<view class="cu-modal" :class="showBatchRenewModal?'show':''">
			<view class="cu-dialog bg-gray">
				<view class="cu-bar bg-gray justify-end">
					<view class="content">批量续借</view>
					<view class="action" @tap="showBatchRenewModal=false">
						<text class="cuIcon-close text-red"></text>
					</view> 
				</view>
				<view class="bg-gray padding-bottom-sm">
					<view class="padding-sm text-left">请选择您要续借的图书：</view>
					<view class="bg-white margin-xs card-radius">
						<checkbox-group class="block" @change="batchRenewChange">
							<label v-for="(item, index) in batchRenewList" :key="index">
								<view class="cu-form-group" >
									<view class="title text-cut">{{item.title}}({{item.normReturnDate}}还)</view>
									<checkbox class="round green" :class="item.checked?'checked':''" :value="item.loanId" :checked="item.checked"></checkbox>
								</view>
							</label>
						</checkbox-group>
					</view>
					<view class="flex justify-center margin-top">
						<button @click="batchRenew" class="cu-btn round bg-gradual-green">续借图书</button>
					</view>
				</view>
			</view>
		</view>
		
		<template v-if="errorMessage">
			<tips :tips="errorMessage" image="/static/image/nothing.png" :showButton="true" buttonText="返回"
				path="/pages/index/feature"></tips>
		</template>
		
	</view>
</template>

<script>
	const app = getApp()
	import api from '@/request/api.js'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	import { navigateToPlace } from '@/common/utils/location.js'
	import { addPhoneCalendarEvent } from '@/common/utils/phone-calendar.js'
	import bookItem from './components/bookItem.vue'
	export default {
		components:{ bookItem },
		data() {
			return {
				isVip: false,
				isLogined: true,
				typeIndex: 0,
				typeTabs: ['图书', '现刊'],
				foldOptionsArea: false,
				searchTypeIndex: 0,
				searchTypeOptions: [
					{ label: '题名', value: 1 },
					{ label: '责任者', value: 2 },
					{ label: '条码号', value: 3 },
				],
				optionsForm: {
					searchType: 1,
					searchContent: '',
					page: 1,
					rows: 10,
					startDate: null,
					endDate: null
				},
				loanList: '',
				loanDetailIndex: null,
				renewResult: '',
				showBatchRenewModal: false,
				batchRenewList: [],
				batchRenewIds: [],
				errorMessage: '',
			}
		},
		onLoad() {
			this.isVip = app.globalData.isVip
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
			
			this.fetchLoanList()
		},
		methods: {
			typeTabChange (e) {
				this.typeIndex = e.currentTarget.dataset.id
				this.searchTypeIndex = 0
				if (this.typeIndex == 0) {
					this.searchTypeOptions = [
						{ label: '题名', value: 1 },
						{ label: '责任者', value: 2 },
						{ label: '条码号', value: 3 }
					]
				} else if (this.typeIndex == 1) {
					this.searchTypeOptions = [
						{ label: '题名', value: 1 },
						{ label: 'ISSN', value: 4 },
					]
				} else {
					this.searchTypeOptions = [
						{ label: '题名', value: 1 },
						{ label: '责任者', value: 2 },
						{ label: '条码号', value: 3 },
						{ label: 'ISSN', value: 4 },
					]
				}
			},
			showOptionsArea () {
				this.foldOptionsArea = !this.foldOptionsArea
			},
			searchTypeChange (e) {
				const index = e.detail.value
				this.searchTypeIndex = index
				this.optionsForm.searchType = this.searchTypeOptions[index].value
			},
			startDateChange (e) {
				const value = e.detail.value
				this.optionsForm.startDate = value
			},
			endDateChange (e) {
				const value = e.detail.value
				this.optionsForm.endDate = value
			},
			resetOptionsForm () {
				this.optionsForm = {
					searchType: 1,
					searchContent: '',
					page: 1,
					rows: 10,
					startDate: null,
					endDate: null
				}
				this.searchTypeIndex = 0
			},
			fetchLoanList () {
				if (!this.isLogined) {
					uni.showToast({ title: '需要登录', icon: 'none' })
					return
				}
				
				uni.showLoading({ title: '正在加载...' })
				const isIssue = this.typeIndex === 1 ? true: false
				api.fetchLibspLoanList(
				    isIssue,
					this.optionsForm.searchType,
					this.optionsForm.searchContent,
					this.optionsForm.page,
					this.optionsForm.rows,
					0,
					this.optionsForm.startDate,
					this.optionsForm.endDate
				).then(res => {
					if (res.data.data) {
						const lastPage = Math.ceil(res.data.data.numFound / this.optionsForm.rows)
						res.data.data.lastPage = lastPage
						let batchRenewList = []
						for (var i = 0; i < res.data.data.searchResult.length; i++) {
							const element = res.data.data.searchResult[i]
							batchRenewList.push({
								title: element.title,
								normReturnDate: element.normReturnDate,
								loanId: element.loanId,
								checked: false
							})
						}
						this.batchRenewList = batchRenewList
						this.loanList = res.data.data
					}
				}).catch(error => {
					this.errorMessage = error.data.message
				}).finally(() => {
					uni.hideLoading()
				})
			},
			lastPage () {
				let page = this.optionsForm.page - 1
				if (page <= 1) page = 1
				this.optionsForm.page = page
				this.fetchLoanList()
			},
			nextPage () {
				let page = parseInt(this.optionsForm.page) + 1
				if (page >= this.historyList.lastPage) page = this.historyList.lastPage
				this.optionsForm.page = page
				this.fetchLoanList()
			},
			hideDetail () {
				this.loanDetailIndex = null
			},
			clickBookItem (e) {
				const loanId = e.loanId
				let index = null
				for (var i = 0; i < this.loanList.searchResult.length; i++) {
					const element = this.loanList.searchResult[i]
					if (element.loanId === loanId) index = i
				}
				this.loanDetailIndex = index
			},
			renewBookItem (e) {
				uni.showLoading({ title: '续借中...'})
				api.fetchLibspRenewBooks([e.loanId]).then(res=> {
					this.renewResult = res.data.data
					uni.hideLoading()
					this.fetchLoanList()
				}).catch(error => {
					console.log(error)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			goBookDetail () {
				const recordId = this.loanList.searchResult[this.loanDetailIndex].recordId
				uni.navigateTo({ url: `/pages/book/detail?recordId=${recordId}`})
			},
			goLibrary() {
				const book = this.loanList.searchResult[this.loanDetailIndex]
				if (book) navigateToPlace(book.locationName)
			},
			checkAddCalendarPermisson () {
				const book = this.loanList.searchResult[this.loanDetailIndex]
				if (!book) return
				addPhoneCalendarEvent({
					modalContent: '添加日程，图书应还日期前一天提醒您？',
					buildCalendarData() {
						const startTime = new Date(`${book.normReturnDate}T00:00`).getTime().toString().slice(0, -3)
						const place = book.locationName ? book.locationName.substr(0, 3) : ''
						return {
							title: `归还图书${book.title}`,
							startTime: startTime,
							description: `您借阅的图书《${book.title}》将于${book.normReturnDate}到期，请及时前往${place}归还！`,
							location: place,
							alarmOffset: 60 * 60 * 24, // 提前1天提醒
						}
					}
				})
			},
			batchRenewChange (e) {
				const loanIds = e.detail.value
				this.batchRenewIds = loanIds
				
				let batchRenewList = this.batchRenewList
				for (var i = 0; i < batchRenewList.length; i++) {
					batchRenewList[i].checked = loanIds.includes(batchRenewList[i].loanId)
				}
				this.batchRenewList = batchRenewList
			},
			batchRenew () {
				this.showBatchRenewModal = false
				uni.showLoading({ title: '续借中...'})
				api.fetchLibspRenewBooks(this.batchRenewIds).then(res=> {
					this.renewResult = res.data.data
					uni.hideLoading()
					this.fetchLoanList()
				}).catch(error => {
					console.log(error)
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>
.swiper-item .cu-list .cu-item {
	min-height: 2.8rem;
}
</style>