import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getPatrolList(params) {
	return request({
		url: "patrols/list",
		method: "get",
		params
	})
}

export function getPatrolAllList(params) {
	return request({
		url: "/patrols/alllist",
		method: "get",
		params
	})
}
