import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getDevRelationList(params) {
	return request({
		url: "devicerelations/list",
		method: "get",
		params
	})
}

// 导出
export function exportDevRelation(params) {
	return request({
		url: "devicerelations/export",
		method: "get",
		params,
		responseType: "blob"
	})
}

// 导入
export function importDevRelation(data) {
	return request({
		url: "devicerelations/import",
		method: "post",
		data,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	})
}

// 增
export function addDevRelation(data) {
	return request({
		url: "devicerelations/add",
		method: "post",
		data
	})
}

// 删
export function deleteDevRelation(id) {
	return request({
		url: `devicerelations/${id}/delete`,
		method: "delete"
	})
}


