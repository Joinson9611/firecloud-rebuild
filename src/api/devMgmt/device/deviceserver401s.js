import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getDeviceList(params) {
	return request({
		url: "deviceserver401s/list",
		method: "get",
		params
	})
}

// 增
export function addDevice(data) {
	return request({
		url: "deviceserver401s/add",
		method: "post",
		data
	})
}

// 获取服务器下拉列表
export function getServiceMenu(params) {
	return request({
		url: "deviceserver401s/menu",
		method: "get",
		params
	})
}


// 改
export function editDevice(data, id) {
	return request({
		url: `deviceserver401s/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteDevice(id) {
	return request({
		url: `deviceserver401s/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getDeviceInfo(id) {
	return request({
		url: `deviceserver401s/${id}/info`,
		method: "get"
	})
}
