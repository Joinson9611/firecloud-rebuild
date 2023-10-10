import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getPatrolList(params) {
	return request({
		url: "patroldevs/list",
		method: "get",
		params
	})
}

// 导出
export function exportPatrol(params) {
	return request({
		url: "patroldevs/export",
		method: "get",
		params,
		responseType: "blob"
	})
}

// 导入
export function importPatrol(data) {
	return request({
		url: "patroldevs/import",
		method: "post",
		data,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	})
}

// 增
export function addPatrol(data) {
	return request({
		url: "patroldevs/add",
		method: "post",
		data,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	})
}

// 改
export function editPatrol(data, id) {
	return request({
		url: `patroldevs/${id}/edit`,
		method: "put",
		data,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	})
}

// 删
export function deletePatrol(id) {
	return request({
		url: `patroldevs/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getPatrolInfo(id) {
	return request({
		url: `patroldevs/${id}/info`,
		method: "get"
	})
}
