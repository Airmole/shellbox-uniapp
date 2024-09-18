export const menuList = [{
	title: '课表成绩',
	fold: false,
	items: [{
		id: 'myCourse',
		icon: 'wodekebiao',
		teacher: true,
		student: true,
		name: '我的课表',
		url: '../course/my',
		login: true,
	}, {
		id: 'score',
		icon: 'chengji',
		teacher: false,
		student: true,
		name: '成绩查询',
		url: '../score/score',
		login: true,
	}]
}]