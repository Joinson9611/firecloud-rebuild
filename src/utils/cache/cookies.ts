/** 统一处理 Cookie */

import CacheKey from "@/constants/cacheKey"
import Cookies from "js-cookie"

export const getToken = () => {
	return Cookies.get(CacheKey.TOKEN)
}
export const setToken = (token: string) => {
	Cookies.set(CacheKey.TOKEN, token)
}
export const removeToken = () => {
	Cookies.remove(CacheKey.TOKEN)
}

export const getUserId = () => {
	return Cookies.get(CacheKey.USER_ID)
}
export const setUserId = (user_id: string) => {
	Cookies.set(CacheKey.USER_ID, user_id)
}
export const removeUserId = () => {
	Cookies.remove(CacheKey.USER_ID)
}

export const getProjectId = () => {
	return Cookies.get(CacheKey.PROJECT_ID)
}
export const setProjectId = (project_id: string) => {
	Cookies.set(CacheKey.PROJECT_ID, project_id)
}
export const removeProjectId = () => {
	Cookies.remove(CacheKey.PROJECT_ID)
}
