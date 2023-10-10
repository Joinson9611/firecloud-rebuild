import { request } from "@/utils/service"
import "./systemtypeautombs.js"
// import qs from "qs"

// 查
export function getDevAutoList(params) {
	return request({
		url: "deviceautombs/list",
		method: "get",
		params
	})
}

// 导出
export function exportDevAuto(params) {
	return request({
		url: "deviceautombs/export",
		method: "get",
		params,
		responseType: "blob"
	})
}

// 导入
export function importDevAuto(data) {
	return request({
		url: "deviceautombs/import",
		method: "post",
		data,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	})
}

// 增
export function addDevAuto(data) {
	return request({
		url: "deviceautombs/add",
		method: "post",
		data
	})
}

// 改
export function editDevAuto(data, id) {
	return request({
		url: `deviceautombs/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteDevAuto(id) {
	return request({
		url: `deviceautombs/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getDevAutoInfo(id) {
	return request({
		url: `deviceautombs/${id}/info`,
		method: "get"
	})
}
