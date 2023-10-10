//请求
export interface LoginRequestData {
	/** admin 或 editor */
	username: string
	/** 密码 */
	password: string
	/** 验证码 */
}

// 响应
export type LoginCodeResponseData = IApiResponseData<string>

export type LoginResponseData = IApiResponseData<{ token: string, id: number}>

export type UserInfoResponseData = IApiResponseData<{
	appModule: string // app模块权限
	id: number // 用户ID
	level: number // 用户账号等级
	menuPermissions: string // web主菜单权限
	name: string // 用户账号名称
	nickname: string // 用户昵称
	platformPermissions: string // 平台操作权限
	projectPermissions: string // 项目操作权限
	subMenuPermissions: string // 子菜单权限
}>
