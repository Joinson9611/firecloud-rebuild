import { request } from "@/utils/service"
// import qs from "qs"

// 查
export function getOperationLogsList(params) {
	return request({
		url: "operationlogs/list",
		method: "get",
		params
	})
}
