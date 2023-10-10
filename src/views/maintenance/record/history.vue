<template>
	<div class="inner-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true" >
				<el-form-item label="系统类型" prop="systemTypeId">
					<el-select
						size="small"
						v-model="paramGetList.systemTypeId"
						filterable
						clearable
						placeholder="请选择"
						@change="systemChange"
					>
						<el-option v-for="item in option.systemType" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<!--设备类型-->
				<el-form-item label="设备类型" prop="deviceTypeId">
					<el-select
						@change="deviceChange"
						size="small"
						v-model="paramGetList.deviceTypeId"
						filterable
						clearable
						placeholder="请选择"
					>
						<el-option v-for="item in option.deviceType" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<!--设备建筑-->
				<el-form-item label="所属建筑" prop="buildingId">
					<el-select
						@change="buildingChange"
						size="small"
						v-model="paramGetList.buildingId"
						placeholder="请选择"
						clearable
					>
						<el-option v-for="item in option.building" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<!--设备建筑-->
				<el-form-item label="所属楼层" prop="floorId">
					<el-select @change="floorChange" size="small" v-model="paramGetList.floorId" placeholder="请选择" clearable>
						<el-option v-for="item in option.floor" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item :label="`${type[mcTypeId]}结果`">
					<el-select
						size="small"
						v-model="paramGetList.result"
						filterable
						clearable
						placeholder="请选择"
						@change="getHistoryList"
					>
						<el-option v-for="item in option.result" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="never">
			<el-table v-loading="isLoadingShow" :data="recordList" highlight-current-row fit style="width: 100%">
				<el-table-column label="序号" align="center" width="70">
					<template v-slot="scope"
						><span>{{ scope.$index + (paramGetList.page - 1) * paramGetList.limit + 1 }} </span></template
					>
				</el-table-column>
				<el-table-column label="所属系统" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.systemType }}</span>
					</template>
				</el-table-column>
				<el-table-column label="所属设备" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.deviceType }}</span>
					</template>
				</el-table-column>
				<el-table-column label="建筑" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.buildingName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="楼层" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.floorName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="设备位置" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.address }}</span>
					</template>
				</el-table-column>
				<el-table-column label="数量" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.quantity }}</span>
					</template>
				</el-table-column>
				<el-table-column label="时间" width="110" align="center">
					<template v-slot="scope">
						<span>{{ getTime2(scope.row.testingTime) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作者" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.operator }}</span>
					</template>
				</el-table-column>
				<el-table-column :label="`${type[mcTypeId]}结果`" align="center">
					<template v-slot="scope">
						<span :style="{ color: resultColor[scope.row.result] }">{{ result[scope.row.result] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="70">
					<template v-slot="scope">
						<el-button type="success" size="small" bg text @click="openDetail(scope.row)"> 详情 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--页码导航-->
			<pagination
				v-show="total > 0"
				:total="total"
				v-model:page="paramGetList.page"
				v-model:limit="paramGetList.limit"
				@pagination="getHistoryList"
			/>
		</el-card>

		<el-drawer v-model="detailVisible" title="详情" direction="ltr" size="50%">
			<div class="patrolDetail">
				<div class="content">
					<ul>
						<li class="item">
							公司名称: <span>{{ patrolDetail.projectName || "-" }}</span>
						</li>
						<li class="item">
							所属建筑: <span>{{ patrolDetail.buildingName || "-" }}</span>
						</li>
						<li class="item">
							所属楼层: <span>{{ patrolDetail.floorName || "-" }}</span>
						</li>
						<li class="item">
							系统类型: <span>{{ patrolDetail.systemType || "-" }}</span>
						</li>
						<li class="item">
							设备类型: <span>{{ patrolDetail.deviceType || "-" }}</span>
						</li>
						<li class="item">
							数量: <span>{{ patrolDetail.quantity || "-" }}</span>
						</li>
						<li class="item">
							情况说明: <span>{{ patrolDetail.note || "-" }}</span>
						</li>
						<li class="item">
							{{ `${type[mcTypeId]}` }}结果:
							<span :style="{ color: resultColor[patrolDetail.result] }">{{ result[patrolDetail.result] }}</span>
						</li>
						<li class="item">
							操作员: <span>{{ patrolDetail.operator }}</span>
						</li>
						<li class="item">
							{{ `${type[mcTypeId]}` }}时间: <span>{{ getTime2(patrolDetail.testingTime) }}</span>
						</li>
						<li class="item">
							更新时间: <span>{{ getTime(patrolDetail.createTime) }}</span>
						</li>
						<li v-if="imageUrl.length !== 0" class="item">
							现场照片
							<div class="image-wrapper">
								<img v-for="(url, index) in imageUrl" :key="index" :src="url" class="image" />
							</div>
						</li>
					</ul>
				</div>
			</div>
		</el-drawer>
	</div>
</template>

<script>
import pagination from "@/components/Pagination"
import { getMcsystemTypes } from "@/api/maintenance/mcsystemtypes.js"
import { getMcdeviceTypes } from "@/api/maintenance/mcdevicetypes.js"
import { getBuildingMenu } from "@/api/building/buildings.js"
import { getFloorMenu } from "@/api/building/floors.js"
import { getHistoryList, getHistoryInfo } from "@/api/maintenance/historymcs.js"
import { Formattimestamp, Formattimestamp2 } from "@/utils/time.ts"
export default {
	name: "maintenanceRecord",
	components: {
		pagination
	},
	props: {
		mcTypeId: {
			required: true,
			type: Number
		}
	},
	data() {
		return {
			isLoadingShow: true,
			detailVisible: false,

			total: 0,

			recordList: [],
			type: ["巡查", "测试"],
			option: {
				building: [],
				floor: [],
				deviceType: [],
				systemType: [],
				result: [
					{ id: 1, type: "正常" },
					{ id: 2, type: "故障" }
				]
			},
			result: ["", "正常", "故障"],
			resultColor: ["", "#67C23A", "#E6A23C"],

			patrolDetail: {
				projectName: undefined,
				buildingName: undefined,
				floorName: undefined,
				systemType: undefined,
				deviceType: undefined,
				quantity: undefined,
				address: undefined,
				note: undefined,
				result: undefined,
				operator: undefined,
				image: ""
			},

			// 报修记录请求参数
			paramGetList: {
				page: 1,
				limit: 10,
				systemTypeId: undefined,
				deviceTypeId: undefined,
				mcTypeId: undefined,
				buildingId: undefined,
				floorId: undefined,
				result: undefined
			}
		}
	},

	computed: {
		imageUrl() {
			let imgList = []
			if (this.patrolDetail.image === "") {
				imgList = []
			} else {
				imgList = this.patrolDetail.image.split(",").map((item) => import.meta.env.VITE_IMAGE_PATH + item)
			}
			return imgList
		}
	},

	created() {
		this.getHistoryList()
		this.getSystemTypes()
		this.getBuildingMenu()
	},
	methods: {
		openDetail({ id }) {
			getHistoryInfo(id).then((res) => {
				this.patrolDetail = res.data
				this.detailVisible = true
			})
		},
		onSearch() {
			this.paramGetList.taskmbStateTypeId = this.tempFilterOptions.taskmbStateTypeId
			this.paramGetList.sTime = this.tempFilterOptions.sTime
			this.paramGetList.page = 1
			this.getHistoryList()
		},

		getTime(time) {
			return Formattimestamp(time)
		},
		getTime2(time) {
			return Formattimestamp2(time)
		},

		/**
		 * @Description: 获记录列表
		 * @Date: 2020/6/23
		 **/
		getHistoryList() {
			this.paramGetList.mcTypeId = this.mcTypeId
			this.isLoadingShow = true
			getHistoryList(this.paramGetList)
				.then((res) => {
					// 取消加载特效
					this.isLoadingShow = false
					this.recordList = res.data.items
					// 数据条数
					this.total = res.data.total
				})
				.catch(() => {
					this.isLoadingShow = false
				})
		},

		// 获取系统列表
		getSystemTypes() {
			getMcsystemTypes()
				.then((res) => {
					this.option.systemType = res.data.items
				})
				.catch(() => {})
		},

		// 获取建筑物列表
		getBuildingMenu() {
			getBuildingMenu()
				.then((res) => {
					this.option.building = res.data.items
				})
				.catch(() => {})
		},

		getDeviceTypes(id) {
			const params = {
				mcTypeId: this.mcTypeId,
				systemTypeId: id
			}
			getMcdeviceTypes(params)
				.then((res) => {
					this.option.deviceType = res.data.items
				})
				.catch(() => {})
		},
		getFloorMenu(id) {
			getFloorMenu({ projectId: this.selectedProjectId, buildingId: id })
				.then((res) => {
					this.option.floor = res.data.items
				})
				.catch(() => {})
		},
		// 系统类型改变
		systemChange(id) {
			this.paramGetList.deviceTypeId = undefined
			// 如果系统列表清空执行
			if (id === "") {
				this.paramGetList.systemTypeId = undefined
				this.option.deviceType = []
			} else {
				this.getDeviceTypes(id)
			}
			this.paramGetList.page = 1
			this.getHistoryList()
		},

		buildingChange(id) {
			this.paramGetList.floorId = undefined
			// 如果建筑列表清空执行
			if (id === "") {
				this.paramGetList.buildingId = undefined
				this.option.floor = []
			} else {
				this.getFloorMenu(id)
			}
			this.paramGetList.page = 1
			this.getHistoryList()
		},
		floorChange(id) {
			if (id === "") {
				this.paramGetList.floorId = undefined
			} else {
				this.paramGetList.floorId = id
			}
			this.paramGetList.page = 1
			this.getHistoryList()
		},
		// 设备类型改变
		deviceChange(id) {
			if (id === "") {
				this.paramGetList.deviceTypeId = undefined
			}
			this.paramGetList.page = 1
			this.getHistoryList()
		},
		resultChange(id) {
			if (id === "") {
				this.paramGetList.result = undefined
			}
			this.paramGetList.page = 1
			this.getHistoryList()
		}
	}
}
</script>

<style scoped lang="scss">
::v-deep .el-drawer__body {
	padding: 0;
}
.patrolDetail {
	overflow: auto;
	.content {
		.image-wrapper {
			font-size: 0;
			margin-top: 12px;
			.image {
				cursor: zoom-in;
				width: 170px;
				height: 120px;
				margin-right: 5px;
				margin-bottom: 5px;
				&:last-child {
					margin-right: 0;
				}
			}
		}
		font-family: "arial";
		padding: 20px;
		padding-top: 0;
		ul {
			list-style: none;
			padding: 0;
			.item {
				word-break: break-all;
				line-height: 16px;
				font-size: 15px;
				padding: 10px 0;
				border-bottom: 1px solid rgba(144, 147, 153, 0.3);

				&:last-of-type {
					border-bottom: none;
				}

				span {
					font-size: 14px;
					color: #909399;
				}

				.standard {
					margin-top: 10px;
					font-size: 14px;
					white-space: pre-line;
					color: #909399;
					line-height: 20px;
				}
			}
		}
	}
}
</style>
