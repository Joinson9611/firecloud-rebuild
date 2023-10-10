import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getFloorList(params) {
	return request({
		url: "floors/list",
		method: "get",
		params
	})
}

// 下拉列表
export function getFloorMenu(params) {
	return request({
		url: "floors/menu",
		method: "get",
    params
	})
}

// 更新楼层顺序
export function setFloorOrder(data) {
	return request({
		url: "floors/setorder",
		method: "put",
    data
	})
}

// 增
export function addFloor(data) {
	return request({
		url: "floors/add",
		method: "post",
		data
	})
}


// 改
export function editFloor(data, id) {
	return request({
		url: `floors/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteFloor(id) {
	return request({
		url: `floors/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getFloorInfo(id) {
	return request({
		url: `floors/${id}/info`,
		method: "get"
	})
}
