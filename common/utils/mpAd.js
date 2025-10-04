export function initalVideoAd (callback, callbackData, actionText = '完成操作') {
	console.log('initalVideoAd data', callbackData)
	// #ifdef MP-WEIXIN
	const adUnitId = 'adunit-6eaa05f3467dce0c'
	if (uni.createRewardedVideoAd) {
		let videoAd = uni.createRewardedVideoAd({ adUnitId: adUnitId })
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

export function startPlayVideoAd(
    videoAd,
	callback,
	callbackData,
	tips = '非VIP会员需要观看广告!',
	isVip = false,
	confirmText = '观看广告',
	cancelText = '取消操作'
) {
	console.log('startPlayVideoAd data', callbackData)
	// #ifdef MP-WEIXIN
	if (!isVip) {
		uni.showModal({
				title: '会员功能',
				content: tips,
				cancelText: cancelText,
				confirmText: confirmText,
				success: function (res) {
					if (res.confirm) {
						if (videoAd) {
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