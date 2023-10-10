export const menuTree = [
	{
		id: 1,
		label: "项目管理",
		children: [
			{
				id: 101,
				label: "项目详情",
				is_children: true,
				children: [
					{
						id: 10101,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 10102,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 102,
				label: "项目概况",
				is_children: true,
				children: [
					{
						id: 10201,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 10202,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 103,
				label: "项目成员",
				is_children: true,
				children: [
					{
						id: 10301,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 10302,
						label: "编辑",
						is_children: true,
						is_last: true
					},
					{
						id: 10300,
						label: "添加公司",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 104,
				label: "操作日志",
				is_children: true,
				children: [
					{
						id: 10401,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			}
		]
	},
	{
		id: 2,
		label: "消防安全管理",
		children: [
			{
				id: 201,
				label: "人员登记",
				is_children: true,
				children: [
					{
						id: 20101,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 20102,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 202,
				label: "重点部位",
				is_children: true,
				children: [
					{
						id: 20201,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 20202,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 203,
				label: "微型消防站",
				is_children: true,
				children: [
					{
						id: 20301,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 20302,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 204,
				label: "消防培训记录",
				is_children: true,
				children: [
					{
						id: 20401,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 205,
				label: "灭火演练记录",
				is_children: true,
				children: [
					{
						id: 20501,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			}
		]
	},
	{
		id: 3,
		label: "消防培训考核",
		children: [
			{
				id: 301,
				label: "题库管理",
				is_children: true,
				children: [
					{
						id: 30101,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 30102,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 302,
				label: "考卷管理",
				is_children: true,
				children: [
					{
						id: 30201,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 30202,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 303,
				label: "考核记录",
				is_children: true,
				children: [
					{
						id: 30301,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			}
		]
	},
	{
		id: 4,
		label: "建筑管理",
		children: [
			{
				id: 401,
				label: "建筑",
				is_children: true,
				children: [
					{
						id: 40101,
						label: "查看",
						is_children: true,
						is_last: true
					},
          {
						id: 40102,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 403,
				label: "可视地图",
				is_children: true,
				children: [
					{
						id: 40301,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 40302,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			}
		]
	},
	{
		id: 5,
		label: "设备管理",
		children: [
			{
				id: 501,
				label: "消防设备",
				is_children: true,
				children: [
					{
						id: 50001,
						label: "查看(含导出)",
						is_children: true,
						is_last: true
					},
					{
						id: 50002,
						label: "编辑(含导入)",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 502,
				label: "物联设备",
				is_children: true,
				children: [
					{
						id: 50001,
						label: "查看(含导出)",
						is_children: true,
						is_last: true
					},
					{
						id: 50002,
						label: "编辑(含导入)",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 503,
				label: "巡更点管理",
				is_children: true,
				children: [
					{
						id: 50001,
						label: "查看(含导出)",
						is_children: true,
						is_last: true
					},
					{
						id: 50002,
						label: "编辑(含导入)",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 504,
				label: "疏散指引点管理",
				is_children: true,
				children: [
					{
						id: 50001,
						label: "查看(含导出)",
						is_children: true,
						is_last: true
					},
					{
						id: 50002,
						label: "编辑(含导入)",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 505,
				label: "NFC卡管理",
				is_children: true,
				children: [
					{
						id: 50001,
						label: "查看(含导出)",
						is_children: true,
						is_last: true
					},
					{
						id: 50002,
						label: "编辑(含导入)",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 506,
				label: "过期设备",
				is_children: true,
				children: [
					{
						id: 50001,
						label: "查看(含导出)",
						is_children: true,
						is_last: true
					},
					{
						id: 50002,
						label: "编辑(含导入)",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 507,
				label: "自动报修",
				is_children: true,
				children: [
					{
						id: 50001,
						label: "查看(含导出)",
						is_children: true,
						is_last: true
					},
					{
						id: 50002,
						label: "编辑(含导入)",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 508,
				label: "报警关联",
				is_children: true,
				children: [
					{
						id: 50001,
						label: "查看(含导出)",
						is_children: true,
						is_last: true
					},
					{
						id: 50002,
						label: "编辑(含导入)",
						is_children: true,
						is_last: true
					}
				]
			}
		]
	},
	{
		id: 6,
		label: "设备巡查",
		children: [
			{
				id: 601,
				label: "巡查项",
				is_children: true,
				children: [
					{
						id: 60101,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 60102,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			// {
			// 	id: 602,
			// 	label: "巡查组",
			// 	is_children: true,
			// 	children: [
			// 		{
			// 			id: 60201,
			// 			label: "查看",
			// 			is_children: true,
			// 			is_last: true
			// 		},
			// 		{
			// 			id: 60202,
			// 			label: "编辑",
			// 			is_children: true,
			// 			is_last: true
			// 		}
			// 	]
			// },
			{
				id: 603,
				label: "任务列表",
				is_children: true,
				children: [
					{
						id: 60301,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 60302,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 604,
				label: "任务记录",
				is_children: true,
				children: [
					{
						id: 60401,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 605,
				label: "设备记录",
				is_children: true,
				children: [
					{
						id: 60501,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			}
		]
	},
	{
		id: 7,
		label: "消防巡查",
		children: [
			{
				id: 701,
				label: "巡查项",
				is_children: true,
				children: [
					{
						id: 70101,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 70102,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 702,
				label: "巡查组",
				is_children: true,
				children: [
					{
						id: 70201,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 70202,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 703,
				label: "任务列表",
				is_children: true,
				children: [
					{
						id: 70301,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 70302,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 704,
				label: "任务记录",
				is_children: true,
				children: [
					{
						id: 70401,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 705,
				label: "设备记录",
				is_children: true,
				children: [
					{
						id: 70501,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			}
		]
	},
	{
		id: 8,
		label: "维保",
		children: [
			{
				id: 801,
				label: "维保计划",
				is_children: true,
				children: [
					{
						id: 80101,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 80102,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 802,
				label: "巡查测试",
				is_children: true,
				children: [
					{
						id: 80201,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 80202,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 803,
				label: "快速设定",
				is_children: true,
				children: [
					{
						id: 80301,
						label: "查看",
						is_children: true,
						is_last: true
					},
					{
						id: 80302,
						label: "编辑",
						is_children: true,
						is_last: true
					}
				]
			}
		]
	},
	{
		id: 9,
		label: "设备报修",
		children: [
			{
				id: 90001,
				label: "查看",
				is_children: true,
				is_last: true
			}
		]
	},
	{
		id: 10,
		label: "二次施工",
		children: [
			{
				id: 100001,
				label: "查看",
				is_children: true
			}
		]
	},
	{
		id: 20,
		label: "物联终端",
		children: [
			{
				id: 2001,
				label: "FAS",
				is_children: true,
				children: [
					{
						id: 200101,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 2002,
				label: "AI火灾识别系统",
				is_children: true,
				children: [
					{
						id: 200201,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 2021,
				label: "无线烟感",
				is_children: true,
				children: [
					{
						id: 202101,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 2022,
				label: "水位监测",
				is_children: true,
				children: [
					{
						id: 202201,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 2023,
				label: "水压监测",
				is_children: true,
				children: [
					{
						id: 202301,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 2024,
				label: "水浸监测",
				is_children: true,
				children: [
					{
						id: 202401,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 2025,
				label: "电气火灾",
				is_children: true,
				children: [
					{
						id: 202501,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			},
			{
				id: 2026,
				label: "AI火灾识别摄像头",
				is_children: true,
				children: [
					{
						id: 202601,
						label: "查看",
						is_children: true,
						is_last: true
					}
				]
			}
		]
	},
	{
		id: 11,
		label: "设置",
		children: [
			{
				id: 110001,
				label: "查看",
				is_children: true,
				is_last: true
			},
			{
				id: 110002,
				label: "编辑",
				is_children: true,
				is_last: true
			}
		]
	}
]

export const appNotification = [
	{
		id: 0,
		label: "FAS",
		children: [
			{
				id: 11,
				label: "火警",
				is_children: true
			}
		]
	},
	{
		id: 0,
		label: "AI火灾识别系统",
		children: [
			{
				id: 21,
				label: "报警",
				is_children: true
			}
		]
	},
	{
		id: 0,
		label: "无线烟感",
		children: [
			{
				id: 211,
				label: "火灾报警",
				is_children: true
			},
      {
				id: 212,
				label: "电量过低报警",
				is_children: true
			},
      {
				id: 213,
				label: "拆开报警",
				is_children: true
			}
		]
	},
	{
		id: 0,
		label: "水位监测",
		children: [
			{
				id: 221,
				label: "水位报警",
				is_children: true
			},
      {
				id: 222,
				label: "电量过低报警",
				is_children: true
			}
		]
	},
	{
		id: 0,
		label: "水压监测",
		children: [
			{
				id: 231,
				label: "水压报警",
				is_children: true
			},
      {
				id: 232,
				label: "电量过低报警",
				is_children: true
			}
		]
	},
	{
		id: 0,
		label: "水浸监测",
		children: [
			{
				id: 241,
				label: "水浸报警",
				is_children: true
			},
      {
				id: 242,
				label: "电量过低报警",
				is_children: true
			}
		]
	},
	{
		id: 0,
		label: "电气火灾",
		children: [
			{
				id: 251,
				label: "报警",
				is_children: true
			}
		]
	},
	{
		id: 0,
		label: "AI火灾识别摄像头",
		children: [
			{
				id: 261,
				label: "报警",
				is_children: true
			}
		]
	}
]
