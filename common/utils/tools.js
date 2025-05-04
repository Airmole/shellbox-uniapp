export function getYMDByDateString(s) {
	return [s.slice(0, 4), s.slice(4,6), s.slice(6)]
}

// 0-6 对应 周天-周六
const weekNameList = ['周日','周一','周二','周三','周四','周五','周六']
export function getWeekNameByDayNumber(n) {
	return weekNameList[n]
}

export function httpBuildQuery (object) {
	let formBody = []
	for (let key in object) {
	  let encodedKey = encodeURIComponent(key)
	  let encodedValue = encodeURIComponent(object[key])
	  formBody.push(encodedKey + '=' + encodedValue)
	}
	return formBody.join('&')
}

export function getTodayDateString () {
	var date = new Date()
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()
	return `${year}-${month}-${day}`
}
