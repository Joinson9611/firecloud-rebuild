import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getSysTypeMenu(params) {
	return request({
		url: "systemtypeautombs/menu",
		method: "get",
		params
	})
}
