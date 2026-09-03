/**
 * 统一的地点跳转工具函数
 * 根据地点名称匹配校园地图中的标记ID并跳转
 * 由以下页面使用：
 * - /pages/book/reading.vue（馆藏地跳转）
 * - /pages/book/components/collectionList.vue（馆藏地跳转）
 * - /pages/course/components/courseTable.vue（上课地点跳转）
 * - /pages/school/movie.vue（放映地点跳转）
 */

/**
 * 根据地点名称跳转到校园地图对应位置
 * @param {string} place - 地点名称，如 "7教201"、"社科馆三楼"、"理工馆"、"游泳馆" 等
 */
export function navigateToPlace(place = '') {
	if (!place) return
	
	// 教学楼主楼模式：如 "7教301"、"12教" 等
	const teachNoMatch = /\d{1,2}教/.exec(place)
	if (teachNoMatch) {
		const mapId = /\d{1,2}/.exec(place)
		uni.navigateTo({ url: `/pages/school/map?id=${mapId}` })
		return
	}
	
	// 按关键字匹配的固定地点
	const placeRules = [
		{ keywords: ['社科'], id: 14 },
		{ keywords: ['理工'], id: 15 },
		{ keywords: ['游泳馆'], id: 16 },
		{ keywords: ['体育馆'], id: 17 },
		{ keywords: ['活动中心'], id: 23 },
		{ keywords: ['众创'], id: 24 },
	]
	
	for (const rule of placeRules) {
		for (const keyword of rule.keywords) {
			if (place.includes(keyword)) {
				uni.navigateTo({ url: `/pages/school/map?id=${rule.id}` })
				return
			}
		}
	}
	
	uni.showToast({ title: '地点暂未收录，欢迎反馈', icon: 'none' })
}
