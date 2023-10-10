import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { useTagsViewStore } from "./tags-view"
import {
	getToken,
	removeToken,
	setToken,
	getUserId,
	setUserId,
	removeUserId,
	getProjectId,
	setProjectId,
	removeProjectId
} from "@/utils/cache/cookies"
import router, { resetRouter } from "@/router"
import { loginApi, getUserInfoApi, handlelogout } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import { type RouteRecordRaw } from "vue-router"
import asyncRouteSettings from "@/config/async-route"
import md5 from "@/utils/md5"

export const useUserStore = defineStore("user", () => {
	const token = ref<string>(getToken() || "")
	const projectId = ref<string>(getProjectId() || "")
	const roles = ref<string[]>([])
	const userId = ref<string>(getUserId() || "")
	const username = ref<string>("")
	const level = ref<string>("")
	const appModule = ref<string[]>([])
	const menuPermissions = ref<string>("")
	const platformPermissions = ref<string[]>([])
	const projectPermissions = ref<string[]>([])
	const subMenuPermissions = ref<string>("")
	const permissionStore = usePermissionStore()
	const tagsViewStore = useTagsViewStore()
	/** 设置角色数组 */
	const setRoles = (value: string[]) => {
		roles.value = value
	}
	/** 登录 */
	const login = (loginData: LoginRequestData) => {
		return new Promise((resolve, reject) => {
			loginApi({
				username: loginData.username,
				// MD5加密password
				password: md5.hexMD5(loginData.password + "JavaTestDemo")
				// code: loginData.code
			})
				.then((res) => {
					setToken(res.data.token)
					setUserId(res.data.id + "")
					userId.value = res.data.id + ""
					token.value = res.data.token
					resolve(true)
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	const getPlatformInfo = () => {
		return new Promise((resolve, reject) => {
			getUserInfoApi(Number(userId.value))
				.then((res) => {
					const data = res.data
					username.value = data.nickname
					level.value = data.level + ""
					menuPermissions.value = data.menuPermissions
					subMenuPermissions.value = data.subMenuPermissions
					resolve(res)
				})
				.catch((error) => {
					reject(error)
				})
		})
	}
	/** 获取用户详情 */
	const getInfo = () => {
		return new Promise((resolve, reject) => {
			getUserInfoApi(Number(userId.value))
				.then((res) => {
					const data = res.data
					username.value = data.nickname
					level.value = data.level + ""
					appModule.value = data.appModule.split(',')
					menuPermissions.value = data.menuPermissions
					platformPermissions.value = data.platformPermissions.split(',')
					projectPermissions.value = data.projectPermissions.split(',')
					subMenuPermissions.value = data.subMenuPermissions
					roles.value = (data.menuPermissions + "," + data.subMenuPermissions).split(",")
					resolve(res)
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	const enterProject = (id) => {
		return new Promise<void>((resolve) => {
			setProjectId(id)
      projectId.value = id
			resolve()
		})
	}

	const toPlatform = () => {
		return new Promise<void>((resolve) => {
			roles.value = []
			removeProjectId()
			resolve()
		})
	}

	/** 切换角色 */
	const changeRoles = async (role: string) => {
		const newToken = "token-" + role
		token.value = newToken
		setToken(newToken)
		await getInfo()
		permissionStore.setRoutes(roles.value)
		resetRouter()
		permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
			router.addRoute(item)
		})
		_resetTagsView()
	}
	/** 登出 */
	const logout = () => {
		return new Promise<void>((resolve, reject) => {
			handlelogout()
				.then(() => {
					removeToken()
					removeUserId()
					removeProjectId()
					token.value = ""
					userId.value = ""
					projectId.value = ""
					roles.value = []
					resetRouter()
					_resetTagsView()
					resolve()
				})
				.catch((err) => {
					reject(err)
				})
		})
	}

	/** 重置 Token */
	const resetToken = () => {
		removeToken()
		token.value = ""
		roles.value = []
	}
	/** 重置 visited views 和 cached views */
	const _resetTagsView = () => {
		tagsViewStore.delAllVisitedViews()
		tagsViewStore.delAllCachedViews()
	}

	return {
		token,
		roles,
		username,
		level,
		projectId,
		menuPermissions,
		platformPermissions,
		projectPermissions,
		subMenuPermissions,
    appModule,
		toPlatform,
		setRoles,
		login,
		getInfo,
		getPlatformInfo,
		changeRoles,
		logout,
		resetToken,
		enterProject
	}
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
	return useUserStore(store)
}
