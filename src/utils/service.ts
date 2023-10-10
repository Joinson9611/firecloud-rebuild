import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage, ElMessageBox } from "element-plus"
import { getToken, getProjectId } from "./cache/cookies"
import { get } from "lodash-es"
/** 创建请求实例 */
function createService() {
	// 创建一个 Axios 实例
	const service = axios.create()
	// 请求拦截
	service.interceptors.request.use(
		(config) => {
			const userStore = useUserStoreHook()
			const TOKEN = userStore.token
			const PROJECT_ID = userStore.projectId
			if (TOKEN) {
				config.headers["Authorization"] = getToken()
			} else {
				config.headers["Authorization"] = ""
			}
			if (PROJECT_ID) {
				config.headers["Project"] = getProjectId()
			} else {
				// 如果项目ID为空去掉这个字段
				if (config.headers.hasOwnProperty("Project")) {
					delete config.headers.Project
				}
			}
			return config
		},
		// 发送失败
		(error) => Promise.reject(error)
	)
	// 响应拦截（可根据具体业务作出相应的调整）
	service.interceptors.response.use(
		(response) => {
      const apiData = response.data as any
      // response.config 是请求头的配置信息不要搞混了
			//流文件直接返回
			const contentType = response.headers["content-type"]
      const responseType = response.config.responseType
			if (contentType && contentType.includes("application/octet-stream") || responseType === 'blob') {
        return apiData
			}
			const userStore = useUserStoreHook()
			// apiData 是 API 返回的数据

			// 这个 Code 是和后端约定的业务 Code
			const code = apiData.code + ""
			// 如果没有 Code, 代表这不是项目后端开发的 API
			if (code === undefined) {
				ElMessage.error("非本系统的接口")
				return Promise.reject(new Error("非本系统的接口"))
			} else {
				if (code !== "1") {
					if (code !== "10002") {
						ElMessage({
							message: apiData.message,
							type: "error",
							duration: 3 * 1000
						})
					}
					// 用户未登录或者token已过期或者token错误等情况
					if (code === "10002" || code === "10004") {
						ElMessageBox.confirm("你已被登出，可以取消继续留在该页面，或者重新登录", "确定登出", {
							confirmButtonText: "重新登录",
							cancelButtonText: "取消",
							type: "warning"
						}).then(() => {
							userStore.logout()
							location.reload() // 为了重新实例化vue-router对象 避免bug
						})
					}
					return Promise.reject("error")
				} else {
					return apiData
				}
				// switch (code) {
				//   case 0:
				//     // code === 0 代表没有错误
				//     return apiData
				//   default:
				//     // 不是正确的 Code
				//     ElMessage.error(apiData.message || "Error")
				//     return Promise.reject(new Error("Error"))
				// }
			}
		},
		(error) => {
			// Status 是 HTTP 状态码
			const status = get(error, "response.status")
			switch (status) {
				case 400:
					error.message = "请求错误"
					break
				case 401:
					// Token 过期时，直接退出登录并强制刷新页面（会重定向到登录页）
					useUserStoreHook().logout()
					location.reload()
					break
				case 403:
					error.message = "拒绝访问"
					break
				case 404:
					error.message = "请求地址出错"
					break
				case 408:
					error.message = "请求超时"
					break
				case 500:
					error.message = "服务器内部错误"
					break
				case 501:
					error.message = "服务未实现"
					break
				case 502:
					error.message = "网关错误"
					break
				case 503:
					error.message = "服务不可用"
					break
				case 504:
					error.message = "网关超时"
					break
				case 505:
					error.message = "HTTP 版本不受支持"
					break
				default:
					break
			}
			ElMessage.error(error.message)
			return Promise.reject(error)
		}
	)
	return service
}

/** 创建请求方法 */
function createRequestFunction(service: AxiosInstance) {
	return function <T>(config: AxiosRequestConfig): Promise<T> {
		const configDefault = {
			headers: {
				// 携带 Token
				Authorization: "Bearer " + getToken(),
				"Content-Type": get(config, "headers.Content-Type", "application/json")
			},
			timeout: 10000,
			baseURL: import.meta.env.VITE_BASE_API,
			data: {}
		}
		return service(Object.assign(configDefault, config))
	}
}

/** 用于网络请求的实例 */
export const service = createService()
/** 用于网络请求的方法 */
export const request = createRequestFunction(service)
