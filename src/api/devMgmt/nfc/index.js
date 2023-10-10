import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getNfcList(params) {
	return request({
		url: "nfcpatrols/list",
		method: "get",
		params
	})
}

// 获取巡更点列表
export function getPatrolList(params) {
	return request({
		url: "nfcpatrols/patrollist",
		method: "get",
		params
	})
}


// 导出
export function exportNfc(params) {
	return request({
		url: "nfcpatrols/export",
		method: "get",
		params,
		responseType: "blob"
	})
}

// 导入
export function importNfc(data) {
	return request({
		url: "nfcpatrols/import",
		method: "post",
		data,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	})
}

// 增
export function addNfc(data) {
	return request({
		url: "nfcpatrols/add",
		method: "post",
		data
	})
}

// 改
export function editNfc(data, id) {
	return request({
		url: `nfcpatrols/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteNfc(id) {
	return request({
		url: `nfcpatrols/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getNfcInfo(id) {
	return request({
		url: `nfcpatrols/${id}/info`,
		method: "get"
	})
}
