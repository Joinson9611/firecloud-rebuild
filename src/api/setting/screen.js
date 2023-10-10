import { request } from "@/utils/service"
// import qs from "qs"

// 修改大屏中央大图
export function setCenterImg(params) {
	return request({
		url: "/settings/screen/setcenterpic",
		method: "put",
		params
	})
}

// 修改大屏logo
export function setLogoImg(params) {
	return request({
		url: "/settings/screen/setlogo",
		method: "put",
		params
	})
}
