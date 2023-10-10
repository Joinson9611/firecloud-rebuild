import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getDeviceList(params) {
	return request({
		url: "devices/list",
		method: "get",
		params
	})
}

// 设备类型下拉列表
export function getDevTypeMenu(params) {
	return request({
		url: "devicetypes/menu",
		method: "get",
		params
	})
}

// 系统类型下拉列表
export function getSysTypeMenu(params) {
	return request({
		url: "/systemtypes/menu",
		method: "get",
		params
	})
}

// 导出
export function exportDevice(params) {
	return request({
		url: "devices/export",
		method: "get",
		params,
		responseType: "blob"
	})
}

// 导入
export function importDevice(data) {
	return request({
		url: "devices/import",
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
		url: "devices/add",
		method: "post",
		data
	})
}

// 改
export function editDevice(data, id) {
	return request({
		url: `devices/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteDevice(id) {
	return request({
		url: `devices/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getDeviceInfo(id) {
	return request({
		url: `devices/${id}/info`,
		method: "get"
	})
}
