<template>
	<view>
		<view class="fixed">
			<cu-custom bgColor="bg-gradual-blue" :isBack="true">
				<view>积分商城</view>
			</cu-custom>
		</view>
		
		<!-- 轮播 -->
		<swiper class="screen-swiper round-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
		 duration="500">
			<swiper-item v-for="(item,index) in 1" :key="index">
				<image :src="'https://r2.airmole.cn/i/2025/07/13/1c3m9b-mf.jpeg'" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		
		<view class="VerticalBox">
			<!-- 左侧导航栏 -->
			<scroll-view class="VerticalNav nav padding-top-xs" scroll-y scroll-with-animation :scroll-top="verticalNavTop" style="height:calc(100vh - 375upx)">
				<view class="cu-item" :class="index==tabCur?'text-green bg-white':''" v-for="(item,index) in list" :key="index" @tap="TabSelect"
				 :data-id="index">{{item.name}}</view>
			</scroll-view>
			<!-- 右侧列表 -->
			<scroll-view class="VerticalMain bg-gray" scroll-y scroll-with-animation style="height:calc(100vh - 375upx)"
			 :scroll-into-view="'main-'+mainCur" @scroll="VerticalMain">
				<view class="padding-top-xs padding-lr-xs" v-for="(item,index) in list" :key="index" :id="'main-'+index">
					<view class="cu-bar solid-bottom bg-white">
						<view class="action">
							<text class="cuIcon-title text-green"></text> {{item.name}}</view>
					</view>
					<view class="cu-list menu-avatar">
						<view class="cu-item" v-for="(itm,idx) in item.items" :key="idx" @click="showGoodsDetail(itm)">
							<view class="cu-avatar radius lg" :style="`background-image:url(${itm.image});`"></view>
							<view class="content">
								<view class="text-title"><text class="text-cut">{{itm.title}}</text></view>
								<view class="text-gray text-sm flex">
									<view v-if="itm.type==1" class='cu-tag round bg-green sm margin-top-xs'>实物商品</view>
									<view v-if="itm.type==0" class='cu-tag round bg-green sm margin-top-xs'>虚拟商品</view>
									<text v-if="itm.stock>=0" class="text-cut margin-left-xs">剩余{{itm.stock}}份</text>
								</view>
							</view>
							<view class="action text-yellow" style="width: 140upx;"><text class="iconfont icon-shell"></text>{{itm.price}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 商品详情模态框 -->
		<view class="cu-modal bottom-modal" :class="showGoodsModal?'show':''" style="z-index: 998;">
			<view class="cu-dialog bg-gray" style="height:calc(100vh - 260upx);">
				<view class="cu-bar bg-white">
					<view class="action text-title">积分商品兑换</view>
					<view class="action text-red" @tap="hideGoodsModal"><text class="cuIcon-close"></text></view>
				</view>
				<view class="padding-sm flex flex-direction justify-between">
					<view class="flex margin-bottom-sm mb-sm">
					    <view class="flex-sub margin-xs">
							<view @click="previewImage(goodsDetail.image)" class='cu-avatar radius' style="height: 260upx;width: 260upx;" :style="`background-image: url(${goodsDetail.image});`"></view>
						</view>
					    <view class="flex-twice text-left padding-sm">
							<view class="text-title text-xl margin-top-sm">{{goodsDetail.title}}</view>
							<view class="margin-top-sm"><text class="text-xxl text-yellow margin-lr-xs">{{goodsDetail.price}}<text class="iconfont icon-shell"></text></text>可兑换</view>
							<view class="margin-top-sm">
								<view v-if="goodsDetail.type==0" class="cu-tag line-green">虚拟商品</view>
								<view v-if="goodsDetail.type==1" class="cu-tag line-green">实物商品</view>
								<view v-if="goodsDetail.stock==-1" class="cu-tag line-green">库存充足</view>
								<view v-else class="cu-tag line-green">库存{{goodsDetail.stock}}件</view>
							</view>
						</view>
					</view>
					<scroll-view scroll-y="true" style="height: 800upx;" class="bg-white padding-sm text-left">
						<ua-markdown :source="goodsDetail.description"/>
					</scroll-view>
					<view class="cu-bar foot flex">
						<button @click="exchangeGoods" style="width: 95%;" class="cu-btn bg-gradual-blue lg margin-tb round">确认兑换</button>
					</view>
				</view>
			</view>
		</view>
			
		<view class="cu-modal" :class="showAddressModal?'show':''" style="z-index: 998;">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">收件信息</view>
					<view class="action" @tap="hideAddressModal"> <text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="padding-xl bg-white">
					<view class="cu-form-group margin-top text-left">
						<view class="title">收件姓名</view>
						<input placeholder="收快递的姓名" name="name" v-model="addressForm.name"></input>
					</view>
					<view class="cu-form-group margin-top text-left">
						<view class="title">收件电话</view>
						<input placeholder="收快递的联系电话" name="mobile" type="tel" v-model="addressForm.mobile"></input>
					</view>
					<view class="cu-form-group margin-top text-left">
						<textarea maxlength="254" v-model="addressForm.address" placeholder="快递配送地址"></textarea>
					</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideAddressModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="submitExchangeGoods">确定</button>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import api from '../../request/api'
	export default {
		data() {
			return {
				list: [],
				tabCur: 0,
				mainCur: 0,
				verticalNavTop: 0,
				load: true,
				showGoodsModal: false,
				goodsDetail: '',
				showAddressModal: false,
				addressForm: {
					name: '',
					mobile: '',
					address: '天津市宝坻区京津新城珠江北环东路1号北京科技大学天津学院',
				},
			};
		},
		onLoad() {
			uni.showLoading({ title: '加载中...', mask: true })
			api.fetchPointsMallGoods().then(res => {
				this.list = res.data
			})
		},
		onReady() {
			uni.hideLoading()
		},
		methods: {
			hideAddressModal () {
				this.showAddressModal = false
			},
			hideGoodsModal () {
				this.showGoodsModal = false
			},
			showGoodsDetail (goods) {
				api.fetchPoitsMallGoodsDetail(goods.id).then(res => {
					this.goodsDetail = res.data
					this.showGoodsModal = true
				}).catch(error => {
					console.log('showGoodsDetail获取积分商品详情失败', error)
					uni.showModal({ content: error })
				})
			},
			previewImage (imageUrl) {
				uni.previewImage({ urls: [imageUrl] })
			},
			exchangeGoods () {
				// 虚拟商品兑换，无需填写收件信息
				if (this.goodsDetail.type == 0) {
					this.submitExchangeGoods()
					return
				}
				// 实物商品兑换,需要填写收件信息
				if (this.goodsDetail.type == 1) {
					this.showAddressModal = true
					return
				}
			},
			submitExchangeGoods() {
				const _this = this
				if (_this.goodsDetail.type == 1 && _this.addressForm.name.length <= 0) {
					uni.showModal({ content: '收件姓名不可为空'})
					return
				}
				if (_this.goodsDetail.type == 1 && _this.addressForm.mobile.length <= 0) {
					uni.showModal({ content: '收件电话不可为空'})
					return
				}
				uni.showModal({
					title: '提示',
					content: `确认要兑换【${_this.goodsDetail.title}】吗？`,
					success: function (confirmRes) {
						if (confirmRes.confirm) {
							uni.showLoading({ title: '正在为你兑换中...' })
							api.userPointsExchaneGoods(
								_this.goodsDetail.id,
								_this.addressForm.name,
								_this.addressForm.mobile,
								_this.addressForm.address
							).then(res => {
								uni.hideLoading()
								uni.showModal({ content: res.data.message, showCancel: false})
							}).catch(error => {
								console.log('exchangeGoods error', error)
								uni.showModal({ content: error.data.message, showCancel: false })
							}).finally(() => {
								uni.hideLoading()
							})
						}
					}
				})
			},
			TabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.mainCur = e.currentTarget.dataset.id;
				this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50
			},
			VerticalMain(e) {
				// #ifdef MP-ALIPAY
				   return false  //支付宝小程序暂时不支持双向联动 
				// #endif
				let that = this
				let tabHeight = 0
				if (this.load) {
					for (let i = 0; i < this.list.length; i++) {
						let view = uni.createSelectorQuery().select("#main-" + this.list[i].id)
						view.fields({
							size: true
						}, data => {
							if (data) {
								this.list[i].top = tabHeight
								tabHeight = tabHeight + data.height
								this.list[i].bottom = tabHeight
							}
						}).exec()
					}
					this.load = false
				}
				let scrollTop = e.detail.scrollTop + 10
				for (let i = 0; i < this.list.length; i++) {
					if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
						this.verticalNavTop = (this.list[i].id - 1) * 50
						this.tabCur = this.list[i].id
						// console.log(scrollTop)
						return false
					}
				}
			}
		},
	}
</script>

<style>
	.fixed {
		position: fixed;
		z-index: 99;
	}

	.VerticalNav.nav {
		width: 180upx;
		white-space: initial;
	}

	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: center;
		margin: 0;
		border: none;
		height: 50px;
		position: relative;
	}

	.VerticalBox {
		display: flex;
	}

	.VerticalMain {
		flex: 1;
	}
	
	.ua__markdown img {
		max-width: none !important;
	}
</style>
