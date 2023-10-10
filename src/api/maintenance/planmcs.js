import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getPlanList(params) {
	return request({
		url: "planmcs/list",
		method: "get",
		params
	})
}

// 增
export function addPlan(data) {
	return request({
		url: "planmcs/add",
		method: "post",
		data
	})
}

// 改
export function editPlan(data, id) {
	return request({
		url: `planmcs/${id}/edit`,
		method: "put",
		data
	})
}

// 生成维保报告
export function generateReport(id) {
	return request({
		url: `planmcs/${id}/generate`,
		method: "put"
	})
}

// 更新维保结论
export function editConlusion(data, id) {
	return request({
		url: `planmcs/${id}/conclusionedit`,
		method: "put",
		data
	})
}

// 删
export function deletePlan(id) {
	return request({
		url: `planmcs/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getPlanInfo(id) {
	return request({
		url: `planmcs/${id}/info`,
		method: "get"
	})
}
