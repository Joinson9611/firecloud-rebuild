import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getTaskcrList(params) {
	return request({
		url: "taskcrs/list",
		method: "get",
		params
	})
}

// 获取操作流程记录
export function getHistoryList(id) {
	return request({
    url: `taskcrs/${id}/history`,
		method: "get",
		params
	})
}


// 导出申请表
export function generateReport(id) {
	return request({
		url: `taskcrs/${id}/generate`,
		method: "get",
		responseType: "blob"
	})
}

// 增
export function addTaskcr(data) {
	return request({
		url: "taskcrs/add",
		method: "put",
		data
	})
}


// 详情
export function getTaskcrInfo(id) {
	return request({
		url: `taskcrs/${id}/info`,
		method: "get"
	})
}
