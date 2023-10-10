import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getPatrolList(params) {
	return request({
		url: "patrolsecs/list",
		method: "get",
		params
	})
}

// 获取消防巡更点系统类型下拉菜单
export function getPatrolSysMenu(params) {
	return request({
		url: "/patrolsecsystemtypes/menu",
		method: "get",
		params
	})
}

// 获取消防巡更点设备类型下拉菜单
export function getPatrolDevMenu(params) {
	return request({
		url: "/patrolsecdevicetypes/menu",
		method: "get",
		params
	})
}

// 导出
export function exportPatrol(params) {
	return request({
		url: "patrolsecs/export",
		method: "get",
		params,
		responseType: "blob"
	})
}

// 导入
export function importPatrol(data) {
	return request({
		url: "patrolsecs/import",
		method: "post",
		data,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	})
}

// 增
export function addPatrol(data) {
	return request({
		url: "patrolsecs/add",
		method: "post",
		data,
    headers: {
			"Content-Type": "multipart/form-data"
		}
	})
}
// 改
export function editPatrol(data, id) {
	return request({
		url: `patrolsecs/${id}/edit`,
		method: "put",
		data,
    headers: {
			"Content-Type": "multipart/form-data"
		}
	})
}

// 删
export function deletePatrol(id) {
	return request({
		url: `patrolsecs/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getPatrolInfo(id) {
	return request({
		url: `patrolsecs/${id}/info`,
		method: "get"
	})
}
