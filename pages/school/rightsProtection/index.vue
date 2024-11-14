<template>
	<view>
		<template v-if="env === 'release'">
		  <cu-custom bgColor="bg-cyan" :isBack="true">
		    <view>投诉维权通道</view>
		  </cu-custom>
		
		  <view class="page margin-bottom">
		    <!-- 介绍说明 -->
		    <view class="margin radius bg-white padding-lr padding-bottom">
		      <text decode="true">
		      &nbsp;&nbsp;&nbsp;&nbsp;如果您在学校遇到了以下问题，可以向“北科天院权益中心”发起投诉维权：\n</text>
		      <template v-if="!showMoreDesc">
		        <text decode="true">1.食堂问题；&nbsp;&nbsp;2.维修问题；&nbsp;&nbsp;3.教学；&nbsp;&nbsp;4.其他；&nbsp;&nbsp;\n</text>
		        <view class="text-center margin-top" @click="unfoldDesc()">
		          <text class="text-cyan cuIcon-unfold">展开详细说明</text>
		        </view>
		      </template>
		      <template v-else>
		        <text decode="true">
		          1. 食堂问题：\n &nbsp;&nbsp;&nbsp;&nbsp;外卖，工作人员，饭菜，餐具，桌椅，其他问题；\n
		          2. 维修问题：\n
		          &nbsp;&nbsp;&nbsp;&nbsp;宿舍：厕所，床架，书桌（宿舍维修问题需注明几斋几室）;\n
		          &nbsp;&nbsp;&nbsp;&nbsp;操场:石板，体育设施;\n
		          &nbsp;&nbsp;&nbsp;&nbsp;教学区域:桌椅，黑板， 媒体设备，门窗;\n
		          &nbsp;&nbsp;&nbsp;&nbsp;公共区域:图书馆，下水井盖破损，路灯不亮;\n
		          3. 教学：\n
		          &nbsp;&nbsp;&nbsp;&nbsp;对任课老师的建议。\n
		          4.其他问题（您在校园里遇见的其他需要求助相关部门的问题）\n
		          
		          注：请勿发布无关的话题内容！您的投诉留言将由“北科天院权益中心”相关工作人员回复并跟进解决，其他同学无权回复评论。\n
		          &nbsp;&nbsp;&nbsp;&nbsp;工作人员会在投诉问题后24-48小时内给您回复，请您在投诉维权后持续关注本维权投诉通道对应投诉内容的相关答复。\n
		        </text>
		        <view class="text-center margin-top" @click="unfoldDesc()">
		          <text class="text-cyan cuIcon-fold">收起详细说明</text>
		        </view>
		      </template>
		    </view>
		
		  <!-- 常见问题板块 -->
		    <view class="cu-bar bg-white margin-lr radius-top faq-item" v-if="hotDatalist.data && hotDatalist.data.length > 0" @click="goFaqPage()">
		      <view class='action'>
		        <text class='cuIcon-titles text-cyan'></text> 常见问题
		      </view>
		      <view class='action'></view>
		    </view>
		    <view :class="'cu-list menu no-padding margin-lr ' + (hotDatalist.pagination.last > 1 ? '' : 'margin-bottom radius-bottom')">
		      <navigator :url="`./detail?id=${item.id}`" class="faq-item cu-item arrow" v-for="(item, index) in hotDatalist.data" :key="index">
		        <view class="content text-cut">
		          <text class="cuIcon-tagfill text-red"></text>
		          <text class="text-grey">{{item.content}}</text>
		        </view>
		        <view class="action">
		          <view class="cu-tag round bg-orange light">{{tags[item.tag]}}</view>
		        </view>
		      </navigator>
		    </view>
		    <view class="radius-bottom text-center bg-white margin-lr padding-bottom-xs" v-if="hotDatalist.pagination.last > 1" @click="goFaqPage">
		      <text class="text-cyan">更多...</text>
		    </view>
		
		    <!-- 发表按钮 -->
		    <view class="margin-lr margin-top-xl margin-bottom">
		      <navigator url="./edit" class="flex radius bg-blue align-center justify-center">
		        <view class="text-xxl text-blod text-white margin-top justify-center shadow-blur" style="height:90rpx;">
		          <text class="cuIcon-safe"></text> 我要投诉维权
		        </view>
		      </navigator>
		    </view>
		
		    <!-- 类型筛选 -->
		    <view class="padding-lr-sm flex flex-wrap">
		      <view class="padding-xs" v-for="(item, index) in tagList" :key="index">
		        <view @click="tagChanged(index)" :class="(item.value === tag ? 'bg-white' : 'line-blue') + ' cu-tag light radius'">{{item.title}}</view>
		      </view>
		    </view>
		
		    <template v-for="(item, index) in datalist.data" :key="index">
		      <navigator :url="`./detail?id=${item.id}`" class="cu-card dynamic">
		        <view class="cu-item shadow">
		          <view class="cu-list menu-avatar">
		            <view class="cu-item">
		              <view class="cu-avatar round lg bg-cyan" style="background-image:url(https://upload-images.jianshu.io/upload_images/4697920-5a559d389ef75773.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/128);"></view>
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
		            <view :class="(item.status == 1 ? 'line-blue': 'line-red') + ' cu-tag radius'">{{item.status == 1 ? '已回复': '待回复'}}</view>
		            <!-- 解决状态胶囊 -->
		            <view :class="(item.resolve_status == 1 ? 'line-blue': 'line-red') + ' cu-tag radius'">{{item.resolve_status == 1 ? '已解决': '解决中'}}</view>
		            <view>{{item.content}}</view>
		          </view>
		          <view class="grid flex-sub padding-lr padding-bottom col-3 grid-square">
		            <view class="bg-img" v-for="(pitem, pindex) in item.images" :key="pindex" :style="`background-image:url(${pitem});`" @tap.stop="previewImage(item.images, pitem)">
		            </view>
		          </view>
		          <view class="cu-list menu sm-border">
		            <view class="cu-item arrow">
		              <view class="content"><text class="">查看详情</text></view>
		              <view class="action">
		                <button v-if="isAdminer" class="cu-btn round bg-red shadow" @click="deleteConfirm(item.id)">
		                  <text class="cuIcon-delete"></text> 删除</button>
		              </view>
		            </view>
		          </view>
		        </view>
		      </navigator>
		    </template>
		
		  <view v-if="datalist.length < 1 || datalist.data.length < 1" class="bg-white margin-lr padding radius margin-top-xl">
		    <tips :tips="'这里是空的，还没有人发内容呢~'"></tips>
		  </view>
		
		    <!-- 分页器 -->
		    <view class="flex margin-right-sm justify-end">
		      <button @click="lastPage" v-if="datalist.pagination.current > 1"
		        class="cu-btn bg-black round shadow">上一页</button>
		      <view v-if="datalist.pagination.current > 0" class="text-black margin-sm">{{datalist.pagination.current}} /
		        {{datalist.pagination.last}}</view>
		      <button @click="nextPage"
		        v-if="datalist.pagination.current < datalist.pagination.last && datalist.pagination.current > 0"
		        class="cu-btn bg-black round shadow">下一页</button>
		    </view>
		
		    <view class="text-center" style="color: #eee;"><text>本功能由"贝壳小盒子"为北科天院权益中心开发\n欢迎更多社团与小盒子合作</text></view>
		
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
	import { getEdusysAccount } from '@/common/utils/auth.js'
	export default {
		data() {
			return {
				showMoreDesc: false,
				env: 'develop',
				isAdminer: false,
				uid: 0,
				qrcode: 'https://r2.airmole.net/images/upload/quanyi_offical_qrcode.webp',
				datalist: [],
				hotDatalist: [],
				tags: ['其他', '食堂', '宿舍', '教学楼', '老师'],
				tag: '[0,1,2,3,4]',
				tagList: [{
				  title: '所有',
				  value: '[0,1,2,3,4]'
				}, {
				  title: '食堂',
				  value: '[1]'
				}, {
				  title: '宿舍',
				  value: '[2]'
				}, {
				  title: '教学楼',
				  value: '[3]'
				}, {
				  title: '老师',
				  value: '[4]'
				}, {
				  title: '其他',
				  value: '[0]'
				}],
				backpage: '1'
			}
		},
		onLoad() {
			uni.showLoading({ title: 'loading...' })
			// #ifdef MP
			this.env = app.globalData.env
			if (app.globalData.env !== 'release') {
				uni.switchTab({ url: '../../index/index' })
			}
			// #endif
			this.inital()
		},
		onShow() {
			let pages = getCurrentPages()
			let currPage = pages[pages.length - 1]
			const page = currPage.data.backpage ? currPage.data.backpage : '1'
			this.inital(page)
		},
		methods: {
			inital: function (page = 1) {
			    this.getDatalist(page)
			    this.getHotDatalist()
				const edusysAccount = getEdusysAccount()
			    const uid = (edusysAccount && edusysAccount.account) ? edusysAccount.account : 0
			    this.uid = uid
			    this.isAdminerMthod(uid)
			  },
			  getDatalist: function (page = 1, tag = '[0,1,2,3,4]') {
				api.fetchRightsProtectionIndex(page, this.tag).then(res => {
					this.datalist = res.data
					uni.hideLoading()
				})
			  },
			  getHotDatalist: function (page = 1, hot = [1]) {
				api.fetchRightsProtectionIndex(page, '[0,1,2,3,4]', JSON.stringify(hot)).then(res => {
					this.hotDatalist = res.data
				})
			  },
			  tagChanged: function (index) {
			    const tag = this.tagList[index].value
			    // console.log(type, orderby);
			    this.tag = tag
			    this.getDatalist(1, tag);
			  },
			  isAdminerMthod: function(uid = 0) {
				api.fetchIsRightsProtectionAdminer(uid).then(res => {
					app.globalData.isBoardAdminer = false
					if (res.data.code == 200 && res.data.message == 'success') {
					  this.isAdminer = true
					  app.globalData.isBoardAdminer = true
					}
				}).catch(res => {
					console.log('不是权益管理员')
				})
			  },
			  deleteConfirm: function(id) {
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
					try {
					  if (res.statusCode == 200 && res.data.code == 200) {
					    uni.hideLoading()
					    uni.showToast({ title: res.data.message })
					    this.getDatalist()
					  }
					} catch (error) {
					  uni.hideLoading()
					  uni.showToast({ title: res.data.message, icon: 'none' })
					}
				})
			  },
			  previewImage:function (allurl, url) {
			    uni.previewImage({ urls: allurl, current: url })
			  },
			  unfoldDesc: function () {
			    const showMoreDesc = this.showMoreDesc
			    this.showMoreDesc = !showMoreDesc
			  },
			  goFaqPage () {
			    uni.navigateTo({ url: './faq'})
			  },
			  // 上一页
			  lastPage: function () {
				uni.showLoading({ title: 'loading...'})
			    const current = this.datalist.pagination.current
			    const targetPage = current > 1 ? Number(current) - 1 : 2
			    this.getDatalist(targetPage)
			  },
			  // 下一页
			  nextPage: function () {
				uni.showLoading({ title: 'loading...'})
			    const current = this.datalist.pagination.current
			    const last = this.datalist.pagination.last
			    const targetPage = current < last ? Number(current) + 1 : last
			    this.getDatalist(targetPage)
			}
		}
	}
</script>

<style>

</style>
