	<template>
		<view v-if="collection" class="bg-white padding-bottom-xs">
			<view class="padding-lr-sm text-lg margin-top">
				<text class="cuIcon-title text-green margin-right-xs"></text>共计{{collection.totalCount}}条馆藏记录
			</view>
			<tips v-if="collection.totalCount==0" :tips="'暂时没有馆藏'"></tips>
			<view v-for="(item, index) in collection.list" class="bg-gray radius margin-xs flex flex-direction padding-xs">
				<view class="flex align-center justify-between">
					<view class="basis-xxs"><text>书刊状态： </text></view>
					<view class="flex justify-end">
						<view class="fbasis-llg margin-lr-xs"><view class="cu-tag radius line-blue">{{item.processType||'未知状态'}}</view></view>
						<!-- 借阅属性 -->
						<view class="fbasis-llg margin-lr-xs" v-if="item.circAttr!=='--'">
							<view v-if="item.circAttr==0" class="cu-tag radius line-green">可借</view>
							<view v-else-if="item.circAttr==1" class="cu-tag radius line-green">阅览</view>
							<view v-else-if="item.circAttr==2" class="cu-tag radius line-red">停借</view>
							<view v-else-if="item.circAttr==3" class="cu-tag radius line-red">保留本</view>
							<view v-else-if="item.circAttr==4" class="cu-tag radius line-orange">业务用书</view>
							<view v-else-if="item.circAttr==5" class="cu-tag radius line-red">非可借</view>
							<view v-else-if="item.circAttr==6" class="cu-tag radius line-green">分馆藏书</view>
							<view v-else class="cu-tag radius line-blue">{{item.circAttr}}</view>
						</view>
					</view>
				</view>
				<view class="flex justify-between">
					<!-- 入藏日期 -->
					<view class="flex padding-tb-xs justify-between">
						<view class="basis-xxs"><text>入藏日期：</text></view>
						<view class="fbasis-llg">{{item.inDate||'未记录'}}</view>
					</view>
					<!-- 年代 -->
					<view class="flex padding-tb-xs justify-between">
						<view class="basis-xxs"><text>年代： </text></view>
						<view class="fbasis-llg">{{item.year||'未记录'}}</view>
					</view>
				</view>
				<!-- 馆藏地 -->
				<view class="flex padding-tb-xs justify-between" v-if="item.locationName">
					<view class="basis-xxs"><text>馆藏地： </text></view>
					<view class="cu-capsule radius" @click="goLibrary(item.locationName)">
						<view class="cu-tag line-blue"><text class="cuIcon-locationfill"></text></view>
						<view class="cu-tag bg-blue">{{item.locationName}}</view>
					</view>
				</view>
				<!-- 索书号 -->
				<view class="flex padding-tb-xs justify-between" v-if="item.callNo">
					<view class="basis-xxs"><text>索书号： </text></view>
					<view class="cu-capsule radius">
						<view class="cu-tag line-grey"><text class="cuIcon-tag"></text></view>
						<view class="cu-tag bg-grey">{{item.callNo}}</view>
					</view>
				</view>
				<!-- 条码号 -->
				<view class="flex padding-tb-xs justify-between" v-if="item.barcode">
					<view class="basis-xxs"><text>条码号： </text></view>
					<view class="fbasis-llg">{{item.barcode}}</view>
				</view>
				<!-- 捐赠人 -->
				<view class="flex padding-tb-xs justify-between" v-if="item.donatorName">
					<view class="basis-xxs"><text>捐赠人： </text></view>
					<view class="fbasis-llg">{{item.donatorName}}</view>
				</view>
			</view>
			
		</view>
	</template>
	<script>
		import { navigateToPlace } from '@/common/utils/location.js'
		export default {
			props: {
				collection: {
					type: [Object, String],
					default: {},
					required: true
				}
			},
			methods: {
				goLibrary(locationName) {
					navigateToPlace(locationName)
				},
			}
		}
	</script>
