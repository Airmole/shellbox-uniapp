<template>
	<view>
		<template v-if="env === 'release'">
		  <cu-custom bgColor="bg-cyan" :isBack="true">
		    <view>投诉维权 - 常见问题</view>
		  </cu-custom>
		
		  <view class="page margin-bottom" v-if="!isLoading">
		    <template v-for="(item, index) in datalist.data" :key="index">
		      <navigator :url="`./detail?id=${item.id}`" class="cu-card dynamic">
		        <view class="cu-item shadow">
		          <view class="cu-list menu-avatar">
		            <view class="cu-item">
		              <view class="cu-avatar round lg bg-cyan" style="background-image:url(https://upload-images.jianshu.io/upload_images/4697920-5a559d389ef75773.png);"></view>
		              <view class="content flex-sub">
		                <view class="text-cut text-df">用户{{item.nickname}}</view>
		                <view class="text-gray text-sm flex justify-between">{{item.created_at}}</view>
		              </view>
		            </view>
		          </view>
		          <view class="text-content">
		            <!-- 投诉内容类型标签 -->
		            <view class="line-blue cu-tag radius">{{tags[item.tag]}}</view>
		            <!-- 回复状态胶囊 -->
		            <view :class="(item.status == 1 ? 'line-blue': 'line-red') +' cu-tag radius'">{{item.status == 1 ? '已回复': '待回复'}}</view>
		            {{item.content}}
		          </view>
		          <view class="grid flex-sub padding-lr padding-bottom col-3 grid-square">
		            <view class="bg-img" :style="`background-image:url(${pitem});`" v-for="(pitem, pindex) in item.images" @tap.stop="previewImage(item.images, pitem)">
		            </view>
		          </view>
		          <view class="cu-list menu sm-border">
		            <view class="cu-item arrow">
		              <view class="content"><text class="">查看详情</text></view>
		              <view class="action">
		              <template v-if="isAdminer">
		                <button class="cu-btn round bg-red shadow" @tap="deleteConfirm(item.id)">
		                  <text class="cuIcon-delete"></text> 删除</button>
		                  <button class="cu-btn round bg-red shadow margin-left-xs" data-id="{{item.id}}" data-hot="0" @tap="update">
		                  <text class="cuIcon-pulldown"></text>移除</button>
		              </template>
		              </view>
		            </view>
		          </view>
		        </view>
		      </navigator>
		    </template>
		
		  <view v-if="datalist.length < 1 || datalist.data.length < 1" class="bg-white margin-lr padding radius margin-top-xl">
		    <tips :tips="'这里是空的，还没有设置常见问题~'"></tips>
		  </view>
		
		
		    <!-- 分页器 -->
		    <view class="flex margin-right-sm justify-end">
		      <button @tap="lastPage" v-if="datalist.pagination.current > 1"
		        class="cu-btn bg-black round shadow">上一页</button>
		      <view v-if="datalist.pagination.current > 0" class="text-black margin-sm">{{datalist.pagination.current}} /
		        {{datalist.pagination.last}}</view>
		      <button @tap="nextPage"
		        v-if="datalist.pagination.current < datalist.pagination.last && datalist.pagination.current > 0"
		        class="cu-btn bg-black round shadow">下一页</button>
		    </view>
		
		  </view>
		
		</template>
		<template v-else>
		  <view class="margin"><tips :tips="'应官方审核要求，此功能已下线'"></tips></view>
		</template>
	</view>
</template>

<script>
	const app = getApp()
	import { getEdusysAccount } from '@/common/utils/auth.js'
	import api from '@/request/api.js'
	export default {
		data() {
			return {
				env: 'develop',
				isLoading: true,
				isAdminer: false,
				uid: 0,
				qrcode: 'https://upload-images.jianshu.io/upload_images/4697920-03629fe77465b1b5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/512',
				datalist: [],
				tags: ['其他', '食堂', '宿舍', '教学楼', '老师']
			}
		},
		  onLoad: function (options) {
		    this.env = app.globalData.env
		    if (app.globalData.env != 'release') {
		      uni.switchTab({ url: '../../index/index' })
		    }
		    
		    this.inital()
		  },
		  onShow: function () {
		    this.inital()
		  },
		methods: {
			inital: function () {
			    this.getHotDatalist()
				const edusysAccount = getEdusysAccount()
			    const uid = edusysAccount && edusysAccount.account ? edusysAccount.account : 0
			    this.uid = uid
			    this.isAdminerMethod(uid)
			  },
			  getHotDatalist: function (page = 1, hot = [1]) {
				api.fetchRightsProtectionIndex(page, '[0,1,2,3,4]', JSON.stringify(hot)).then(res => {
					this.datalist = res.data
					this.isLoading = false
				})
			  },
			  isAdminerMethod: function(uid = 0) {
				  api.fetchIsRightsProtectionAdminer(uid).then(res => {
					app.globalData.isBoardAdminer = false
					if (res.data.code == 200 && res.data.message == 'success') {
					  this.isAdminer = true
					  app.globalData.isBoardAdminer = true
					}
				  })
			  },
			  deleteConfirm: function(e) {
			    const id = e.currentTarget.dataset.id
			    const _this = this
			    uni.showModal({
			      title: '真的要删除？',
			      content: '确认删除嘛？将会连同相关评论回复全部一起删除且无法恢复。',
			      success (res) {
			        if (res.confirm) {
			          _this.deleteDataItem(id)
			        } else if (res.cancel) {
			          console.log('用户点击取消')
			        }
			      }
			    })
			  },
			  deleteDataItem: function (id) {
			    uni.showLoading({ title: '删除中...' })
				api.removeRightsProtection(id).then(res => {
					if (res.statusCode == 200 && res.data.code == 200) {
					  uni.hideLoading()
					  uni.showToast({ title: res.data.message })
					  this.getDatalist()
					}
				}).catch(res => {
				  uni.hideLoading()
				  uni.showToast({ title: res.data.message, icon: 'none' })
				})
			  },
			  update (e) {
			    const id = e.currentTarget.dataset.id
			    const hot = e.currentTarget.dataset.hot
			    const data = { hot: hot }
				api.updateRightsProtection(id, data).then(res => {
					if (res.statusCode == 200 && res.data.code == 200) {
					  wx.showToast({ title: '操作成功' })
					  this.getHotDatalist()
					} else {
					  wx.showToast({ title: res.data.message, icon: 'none' })
					}
				}).catch(res => {
					wx.showToast({ title: res.data.message, icon: 'none' })
				})
			  },
			  previewImage:function (allurl, url) {
			    wx.previewImage({ urls: allurl, current: url })
			  },
			  // 上一页
			  lastPage: function () {
			    const current = this.datalist.pagination.current
			    const targetPage = current > 1 ? Number(current) - 1 : 2
			    this.getHotDatalist(targetPage)
			  },
			  // 下一页
			  nextPage: function () {
			    const current = this.datalist.pagination.current
			    const last = this.datalist.pagination.last
			    const targetPage = current < last ? Number(current) + 1 : last
			    this.getHotDatalist(targetPage)
			  }
		}
	}
</script>

<style>

</style>
