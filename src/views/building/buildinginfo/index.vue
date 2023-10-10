<template>
	<div class="app-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true" :model="searchData">
				<el-form-item prop="name" label="建筑名称">
					<el-input placeholder="建筑名称" size="small" v-model="searchData.name" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" icon="Search" @click="handleSearch">查询</el-button>
					<!-- <el-button :icon="Refresh" size="small" @click="resetSearch">重置</el-button> -->
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="never">
			<div class="toolbar-wrapper">
				<div>
					<el-button type="primary" size="small" icon="Plus" @click="addBuilding">新增建筑</el-button>
					<el-button
						type="danger"
						:disabled="selection.length === 0"
						size="small"
						icon="Delete"
						@click="deleteBuilding()"
						>批量删除</el-button
					>
				</div>
				<div>
					<el-tooltip content="刷新表格">
						<el-button size="small" icon="RefreshRight" circle @click="handleRefresh" />
					</el-tooltip>
				</div>
			</div>
			<el-table
				v-loading="isBuildingListLoading"
				:data="buildingList"
				element-loading-text="Loading"
				style="width: 100%"
				highlight-current-row
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" align="center" width="50" />
				<el-table-column label="序号" align="center" width="70">
					<template v-slot="scope">
						<span>{{ scope.$index + (paramGetList.page - 1) * paramGetList.limit + 1 }} </span></template
					>
				</el-table-column>
				<el-table-column label="建筑名称" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="建筑描述" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.description }}</span>
					</template>
				</el-table-column>

				<el-table-column fixed="right" label="操作" width="220" align="center">
					<template #default="scope">
						<el-button type="success" text bg size="small" @click="editBuilding(scope.row)">编辑</el-button>
						<el-button type="primary" text bg size="small" @click="handleFloor(scope.row)">楼层管理</el-button>
						<el-button type="danger" text bg size="small" @click="deleteBuilding(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				v-if="total > 0"
				:total="total"
				v-model:page="paramGetList.page"
				v-model:limit="paramGetList.limit"
				@pagination="getBuildingList"
			/>
		</el-card>
		<el-dialog v-model="dialogVisible" @close="closeDialogBuilding" :title="isEdit ? '编辑建筑' : '新建建筑'">
			<el-form ref="formRef" :model="formBuildings" :rules="formRules" label-width="120px" label-building="right">
				<el-form-item prop="name" label="建筑名称">
					<el-input size="small" v-model="formBuildings.name" placeholder="请输入名称" />
				</el-form-item>
        <el-form-item prop="description" label="建筑描述">
					<el-input size="small" v-model="formBuildings.description" placeholder="请输入描述" />
				</el-form-item>
        <el-form-item prop="address" label="建筑地址">
					<el-input size="small" v-model="formBuildings.address" placeholder="请输入地址" />
				</el-form-item>
				<el-form-item label="建筑类别" prop="buildingTypeId">
					<el-select size="small" v-model="formBuildings.buildingTypeId" filterable clearable placeholder="请选择">
						<el-option v-for="item in buildingTypeOption" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="地下层数" class="dialog-form-item" prop="startFloor">
					<el-input
						size="small"
						onkeyup="value=value.replace(/[^\d.]/g,'')"
						v-model="formBuildings.startFloor"
						type="text"
					>
						<template #append>层</template>
					</el-input>
				</el-form-item>
				<el-form-item label="地上楼层" class="dialog-form-item" prop="endFloor">
					<el-input
						size="small"
						onkeyup="value=value.replace(/[^\d.]/g,'')"
						v-model="formBuildings.endFloor"
						type="text"
					>
						<template #append>层</template>
					</el-input>
				</el-form-item>
				<el-form-item label="自动消防设施" class="dialog-form-item" prop="autoFireFightingEquipment">
					<el-radio-group v-model="formBuildings.autoFireFightingEquipment">
						<el-radio :label="0">无</el-radio>
						<el-radio :label="1">有</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="建筑面积" class="dialog-form-item" prop="buildingArea">
					<el-input
						size="small"
						onkeyup="value=value.replace(/[^\d.]/g,'')"
						v-model="formBuildings.buildingArea"
						type="text"
					>
						<template #append>m²</template>
					</el-input>
				</el-form-item>
				<el-form-item label="占地面积" class="dialog-form-item" prop="coverArea">
					<el-input
						size="small"
						onkeyup="value=value.replace(/[^\d.]/g,'')"
						v-model="formBuildings.coverArea"
						type="text"
					>
						<template #append>m²</template>
					</el-input>
				</el-form-item>
				<el-form-item label="建筑高度" class="dialog-form-item" prop="buildingHeight">
					<el-input size="small" v-model="formBuildings.buildingHeight" type="number">
						<template #append>m</template>
					</el-input>
				</el-form-item>
				<el-form-item label="建筑层数" class="dialog-form-item" prop="countFloor">
					<el-input size="small" v-model="formBuildings.countFloor" type="text">
						<template #append>层</template>
					</el-input>
				</el-form-item>
				<el-form-item label="紧急出口数量" class="dialog-form-item">
					<el-input size="small" v-model="formBuildings.countEmergencyExit" onkeyup="value=value.replace(/[^\d.]/g,'')">
						<template #append>个</template>
					</el-input>
				</el-form-item>
				<el-form-item label="疏散楼梯个数" class="dialog-form-item">
					<el-input
						size="small"
						v-model="formBuildings.countEvacuationStaircase"
						onkeyup="value=value.replace(/[^\d.]/g,'')"
					>
						<template #append>个</template>
					</el-input>
				</el-form-item>
				<el-form-item label="消防电梯个数" class="dialog-form-item">
					<el-input size="small" v-model="formBuildings.countFireElevator" onkeyup="value=value.replace(/[^\d.]/g,'')">
						<template #append>个</template>
					</el-input>
				</el-form-item>
				<el-form-item label="避难层位置" class="dialog-form-item">
					<el-input size="small" v-model="formBuildings.refugeLayer" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button size="small" @click="dialogVisible = false">取消</el-button>
				<el-button size="small" type="primary" @click="onSubmit">确认</el-button>
			</template>
		</el-dialog>

		<el-dialog v-model="dialogFloorVisible" title="楼层管理">
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="onSubmit">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { getBuildingTypeList } from "@/api/building/buildingtypes.js"
import { getBuildingList, addBuilding, editBuilding, deleteBuilding } from "@/api/building/buildings.js"
import Pagination from "@/components/Pagination/index.vue"
export default {
	data() {
		return {
			dialogVisible: false,
			isBuildingListLoading: false,
			dialogFloorVisible: false,
			isEdit: false,
			total: 0,
			buildingList: [],
			selection: [],
			buildingTypeOption: [],
			paramGetList: {
				page: 1,
				limit: 20,
				name: ""
			},
			searchData: {
				name: ""
			},
			formRules: {
				name: { required: true, message: "填写名称" },
				description: { required: true, message: "填写描述" }
			},
			formBuildings: {
				description: "",
				name: "",
				id: 0,

				startFloor: "",
				endFloor: "",
				address: "",
				buildingTypeId: undefined,
				autoFireFightingEquipment: "",
				coverArea: "",
				buildingArea: "",
				countFloor: "",
				buildingHeight: "",
				countEmergencyExit: "",
				countEvacuationStaircase: "",
				countFireElevator: "",
				refugeLayer: ""
			}
		}
	},
	components: {
		Pagination
	},

	created() {
		this.getBuildingList()
		this.getBuildingTypeList()
	},
	methods: {
		handleFloor({ id }) {
			this.$router.push({
				path: "/building/floor",
				query: {
					bid: id
				}
			})
		},
		handleSelectionChange(list) {
			this.selection = list
		},
		handleSearch() {
			this.paramGetList.name = this.searchData.name
			if (this.paramGetList.page === 1) {
				this.getBuildingList()
			}
			this.paramGetList.page = 1
		},
		handleRefresh() {
			this.getBuildingList()
		},
		// 获取建筑列表
		getBuildingList() {
			this.isBuildingListLoading = true
			getBuildingList(this.paramGetList)
				.then((res) => {
					this.total = res.data.total
					this.buildingList = res.data.items
					this.isBuildingListLoading = false
				})
				.catch(() => {
					this.isBuildingListLoading = false
				})
		},
		getBuildingTypeList() {
			getBuildingTypeList().then(({ data }) => {
				this.buildingTypeOption = data.items
			})
		},
		addBuilding() {
			this.dialogVisible = true
			this.isEdit = false
			if (this.$refs.formRef) this.$refs.formRef.clearValidate()
		},
		editBuilding(info) {
			this.dialogVisible = true
			const extension = JSON.parse(info.extension)
			this.formBuildings.id = info.id
			this.formBuildings.description = info.description
			this.formBuildings.name = info.name
			this.formBuildings = Object.assign(this.formBuildings, extension)
			this.isEdit = true
			if (this.$refs.formRef) this.$refs.formRef.clearValidate()
		},
		closeDialogBuilding() {
			if (this.isEdit) {
				this.init()
			}
			this.isEdit = false
		},
		init() {
			this.formBuildings.name = ""
			this.formBuildings.description = ""
			this.formBuildings.startFloor = ""
			this.formBuildings.endFloor = ""
			this.formBuildings.address = ""
			this.formBuildings.buildingTypeId = ""
			this.formBuildings.autoFireFightingEquipment = 0
			this.formBuildings.coverArea = ""
			this.formBuildings.buildingArea = ""
			this.formBuildings.countFloor = ""
			this.formBuildings.buildingHeight = ""
			this.formBuildings.countEmergencyExit = ""
			this.formBuildings.countEvacuationStaircase = ""
			this.formBuildings.countFireElevator = ""
			this.formBuildings.refugeLayer = ""
		},
		// 建筑删除
		deleteBuilding(param) {
			let id
			if (param) {
				id = param.id
			} else {
				if (this.selection.length === 0) {
					id = ""
				} else {
					id = this.selection.map((item) => item.id).join(",")
				}
			}
			deleteBuilding(id)
				.then(() => {
					this.getBuildingList()
					this.$message({
						type: "success",
						message: "删除成功"
					})
				})
				.catch(() => {})
		},
		onSubmit() {
			this.$refs.formRef.validate((valid) => {
				if (valid) {
					const extension = {
						startFloor: this.formBuildings.startFloor,
						endFloor: this.formBuildings.endFloor,
						address: this.formBuildings.address,
						building_type_id: this.formBuildings.building_type_id,
						autoFireFightingEquipment: this.formBuildings.autoFireFightingEquipment,
						coverArea: this.formBuildings.coverArea,
						buildingArea: this.formBuildings.buildingArea,
						countFloor: this.formBuildings.countFloor,
						buildingHeight: this.formBuildings.buildingHeight,
						countEmergencyExit: this.formBuildings.countEmergencyExit,
						countEvacuationStaircase: this.formBuildings.countEvacuationStaircase,
						countFireElevator: this.formBuildings.countFireElevator,
						refugeLayer: this.formBuildings.refugeLayer,
						buildingTypeId: this.formBuildings.buildingTypeId
					}
					if (this.isEdit) {
						const param = {
							dataPermissionLevel: this.formBuildings.dataPermissionLevel,
							name: this.formBuildings.name,
							description: this.formBuildings.description,
							extension: JSON.stringify(extension)
						}
						editBuilding(param, this.formBuildings.id)
							.then(() => {
								this.$message({
									type: "success",
									message: "编辑成功"
								})
								this.getBuildingList()
								this.dialogVisible = false
							})
							.catch(() => {
							})
					} else {
						const param = {
							name: this.formBuildings.name,
							description: this.formBuildings.description,
							extension: JSON.stringify(extension)
						}
						addBuilding(param)
							.then(() => {
								this.getBuildingList()
								this.dialogVisible = false
								this.$message({
									type: "success",
									message: "添加成功"
								})
							})
							.catch(() => {

							})
					}
				}
			})
		}
	}
}
</script>
