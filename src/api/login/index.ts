import { request } from "@/utils/service"
import { words } from "lodash-es"
import type * as Login from "./types/login"

/** 获取登录验证码 */
export function getLoginCodeApi() {
	return request<Login.LoginCodeResponseData>({
		url: "login/code",
		method: "get"
	})
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
	return request<Login.LoginResponseData>({
		url: "users/login",
		method: "put",
		data
	})
}

/** 获取用户详情 */
export function getUserInfoApi(id: number) {
	return request<Login.UserInfoResponseData>({
		url: `users/${id}/userinfo`,
		method: "get"
	})
}

/** 登出 */
export function handlelogout() {
	return request({
		url: `users/logout`,
		method: "put"
	})
}
