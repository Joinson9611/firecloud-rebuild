import { request } from "@/utils/service"
const map = ['approvaldevs','approvalsecs']
// 查
export function getApprovalList(params,type) {
	return request({
		url: `${map[type]}/list`,
		method: "get",
		params
	})
}

// 审核
export function approval(data,id,type) {
	return request({
		url: `${map[type]}/${id}/approval`,
		method: "put",
    data
	})
}


// 详情
export function getApprovalInfo(id,type) {
	return request({
		url: `${map[type]}/${id}/info`,
		method: "get",
	})
}
