<template>
	<div class="app-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true" :model="searchData">
				<el-form-item label="系统类型" prop="systemTypeId">
					<el-select
						size="small"
						v-model="paramGetList.systemTypeId"
						filterable
						clearable
						placeholder="请选择"
						@change="selectChange($event, 'systemType', 'searchDeviceType', true)"
					>
						<el-option v-for="item in option.systemType" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<!--设备类型-->
				<el-form-item label="设备类型" prop="deviceTypeId">
					<el-select
						@change="selectChange($event, 'deviceType', '', true)"
						size="small"
						v-model="paramGetList.deviceTypeId"
						filterable
						clearable
						placeholder="请选择"
					>
						<el-option v-for="item in option.searchDeviceType" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<!--设备建筑-->
				<el-form-item label="所属建筑" prop="buildingId">
					<el-select
						@change="selectChange($event, 'building', 'searchFloor', '', true)"
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
					<el-select
						@change="selectChange($event, 'floor', '', true)"
						size="small"
						v-model="paramGetList.floorId"
						placeholder="请选择"
						clearable
					>
						<el-option v-for="item in option.searchFloor" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item prop="name" label="设备编码">
					<el-input
						placeholder="设备编码"
						size="small"
						v-model="searchData.deviceNum"
						@keydown.enter="handleSearch"
						clearable
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" icon="Search" @click="handleSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="never">
			<el-table
				ref="deviceTable"
				v-loading="isDeviceListLoading"
				:data="deviceList"
				element-loading-text="Loading"
				style="width: 100%"
				highlight-current-row
				@selection-change="handleSelectionChange"
				@select="deviceSelect"
				@select-all="deviceSelectAll"
			>
				<el-table-column type="selection" align="center" width="50" />
				<el-table-column label="序号" align="center" width="70">
					<template v-slot="scope">
						<span>{{ scope.$index + (paramGetList.page - 1) * paramGetList.limit + 1 }} </span></template
					>
				</el-table-column>
				<el-table-column label="设备编码" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.deviceNum }}</span>
					</template>
				</el-table-column>
				<el-table-column label="设备类型" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.deviceType }}</span>
					</template>
				</el-table-column>
				<el-table-column label="设备描述" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.description }}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column label="所属建筑" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.buildingName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="所属楼层" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.floorName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="详细地址" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.address }}</span>
					</template>
				</el-table-column> -->
			</el-table>
			<pagination
				v-if="total > 0"
				:total="total"
				v-model:page="paramGetList.page"
				v-model:limit="paramGetList.limit"
				@pagination="getDeviceList"
			/>
		</el-card>
	</div>
</template>

<script>
import { getDeviceList, getDevTypeMenu, getSysTypeMenu } from "@/api/devMgmt/device/devices.js"
import { getBuildingMenu } from "@/api/building/buildings.js"
import { getFloorMenu } from "@/api/building/floors.js"
import Pagination from "@/components/Pagination/index.vue"
export default {
	components: {
		Pagination
	},
	props: {
		deviceNum: {
			type: String,
			required: false
		}
	},
	watch: {
		deviceNum(id) {
			if (id) {
				this.getDeviceList()
			} else {
				if (this.$refs.deviceTable) this.$refs.deviceTable.clearSelection()
			}
		}
	},
	data() {
		return {
			isDeviceListLoading: false,
			deviceList: [],
			selection: [],
			total: 0,
			paramGetList: {
				page: 1,
				limit: 10,
				deviceNum: "",
				deviceTypeId: "",
				floorId: "",
				buildingId: "",
				systemTypeId: ""
			},
			option: {
				building: [],
				floor: [],
				searchFloor: [],
				systemType: [],
				deviceType: [],
				searchDeviceType: []
			},
			searchData: {
				deviceNum: ""
			}
		}
	},
	created() {
		this.getDeviceList()
		this.getSysTypeMenu()
		this.getBuildingMenu()
	},
	methods: {
		staySame() {
			this.getDeviceList()
		},
		deviceSelect(selection) {
			if (selection.length > 1) {
				const del_row = selection.shift()
				this.$refs.deviceTable.toggleRowSelection(del_row, false) // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
			}
		},
		deviceSelectAll(selection) {
			if (selection.length > 1) {
				selection.length = 1
			}
		},
		handleSelectionChange(list) {
			this.selection = list
			this.$emit("getSelectedItem", list)
		},
		getSysTypeMenu() {
			getSysTypeMenu().then(({ data }) => {
				this.option.systemType = data.items
			})
		},
		isValidTime(time) {
			return Date.now() / 1000 < time ? { type: "有效", color: "#67C23A" } : { type: "无效", color: "#F56C6C" }
		},
		getDevTypeMenu(systemTypeId, type) {
			getDevTypeMenu({ systemTypeId }).then(({ data }) => {
				this.option[type] = data.items
			})
		},
		getBuildingMenu() {
			getBuildingMenu().then(({ data }) => {
				this.option.building = data.items
			})
		},
		getFloorMenu(buildingId, type) {
			getFloorMenu({ buildingId }).then(({ data }) => {
				this.option[type] = data.items
			})
		},
		handleSearch() {
			this.paramGetList.deviceNum = this.searchData.deviceNum
			if (this.paramGetList.page === 1) {
				this.getDeviceList()
			}
			this.paramGetList.page = 1
		},
		selectChange(id, type, optionType, isSearch) {
			if (type === "systemType") {
				if (id) {
					this.getDevTypeMenu(id, optionType)
				} else {
					this.option[optionType] = []
				}
				this.paramGetList.deviceTypeId = ""
			} else if (type === "building") {
				if (id) {
					this.getFloorMenu(id, optionType)
				} else {
					this.option[optionType] = []
				}
				this.paramGetList.floorId = ""
			}
			if (isSearch) {
				this.getDeviceList()
			}
		},
		getDeviceList() {
			this.isDeviceListLoading = true
			getDeviceList(this.paramGetList)
				.then((res) => {
					this.total = res.data.total
					this.deviceList = res.data.items
					this.isDeviceListLoading = false
					this.$nextTick(() => {
						if (this.deviceNum) {
							this.deviceList.forEach((item) => {
								if (item.deviceNum === this.deviceNum) {
									this.$refs.deviceTable.toggleRowSelection(item, true)
								}
							})
						}
					})
				})
				.catch(() => {
					this.isDeviceListLoading = false
				})
		}
	}
}
</script>
