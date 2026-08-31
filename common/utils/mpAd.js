// #ifdef MP-WEIXIN
const WEIXIN_AD_UNIT_ID = 'adunit-c142eaf344ea8f4b'
// #endif
// #ifdef MP-QQ
const QQ_AD_UNIT_ID = '8fe9b8e7191346a2ffb0c20c6bf3e0cf'
// #endif

/**
 * 初始化插屏广告（微信/QQ小程序通用）
 * @returns {Object|null} 广告实例，不支持时返回 null
 */
export function initInterstitialAd() {
	let interstitialAd = null
	// #ifdef MP-WEIXIN
	if (wx.createInterstitialAd) {
		interstitialAd = wx.createInterstitialAd({ adUnitId: WEIXIN_AD_UNIT_ID })
	}
	// #endif
	// #ifdef MP-QQ
	if (qq.createInterstitialAd) {
		interstitialAd = qq.createInterstitialAd({ adUnitId: QQ_AD_UNIT_ID })
	}
	// #endif
	return interstitialAd
}

/**
 * 初始化激励视频广告
 */
export function initalVideoAd (callback, callbackData, actionText = '完成操作', adUnitId = 'adunit-6eaa05f3467dce0c') {
	// #ifdef MP-WEIXIN
	if (uni.createRewardedVideoAd) {
		let videoAd = uni.createRewardedVideoAd({ adUnitId, multiton: true })
		videoAd.onLoad()
		videoAd.onError((err) => {
			console.error('激励视频广告加载失败', err)
			uni.showModal({ title: err, showCancel: false })
		})
		videoAd.onClose((res) => {
			if (res.isEnded) {
				callback(callbackData)
			} else {
				uni.showToast({ title: `广告中断，无法${actionText}`, icon: 'none'})
			}
		})
		return videoAd
	}
	// #endif
}

/**
 * 播放激励视频广告
 */
export function startPlayVideoAd(
	videoAd,
	callback,
	callbackData,
	tips = '非VIP会员需要观看广告!',
	isVip = false,
	confirmText = '观看广告',
	cancelText = '取消操作'
) {
	// #ifdef MP-WEIXIN
	if (!isVip) {
		uni.showModal({
				title: '会员功能',
				content: tips,
				cancelText,
				confirmText,
				success: function (res) {
					if (res.confirm && videoAd) {
						videoAd.show().catch(() => {
							// 失败重试
							videoAd.load()
								.then(() => videoAd.show()).catch(err => {
									console.error('激励视频 广告显示失败', err)
									uni.showModal({ title: err, showCancel: false })
								})
						})
					}
				}
			})
	} else {
		callback(callbackData)
	}
	// #endif
	// #ifdef H5
	callback(callbackData)
	// #endif
}
