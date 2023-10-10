import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getPositionList(params) {
	return request({
		url: "positions/list",
		method: "get",
		params
	})
}
// 岗位下拉列表
export function getPositionMenu(params) {
	return request({
		url: "positions/menu",
		method: "get",
    params
	})
}

// 数据权限菜单
export function getPermissionMenu(params) {
	return request({
		url: "positions/datapermissions/menu",
		method: "get",
		params
	})
}

// 增
export function addPosition(data) {
	return request({
		url: "positions/add",
		method: "post",
		data
	})
}


// 改
export function editPosition(data, id) {
	return request({
		url: `positions/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deletePosition(id) {
	return request({
		url: `positions/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getPositionInfo(id) {
	return request({
		url: `positions/${id}/info`,
		method: "get"
	})
}
