import { request } from "@/utils/service"
// import qs from "qs"
const map = ["taskpatrolsecs", "taskpatroldevs"]
// 查
export function getTaskList(params, type) {
	return request({
		url: `${map[type]}/list`,
		method: "get",
		params
	})
}

// 增
export function addTask(data, type) {
	return request({
		url: `${map[type]}/add`,
		method: "post",
		data
	})
}

// 改
export function editTask(data, id, type) {
	return request({
		url: `${map[type]}/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteTask(id, type) {
	return request({
		url: `${map[type]}/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getTaskInfo(id,type) {
	return request({
		url: `${map[type]}/${id}/info`,
		method: "get"
	})
}
