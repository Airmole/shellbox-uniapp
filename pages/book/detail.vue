<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>{{title}}</view>
		</cu-custom>
		
		<template v-if="jsonStr !== ''">
			<!-- 馆藏借阅信息 -->
			<view class="cu-list menu sm-border card-menu margin-top margin-bottom">
				<view class="cu-item">
					<view class="action">
						<text class="cuIcon-title text-cyan"></text> 馆藏信息(共{{jsonStr.collection.length}}本)
					</view>
					<view class="action">
						<!-- <button class="cu-btn bg-cyan shadow" open-type="share"><text class="cuIcon-share"></text>分享
						</button> -->
						<button @tap="showCollectionChanged" class="cu-btn bg-white margin-left-xs"><text
								:class="`cuIcon-${showCollection?'fold':'unfold'}`"></text></button>
					</view>
				</view>
				<template v-if="showCollection">
					<view class="cu-item" v-for="(item, index) in jsonStr.collection" :key="index">
						<view class="content padding-sm" style="color: #8B99A3;">
							<template v-for="(row, idx) in item" :key="idx">
								<view class="flex padding-tb-xs" v-if="row.value.length>0 && row.title.length>0">
									<template v-if="row.title === '书刊状态'">
										<view class="basis-xxs"><text>{{row.title}}: </text></view>
										<view class="cu-capsule radius">
											<view :class="`cu-tag line-${row.value==='可借'?'cyan':'red'}`">
												<text :class="`cuIcon-${row.value==='可借'?'check':'close'}`"></text>
											</view>
											<view :class="`cu-tag bg-${row.value==='可借'?'cyan':'red'}`">{{row.value}}</view>
										</view>
									</template>
									<template v-else-if="row.title === '馆藏地' || row.title === '还书位置'">
										<view class="basis-xxs"><text>{{row.title}}: </text></view>
										<view class="cu-capsule radius" :data-place="row.value" @tap="goLibrary">
											<view class="cu-tag line-grey">
												<text class="cuIcon-locationfill"></text>
											</view>
											<view class="cu-tag bg-grey">{{row.value}}</view>
										</view>
									</template>
									<template v-else-if="row.title === '索书号'">
										<view class="basis-xxs"><text>{{row.title}}: </text></view>
										<view class="cu-capsule radius">
											<view class="cu-tag line-grey">
												<text class="cuIcon-tag"></text>
											</view>
											<view class="cu-tag bg-grey">{{row.value}}</view>
										</view>
									</template>
									<template v-else>
										<template v-if="row.value.length > 0 && row.title.length > 0">
											<view class="basis-xxs"><text>{{row.title}}: </text></view>
											<view class="fbasis-llg">{{row.value}}</view>
										</template>
									</template>
								</view>
							</template>
						</view>
					</view>
				</template>
			</view>
			
			<!-- 图书信息 -->
			<view class="cu-list menu sm-border card-menu margin-top">
				<view class="cu-item">
					<view class="action">
						<text class="cuIcon-title text-cyan"></text> 图书信息
					</view>
					<view class="action">
						<text class="cuIcon-attentionfill line-cyan"> {{jsonStr.viewedSum}}次</text>
						<button @tap="showBookInfoChanged" class="cu-btn bg-white margin-left-xs"><text
								:class="`cuIcon-${showBookInfo?'fold':'unfold'}`"></text></button>
					</view>
				</view>
				<template v-if="showBookInfo">
					<template v-for="(item, index) in jsonStr.bookInfo" :key="index">
						<view class="cu-item"  v-if="item.value.length>0">
							<view class="content" style="min-width:220rpx;">
								<text class="text-grey">{{item.name}}</text>
							</view>
							<view class="action">
								<text class="text-grey text-sm text-left">{{item.value}}</text>
							</view>
						</view>
					</template>
				</template>
			</view>
			
			<!-- #ifdef MP-WEIXIN -->
			<view class="margin-lr margin-tb-sm radius">
				<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
			</view>
			<!-- #endif -->
			
			<!-- 同名作者的其他书籍 -->
			<view class="cu-list menu sm-border card-menu margin-tb" v-if="jsonStr.sameAuthor">
				<view class="cu-item">
					<view class="action">
						<text class="cuIcon-title text-cyan"></text> 同名作者其他著作
					</view>
					<view class="action">
						<button @tap="showSameAuthorChanged" class="cu-btn bg-white"><text
								:class="`cuIcon-${showSameAuthor?'fold':'unfold'}`"></text></button>
					</view>
				</view>
				<template v-if="showSameAuthor">
					<navigator class="cu-item arrow" v-for="(sameAuthor, idx) in jsonStr.sameAuthor"
						:url="`./detail?code=${sameAuthor.marcNo}`" :key="idx">
						<view class="content padding-tb-sm text-cut">
							<view>
								<text class="cuIcon-read text-blue margin-right-xs"></text>{{sameAuthor.data[0].value}}
							</view>
							<view class="text-gray text-sm">{{sameAuthor.data[1].value}} | {{sameAuthor.data[2].value}}
							</view>
						</view>
						<view class="action">{{sameAuthor.data[3].value}}</view>
					</navigator>
				</template>
			</view>
		</template>

	</view>
</template>

<script>
	import api from '../../request/api'
	let interstitialAd = null
	export default {
		data() {
			return {
				code: "",
				codeType: '',
				jsonStr: "",
				doubanStr: '',
				title: '',
				isbn: '',
				place: '',
				placeType: 0,
				showCollection: true,
				showDistribution: true,
				showBookInfo: true,
				showSameAuthor: true,
			}
		},
		onLoad(options) {
			// #ifdef MP-WEIXIN
			if(wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif

			uni.showLoading({ title: "等我加载一下~" })
			let codeType = options.codeType ? options.codeType : 'marc';
			this.code = options.code
			this.codeType = codeType
			if (codeType == 'marc') {
				this.getBookDetailByMarc(options.code);
			}
		},
		onShow() {
			if (interstitialAd) interstitialAd.show()
		},
		methods: {
			getBookDetailByMarc(marc) {
				api.fetchBookDetailByMarcNo(marc).then(res => {
					this.jsonStr = res.data
					this.title = this.getTitleFromBookInfo(res.data.bookInfo)
					uni.hideLoading()
				}).catch(error => {
					console.log('fetchBookDetailByMarcNo carth', error)
					uni.showToast({
						title: '出错，暂不可用',
						icon: 'info'
					})
				}).finally(res => {
					uni.hideLoading()
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
			getTitleFromBookInfo(bookInfo) {
				let title = ''
				let pattern = /(.*?)\//
				for (let index = 0; index < bookInfo.length; index++) {
					const element = bookInfo[index]
					if (element.name.indexOf('题名') >= 0) {
						let titleMatched = pattern.exec(element.value)
						title = titleMatched == null ? element.value : titleMatched[1]
						break
					}
				}
				return title
			},
			distributionChanged() {
				const currentValue = this.showDistribution
				this.showDistribution = !currentValue
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
			}
		}
	}
</script>

<style>

</style>