import { request } from "@/utils/service"
// 修改设置信息
export function setMcitem(data) {
	return request({
		url: "settings/mcitems/edit",
		method: "put",
		data
	})
}
// 查
export function getMcitemList(params) {
	return request({
		url: "settings/mcitems/list",
		method: "get",
		params
	})
}

