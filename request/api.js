import { request } from './index.js'
import { httpBuildQuery } from '../common/utils/tools.js'

export default {
	// 登录换取openID
	uniLogin: (data) => {
		return request('/weapp/login/code', 'POST', data)
	},
	// 获取菜单列表
	fetchMenuList () {
		return request(`/menu`, `GET`)
	},
	// 获取登录页背景图
	getLoginBackground: () => {
		return request('/login/image', 'GET')
	},
	// 自动登录接口
	autoLogin: (data) => {
		return request('/login', 'POST', data)
	},
	// 获取资料
	fetchProfile: () => {
		return request('/profile', 'GET')
	},
	// 更新资料
	updateProfile: (data) => {
		return request('/profile', 'PUT', data)
	},
	// 个人学期课表筛选项
	fetchSemesterCourseOptions: () => {
		return request(`/edusys/course/semester/options`, 'GET')
	},
	// 个人学期课表
	fetchSemesterCourse: (semester = '', week = '') => {
		return request(`/edusys/course/semester?semester=${semester}&week=${week}`, 'GET')
	},
	// 个人当天日期本周课表
	fetchDateCourse: (date = '') => {
		return request(`/edusys/course/date?date=${date}`, 'GET')
	},
	// 成绩查询筛选项
	fetchScoreOptions: () => {
		return request(`/edusys/score/options`, 'GET')
	},
	// 成绩查询
	fetchScore: (semester = '', nature = '', course = '', show = '') => {
		const params = {}
		if (semester.length > 0) params.semester = semester
		if (nature.length > 0) params.nature = nature
		if (course.length > 0) params.course = course
		if (show.length > 0) params.show = show
		let queryString = ''
		const queryStringArray = []
		for (let key in params) {
			const value = params[key]
			const queryString = `${key}=${encodeURIComponent(value)}`
			queryStringArray.push(queryString)
		}
		queryString = queryStringArray.join('&')
		// console.log(queryString)
		return request(`/edusys/score?${queryString}`, 'GET')
	},
	// 首页组件数据
	fetchHomeWidget(widgetNameList = []) {
		if (!Array.isArray(widgetNameList)) {
			widgetNameList = []
		}
		const paramsStr = widgetNameList.join(',')
		return request(`/widget/batch?widgets=${paramsStr}`, 'GET')
	},
	// 校历查询
	fetchCalendar() {
		return request(`/edusys/calendar`, `GET`)
	},
	// 获取校历筛选项
	fetchCalendarOptions () {
		return request(`/edusys/calendar/options`, `GET`)
	},
	// 获取校历图片
	getSchoolCalendarImage (semester = '') {
		return request(`/edusys/calendar/image?semester=${semester}`, `GET`)
	},
	// 班级课表筛选项
	fetchClassCourseOptions () {
		return request(`/edusys/course/class/options`, `GET`)
	},
	// 班级课表专业选项
	fetchClassCourseProfessionOptions (collegeCode = '', grade = '') {
		let query = {}
		if (collegeCode !== '') query.collegeCode = collegeCode
		if (grade !== '') query.grade = grade
		const queryString = httpBuildQuery(query)
		return request(`/edusys/course/class/professionOptions?${queryString}`, `GET`)
	},
	// 获取班级课表
	fetchClassCourse (
		semester = '',
		timeModel = '',
		college = '',
		grade= '',
		profession = '',
		className = '',
		weekStart = '',
		weekEnd = '',
		dayOfWeekStart = '',
		dayOfWeekEnd = '',
		serialNoStart = '',
		serialNoEnd = ''
	) {
		let query = {}
		if (semester.length) query.semester = semester
		if (timeModel.length) query.timeModel = timeModel
		if (college.length) query.college = college
		if (grade.length) query.grade = grade
		if (profession.length) query.profession = profession
		if (className.length) query.className = className
		if (weekStart.length) query.weekStart = weekStart
		if (weekEnd.length) query.weekEnd = weekEnd
		if (dayOfWeekStart.length) query.dayOfWeekStart = dayOfWeekStart
		if (dayOfWeekEnd.length) query.dayOfWeekEnd = dayOfWeekEnd
		if (serialNoStart.length) query.serialNoStart = serialNoStart
		if (serialNoEnd.length) query.serialNoEnd = serialNoEnd
		const queryString = httpBuildQuery(query)
		return request(`/edusys/course/class/course?${queryString}`, `GET`)
	},
	// 教师课表筛选项
	fetchTeacherCourseOptions () {
		return request(`/edusys/course/teacher/options`, `GET`)
	},
	// 获取教师课表
	fetchTeacherCourse (
		semester = '',
		timeModel = '',
		college = '',
		teacherName = '',
		weekStart = '',
		weekEnd = '',
		dayOfWeekStart = '',
		dayOfWeekEnd = '',
		serialNoStart = '',
		serialNoEnd = ''
	) {
		let query = {}
		if (semester.length) query.semester = semester
		if (timeModel.length) query.timeModel = timeModel
		if (college.length) query.college = college
		if (teacherName.length) query.teacherName = teacherName
		if (weekStart.length) query.weekStart = weekStart
		if (weekEnd.length) query.weekEnd = weekEnd
		if (dayOfWeekStart.length) query.dayOfWeekStart = dayOfWeekStart
		if (dayOfWeekEnd.length) query.dayOfWeekEnd = dayOfWeekEnd
		if (serialNoStart.length) query.serialNoStart = serialNoStart
		if (serialNoEnd.length) query.serialNoEnd = serialNoEnd
		const queryString = httpBuildQuery(query)
		return request(`/edusys/course/teacher/course?${queryString}`, `GET`)
	},
	// 课程课表筛选项
	fetchLessonCourseOptions () {
		return request(`/edusys/course/lesson/options`, `GET`)
	},
	// 获取课程课表
	fetchLessonCourse (
		semester = '',
		timeModel = '',
		studyCollege = '',
		teachCollege = '',
		courseNature = '',
		courseName = '',
		weekStart = '',
		weekEnd = '',
		dayOfWeekStart = '',
		dayOfWeekEnd = '',
		serialNoStart = '',
		serialNoEnd = ''
	) {
		let query = {}
		if (semester.length) query.semester = semester
		if (timeModel.length) query.timeModel = timeModel
		if (studyCollege.length) query.studyCollege = studyCollege
		if (teachCollege.length) query.teachCollege = teachCollege
		if (courseNature.length) query.courseNature = courseNature
		if (courseName.length) query.courseName = courseName
		if (weekStart.length) query.weekStart = weekStart
		if (weekEnd.length) query.weekEnd = weekEnd
		if (dayOfWeekStart.length) query.dayOfWeekStart = dayOfWeekStart
		if (dayOfWeekEnd.length) query.dayOfWeekEnd = dayOfWeekEnd
		if (serialNoStart.length) query.serialNoStart = serialNoStart
		if (serialNoEnd.length) query.serialNoEnd = serialNoEnd
		const queryString = httpBuildQuery(query)
		return request(`/edusys/course/lesson/course?${queryString}`, `GET`)
	},
	// 教师获取授课列表
	fetchTeacherCourseList () {
		return request(`/edusys/teacher/course/list`, `GET`)
	},
	// 教师获取授课课堂花名册
	fetchTeacherCourseStudentList (code) {
		return request(`/edusys/teacher/course/list/student?code=${code}`, `GET`)
	},
	// 学校系部联系电话
	getSchoolContact () {
		return request(`/school/contact`, `GET`)
	},
	// 获取教学地点列表
	fetchClassroomList (type = 'classroom', buildingId = '') {
		let query = { type, buildingId }
		const queryString = httpBuildQuery(query)
		let url = `/edusys/classroom/list`
		return request(`${url}?${queryString}`, `GET`)
	},
	// 教室状态查询筛选项
	fetchClassroomOptions () {
		let url = `/edusys/classroom/status/options`
		// url = `https://apifoxmock.com/m1/3906316-3540911-default/wap/edusys/classroom/status/options`
		return request(url, `GET`)
	},
	// 教室借用状态查询
	fetchClassroomStatus (
		semester,
		timeModel,
		schoolArea = '',
		teachArea = '',
		classroomType = '',
		teachBuilding = '',
		classroomCode = '',
		peopleSign = '',
		peopleNum = '',
		classroomStatus = '',
		borrowCollege = '',
		classroomOwned = '',
		weekStart = '',
		weekEnd = '',
		dayOfWeekStart = '',
		dayOfWeekEnd = '',
		serialNoStart = '',
		serialNoEnd = ''
	) {
		let query = { semester, timeModel }
		if (schoolArea.length) query.schoolArea = schoolArea
		if (teachArea.length) query.teachArea = teachArea
		if (classroomType.length) query.classroomType = classroomType
		if (teachBuilding.length) query.teachBuilding = teachBuilding
		if (classroomCode.length) query.classroomCode = classroomCode
		if (peopleSign.length) query.peopleSign = peopleSign
		if (peopleNum.length) query.peopleNum = peopleNum
		if (classroomStatus.length) query.classroomStatus = classroomStatus
		if (borrowCollege.length) query.borrowCollege = borrowCollege
		if (classroomOwned.length) query.classroomOwned = classroomOwned
		if (weekStart.length) query.weekStart = weekStart
		if (weekEnd.length) query.weekEnd = weekEnd
		if (dayOfWeekStart.length) query.dayOfWeekStart = dayOfWeekStart
		if (dayOfWeekEnd.length) query.dayOfWeekEnd = dayOfWeekEnd
		if (serialNoStart.length) query.serialNoStart = serialNoStart
		if (serialNoEnd.length) query.serialNoEnd = serialNoEnd
		const queryString = httpBuildQuery(query)
		let url = `/edusys/classroom/status`
		return request(`${url}?${queryString}`, 'GET')
	},
	//教室借用详情
	fetchClassroomDetail (
		semester,
		timeModel,
		classroomCode,
		serialValue,
		dayOfWeek,
		startAt,
		endAt,
		weekStart = '',
		weekEnd = '',
		dayOfWeekStart = '',
		dayOfWeekEnd = '',
		serialNoStart = '',
		serialNoEnd = '',
		classroomStatus = ''
	) {
		let query = { semester, timeModel, classroomCode, serialValue, dayOfWeek, startAt, endAt }
		if (weekStart.length) query.weekStart = weekStart
		if (weekEnd.length) query.weekEnd = weekEnd
		if (dayOfWeekStart.length) query.dayOfWeekStart = dayOfWeekStart
		if (dayOfWeekEnd.length) query.dayOfWeekEnd = dayOfWeekEnd
		if (serialNoStart.length) query.serialNoStart = serialNoStart
		if (serialNoEnd.length) query.serialNoEnd = serialNoEnd
		const queryString = httpBuildQuery(query)
		let url = `/edusys/classroom/detail`
		return request(`${url}?${queryString}`, `GET`)
	},
	// 权益保护相关
	// 获取权益投诉帖
	fetchRightsProtectionIndex (page = 1, tag = '[0,1,2,3,4]', hot = '[0,1]') {
		return request(`/rightsProtection?page=${page}&tag=${tag}&hot=${hot}`, `GET`)
	},
	fetchRightsProtectionDetail (id, page = 1) {
		return request(`/rightsProtection/${id}?page=${page}`, `GET`)
	},
	postRightsProtection (data) {
		return request(`/rightsProtection`, `POST`, data)
	},
	updateRightsProtection (id, data) {
		return request(`/rightsProtection/${id}`, `POST`, data)
	},
	removeRightsProtection (id) {
		return request(`/rightsProtection/${id}`, `DELETE`)
	},
	fetchIsRightsProtectionAdminer (account) {
		return request(`/rightsProtection/adminer/${account}`, `GET`)
	},
	// 电影放映
	fetchMovieDay (date = '') {
		return request(`/school/movie?date=${date}`, 'GET')
	},
	fetchMovieMonthList (month = '') {
		return request(`/school/movie/month?month=${month}`, 'GET')
	},
	fetchMapAllPoi () {
		return request(`/school/map/poi`, 'GET')
	}
}