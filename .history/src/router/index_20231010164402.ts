import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"
const Layout = () => import("@/layout/index.vue")
const PlatformLayout = () => import("@/platformLayout/index.vue")
/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
	{
		path: "/redirect",
		component: Layout,
		meta: {
			hidden: true
		},
		children: [
			{
				path: "/redirect/:path(.*)",
				component: () => import("@/views/redirect/index.vue")
			}
		]
	},
	{
		path: "/test",
		component: () => import("@/views/test/index.vue")
	},
	{ path: "/taskcr/form", component: () => import("../views/taskcrs/addTaskcr.vue") },
	{
		path: "/platform",
		component: PlatformLayout,
		name: "Platform",
		children: [
			{
				path: "projects",
				component: () => import("@/views/platform/project/index.vue")
			}
		]
	},
	{
		path: "/403",
		component: () => import("@/views/error-page/403.vue"),
		meta: {
			hidden: true
		}
	},
	{
		path: "/404",
		component: () => import("@/views/error-page/404.vue"),
		meta: {
			hidden: true
		},
		alias: "/:pathMatch(.*)*"
	},

	{
		path: "/login",
		component: () => import("@/views/login/index.vue"),
		meta: {
			hidden: true
		}
	},

	{
		path: "/",
		component: Layout,
		redirect: "/home",
		name: "Home",
		children: [
			{
				path: "home",
				component: () => import("@/views/home/index.vue"),
				meta: {
					title: "项目首页",
					svgIcon: "home"
				}
			}
		]
	}
	// {
	// 	path: "/unocss",
	// 	component: Layout,
	// 	redirect: "/unocss/index",
	// 	children: [
	// 		{
	// 			path: "index",
	// 			component: () => import("@/views/unocss/index.vue"),
	// 			name: "UnoCSS",
	// 			meta: {
	// 				title: "unocss",
	// 				svgIcon: "unocss"
	// 			}
	// 		}
	// 	]
	// }
]
/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
	{
		path: "/project",
		component: Layout,
		redirect: "noredirect",
		name: "Project",
		meta: {
			title: "项目管理",
			svgIcon: "project",
			roles: ["1"],
			isExpand: true
		},
		children: [
			{
				path: "detail",
				name: "Detail",
				component: () => import("@/views/project/detail.vue"),
				meta: { title: "项目详情", svgIcon: "info", roles: ["101"] }
			},
			{
				path: "info",
				name: "Info",
				component: () => import("@/views/project/info.vue"),
				meta: { title: "项目概况", svgIcon: "situation", roles: ["102"] }
			},
			{
				path: "member",
				name: "Member",
				component: () => import("@/views/project/member/index.vue"),
				meta: { title: "项目成员", svgIcon: "member", roles: ["103"] }
			},
			{
				path: "operationLog",
				name: "OperationLog",
				component: () => import("@/views/project/operationLog.vue"),
				meta: { title: "操作日志", svgIcon: "log", roles: ["104"] }
			}
		]
	},
	{
		path: "/building",
		component: Layout,
		redirect: "noredirect",
		name: "building",
		meta: {
			title: "建筑管理",
			svgIcon: "building",
			roles: ["4"],
			isExpand: true
		},
		children: [
			{
				path: "buildingInfo",
				name: "buildingInfo",
				component: () => import("@/views/building/buildinginfo/index.vue"),
				meta: { title: "建筑", svgIcon: "info", roles: ["401"] }
			},
			{
				path: "floor",
				name: "floor",

				component: () => import("@/views/building/buildinginfo/floor/index.vue"),
				meta: { title: "楼层管理", hidden: true }
			},
			{
				path: "visualmap",
				name: "visualmap",
				component: () => import("@/views/building/visualmap/index.vue"),
				meta: { title: "可视地图", svgIcon: "map", roles: ["403"] }
			}
		]
	},
	{
		path: "/devMgmt",
		component: Layout,
		redirect: "noredirect",
		name: "devMgmt",
		meta: {
			title: "设备管理",
			svgIcon: "devMgmt",
			roles: ["5"],
			isExpand: true
		},
		children: [
			{
				path: "device",
				name: "device",
				component: () => import("@/views/devMgmt/device/index.vue"),
				meta: { title: "消防设备", svgIcon: "device", roles: ["501"] }
			},
      {
				path: "expire",
				name: "expire",
				component: () => import("@/views/devMgmt/expire/index.vue"),
				meta: { title: "过期消防设备", svgIcon: "expire", roles: ["506"] }
			},
			{
				path: "devIot",
				name: "devIot",
				component: () => import("@/views/devMgmt/devIot/index.vue"),
				meta: { title: "物联设备", svgIcon: "iot", roles: ["502"] }
			},
			{
				path: "patrol",
				name: "patrol",
				component: () => import("@/views/devMgmt/patrol/index.vue"),
				meta: { title: "巡更点管理", svgIcon: "patrol", roles: ["503"] }
			},
			{
				path: "nfc",
				name: "nfc",
				component: () => import("@/views/devMgmt/nfc/index.vue"),
				meta: { title: "NFC卡管理", svgIcon: "nfc", roles: ["505"] }
			},

			{
				path: "automb",
				name: "automb",
				component: () => import("@/views/devMgmt/automb/index.vue"),
				meta: { title: "自动报修", svgIcon: "repair", roles: ["507"] }
			},
			{
				path: "relation",
				name: "relation",
				component: () => import("@/views/devMgmt/relation/index.vue"),
				meta: { title: "报警关联", svgIcon: "relation", roles: ["508"] }
			}
		]
	},

	,
	{
		path: "/patrolSectasks",
		component: Layout,
		redirect: "noredirect",
		name: "patrolSectasks",
		meta: {
			title: "消防巡查",
			svgIcon: "security",
			roles: ["6"],
			isExpand: true
		},
		children: [
			{
				path: "taskCheckItem",
				name: "secTaskCheckItem",
				component: () => import("@/views/task/taskCheckItem/index.vue"),
				meta: { title: "巡查项", svgIcon: "item", patrolTypeId: "0", roles: ["601"] }
			},
			{
				path: "taskslist",
				name: "secTaskslist",
				component: () => import("@/views/task/tasklist/index.vue"),
				meta: {
					title: "任务列表",
					svgIcon: "tasklist",
					roles: ["603"],
					patrolTypeId: 0
				}
			},
			{
				path: "newtasks",
				name: "newSectasks",
				component: () => import("@/views/task/tasklist/newtasks.vue"),
				meta: {
					title: "新建任务",
					roles: ["603"],
					patrolTypeId: 0,
					hidden: true
				}
			},
			{
				path: "tasksinfo",
				name: "secTaskinfo",
				component: () => import("@/views/task/tasklist/tasksinfo/index.vue"),
				meta: {
					title: "任务详情",
					hidden: true,
					roles: ["603"],
					patrolTypeId: 0
				}
			},
			{
				path: "tasksrecord",
				name: "secTasksrecord",
				component: () => import("@/views/task/record/index.vue"),
				meta: {
					keepAlive: true,
					scrollTop: 0,
					title: "任务记录",
					svgIcon: "record",
					roles: ["604"],
					patrolTypeId: 0
				}
			},
			{
				path: "historyInfo",
				name: "historySecTasksinfo",
				component: () => import("@/views/task/record/historyInfo/index.vue"),

				meta: {
					title: "记录详情",
					hidden: true,
					patrolTypeId: 0
				}
			}
		]
	},

	{
		path: "/patrolDevtasks",
		component: Layout,
		redirect: "noredirect",
		name: "patrolDevtasks",
		meta: {
			title: "设备巡查",
			svgIcon: "patrol",
			roles: ["7"],
			isExpand: true
		},
		children: [
			{
				path: "taskCheckItem",
				name: "devTaskCheckItem",
				component: () => import("@/views/task/taskCheckItem/index.vue"),
				meta: { title: "巡查项", svgIcon: "item", patrolTypeId: "1", roles: ["701"] }
			},
			{
				path: "taskslist",
				name: "devTaskslist",
				component: () => import("@/views/task/tasklist/index.vue"),
				meta: {
					title: "任务列表",
					svgIcon: "tasklist",
					roles: ["703"],
					patrolTypeId: 1
				}
			},
			{
				path: "newtasks",
				name: "newDevTasks",
				component: () => import("@/views/task/tasklist/newtasks.vue"),
				meta: {
					title: "新建任务",
					roles: ["703"],
					patrolTypeId: 1,
					hidden: true
				}
			},
			{
				path: "tasksinfo",
				name: "devTaskinfo",
				component: () => import("@/views/task/tasklist/tasksinfo/index.vue"),
				meta: {
					title: "任务详情",
					hidden: true,
					roles: ["703"],
					patrolTypeId: 1
				}
			},
			{
				path: "tasksrecord",
				name: "devTasksrecord",
				component: () => import("@/views/task/record/index.vue"),
				meta: {
					keepAlive: true,
					scrollTop: 0,
					title: "任务记录",
					svgIcon: "record",
					roles: ["704"],
					patrolTypeId: 1
				}
			},
			{
				path: "historyInfo",
				name: "historyDevTasksinfo",
				component: () => import("@/views/task/record/historyInfo/index.vue"),
				meta: {
					title: "记录详情",
					hidden: true,
					patrolTypeId: 1
				}
			}
		]
	},

	{
		path: "/maintenance",
		component: Layout,
		redirect: "noredirect",
		name: "maintenance",
		meta: {
			title: "维保",
			svgIcon: "tasks",
			roles: ["8"],
			isExpand: true
		},
		children: [
			{
				path: "plan",
				name: "plan",
				component: () => import("@/views/maintenance/plan/index.vue"),
				meta: { title: "维保计划", svgIcon: "plan", roles: ["801"] }
			},
			{
				path: "record",
				name: "record",
				component: () => import("@/views/maintenance/record/index.vue"),
				meta: {
					title: "巡查测试",
					svgIcon: "record",
					roles: ["802"]
				}
			},
			{
				path: "setting",
				name: "mcsetting",
				component: () => import("@/views/maintenance/setting/index.vue"),
				meta: {
					title: "快速设定",
					svgIcon: "setting",
					roles: ["803"]
				}
			}
		]
	},

	{
		path: "/repair",
		component: Layout,
		name: "repair",
		redirect: "noredirect",
		meta: {
			roles: ["9"]
		},
		children: [
			{
				path: "record",
				component: () => import("@/views/repair/index.vue"),
				name: "RepairRecord",
				meta: {
					title: "设备报修",
					svgIcon: "repair"
				}
			},

			{
				path: "repairInfo",
				component: () => import("@/views/repair/repairInfo.vue"),
				name: "repairInfo",
				meta: {
					title: "报修记录详情",
					hidden: true
				}
			}
		]
	},

	{
		path: "/construction",
		component: Layout,
		name: "construction",

		meta: { title: "二次施工管理", svgIcon: "taskcrs", roles: ["10"], isExpand: true },
		redirect: "noredirect",
		children: [
			{
				path: "fire",
				component: () => import("@/views/taskcrs/index.vue"),
				name: "fire",
				meta: {
					title: "动火",
					svgIcon: "fire",
					taskcrTypeId: "1",
					roles: ["10"]
				}
			},
			{
				path: "water",
				component: () => import("@/views/taskcrs/index.vue"),
				name: "water",
				meta: {
					title: "动水",
					svgIcon: "water",
					taskcrTypeId: "2",
					roles: ["10"]
				}
			},

			{
				path: "detail",
				component: () => import("@/views/taskcrs/detail.vue"),
				name: "detail",
				meta: {
					hidden: true,
					title: "施工申请表详情",
					roles: ["10"]
				}
			}
		]
	},

	{
		path: "/approval",
		component: Layout,
		name: "approval",
		meta: { title: "审核任务", svgIcon: "approval" },
		redirect: "noredirect",
		children: [
			{
				path: "fasAlarm",
				name: "fasAlarm",
				component: () => import("@/views/approval/fasAlarm/index.vue"),
				meta: {
					title: "FAS报警审核",
					svgIcon: "fire"
				}
			},
			{
				path: "fasAlarmDetail",
				name: "fasAlarmDetail",
				component: () => import("@/views/approval/fasAlarm/detail/index.vue"),
				meta: {
					title: "FAS报警审核详情",
					hidden: true
				}
			},
			{
				path: "devApproval",
				component: () => import("@/views/approval/task/index.vue"),
				name: "devApproval",
				meta: {
					title: "设备巡查审核",
					svgIcon: "patrol",
					taskApprovalTypeId: 0
				}
			},
			{
				path: "secApproval",
				component: () => import("@/views/approval/task/index.vue"),
				name: "secApproval",
				meta: {
					title: "消防巡查审核",
					svgIcon: "security",
					taskApprovalTypeId: 1
				}
			},
			{
				path: "repairApproval",
				name: "repairApproval",
				component: () => import("@/views/approval/repair/index.vue"),
				meta: {
					title: "设备报修审核",
					svgIcon: "repair"
				}
			},
			{
				path: "constructionApproval",
				name: "constructionApproval",
				component: () => import("@/views/approval/construction/index.vue"),
				meta: {
					title: "二次施工审核",
					svgIcon: "taskcrs"
				}
			}
		]
	},
	{
		path: "/setting",
		component: Layout,
		name: "setting",
		meta: { title: "设置", svgIcon: "setting", roles: ["11"], isExpand: true },
		redirect: "noredirect",
		children: [
			{
				path: "fullscreen",
				name: "fullscreen",
				component: () => import("@/views/setting/fullscreen/index.vue"),
				meta: {
					title: "大屏设置",
					svgIcon: "fullscreen"
				}
			},
			{
				path: "settingExpire",
				name: "settingExpire",
				component: () => import("@/views/setting/expire/index.vue"),
				meta: {
					title: "设备过期设置",
          svgIcon: "expire"
				}
			},
			{
				path: "settingFas",
				name: "settingFas",
				component: () => import("@/views/setting/fas/index.vue"),
				meta: {
					title: "fas设置",
          svgIcon: "fire"
				}
			},
			{
				path: "settingRepair",
				name: "settingRepair",
				component: () => import("@/views/setting/repair/index.vue"),
				meta: {
					title: "报修设置",
          svgIcon: "repair"
				}
			},
			{
				path: "settingConstruction",
				name: "settingConstruction",
				component: () => import("@/views/setting/construction/index.vue"),
				meta: {
					title: "二次施工设置",
          svgIcon: "taskcrs"
				}
			}
		]
	},

	{
		path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
		redirect: "/404",
		name: "ErrorPage",
		meta: {
			hidden: true
		}
	}
]

const router = createRouter({
	history:
		import.meta.env.VITE_ROUTER_HISTORY === "hash"
			? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
			: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
	routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
	// 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
	try {
		router.getRoutes().forEach((route) => {
			const { name, meta } = route
			if (name && meta.roles?.length) {
				router.hasRoute(name) && router.removeRoute(name)
			}
		})
	} catch (error) {
		// 强制刷新浏览器也行，只是交互体验不是很好
		window.location.reload()
	}
}

export default router
