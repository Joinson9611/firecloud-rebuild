import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getSettingInfo() {
	return request({
		url: "settings/approvalmb/info",
		method: "get",
	})
}

// 改
export function setting(data,id) {
	return request({
		url: `settings/approvalmb/${id}/edit`,
		method: "put",
    data
	})
}
