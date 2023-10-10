import { request } from "@/utils/service"
// import qs from "qs"
const map = ["historysectasks", "historydevtasks"]
// 查
export function getHistoryTaskList(params, type) {
	return request({
		url: `${map[type]}/list`,
		method: "get",
		params
	})
}

// 导出
export function exportHistoryTask(params, type) {
	return request({
		url: `${map[type]}/export`,
		method: "get",
		params,
		responseType: "blob"
	})
}

// 详情
export function getHistoryTaskInfo(id, type) {
	return request({
		url: `${map[type]}/${id}/info`,
		method: "get"
	})
}

// 审核详情
export function getApprovalInfo(id, type) {
	return request({
		url: `${map[type]}/${id}/approvalinfo`,
		method: "get"
	})
}
