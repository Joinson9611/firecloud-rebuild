import { request } from "@/utils/service"
import type * as Project from "./types/projects"
// import qs from "qs"

// 查
export function getProjectList(params: Project.getProjectRequestData) {
	return request({
		url: "projects/list",
		method: "get",
		params
	})
}

// 增
export function addProject(data) {
	return request({
		url: "projects/add",
		method: "post",
		data
	})
}

// 改
export function editProject(data, id) {
	return request({
		url: `projects/${id}/edit`,
		method: "put",
		data
	})
}

// 删
export function deleteProject(id) {
	return request({
		url: `projects/${id}/delete`,
		method: "delete"
	})
}

// 详情
export function getProjectInfo(id) {
	return request({
		url: `projects/${id}/info`,
		method: "get"
	})
}
