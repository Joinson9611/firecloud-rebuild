import { request } from "@/utils/service"
// 获取维保系统类型下拉菜单
export function getMcsystemTypes(params) {
	return request({
		url: "mcsystemtypes/menu",
		method: "get",
		params
	})
}
