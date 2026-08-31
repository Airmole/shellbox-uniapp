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
		<view class="cu-list menu sm-border card-menu shadow margin-top shadow">
			<view class="cu-bar bg-white solid-bottom" @click="showOptionsArea">
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
				
		<view class="cu-bar bg-white solid-bottom margin card-radius" v-if="loanList && loanList.loanNum">
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
							:isbn="`ISBN：${book.isbn}`"
							:bottomText="`${book.loanDate}借阅丨${book.normReturnDate}应还\n`"
						></bookItem>
					</template>
				</view>
			</template>
			<!-- 分页器 -->
			<view class="flex justify-between padding-lr-sm margin-top align-center">
				<view class="flex-sub"><button @tap="lastPage" v-if="optionsForm.page>1" class="cu-btn round bg-gradual-blue">上一页</button></view>
				<view class="flex-twice text-center"><text>第{{optionsForm.page}}页丨共{{loanList.lastPage}}页</text></view>
				<view class="flex-sub text-right"><button @tap="nextPage" v-if="optionsForm.page<loanList.lastPage" class="cu-btn round bg-gradual-blue">下一页</button></view>
			</view>
		</template>
		
	</view>
</template>

<script>
	const app = getApp()
	import api from '@/request/api.js'
	import { getEdusysAccount } from '@/common/utils/auth.js'
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
				loanList: ''
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
						this.loanList = res.data.data
					}
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
			}
		}
	}
</script>

<style>

</style>