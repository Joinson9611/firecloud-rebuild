import { request } from "@/utils/service"

// 查
export function getApprovalList(params) {
	return request({
		url: "approvalcrs/list",
		method: "get",
		params
	})
}

// 审核
export function approval(data,id) {
	return request({
		url: `approvalcrs/${id}/approval`,
		method: "put",
    data
	})
}

// 详情
export function getApprovalInfo(id) {
	return request({
		url: `approvalcrs/${id}/info`,
		method: "get",
	})
}
