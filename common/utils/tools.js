export function getYMDByDateString(s) {
	return [s.slice(0, 4), s.slice(4, 6), s.slice(6)]
}

// 0-6 对应 周天-周六
const weekNameList = ['周日','周一','周二','周三','周四','周五','周六']
export function getWeekNameByDayNumber(n) {
	return weekNameList[n]
}

/**
 * 将对象转换为URL查询字符串
 * 自动跳过 null/undefined 值，并正确序列化布尔值和数字
 */
export function httpBuildQuery (object = {}) {
	const formBody = []
	for (const key in object) {
		const value = object[key]
		if (value === null || value === undefined) continue
		const encodedKey = encodeURIComponent(key)
		const encodedValue = encodeURIComponent(String(value))
		formBody.push(`${encodedKey}=${encodedValue}`)
	}
	return formBody.join('&')
}

export function getTodayDateString () {
	const date = new Date()
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}
