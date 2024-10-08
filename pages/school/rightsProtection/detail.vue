<template>
	<view v-if="!isLoading">
		<template v-if="env !== 'release'">
		  <cu-custom bgColor="bg-cyan" :isBack="true">
		    <view>投诉维权详情</view>
		  </cu-custom>

		
		    <!-- 原贴 -->
		    <view class="cu-card dynamic">
		      <view class="cu-item shadow">
		        <view class="cu-list menu-avatar">
		          <view class="cu-item">
		            <view class="cu-avatar round lg bg-cyan" :style="`background-image:url(${defaultAvatar});`"></view>
		            <view class="content flex-sub">
		              <view class="text-cut text-df">用户{{data.content.nickname}}</view>
		              <view class="text-gray text-sm flex justify-between">{{data.content.created_at}}</view>
		            </view>
		          </view>
		        </view>
		        <view class="text-content" style="max-height: unset;">
		          <!-- 投诉内容类型标签 -->
		          <view class="line-blue cu-tag radius">{{tags[data.content.tag]}}</view>
		          <!-- 回复状态胶囊 -->
		          <view :class="(data.content.status == 1 ? 'line-blue': 'line-red') + ' cu-tag radius'">{{data.content.status == 1 ? '已回复': '待回复'}}</view>
		          <!-- 解决状态胶囊 -->
		          <view :class="(data.content.resolve_status == 1 ? 'line-blue': 'line-red') + ' cu-tag radius'">{{data.content.resolve_status == 1 ? '已解决': '解决中'}}</view>
		          <!-- 位置 -->
		          <template v-if="data.content.place_building || data.content.place_room">
		            <view class="cu-capsule margin-lr-sm">
		              <view class="cu-tag bg-blue"><text>{{data.content.place_building}}</text></view>
		              <view class="cu-tag line-blue">{{data.content.place_room}}</view>
		            </view>
		          </template>
		          <view>{{data.content.content}}</view>
		        </view>
		        <view class="grid flex-sub padding-lr padding-bottom col-3 grid-square">
		          <view class="bg-img" :style="`background-image:url(${pitem});`" v-for="(pitem, pindex) in data.content.images" :key="pindex" @tap.stop="previewImage(data.content.images, pitem)"></view>
		        </view>
		      </view>
		    </view>
		
		    <view v-if="!canReplay" class="bg-white margin-lr padding radius">
		      <tips :tips="'仅权益部管理人员可评论回复'"></tips>
		      <view v-if="uid == 0" class="margin-tb-sm text-center">
		        <navigator url="../../index/login" class="cu-btn round bg-green shadow">登录</navigator>
		      </view>
		    </view>
		
		    <template v-if="isAdminer">
		      <view class="cu-bar bg-white margin-lr radius-top">
		        <view class='action'>
		          <text class='cuIcon-titles text-cyan'></text> 投诉人联系方式
		        </view>
		        <view class='action'></view>
		      </view>
		      <view class="cu-list menu-avatar no-padding margin-lr radius-bottom margin-bottom">
		        <view class="cu-item">
		          <view class="cu-avatar lg round bg-green" :style="`background-image:url(${data.content.avatar||defaultAvatar});`"></view>
		          <view class="content">
		            <view class="text-grey text-cut"><text>{{data.content.nickname}}</text> </view>
		            <view class="text-gray text-sm">联系方式：{{data.content.mobile}}</view>
		          </view>
		          <view v-if="data.content.mobile" @tap="callPhone(data.content.mobile)" class="action text-xxl margin-right-xl"><text
		              class="cuIcon-phone text-green"></text></view>
		        </view>
		      </view>
		    </template>
		
		    <!-- 发表回复按钮 -->
		    <view class="margin-lr margin-bottom" v-if="canReplay">
		      <view class="cu-list grid col-4 radius">
		        <view class="cu-item" @tap="reply">
		          <view class="cuIcon-message text-blue"></view>
		          <text>评论回复</text>
		        </view>
		        <view class="cu-item" data-hot="1" @tap="update" v-if="!data.content.hot">
		          <view class="cuIcon-pullup text-blue"></view>
		          <text>常见问题</text>
		        </view>
		        <view class="cu-item" data-hot="0" @tap="update" v-if="data.content.hot">
		          <view class="cuIcon-pulldown text-blue"></view>
		          <text>非常见问题</text>
		        </view>
		        <view class="cu-item" data-resolve="1" @tap="update" v-if="!data.content.resolve_status">
		          <view class="cuIcon-roundcheck text-blue"></view>
		          <text>已解决</text>
		        </view>
		      </view>
		    </view>
		
		    <!-- 回复 -->
		    <view class="cu-card dynamic no-card margin radius">
		      <view class="cu-bar bg-white solid-bottom">
		        <view class='action'>
		          <text class='cuIcon-titles text-cyan'></text> 回复
		        </view>
		        <view class='action'></view>
		      </view>
		      <template v-if="data.replay.length > 0">
		        <view class="cu-item shadow solid-bottom" v-for="(item, index) in data.replay" :key="index">
		          <view class="cu-list menu-avatar">
		            <view class="cu-item">
		              <view class="cu-avatar round lg bg-cyan" style="background-image:url(https://upload-images.jianshu.io/upload_images/4697920-c9b94a8b22d5ee7e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/128);"></view>
		              <view class="content flex-sub">
		                <view>权益中心工作人员 - {{item.nickname}}</view>
		                <view class="text-gray text-sm flex justify-between">{{item.created_at}}</view>
		              </view>
		            </view>
		          </view>
		          <view class="text-content" style="max-height: unset;">
		            {{item.content}}
		          </view>
		          <view class="grid flex-sub padding-lr padding-bottom col-3 grid-square">
		            <view class="bg-img" :style="`background-image:url(${pitem});`" v-for="(pitem, index) in item.images" @tap.stop="previewImage(item.images, pitem)">
		            </view>
		          </view>
		          <view class="cu-list menu sm-border" v-if="isAdminer">
		            <view class="cu-item">
		              <view class="content"><text class=""></text></view>
		              <view class="action">
		                <button class="cu-btn round bg-blue shadow margin-lr-xs" @tap="reditConfirm(item.id)">
		                  <text class="cuIcon-edit"></text> 编辑</button>
		                <button class="cu-btn round bg-red shadow" @tap="deleteConfirm(item.id)">
		                  <text class="cuIcon-delete"></text> 删除</button>
		              </view>
		            </view>
		          </view>
		        </view>
		      </template>
		      <template v-else>
		        <view class="bg-white padding">
		          <tips :tips="'这里是空的，还没有人回复呢~'"></tips>
		        </view>
		      </template>
		    </view>
		
		    <!-- 分页器 -->
		    <view class="flex margin-right-sm justify-end">
		      <button @tap="lastPage()" v-if="data.pagination.current > 1" class="cu-btn bg-black round shadow">上一页</button>
		      <view v-if="data.pagination.current > 0" class="text-black margin-sm">{{data.pagination.current}} /
		        {{data.pagination.last}}</view>
		      <button @tap="nextPage()" v-if="data.pagination.current < data.pagination.last && data.pagination.current > 0"
		        class="cu-btn bg-black round shadow">下一页</button>
		    </view>
		
		</template>
		<template v-else>
		  <view class="margin"><tips :tips="'应官方审核要求，此功能已下线'"></tips></view>
		</template>
	</view>
</template>

<script>
	const app = getApp()
	import api from '@/request/api.js'
	import { request } from '@/request/index.js'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	export default {
		data() {
			return {
				defaultAvatar: 'https://r2.airmole.net/images/upload/4697920-5a559d389ef75773.webp',
				env: 'develop',
				isLoading: true,
				isAdminer: false,
				canReplay: false,
				uid: '',
				id: '',
				backpage: '',
				tags: ['其他', '食堂', '宿舍', '教学楼', '老师'],
				data: {
					reply: [],
					pagination: { current: 1, last: 1 }
				}
			}
		},
		onLoad: function (options) {
			this.env = app.globalData.env
			console.log('options', options)
			this.inital(options)
		  },
		  onShow: function () {
			this.getDetailData(this.id, 1)
		  },
		methods: {
			inital: function (options) {
			    const envVersion = app.globalData.env
			    if (envVersion != 'release') {
			      // wx.switchTab({ url: '../../index/index' })
			    }
			    const id = options.id
				const edusysAccount = getEdusysAccount()
			    const uid = edusysAccount && edusysAccount.account ? edusysAccount.account : 0
			    const backpage = options.backpage ? options.backpage : 1
			    this.id = id
			    this.getDetailData(id, 1)
			    if (app.globalData.isBoardAdminer == undefined) {
			      this.isAdminerMethod(uid)
			    } else {
			      this.uid = uid
				  this.isAdminer = app.globalData.isBoardAdminer ? true : false
			    }
			  },
			  getDetailData: function (id, page = 1) {
				api.fetchRightsProtectionDetail(id, page).then(res => {
					uni.hideLoading()
					const canReplay = this.isAdminer ? true : false
					this.data = res.data.data
					this.canReplay = canReplay
					this.isLoading = false
				})
			  },
			  reditConfirm: function (id) {
			    uni.showModal({
			      title: '注意',
			      content: '真的要重新编辑此回复？',
			      success(res) {
			        if (res.confirm) {
			          wx.navigateTo({ url: `./edit?reditid=${id}` })
			        } else if (res.cancel) {
			          console.log('用户点击取消')
			        }
			      }
			    })
			  },
			  deleteConfirm: function (id) {
			    const _this = this
			    uni.showModal({
			      title: '真的要删除？',
			      content: '确认删除嘛？将会删除本条回复评论且无法恢复！',
			      success(res) {
			        if (res.confirm) {
			          _this.deleteDataItem(id)
			        } else if (res.cancel) {
			          console.log('用户点击取消')
			        }
			      }
			    })
			  },
			  reply() {
			    const id = this.id
			    uni.navigateTo({ url: `./edit?id=${id}` })
			  },
			  update(e) {
			    const id = this.id
			    const hot = e.currentTarget.dataset.hot ? e.currentTarget.dataset.hot : this.data.content.hot
			    const resolve_status = e.currentTarget.dataset.resolve ? e.currentTarget.dataset.resolve : this.data.content.resolve_status
			    const data = { hot: hot, resolve_status: resolve_status }
				var _this = this
			    uni.showModal({
			      title: '注意',
			      content: resolve_status == 1 ? '设置为已解决后将无法重新修改解决状态，确认【已解决】？' : '确定设为【常见问题】嘛？',
			      success(res) {
			        if (res.confirm) {
						api.updateRightsProtection(id, data).then(ress => {
							if (ress.statusCode == 200 && ress.data.code == 200) {
							  uni.showToast({ title: '操作成功' })
							  _this.getDetailData(_this.id, 1)
							} else {
							  uni.showToast({ title: ress.data.message, icon: 'none' })
							}
						}).catch(ress => {
							console.log('ress', ress)
							wx.showToast({ title: ress.data.message, icon: 'none' })
						})
			        } else if (res.cancel) {
			          console.log('取消操作')
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
					  this.getDetailData(this.id, 1)
					}
				}).catch(res => {
				  uni.hideLoading()
				  uni.showToast({ title: res.data.message, icon: 'none' })
				})
			  },
			  isAdminerMethod: function (uid = 0) {
				api.fetchIsRightsProtectionAdminer(uid).then(res => {
				  app.globalData.isBoardAdminer = false
				  if (res.data.code == 200 && res.data.message == 'success') {
					this.uid = uid
					this.isAdminer = true
					app.globalData.isBoardAdminer = true
				  }
				}).catch(res => {
					console.log('不是权益管理员')
				})
			  },
			  // 上一页
			  lastPage: function () {
				uni.showLoading({ title: 'loading...'})
			    const current = this.data.pagination.current
			    const targetPage = current > 1 ? Number(current) - 1 : 2
			    this.getDetailData(this.id, targetPage)
			  },
			  // 下一页
			  nextPage: function () {
				  uni.showLoading({ title: 'loading...'})
			    const current = this.datalist.pagination.current
			    const last = this.datalist.pagination.last
			    const targetPage = current < last ? Number(current) + 1 : last
			    this.getDetailData(this.id, targetPage)
			  },
			  previewImage: function (allurl, url) {
			    uni.previewImage({ urls: allurl, current: url })
			  },
			  callPhone: function (tel) {
			    uni.makePhoneCall({ phoneNumber: tel });
			  }
		}
	}
</script>

<style>

</style>
