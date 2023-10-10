import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getDevExpireList(params) {
	return request({
		url: "expireddevices/list",
		method: "get",
		params
	})
}

// 导出
export function exportDevExpire(params) {
	return request({
		url: "expireddevices/export",
		method: "get",
		params,
		responseType: "blob"
	})
}

// 导入
export function importDevExpire(data) {
	return request({
		url: "expireddevices/import",
		method: "post",
		data,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	})
}

// 改
export function editDevExpire(data) {
	return request({
		url: `expireddevices/batchedit`,
		method: "put",
		data
	})
}
