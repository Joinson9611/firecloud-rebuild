import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getDeviceList(params) {
	return request({
		url: "device51s/list",
		method: "get",
		params
	})
}

// 导出
export function exportDevice(params) {
	return request({
		url: "device51s/export",
		method: "get",
		params,
		responseType: "blob"
	})
}

// 导入
export function importDevice(data) {
	return request({
		url: "device51s/import",
		method: "post",
		data,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	})
}

// 增
export function addDevice(data) {
	return request({
		url: "device51s/add",
		method: "post",
		data
	})
}

// 改
export function editDevice(data, id) {
	return request({
		url: `device51s/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteDevice(id) {
	return request({
		url: `device51s/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getDeviceInfo(id) {
	return request({
		url: `device51s/${id}/info`,
		method: "get"
	})
}
