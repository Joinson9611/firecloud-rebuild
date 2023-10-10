import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getDTUList(params) {
	return request({
		url: "dtus/list",
		method: "get",
		params
	})
}

export function getDTUMenu(params) {
	return request({
		url: "dtus/menu",
		method: "get",
		params
	})
}


// 增
export function addDTU(data) {
	return request({
		url: "dtus/add",
		method: "post",
		data
	})
}

// 改
export function editDTU(data, id) {
	return request({
		url: `dtus/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteDTU(id) {
	return request({
		url: `dtus/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getDTUInfo(id) {
	return request({
		url: `dtus/${id}/info`,
		method: "get"
	})
}
