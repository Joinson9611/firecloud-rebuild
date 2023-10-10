import { request } from "@/utils/service"
// 获取维保设备类型下拉菜单
export function getMcdeviceTypes(params) {
	return request({
		url: "mcdevicetypes/menu",
		method: "get",
		params
	})
}
