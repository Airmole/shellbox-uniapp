/**
 * 统一的手机日历日程添加工具函数
 * 检查添加手机日历权限并添加到系统日历
 * 由以下页面使用：
 * - /pages/book/reading.vue（归还图书提醒）
 * - /pages/course/calendar.vue（上课提醒）
 * - /pages/school/movie.vue（影片放映提醒）
 */

/**
 * 检查添加手机日历权限，确认后添加日程到手机日历
 * @param {Object} options - 配置对象
 * @param {string} options.modalContent - 确认弹窗提示文案
 * @param {Function} options.buildCalendarData - 构建 wx.addPhoneCalendar 参数的回调函数，返回日程数据对象
 * @param {Function} [options.onSuccess] - 添加成功后的回调
 */
export function addPhoneCalendarEvent({ modalContent = '', buildCalendarData, onSuccess }) {
	// #ifdef MP
	uni.getSetting({
		success(settingRes) {
			if (!settingRes.authSetting['scope.addPhoneCalendar']) {
				uni.authorize({
					scope: 'scope.addPhoneCalendar',
					success() {
						confirmAndAdd()
					},
					fail() {
						uni.openSetting()
					}
				})
			} else {
				confirmAndAdd()
			}
		}
	})
	// #endif
	
	function confirmAndAdd() {
		uni.showModal({
			title: '提示',
			content: modalContent,
			success: function(res) {
				if (!res.confirm) return
				if (typeof buildCalendarData !== 'function') return
				const calendarData = buildCalendarData()
				if (!calendarData) return
				// #ifdef MP
				wx.addPhoneCalendar({
					...calendarData,
					fail: function(error) {
						console.log(error)
					}
				})
				// #endif
				if (typeof onSuccess === 'function') onSuccess()
			}
		})
	}
}
