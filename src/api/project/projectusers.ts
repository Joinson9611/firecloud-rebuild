import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getUserList(params) {
	return request({
		url: "projectusers/list",
		method: "get",
		params
	})
}

export function getUserMenu(params) {
	return request({
		url: "projectusers/menu",
		method: "get",
		params
	})
}

// 增
export function addUser(data) {
	return request({
		url: "projectusers/add",
		method: "post",
		data
	})
}

// 改
export function editUser(data, id) {
	return request({
		url: `projectusers/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteUser(id) {
	return request({
		url: `projectusers/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getUserInfo(id) {
	return request({
		url: `projectusers/${id}/info`,
		method: "get"
	})
}

// 重置密码
export function resetPassword(data, id) {
	return request({
		url: `projectusers/${id}/resetpassword`,
		method: "post",
		data
	})
}
