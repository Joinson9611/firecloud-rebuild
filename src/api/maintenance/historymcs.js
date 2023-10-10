import { request } from "@/utils/service"
// 查
export function getHistoryList(params) {
	return request({
		url: "historymcs/list",
		method: "get",
		params
	})
}

// 获取设备详细信息
export function getHistoryInfo(id) {
	return request({
		url: `historymcs/${id}/info`,
		method: "get"
	})
}
