import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getRepairList(params) {
	return request({
		url: "taskmbs/list",
		method: "get",
		params
	})
}

// 获取操作流程记录
export function getHistoryList(id) {
	return request({
		url: `taskmbs/${id}/history`,
		method: "get",
		params
	})
}

// 详情
export function getRepairInfo(id) {
	return request({
		url: `taskmbs/${id}/info`,
		method: "get"
	})
}

// 导出
export function exportRepair(params) {
	return request({
		url: "taskmbs/export",
		method: "get",
		params,
		responseType: "blob"
	})
}
