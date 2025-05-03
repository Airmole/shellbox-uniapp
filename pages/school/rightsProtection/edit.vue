<template>
	<view class="bg-cyan" style="height: 1900rpx;">
		<template v-if="env === 'release'">
		  <cu-custom bgColor="bg-cyan" :isBack="true">
		    <view>投诉维权信息</view>
		  </cu-custom>
		  <view class="page bg-cyan">
		
		    <!-- 填写表单内容 -->
		    <view class="margin-lr padding-top">
		      <view class="cu-form-group radius-top" v-if="!related && !reditid">
		        <view class="title text-black">投诉问题类型</view>
		        <picker @change="tagChange" :value="tag" :range="tags">
		          <view class="picker text-black">
		            {{tag?tags[tag]:'请选择投诉问题类型'}}
		          </view>
		        </picker>
		      </view>
		      <!-- 食堂窗口 -->
		      <template v-if="tag==1 && !related && !reditid">
		        <view class="cu-form-group">
		          <view class="title text-black">维权食堂</view>
		          <picker @change="canteenChange" :value="canteen" :range="canteens">
		            <view class="picker text-black" style="text-align: center;">
		              {{canteen?canteens[canteen]:'点击选择食堂'}}
		            </view>
		          </picker>
		          <input name="place_room" @input="roomInput" placeholder="填写具体窗口" type="text" style="padding-left: 20rpx;"></input>
		        </view>
		      </template>
		      <!-- 宿舍 -->
		      <template v-if="tag==2 && !related && !reditid">
		        <view class="cu-form-group">
		          <view class="title text-black">宿舍</view>
		          <picker @change="dormitoryChange" :value="dormitory" :range="dormitories">
		            <view class="picker text-black" style="text-align: center;">
		              {{dormitory?dormitories[dormitory]:'点击选择宿舍'}}
		            </view>
		          </picker>
		          <input name="place_room" @input="roomInput" placeholder="填写房间号" type="text" style="padding-left: 20rpx;"></input>
		        </view>
		      </template>
		      <!-- 教学楼 -->
		      <template v-if="tag==3 && !related && !reditid">
		        <view class="cu-form-group">
		          <view class="title text-black">教学楼</view>
		          <picker @change="teachBuildingChange" :value="teachBuilding" :range="teachBuildings">
		            <view class="picker text-black" style="text-align: center;">
		              {{teachBuilding?teachBuildings[teachBuilding]:'点击选择教学楼'}}
		            </view>
		          </picker>
		          <input name="place_room" @input="roomInput" placeholder=" 填写教室号" type="text" style="padding-left: 20rpx;"></input>
		        </view>
		      </template>
		      <!-- 图书馆 -->
		      <template v-if="tag==5 && !related && !reditid">
		        <view class="cu-form-group">
		          <view class="title text-black">图书馆</view>
		          <picker @change="libraryChange" :value="library" :range="libraries">
		            <view class="picker text-black" style="text-align: center;">
		              {{library?libraries[library]:'点击选择图书馆'}}
		            </view>
		          </picker>
		          <input name="place_room" @input="roomInput" placeholder="填写具体位置" type="text" style="padding-left: 20rpx;"></input>
		        </view>
		      </template>
		      <!-- 联系方式 -->
		      <view class="cu-form-group" v-if="!related && !reditid">
		        <view class="title text-black">联系方式</view>
		        <input name="concact" @input="mobileInput" placeholder="放心填写,仅工作人员可见" type="number"></input>
		      </view>
		      <!-- 投诉内容 -->
		      <view :class="'cu-form-group ' + (related ? 'margin-top radius-top' : '')">
		        <textarea :value="content" style="color: black;" maxlength="800" @input="contentInput" placeholder="投诉维权内容详细说明"></textarea>
		      </view>
		      <!-- 图片上传 -->
		      <view class="cu-bar bg-white">
		        <view class="action">图片(也可以不上传)</view>
		        <view class="action">{{imgList.length}}/4</view>
		      </view>
		      <view class="cu-form-group radius-bottom">
		        <view class="grid col-4 grid-square flex-sub">
		          <view class="bg-img" v-for="(pintem, pindex) in imgList" :key="pindex" @tap.stop="previewImage(pintem)">
		            <image :src="imgList[pindex]" mode='aspectFill'></image>
		            <view class="cu-tag bg-red" @tap.stop="DelImg(pindex)" data-index="{{pindex}}">
		              <text class="cuIcon-close"></text>
		            </view>
		          </view>
		          <view class="solids" @tap="chooseImage" v-if="imgList.length<4">
		            <text class="cuIcon-cameraadd"></text>
		          </view>
		        </view>
		      </view>
		    </view>
		    <!-- 发布提交按钮 -->
		    <view class="padding flex flex-direction">
		      <button class="cu-btn bg-blue lg round" @tap="postContent">发布</button>
		    </view>
		  </view>
		</template>
		<template v-else>
		  <view class="margin">
		    <tips tipsText="应官方审核要求，此功能已下线"></tips>
		  </view>
		</template>
	</view>
</template>

<script>
	const app = getApp()
	import { getEdusysAccount } from '@/common/utils/auth.js'
	import api from '@/request/api.js'
	import { request } from '@/request/index.js'
	export default {
		data() {
			return {
				env: 'develop',
				uid: 0,
				nickname: '',
				avatar: '',
				pindex: null,
				imgList: [],
				content: '',
				mobile: '',
				related: '',
				reditid: '',
				tag: null,
				tags: ['其他', '食堂', '宿舍', '教学楼', '老师', '图书馆'],
				canteen: null,
				canteens: ['一食堂', '二食堂', '三食堂'],
				library: null,
				libraries: ['理工图书馆', '社科图书馆'],
				teachBuilding: null,
				teachBuildings: [],
				dormitory: null,
				dormitories: [],
				placeRoom: ''
			}
		},
		onLoad(options) {
			// #ifdef MP
			this.env = app.globalData.env
			if (app.globalData.env !== 'release') {
				uni.switchTab({ url: '../../index/index' })
			}
			// #endif
			this.inital(options)
		},
		methods: {
			inital: function (options) {
			    let openid = app.getOpenId()
				if (typeof openid === 'object') openid = openid.openid
			    const nickname = openid
			    const avatar = 'https://r2.airmole.net/images/upload/4697920-5a559d389ef75773.webp'
				const edusysAccount = getEdusysAccount()
			    const uid = edusysAccount.account ? edusysAccount.account : 0
			    const related = options.id ? options.id : ''
			    const reditid = options.reditid ? options.reditid : ''
			    if (reditid != '') this.getDetailData(reditid, 1)
			    // 生成教学楼选择列表
			    const teachBuildings = []
			    for (let index = 1; index < 13; index++) {
			      teachBuildings.push(`${index}号教学楼`)
			    }
			    // 生成宿舍楼选择列表
			    const dormitories = []
			    for (let index = 1; index < 43; index++) {
			      dormitories.push(`${index}斋`)
			    }
			    
			    this.uid = uid
			    this.nickname = nickname
			    this.avatar = avatar
			    this.related = related
			    this.reditid = reditid
			    this.teachBuildings = teachBuildings
			    this.dormitories = dormitories
			  },
			  contentInput: function (e) {
			    this.content = e.detail.value
			  },
			  mobileInput: function (e) {
			    this.mobile = e.detail.value
			  },
			  roomInput: function (e) {
			    this.placeRoom = e.detail.value
			  },
			  tagChange(e) {
			      this.tag = e.detail.value
			  },
			  canteenChange(e) {
			    this.canteen = e.detail.value
			  },
			  libraryChange(e) {
			    this.library = e.detail.value
			  },
			  dormitoryChange(e) {
			    this.dormitory = e.detail.value
			  },
			  teachBuildingChange(e) {
			    this.teachBuilding = e.detail.value
			  },
			  previewImage: function (url) {
			    uni.previewImage({ urls: this.imgList, current: url })
			  },
			  DelImg: function (index) {
			    var _this = this
			    uni.showModal({
			      title: '注意',
			      content: '确定要删除这张图片？',
			      cancelText: '点错了',
			      confirmText: '删掉！',
			      success: res => {
			        if (res.confirm) {
			          _this.imgList.splice(index, 1)
			          _this.imgList = _this.imgList
			        }
			      }
			    })
			  },
			  chooseImage: function () {
			    var _this = this
			    uni.chooseMedia({
			      count: 1,
			      mediaType: ['image'],
			      sizeType: ['compressed'],
			      sourceType: ['album', 'camera'],
			      success: (res) => {
			        uni.showLoading({ title: '上传中...' })
			        var tempFilesSize = res.tempFiles[0].size
			        console.log('上传图片文件大小', tempFilesSize)
			        if (tempFilesSize > 4000000) { // 4M图片大小限制
			          uni.hideLoading()
			          uni.showToast({ title: '上传图片不能大于4M!', icon: 'none' })
			          return
			        }
			        _this.uploadImage(res.tempFiles[0].tempFilePath)
			      }
			    })
			  },
			  uploadImage: function (filepath) {
				request('','', filepath, true).then(res => {
					uni.hideLoading()
					const data = JSON.parse(res.data)
					if (res.statusCode == 200 || data.code == 200) {
					  console.log(data)
					  if (this.imgList.length != 0) {
					    this.imgList = this.imgList.concat(data.url)
					  } else {
					    this.imgList = [data.url]
					  }
					} else {
					  uni.showToast({ title: res.data.message, icon: 'none' })
					}
				})
			  },
			  postContent: function () {
			    // 编辑修改
			    if (this.reditid) {
			      const content = this.content
			      const images = this.imgList
			      if (content == '') {
			        uni.showToast({ title: '请填写正文内容！', icon: 'none' })
			        return
			      }
			      this.update(this.reditid, { content: content, images: images })
			      return
			    }
			    // 发布新帖、评论
			    const uid = this.uid
			    const nickname = this.nickname ? this.nickname : ''
			    const avatar = this.avatar ? this.avatar : ''
			    const content = this.content
			    const images = this.imgList
			    const related = this.related
			    const mobile = this.mobile
			    const tag = this.tag === null ? '0' : this.tag
			    let place_building = ''
			    let place_room = this.placeRoom
			    if (tag == 1) place_building = this.canteen === null ? '' : this.canteens[this.canteen]
			    if (tag == 2) place_building = this.dormitory === null ? '' : this.dormitories[this.dormitory]
			    if (tag == 3) place_building = this.teachBuilding === null ? '' : this.teachBuildings[this.teachBuilding]
			    if (tag == 5) place_building = this.library === null ? '' : this.libraries[this.library]
			    const data = {
			      uid: uid,
			      nickname: nickname,
			      avatar: avatar,
			      tag: tag,
			      content: content,
			      images: images,
			      mobile: mobile,
			      place_building: place_building,
			      place_room: place_room
			    }
			    if ((tag == '' || tag == null) && related == '') {
			      uni.showToast({ title: '请先选择投诉问题类型', icon: 'none' })
			      return
			    }
			    // 食堂、教学楼、宿舍问题选择位置验证
			    if ((tag <= 3 && tag >= 1) && (place_building == '' || place_room == '')) {
			      uni.showToast({ title: '请填写位置', icon: 'none' })
			      return
			    }
			    if (mobile.length < 5 && related == '') {
			      uni.showToast({ title: '请您务必输入正确联系方式,以便工作人员联系你', icon: 'none' })
			      return
			    }
			    if (related != '') data.related = related
			    if (content.length < 1) {
			      uni.showToast({ title: '请输入内容', icon: 'none' })
			      return
			    }
			    const templateIds = ['el20tge29Hz5-ZLDcKZABYj6BPiPK8eAUb4gumP01PQ']
			    const _this = this
			    if (related){
			      _this.sendPostRequest(data)
			      return
			    }
				console.log('data', data)
			    uni.requestSubscribeMessage({
			      tmplIds: templateIds,
			      success (res) {
			        _this.sendPostRequest(data)
			      },
			      fail (res) {
			        _this.sendPostRequest(data)
			      }
			    })
			  },
			  sendPostRequest: function (data) {
				uni.showLoading({ title: 'loading...'})
				api.postRightsProtection(data).then(res => {
					uni.hideLoading()
				  if (res.statusCode == 200 && res.data.code == 200) {
					uni.showToast({ title: '发布成功' })
					// 1秒后跳转上页
					setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 1000)
				  } else {
					uni.showToast({ title: (res.data.message || res.data.message), icon: 'none' })
				  }
				}).catch(res => {
					uni.hideLoading()
					if (res.statusCode === 422) {
						uni.showToast({ title: JSON.stringify(res.data.errors), icon: 'none' })
					} else {
						uni.showToast({ title: res.data.errors , icon: 'none' })
					}
				})
			  },
			  getDetailData: function (id, page = 1) {
				api.fetchRightsProtectionDetail(id, page).then(res => {
				  this.content = res.data.data.content.content
				  this.imgList = res.data.data.content.images
				}).catch(res => {
					uni.showToast({ title: (res.data.errors || res.data.message), icon: 'none' })
				})
			  },
			  update(id, data) {
				api.updateRightsProtection(id, data).then(res => {
				  if (res.statusCode == 200 && res.data.code == 200) {
					uni.showToast({ title: '修改成功' })
					// 1秒后跳转上页
					setTimeout(function () { uni.navigateBack({ delta: 1 }) }, 1000)
				  } else {
					uni.showToast({ title: res.data.message, icon: 'none' })
				  }
				}).catch(res => {
					if (res.statusCode === 422) {
						uni.showToast({ title: JSON.stringify(res.data.errors), icon: 'none' })
					} else {
						uni.showToast({ title: res.data.errors , icon: 'none' })
					}
				})
			  }
		}
	}
</script>

<style>

</style>
