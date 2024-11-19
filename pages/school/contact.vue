<template>
	<cu-custom bgColor="bg-green" class="text-white" :isBack="true">
		<block slot="backText">返回</block>
		<view>联系电话 - 贝壳小盒子</view>
	</cu-custom>

	<view class="cu-bar bg-white search fixed" :style="`top:${CustomBar}px;`">
		<view class="search-form round">
			<text class="cuIcon-search"></text>
			<input type="text" :value="keyword" placeholder="输入搜索的关键词" @input="searchInput"></input>
		</view>
		<view class="action">
			<button @tap="clearSearch" class="cu-btn bg-gradual-green shadow-blur round">清空筛选</button>
		</view>
	</view>

	<scroll-view scroll-y class="indexes" :scroll-into-view="`indexes-${listCurID}`"
		:style="[{height:'calc(100vh - '+ CustomBar + 'px - 50px)'}]" :scroll-with-animation="true"
		:enable-back-to-top="true">
		<template v-for="(item,index) in telLists" :key="index">
			<view :class="`padding indexItem-${telLists[index]}`" v-if="telLists[index].length>0"
				:id="`indexes-${index}`" :data-index="`${index}`">{{index}}</view>
			<view class="cu-list menu-avatar no-padding">
				<template v-for="(tel, sub) in item" :key="sub">
					<view class="cu-item" :data-tel="tel.tel" @longtap="copyTel">
						<view class="cu-avatar lg round bg-green text-cut">
							<text class="avatar-text">{{tel.name.slice(0, 4)}}</text>
						</view>
						<view class="content">
							<view class="text-grey">
								<text class="text-abc">{{tel.name}}</text>
							</view>
							<view class="text-gray text-sm">
								022-{{tel.tel}}
							</view>
						</view>
						<view :data-tel='tel.tel' @tap='callPhone' class="action text-xxl margin-right-xl padding-right-xl">
							<text class="cuIcon-phone text-green"></text></view>
					</view>
				</template>
			</view>
		</template>
		<view class="margin-tb-xl padding-tb-xl"></view>
	</scroll-view>
	
	<view class="indexBar" :style="[{height:'calc(100vh - ' + CustomBar + 'px - 50px)'}]">
		<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove.stop="tMove">
			<view class="indexBar-item" v-for="(item, index) in list" :key="index" :id="index" @touchstart="getCur"
				@touchend="setCur">{{list[index]}}</view>
		</view>
	</view>
	<!--选择显示-->
	<view v-show="!hidden" class="indexToast">
		{{listCur}}
	</view>
</template>

<script>
	import { getCurrentInstance } from "vue"
	import api from '@/request/api.js'
	let interstitialAd = null
	export default {
		data() {
			return {
				StatusBar: 0,
				CustomBar: 0,
				hidden: true,
				listCurID: '',
				keyword: '',
				backLists: {},
				telLists: '',
				list: []
			}
		},
		onLoad(option) {
			// #ifdef MP-WEIXIN
			if(wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif
			uni.showLoading({
				title: '加载中...'
			})
			let list = [];
			for (let i = 0; i < 26; i++) {
				list[i] = String.fromCharCode(65 + i)
			}
			this.list = list
			this.listCur = 'B'
			
			var _this = this
			uni.getSystemInfo({
				success(e) {
					// #ifndef MP
					_this.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						_this.CustomBar = e.statusBarHeight + 50;
					} else {
						_this.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN || MP-QQ
					_this.StatusBar = e.statusBarHeight;
					let capsule = wx.getMenuButtonBoundingClientRect();
					if (capsule) {
						_this.Custom = capsule;
						_this.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
					} else {
						_this.CustomBar = e.statusBarHeight + 50;
					}
					// #endif
				}
			})
			this.inital(option)
		},
		onReady() {
			let _this = this
			uni.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
				_this.boxTop = res.top
			}).exec();
			uni.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
				_this.barTop = res.top
			}).exec()
			if (interstitialAd) interstitialAd.show()
		},
		methods: {
			inital(option) {
				this.fetchContactList(option)
			},
			//获取文字信息
			getCur(e) {
				this.hidden = false
				this.listCur = this.list[e.target.id]
			},
			setCur(e) {
				this.hidden = true
				this.listCur = this.listCur
			},
			//滑动选择Item
			tMove(e) {
				let y = e.touches[0].clientY,
					offsettop = this.boxTop,
					that = this;
				//判断选择区域,只有在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 20);
					this.listCur = that.list[num].name
				};
			},
			//触发全部开始选择
			tStart() {
				this.hidden = false
			},
			//触发结束选择
			tEnd() {
				this.hidden = true;
				this.listCurID = this.listCur
			},
			indexSelect(e) {
				let that = this
				let barHeight = this.barHeight
				let list = this.list
				let scrollY = Math.ceil(list.length * e.detail.y / barHeight)
				for (let i = 0; i < list.length; i++) {
					if (scrollY < i + 1) {
						that.listCur = list[i].name;
						that.movableY = i * 20
						return false
					}
				}
			},
			searchInput: function(e) {
				var keyword = e.detail.value
				var telLists = this.backLists
				var resultLists = {}
				var hasResult = false
				var _this = this

				if (keyword.length < 1) {
					this.telLists = _this.backLists
					return
				}
				for (let index in telLists) {
					let element = telLists[index];
					resultLists[index] = [];
					element.forEach((ele, ind) => {
						if (ele.name.indexOf(keyword) != -1 || ele.tel.indexOf(keyword) != -1) {
							resultLists[index].push(ele)
							hasResult = true
						}
					})
				}
				this.keyword = keyword
				this.telLists = resultLists
			},
			clearSearch: function() {
				this.telLists = this.backLists
				this.keyword = ''
			},
			callPhone: function(e) {
				var tel = '022' + e.currentTarget.dataset.tel
				uni.makePhoneCall({
					phoneNumber: tel
				});
			},
			copyTel: function(e) {
				var tel = '022' + e.currentTarget.dataset.tel
				uni.setClipboardData({
					data: tel
				})
				uni.showToast({
					title: '已复制到粘贴版',
					icon: 'none',
					duration: 1000
				})
			},
			fetchContactList(option) {
				api.getSchoolContact().then(res => {
					const lists = this.format2list(res.data.data)
					this.backLists = lists
					this.telLists = lists
					uni.hideLoading()
					if (option && option.keyword) {
						this.searchInput({detail: { value: option.keyword }})
					}
				}).catch(res => {
					uni.hideLoading()
					uni.showToast({ title: res.data.message, icon: 'none' })
				})
			},
			format2list(array) {
				let list = {}
				array.forEach(element => {
					if (!list[element.sortname]) list[element.sortname] = []
					list[element.sortname].push({
						name: element.name,
						tel: element.tel
					})
				})
				return list
			}
		},
		onShareAppMessage() {
			let text = ``
			if (this.keyword) text = `【${this.keyword}...】`
			let data = {
			  title: `${text}联系电话 - 贝壳小盒子`,
			  path: `/pages/school/contact?keyword=${this.keyword}`
			}
			return data
		},
		onShareTimeline() {
			let text = ``
			if (this.keyword) text = `【${this.keyword}...】`
			let data = {
				title: `${text}联系电话 - 贝壳小盒子`,
				query: `keyword=${this.keyword}`
			}
			return data
		}
	}
</script>

<style>
	page {
		padding-top: 100rpx;
	}

	.indexes {
		position: relative;
	}

	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 0px;
		padding: 20rpx 20rpx 20rpx 60rpx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}
	
	@media (prefers-color-scheme: dark) {
		/* DarkMode 下的样式 start */
		.indexBar .indexBar-box {
			width: 40upx;
			height: auto;
			background: #111111;
			display: flex;
			flex-direction: column;
			box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
			border-radius: 10upx;
		}
		/* DarkMode 下的样式 end */
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}
</style>