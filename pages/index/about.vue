<template>
	<view class="padding-bottom-xxl margin-bottom-xxl">	
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>关于 - 贝壳小盒子</view>
		</cu-custom>
		
		<view class="flex flex-direction justify-center align-center margin-top-xl">
			<view><image @tap="previewImage(logoImage)" class='cu-avatar card-radius' style="height: 160rpx;width: 160rpx;" :src="logoImage"
					mode="aspectFit"></image></view>
			<view class="text-xl margin-tb-xs"><text>贝壳小盒子</text></view>
			<!-- #ifdef MP -->
			<view v-if="version" class="margin-tb-xs">Version <view @tap="checkUpdate" class="margin-lr-sm cu-tag line-blue">v{{version}}</view></view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="margin-tb-xs">AppID：<text @tap="copyText(appId || 'wxf0ba93e3faff4eda')" class="text-blue">{{appId || 'wxf0ba93e3faff4eda'}}</text></view>
			<!-- #endif -->
			<!-- #ifdef MP-QQ -->
			<view class="margin-tb-xs">AppID：<text @tap="copyText(appId || '1109608669')" class="text-blue">{{appId || '1109608669'}}</text></view>
			<!-- #endif -->
			<view class="text-center margin-tb-xs"><text @tap="clickUrl('https://shellbox.airmole.cn')" class="text-blue">https://shellbox.airmole.cn</text></view>
		</view>
		
		<!-- 介绍 -->
		<view class="margin padding-sm bg-white card-radius">
			<text>贝壳小盒子是一款为本校师生定制化开发的校园工具类应用，为师生提供课表、成绩、教师、教室等相关教务信息查询服务，以及图书馆图书检索、音像放映，校园地图、教学校历等校园资讯信息。值得注意的是：<text class="text-red">贝壳小盒子是个人开发应用项目，并非学校官方开发出品</text>，因此所有数据信息仅供您参考，实际请以学校官方为准。</text>
		</view>
		
		<!-- 小程序码&二维码 -->
		<!-- #ifndef MP-QQ -->
		<view class="flex margin-lr margin-tb justify-around text-center bg-white padding-sm card-radius">
			<view class="">
				<view class="">
					<image @tap="previewImage('https://r2.airmole.net/i/2024/11/30/18vlto-0h.png')" :show-menu-by-longpress="true" class="cu-avatar xxl" src="https://r2.airmole.net/i/2024/11/30/18vlto-0h.png" mode="aspectFill"></image>
				</view>
				<view @tap="clickUrl('https://shellbox.ustb.tj.cn')" class="margin-tb-xs text-blue">https://shellbox.ustb.tj.cn</view>
			</view>
			<view class="">
				<view class="">
					<image @tap="previewImage('https://r2.airmole.net/i/2024/11/30/18yjmx-s4.jpg')" :show-menu-by-longpress="true" class="cu-avatar xxl" src="https://r2.airmole.net/i/2024/11/30/18yjmx-s4.jpg" mode="aspectFill"></image>
				</view>
				<view class="margin-tb-xs"><text v-if="isWechatH5">可长按识别</text><text v-else>微信小程序码</text></view>
			</view>
		</view>
		<!-- #endif -->
		
		<!-- 开源 -->
		<view class="margin-lr margin-tb-sm bg-white padding-lr-sm card-radius">
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-xl text-bold">开源项目</text>
				</view>
			</view>
			<view class="padding-bottom-sm">
				<text class="cuIcon-info"></text> 本项目前端代码已于 <text class="cuIcon-github">Github</text> 开源，欢迎fork参与开发优化。<br/>
				前端项目：<text @tap="clickUrl('https://github.com/Airmole/shellbox-uniapp')" class="text-blue"><text class="cuIcon-github text-blue"></text>Airmole/shellbox-uniapp</text><br/>
				后端依赖：<text @tap="clickUrl('https://github.com/Airmole/tjustb-edusys')" class="text-blue"><text class="cuIcon-github text-blue"></text>Airmole/tjustb-edusys</text><br/>
			</view>
		</view>
		
		<!-- 打赏赞助 -->
		<view class="margin-lr margin-tb-sm bg-white padding-lr-sm card-radius">
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-xl text-bold">打赏赞助</text>
				</view>
			</view>
			<view class="padding-bottom-sm">
				<view class="flex align-center">
					<view class="">
						本应用属于个人开发项目，除小程序广告外无其他资金来源，仅能勉强维持每月服务器支出。<br/>
						如果贝壳小盒子在您的校园生活中确实有帮助到您，并且在不影响您正常生活消费的情况下有心打赏，那么不胜感激。您可以在打赏附言留下您的称呼，我会将您的支持永久展示到赞助榜
					</view>
					<view class="text-center margin-xs">
						<image @tap="previewImage('https://r2.airmole.net/i/2024/11/30/1bdnal-fm.webp')" :show-menu-by-longpress="true" style="height: 220rpx;width: 220rpx;" src="https://r2.airmole.net/i/2024/11/30/1bdnal-fm.webp" mode="aspectFill"></image>
						<br/><text v-if="isWechatH5">长按识别赞赏码</text><text v-else>微信赞赏码</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 用户社群 -->
		<view class="margin-lr margin-tb-sm bg-white padding-lr-sm card-radius">
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-xl text-bold">用户社群</text>
				</view>
			</view>
			<view class="padding-bottom-sm">
				<view class="flex align-center justify-around text-center">
					<view class="">
						<image @tap="previewImage(`https://r2.airmole.net/images/weapp/wechat_group.png?t=${timestamp}`)" :show-menu-by-longpress="true" class="qrcode-image" :src="`https://r2.airmole.net/images/weapp/wechat_group.png?t=${timestamp}`" mode="aspectFill"></image>
						<br/><text v-if="isWechatH5"><text class="cuIcon-weixin text-xl"></text>长按识别加入微信群</text><text v-else><text class="cuIcon-weixin text-green"></text>微信群二维码</text>
					</view>
					<view class="">
						<image @tap="previewImage('https://r2.airmole.net/images/weapp/qq_group.png')" :show-menu-by-longpress="true" class="qrcode-image" src="https://r2.airmole.net/images/weapp/qq_group.png" mode="aspectFill"></image>
						<!-- #ifdef H5 -->
						<text v-if="!isWechatH5">
							<br/><a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=REj_D_sTDC2fsiZgqqKRIIMxO5mWMVTm&jump_from=webapi&authKey=lKz0z37IRzLL9wHBNptR/hRUCV6A6jUD8DMSu9Yf83qSJVDCmN/bETSOXqaQ72YO"><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" alt="QQ群(662675925)" title="QQ群(662675925)"></a>
						</text>
						<text v-else>
							<br/><text @tap="copyText('662675925')" class="text-blue">QQ群(662675925)</text>
						</text>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<br/><text @tap="copyText('662675925')" class="text-blue">QQ群(662675925)</text>
						<!-- #endif -->
						<!-- #ifdef MP-QQ -->
						<br/><text @tap="copyText('662675925')" class="text-blue">QQ群(662675925)</text>
						<!-- #endif -->
					</view>
				</view>
			</view>
		</view>
		
		<!-- 数据来源 -->
		<view class="margin-lr margin-tb-sm bg-white padding-lr-sm card-radius">
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-xl text-bold">数据来源</text>
				</view>
			</view>
			<view class="padding-bottom-sm">
				<view>
					<text class="cuIcon-title text-green"></text> 课表、成绩等教务信息数据来源于<text @tap="clickUrl('http://jw.bkty.top:89/jsxsd')" class="text-blue">学校教务网</text>
				</view>
				<view>
					<text class="cuIcon-title text-green"></text> 图书检索相关信息来源于<text @tap="clickUrl('http://opac.bkty.top')" class="text-blue">图书馆OPAC系统</text>
				</view>
				<view>
				 	<text class="cuIcon-title text-green"></text> 音像放映安排信息来源于<text @tap="goLibraryOffical" class="text-blue">图书馆微信公众号</text>
				</view>
				<view>
				 	<text class="cuIcon-title text-green"></text> 其余信息均来源于网络收集，如有侵权请<text @tap="goShellboxOffical" class="text-blue">联系我</text>
				</view>
			</view>
		</view>
		
		<!-- 操作列表 -->
		<view class="cu-list menu sm-border card-menu">
			<!-- #ifndef MP-QQ -->
		    <view @tap="goPrivacy" class="cu-item arrow">
		        <view class="content">
		            <text class="text-grey">隐私协议</text>
		        </view>
		    </view>
			<!-- #endif -->
			<!-- #ifdef MP -->
			<view @tap="checkUpdate" class="cu-item arrow">
			    <view class="content">
			        <text class="text-grey">检测版本更新</text>
			    </view>
			</view>
			<!-- #endif -->
			<view @tap="goUserGuide" class="cu-item arrow">
			    <view class="content">
			        <text class="text-grey">用户使用手册</text>
			    </view>
			</view>
			<view @tap="goJumpGuide" class="cu-item arrow">
			    <view class="content">
			        <text class="text-grey">公众号、小程序接入指引</text>
			    </view>
			</view>
			<view @tap="goFAQ" class="cu-item arrow">
			    <view class="content">
			        <text class="text-grey">FAQ(常见问题解答)文档</text>
			    </view>
			</view>
		</view>
		
		<!-- 备案信息 -->
		<view class="text-center margin">
			<!-- #ifdef MP -->
			<view class="margin-tb-xs">ICP备案：陇ICP备17001242号-4X</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="margin-tb-xs">ICP备案：陇ICP备17001242号-3</view>
			<!-- #endif -->
			<view class="margin-tb-xs"><text @tap="goShellboxOffical">@Airmole</text> | 2018-{{year}}</view>
		</view>
		
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				timestamp: '',
				logoImage: app.globalData.logoImageUrl,
				appId: '',
				version: '',
				isWechatH5: false,
				year: '2024'
			}
		},
		onLoad() {
			// #ifdef MP
			const accountInfo = uni.getAccountInfoSync()
			this.version = accountInfo.miniProgram.version
			this.appId = accountInfo.miniProgram.appId
			// #endif
			
			// #ifdef H5
			const isInWechatH5 = /micromessenger/i.test(navigator.userAgent)
			this.isWechatH5 = isInWechatH5
			// #endif
			this.year = (new Date()).getFullYear()
			this.timestamp = (new Date()).valueOf()
			console.log('this.year', this.year)
		},
		methods: {
			previewImage (image) {
				uni.previewImage({ urls: [image] })
			},
			copyText (text) {
				uni.setClipboardData({
					data: text,
					success() {
						uni.showToast({ title: '已复制到粘贴板' })
					}
				})
			},
			checkUpdate () {
				app.mpappUpdate('userClick')
			},
			clickUrl (url) {
				// #ifdef MP
				this.copyText(url)
				return
				// #endif
				
				// #ifdef H5
				uni.showLoading({ title: '加载中...' })
				window.location.href = url
				return
				// #endif
			},
			goPrivacy () {
				// #ifdef MP-WEIXIN
				wx.openPrivacyContract()
				// #endif
				// #ifdef H5
				uni.showLoading({ title: '加载中...' })
				window.location.href = 'https://mp.weixin.qq.com/wxawap/waprivacyinfo?action=show&appid=wxf0ba93e3faff4eda&uin=NzAzMDY5MTYx&key=daf9bdc5abc4e8d00b52309f7a57e7745045ac5c5dd36db87634096c1ad8de1245a7fc007c5ced485b1cbde43de0ddf5205f2591e059c93cda77956646a487bbfb1cc788d678ead931433cc83fd434902a38a01d84b51aba008649223d36573a11148bbcb4a64ee7d89ad52db0fe5703fb265cf96872be2099e43fdb9ec9fe76&version=2800363b'
				// #endif
			},
			goLibraryOffical () {
				uni.navigateTo({ url: '/pages/school/media?account=tjclib' })
			},
			goShellboxOffical () {
				uni.navigateTo({
					url: '/pages/school/media?account=USTBShellBox'
				})
			},
			goUserGuide () {
				// #ifdef MP-WEIXIN
				try {
					wx.openOfficialAccountArticle({url: 'https://mp.weixin.qq.com/s/XcTFGHHu57y9fw_t7F8A-w'})
				} catch (error) {
					uni.navigateTo({ url: '/pages/webview/webview?url=' + encodeURIComponent('https://mp.weixin.qq.com/s/XcTFGHHu57y9fw_t7F8A-w') })
				}
				// #endif
				// #ifdef MP-QQ
				this.copyText('https://mp.weixin.qq.com/s/XcTFGHHu57y9fw_t7F8A-w')
				// #endif
				// #ifdef H5
				uni.showLoading({ title: '加载中...' })
				window.location.href = 'https://mp.weixin.qq.com/s/XcTFGHHu57y9fw_t7F8A-w'
				// #endif
			},
			goJumpGuide () {
				// #ifdef MP
				wx.showActionSheet({
				  itemList: ['公众号菜单跳转小盒子', '公众号文章跳转小盒子', '小程序跳转小盒子'],
				  success (res) {
					let url = 'https://mp.weixin.qq.com/s/ID5bfB-T8xNoBWF_K4EI9g'
					if (res.tapIndex === 0) url = 'https://mp.weixin.qq.com/s/ID5bfB-T8xNoBWF_K4EI9g'
					if (res.tapIndex === 1) url = 'https://mp.weixin.qq.com/s/0gRrZAeRmvEk9riItn-gIA'
					if (res.tapIndex === 2) url = 'https://mp.weixin.qq.com/s/64xrmCb2fAT41bq53ChZSA'
					// #ifdef MP-WEIXIN
					uni.navigateTo({ url: '/pages/webview/webview?url=' + encodeURIComponent(url) })
					// #endif
					// #ifdef MP-QQ
					this.copyText(url)
					// #endif
				  }
				})
				// #endif
				// #ifdef H5
				uni.showLoading({ title: '加载中...' })
				window.location.href = 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzIyOTYyMjE1NQ==&action=getalbum&album_id=3752283129172738048#wechat_redirect'
				// #endif
			},
			goFAQ () {
				// #ifdef MP-WEIXIN
				uni.navigateToMiniProgram({ shortLink: '#小程序://腾讯文档/vmDnZwdqqLiY8Dp' })
				// #endif
				// #ifdef MP-QQ
				this.copyText('https://docs.qq.com/doc/DREhocFliTUFRS0dt')
				// #endif
				// #ifdef H5
				uni.showLoading({ title: '加载中...' })
				window.location.href = 'https://docs.qq.com/doc/DREhocFliTUFRS0dt'
				// #endif
			}
		}
	}
</script>

<style>
.qrcode-image {
	width: 200rpx;
	height: 200rpx;
}
</style>
