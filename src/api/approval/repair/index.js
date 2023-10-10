import { request } from "@/utils/service"

// 查
export function getApprovalList(params) {
	return request({
		url: "approvalmbs/list",
		method: "get",
		params
	})
}

// 审核
export function approval(data, id) {
	return request({
		url: `approvalmbs/${id}/approval`,
		method: "put",
		data
	})
}

// 材料更换审核
export function mrrApproval(data, id) {
	return request({
		url: `approvalmbs/${id}/mrrapproval`,
		method: "put",
		data
	})
}

// 详情
export function getApprovalInfo(id) {
	return request({
		url: `approvalmbs/${id}/info`,
		method: "get"
	})
}
