<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>校园地图</view>
		</cu-custom>
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
			<view class="cu-item" :class="index==currentTab?'text-blue cur':''" v-for="(item,index) in categories" :key="index" @tap="tabSelect" :data-id="index">
				{{item}}
			</view>
		</scroll-view>
		<view class="no-scrool flex justify-center align-center" :style="{ height: `${pageHeight-50}px`,width: '100%' }">
			<map
				:style="{ height: `${pageHeight-60}px`,width: '100%' }"
				:longitude="defaultCenter[0]"
				:latitude="defaultCenter[1]"
				:scale="18"
				:show-location="true"
				:markers="markers"
				:include-points="points"
				@markertap="markerTap"
				@regionchange="regionChange"
			></map>
			
			<view class="bg-white padding-xs round map-tool flex flex-direction justify-center text-center" :style="`bottom: ${foldPoiCardArea?'10vh':'43vh'};`">
				<view class="margin-tb-xs flex flex-direction" @tap.stop="goFullviewMap">
					<button class="cu-btn cuIcon tool-icon fullview-btn">
						<text class="iconfont icon-fullview text-white text-bold" style="font-size: 50rpx;"></text>
					</button>
					<text class="text-xs">全景地图</text>
				</view>
				<view class="margin-tb-xs flex flex-direction" @tap.stop="previewMapPic">
					<image src="https://r2.airmole.net/images/weapp/navIcon/staticMap.png" mode="aspectFill" class="tool-icon"></image>
					<text class="text-xs">平面地图</text>
				</view>
				<view class="margin-tb-xs flex flex-direction" @tap.stop="resetMapCenter">
					<image src="https://r2.airmole.net/images/weapp/navIcon/moveSchool.png" mode="aspectFill" class="tool-icon"></image>
					<text class="text-xs">回到学校</text>
				</view>
			</view>
			
			<view :class="`padding-lr-sm poi-card cu-list menu sm-border ${foldPoiCardArea?'round':'card-radius'}`" :style="foldPoiCardArea?'':'height: 40vh;'">
				<view class="cu-item press-class" @click="showPoiCardArea">
					<view class="content">
						<text class="cuIcon-title text-green"></text> 共{{currentTabPoi.length}}个{{categories[currentTab]}}地点
					</view>
					<view class="action text-right">
						<text :class="'cuIcon-'+(foldPoiCardArea?'right':'unfold')"></text>
					</view>
				</view>
				<scroll-view v-if="!foldPoiCardArea" :scroll-top="scrollTop" scroll-y scroll-with-animation class="padding-tb-sm poi-card-content">
					<view @tap="placeCheck(item)" :class="`flex padding-sm radius ${item.id==checkedPlaceId?'bg-blue light':''}`" v-for="(item, index) in currentTabPoi" :key="index">
						<view class="flex-twice">
							<view v-if="item.image" @tap.stop="previewImg(item.image)" class="cu-avatar lg radius" :style="`background-image:url(${item.image});`"></view>
							<view v-else class="cu-avatar lg radius bg-gradual-blue text-cut"><text class="text-xs">{{item.title}}</text></view>
						</view>
						<view class="flex-treble text-xl text-left flex align-center"><view>{{item.title}}</view></view>
						<view class="flex-sub flex align-center text-xl"><view @tap.stop="openLocation(item)" class="bg-gradual-blue padding-xs padding-lr-sm round"><text class="text-white cuIcon-locationfill"></text></view></view>
					</view>
				</scroll-view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import api from '@/request/api.js'
	const app = getApp()
	export default {
		data() {
			return {
				pageHeight: 0,
				defaultCenter: [117.392825, 39.542733],
				currentTab: 0,
				scrollLeft: 0,
				scrollTop: 0,
				categories: [],
				allPoi: [],
				currentTabPoi: [],
				foldPoiCardArea: true,
				markers: [],
				points: [],
				checkedPlaceId: 0
			}
		},
		onLoad() {
			this.pageHeight = app.globalData.screenHeight
			this.fetchPoi()
		},
		methods: {
			showPoiCardArea () {
				this.foldPoiCardArea = !this.foldPoiCardArea
			},
			fetchPoi () {
				uni.showLoading({ title: '加载中...'})
				api.fetchMapAllPoi().then(res => {
					uni.hideLoading()
					if (res.data.data && res.data.data.length) {
						let categories = this.categories
						for (let place of res.data.data) {
							if (!categories.includes(place.category)) categories.push(place.category)
						}
						this.categories = categories
						this.allPoi = res.data.data
						
						const currentTabPoi = []
						const markers = []
						for (let place of res.data.data) {
							if (place.category !== categories[0]) continue
							currentTabPoi.push(place)
							markers.push({
							  id: Number(place.id),
							  latitude: Number(place.latitude),
							  longitude: Number(place.longitude),
							  iconPath: `https://r2.airmole.net/images/weapp/navIcon/${place.icon}.png`,
							  width: 30,
							  height: 32,
							  callout: {
								content: place.title,
								display: 'BYCLICK'
							  }
							})
						}
						this.currentTabPoi = currentTabPoi
						this.markers = markers
						this.foldPoiCardArea = false
					}
				})
			},
			tabSelect(e) {
				this.currentTab = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				const currentCategory = this.categories[this.currentTab]
				const currentTabPoi = []
				const markers = []
				const points = []
				for (let place of this.allPoi) {
					if (place.category !== currentCategory) continue
					markers.push({
					  id: Number(place.id),
					  latitude: Number(place.latitude),
					  longitude: Number(place.longitude),
					  iconPath: `https://r2.airmole.net/images/weapp/navIcon/${place.icon}.png`,
					  width: 30,
					  height: 32,
					  callout: {
						content: place.title,
						display: 'BYCLICK'
					  }
					})
					currentTabPoi.push(place)
					points.push({
					  latitude: Number(place.latitude),
					  longitude: Number(place.longitude)
					})
				}
				this.currentTabPoi = currentTabPoi
				this.markers = markers
				this.points = points
				this.scrollTop = 0
			},
			markerTap (e) {
				this.checkedPlaceId = e.detail.markerId
				const index = this.currentTabPoi.findIndex(place => Number(place.id) === Number(e.detail.markerId))
				if (index >= 0) this.scrollTop = (index - 1) * 60
				const place = this.currentTabPoi[index]
				const currentCategory = this.categories[this.currentTab]
				const markers = []
				for (let poi of this.allPoi) {
					if (poi.category !== currentCategory) continue
					let item = {
					  id: Number(poi.id),
					  latitude: Number(poi.latitude),
					  longitude: Number(poi.longitude),
					  iconPath: `https://r2.airmole.net/images/weapp/navIcon/${poi.icon}.png`,
					  width: 30,
					  height: 32,
					  callout: {
						content: poi.title,
						display: 'BYCLICK'
					  }
					}
					if (Number(place.id) === Number(poi.id)) {
						item.label = {
							content: place.title,
							color: '#ffffff',
							fontSize: 16,
							bgColor: '#3C87ED',
							padding: 4
						}
					}
					markers.push(item)
				}
				this.defaultCenter = [Number(place.longitude), Number(place.latitude)]
				this.markers = markers
				this.foldPoiCardArea = true
			},
			placeCheck (place) {
				this.checkedPlaceId = Number(place.id)
				const index = this.currentTabPoi.findIndex(item => Number(item.id) === Number(place.id))
				if (index >= 0) this.scrollTop = (index - 1) * 60
				const currentCategory = this.categories[this.currentTab]
				const markers = []
				for (let poi of this.allPoi) {
					if (poi.category !== currentCategory) continue
					let item = {
					  id: Number(poi.id),
					  latitude: Number(poi.latitude),
					  longitude: Number(poi.longitude),
					  iconPath: `https://r2.airmole.net/images/weapp/navIcon/${poi.icon}.png`,
					  width: 30,
					  height: 32,
					  callout: {
						content: poi.title,
						display: 'BYCLICK'
					  }
					}
					if (Number(place.id) === Number(poi.id)) {
						item.label = {
							content: place.title,
							color: '#ffffff',
							fontSize: 16,
							bgColor: '#3C87ED',
							padding: 4
						}
					}
					markers.push(item)
				}
				this.defaultCenter = [Number(place.longitude), Number(place.latitude)]
				this.markers = markers
				this.foldPoiCardArea = true
			},
			regionChange (e) {
				if (e.detail.centerLocation) {
					this.defaultCenter = [e.detail.centerLocation.longitude, e.detail.centerLocation.latitude]
				}
			},
			openLocation (place) {
				uni.openLocation({
					longitude: Number(place.longitude),
					latitude: Number(place.latitude),
					name: place.title,
					address: `北京科技大学天津学院(天津市宝坻区京津新城珠江北环东路1号)`
				})
			},
			previewMapPic () {
				uni.previewImage({
					urls: ['https://r2.airmole.net/i/2024/11/12/vbmpa-2i.png']
				})
			},
			previewImg (url) {
				uni.previewImage({
					urls: [url]
				})
			},
			resetMapCenter () {
				this.defaultCenter = [117.392825, 39.542733]
			},
			goFullviewMap () {
				const url = 'https://720yun.com/vr/c80jOsmvzy2'
				// #ifdef MP-WEIXIN
				uni.setClipboardData({
					data: url,
					success() {
						uni.showToast({
							title: '链接已复制到粘贴板，请打开浏览器后粘贴访问！',
							icon: 'none'
						})
					}
				})
				// #endif
				
				// #ifdef H5
				window.location.href = url
				// #endif
			}
		},
		onShareAppMessage(res) {
			return {
			  title: '校园地图 - 贝壳小盒子',
			  path: '/pages/school/map'
			}
		}
	}
</script>

<style>
	.no-scrool {
		overflow-y: hidden;
	}
	.poi-card {
		position: absolute;
		bottom: 20px;
		width: 90vw;
		background-color: #ffffffdd;
	}
	.poi-card-content {
		height: 35vh;
		overflow-y: scroll;
	}
	.map-tool {
		position: absolute;
		right: 10px;
	}
	.tool-icon {
		width: 80upx;
		height: 80upx;
	}
	.fullview-btn {
		background-color: #4594D5 !important;
		height: 80rpx !important;
		width: 80rpx !important;
	}
</style>
