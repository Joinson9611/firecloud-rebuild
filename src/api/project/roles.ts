import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getRoleList(params) {
	return request({
		url: "roles/list",
		method: "get",
		params
	})
}

// 下拉菜单
export function getRoleMenu(params) {
	return request({
		url: "roles/menu",
		method: "get",
    params
	})
}

// 增
export function addRole(data) {
	return request({
		url: "roles/add",
		method: "post",
		data
	})
}


// 改
export function editRole(data, id) {
	return request({
		url: `roles/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteRole(id) {
	return request({
		url: `roles/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getRoleInfo(id) {
	return request({
		url: `roles/${id}/info`,
		method: "get"
	})
}
