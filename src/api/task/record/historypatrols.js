import { request } from "@/utils/service"
// import qs from "qs"
const map = ["historysecpatrols", "historydevpatrols"]
// 查
export function getHistoryPatrolList(params, type) {
	return request({
		url: `${map[type]}/list`,
		method: "get",
		params
	})
}
