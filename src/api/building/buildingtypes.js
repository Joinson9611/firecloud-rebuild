import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getBuildingTypeList(params) {
	return request({
		url: "buildingtypes/menu",
		method: "get",
		params
	})
}
