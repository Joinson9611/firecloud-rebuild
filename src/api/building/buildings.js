import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getBuildingList(params) {
	return request({
		url: "buildings/list",
		method: "get",
		params
	})
}

// 下拉列表
export function getBuildingMenu(params) {
	return request({
		url: "buildings/menu",
		method: "get",
    params
	})
}

// 增
export function addBuilding(data) {
	return request({
		url: "buildings/add",
		method: "post",
		data
	})
}


// 改
export function editBuilding(data, id) {
	return request({
		url: `buildings/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteBuilding(id) {
	return request({
		url: `buildings/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getBuildingInfo(id) {
	return request({
		url: `buildings/${id}/info`,
		method: "get"
	})
}
