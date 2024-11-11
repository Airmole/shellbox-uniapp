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
				:style="{ height: `${pageHeight}px`,width: '100%' }"
				:longitude="defaultCenter[0]"
				:latitude="defaultCenter[1]"
				:scale="18"
				:show-location="true"
				:show-compass="true"
				:markers="markers"
				:include-points="points"
				@markertap="markerTap"
				@regionchange="regionChange"
			></map>
			
			<view class="bg-white padding-xs round map-tool flex flex-direction" :style="`bottom: ${foldPoiCardArea?'10vh':'43vh'};`">
				<view class="margin-tb-xs" @tap="previewMapPic">
					<image src="https://r2.airmole.net/images/weapp/navIcon/staticMap.png" mode="aspectFill" class="tool-icon"></image>
				</view>
				<view class="margin-tb-xs" @tap="resetMapCenter">
					<image src="https://r2.airmole.net/images/weapp/navIcon/moveSchool.png" mode="aspectFill" class="tool-icon"></image>
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
							<view class="cu-avatar lg radius bg-gradual-blue"><text class="text-sm">{{item.title}}</text></view>
						</view>
						<view class="flex-treble text-xl text-left flex align-center"><view>{{item.title}}</view></view>
						<view class="flex-sub flex align-center text-xl"><view @tap.stop="openLocation(item)" class="bg-gradual-blue padding-xs round"><text class="text-white cuIcon-locationfill"></text></view></view>
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
				defaultCenter: [117.395798, 39.5430],
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
			},
			placeCheck (place) {
				this.checkedPlaceId = Number(place.id)
				const index = this.currentTabPoi.findIndex(item => Number(item.id) === Number(place.id))
				if (index >= 0) this.scrollTop = (index - 1) * 60
				this.defaultCenter = [Number(place.longitude), Number(place.latitude)]
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
					urls: ['https://r2.airmole.net/i/2024/11/11/wg3ar-dv.png']
				})
			},
			resetMapCenter () {
				this.defaultCenter = [117.395798, 39.5430]
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
</style>
