import { request } from "@/utils/service"
// import qs from "qs"
const map = ["tdeviceitempatrolsecs", "tdeviceitems"]
// 查
export function getDevItemList(params, type) {
	return request({
		url: `${map[type]}/list`,
		method: "get",
		params
	})
}

// 增
export function addDevItem(data, type) {
	return request({
		url: `${map[type]}/add`,
		method: "post",
		data
	})
}

// 改
export function editDevItem(data, id, type) {
	return request({
		url: `${map[type]}/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteDevItem(id, type) {
	return request({
		url: `${map[type]}/${id}/delete`,
		method: "delete"
	})
}
