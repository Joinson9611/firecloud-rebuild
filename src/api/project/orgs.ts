import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getOrgTree(params) {
	return request({
		url: "orgs/tree",
		method: "get",
		params
	})
}

// 增
export function addOrg(data) {
	return request({
		url: "orgs/add",
		method: "put",
		data
	})
}
// 增
export function addCompany(data) {
	return request({
		url: "orgs/addcompany",
		method: "post",
		data
	})
}


// 改
export function editOrg(data, id) {
	return request({
		url: `orgs/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteOrg(id) {
	return request({
		url: `orgs/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getOrgInfo(id) {
	return request({
		url: `orgs/${id}/info`,
		method: "get"
	})
}
