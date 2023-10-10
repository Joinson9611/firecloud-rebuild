<template>
	<div class="app-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true" :model="searchData">
				<el-form-item label="自动报修系统类型" prop="systemTypeId">
					<el-select
						size="small"
						v-model="paramGetList.systemTypeId"
						filterable
						clearable
						placeholder="请选择"
						@change="selectChange($event, 'systemType', 'searchDevAutoType', true)"
					>
						<el-option v-for="item in option.systemType" :key="item.id" :label="item.type" :value="item.id" />
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
			<div class="toolbar-wrapper">
				<div>
					<el-button type="primary" size="small" icon="Plus" @click="addDevAuto">新增设备</el-button>
					<el-button
						type="danger"
						:disabled="selection.length === 0"
						size="small"
						icon="Delete"
						@click="deleteDevAuto()"
						>批量删除</el-button
					>
				</div>
				<div>
					<el-popover trigger="click" @hide="hidePop" :visible="importVisible" title="" placement="top" :width="260">
						<el-upload
							accept=".xls,.xlsx"
							ref="upload"
							class="upload-demo"
							:limit="1"
							:on-exceed="handleExceed"
							:auto-upload="false"
							:http-request="UploadFile"
						>
							<template #trigger>
								<el-button size="small" type="primary">选择文件</el-button>
							</template>
							<template #tip>
								<div class="el-upload__tip">请上传有效的excel文件</div>
							</template>
						</el-upload>
						<div style="text-align: right; margin: 0">
							<el-button size="small" text @click="importVisible = false">取消</el-button>
							<el-button size="small" type="primary" :loading="isButtonUploadLoadingShow" @click="onImportSubmit"
								>确认</el-button
							>
						</div>
						<template #reference>
							<el-button ref="importBtn" size="small" icon="Upload" circle @click="handleImport" />
						</template>
					</el-popover>
					<el-tooltip :virtual-triggering="true" content="导入" :virtual-ref="$refs.importBtn" />

					<el-tooltip content="导出">
						<el-button :loading="isExportLoading" size="small" icon="Download" circle @click="handleExport" />
					</el-tooltip>
					<el-tooltip content="刷新表格">
						<el-button size="small" icon="RefreshRight" circle @click="handleRefresh" />
					</el-tooltip>
				</div>
			</div>
			<el-table
				v-loading="isDevAutoListLoading"
				:data="deviceList"
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
				<el-table-column label="设备编码" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.deviceNum }}</span>
					</template>
				</el-table-column>
				<el-table-column label="所属DTU" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.dtuName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="所属建筑" align="center">
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
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="150" align="center">
					<template #default="scope">
						<el-button type="success" text bg size="small" @click="editDevAuto(scope.row)">编辑</el-button>
						<el-button type="danger" text bg size="small" @click="deleteDevAuto(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				v-if="total > 0"
				:total="total"
				v-model:page="paramGetList.page"
				v-model:limit="paramGetList.limit"
				@pagination="getDevAutoList"
			/>
		</el-card>
		<el-dialog v-model="dialogVisible" @close="closeDialogDevAuto" :title="isEdit ? '编辑设备' : '新建设备'">
			<el-form ref="formRef" :model="formDevAutos" :rules="formRules" label-width="120px" label-building="right">
				<el-form-item prop="deviceNum" label="设备编码">
					<div class="form-line">
						<div style="margin-right: 5px; width: 181px">
							<el-input
								readonly
								size="small"
								:disabled="isEdit"
								v-model="formDevAutos.deviceNum"
								placeholder="请选择"
							/>
						</div>
						<el-button v-show="!isEdit" type="primary" size="small" @click="selectDevice"
							>选择设备</el-button
						>
					</div>
				</el-form-item>
				<el-form-item v-if="!isEdit" label="报修系统类型" prop="systemTypeId">
					<el-select
						size="small"
						v-model="formDevAutos.systemTypeId"
						filterable
						clearable
						:disabled="isEdit"
						placeholder="请选择"
					>
						<el-option v-for="item in option.systemType" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="自动生成条件" prop="autoAlarmTypeId">
					<el-select size="small" v-model="formDevAutos.autoAlarmTypeId" filterable clearable placeholder="请选择">
						<el-option v-for="item in option.autoAlarmType" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item v-if="!isEdit" label="所属DTU" prop="dtuId">
					<el-select
						size="small"
						v-model="formDevAutos.dtuId"
						filterable
						clearable
						:disabled="isEdit"
						placeholder="请选择"
					>
						<el-option v-for="item in option.dtu" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="启动自动报修" prop="isAutoCreateMb">
					<el-checkbox v-model="formDevAutos.isAutoCreateMb" :true-label="1" :false-label="0"></el-checkbox>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button size="small" @click="dialogVisible = false">取消</el-button>
				<el-button size="small" :loading="isLoading" type="primary" @click="onSubmit">确认</el-button>
			</template>
		</el-dialog>
		<el-dialog @close="closeDialogSelect" v-model="dialogSelectVisible" title="设备选择">
			<RadioTable ref="radioTable" @getSelectedItem="radioChange" :deviceNum="formDevAutos.deviceNum" />
			<template #footer>
				<el-button size="small" @click="dialogSelectVisible = false">取消</el-button>
				<el-button size="small" :loading="isLoading" type="primary" @click="onDevSelectSubmit">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import {
	getDevAutoList,
	addDevAuto,
	editDevAuto,
	deleteDevAuto,
	importDevAuto,
	exportDevAuto
} from "@/api/devMgmt/deviceautombs/index.js"
import { getSysTypeMenu } from "@/api/devMgmt/deviceautombs/systemtypeautombs.js"
import { getBuildingMenu } from "@/api/building/buildings.js"
import { getFloorMenu } from "@/api/building/floors.js"
import { getDTUMenu } from "@/api/devMgmt/device/dtus.js"
import Pagination from "@/components/Pagination/index.vue"
import RadioTable from "@/components/RadioTable"
import { genFileId } from "element-plus"
import downloadfile from "js-file-download"
export default {
	data() {
		return {
			isLoading: false,
			dialogVisible: false,
			isDevAutoListLoading: false,
			dialogFloorVisible: false,
			dialogSelectVisible: false,
			isButtonUploadLoadingShow: false,
			isExportLoading: false,
			importVisible: false,
			isEdit: false,
			total: 0,
			deviceList: [],
			selection: [],
			deviceNum: "",
			paramGetList: {
				page: 1,
				limit: 10,
				deviceNum: "",
				floorId: "",
				buildingId: "",
				systemTypeId: ""
			},
			// 选择器选项
			option: {
				building: [],
				floor: [],
				autoAlarmType: [
					{ id: 0, type: "正常" },
					{ id: 1, type: "火警" },
					{ id: 2, type: "反馈" },
					{ id: 3, type: "启动" },
					{ id: 4, type: "监管" },
					{ id: 5, type: "屏蔽" },
					{ id: 6, type: "故障" },
					{ id: 7, type: "其他" }
				],
				searchFloor: [],
				systemType: [],
				dtu: []
			},
			searchData: {
				deviceNum: ""
			},
			formRules: {
				systemTypeId: { required: true, message: "选择报修系统类型" },
				deviceNum: { required: true, message: "填写设备编码" },
				dtuId: { required: true, message: "填写选择DTU" },
				autoAlarmTypeId: { required: true, message: "请选择自动生成条件" },
				isAutoCreateMb: { required: true, message: "填写选择是否启动自动报修" }
			},
			formDevAutos: {
				id: 0,
				deviceNum: "",
				isAutoCreateMb: 0,
				autoAlarmTypeId: "",
				systemTypeId: "",
				dtuId: ""
			},
			formData: new FormData()
		}
	},
	components: {
		Pagination,
		RadioTable
	},
	created() {
		this.getDevAutoList()
		this.getSysTypeMenu()
		this.getBuildingMenu()
		this.getDTUMenu()
	},
	methods: {
    selectDevice() {
      this.dialogSelectVisible = true
      if(this.$refs.radioTable) this.$refs.radioTable.staySame()
    },
		radioChange(list) {
			if (list.length) {
				this.deviceNum = list[0].deviceNum
			}
		},
		closeDialogSelect() {
			this.deviceNum = ""
		},
		onDevSelectSubmit() {
			this.formDevAutos.deviceNum = this.deviceNum
			this.dialogSelectVisible = false
		},
		// 文件的导入
		handleExceed(files) {
			this.$refs.upload.clearFiles()
			const file = files[0]
			file.uid = genFileId()
			this.$refs.upload.handleStart(file)
		},
		UploadFile(content) {
			this.isButtonUploadLoadingShow = true
			const formData = new FormData()
			formData.append("excel", content.file, content.file.name)
			importDevAuto(formData)
				.then(() => {
					this.isButtonUploadLoadingShow = false
					this.importVisible = false
					this.$message({ type: "success", message: "导入成功" })
					this.getDevAutoList()
				})
				.catch(() => {
					this.isButtonUploadLoadingShow = false
				})
		},
		onImportSubmit() {
			this.$refs.upload.submit()
		},

		handleExport() {
			this.isExportLoading = true
			const param = {
				buildingId: this.paramGetList.buildingId,
				systemTypeId: this.paramGetList.system_type_id,
				deviceTypeId: this.paramGetList.deviceTypeId,
				floorId: this.paramGetList.deviceTypeId
			}
			exportDevAuto(param)
				.then((res) => {
					this.isExportLoading = false
					this.$message({ type: "success", message: "导出成功" })
					downloadfile(res, "设备列表.xlsx")
				})
				.catch(() => {
					this.isExportLoading = false
				})
		},
		handleImport() {
			this.importVisible = true
		},
		hidePop() {
			this.$refs.upload.clearFiles()
		},
		handleSelectionChange(list) {
			this.selection = list
		},
		getDTUMenu() {
			getDTUMenu().then(({ data }) => {
				this.option.dtu = data.items
			})
		},
		getSysTypeMenu() {
			getSysTypeMenu().then(({ data }) => {
				this.option.systemType = data.items
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
		selectChange(id, type, optionType, isSearch) {
			if (type === "building") {
				if (id) {
					this.getFloorMenu(id, optionType)
				} else {
					this.paramGetList.floorId = ""
					this.formDevAutos.floorId = ""
					this.option[optionType] = []
				}
			}
			if (isSearch) {
				this.getDevAutoList()
			}
		},

		handleSearch() {
			this.paramGetList.deviceNum = this.searchData.deviceNum
			if (this.paramGetList.page === 1) {
				this.getDevAutoList()
			}
			this.paramGetList.page = 1
		},
		resetSearch() {
			this.$refs.searchFormRef.value?.resetFields()
			if (paramGetList.page === 1) {
				getDevAutoList()
			}
			paramGetList.page = 1
		},

		isValidTime(time) {
			return Date.now() / 1000 < time ? { type: "有效", color: "#67C23A" } : { type: "无效", color: "#F56C6C" }
		},
		handleRefresh() {
			this.getDevAutoList()
		},
		// 获取设备列表
		getDevAutoList() {
			this.isDevAutoListLoading = true
			getDevAutoList(this.paramGetList)
				.then((res) => {
					this.total = res.data.total
					this.deviceList = res.data.items
					this.isDevAutoListLoading = false
				})
				.catch(() => {
					this.isDevAutoListLoading = false
				})
		},
		addDevAuto() {
			this.dialogVisible = true
			this.isEdit = false
			if (this.$refs.formRef) this.$refs.formRef.clearValidate()
		},
		editDevAuto(info) {
			this.dialogVisible = true
			this.formDevAutos.id = info.id
			this.formDevAutos.deviceNum = info.deviceNum
			this.formDevAutos.systemTypeId = info.systemTypeId
			this.formDevAutos.autoAlarmTypeId = info.autoAlarmTypeId
			this.formDevAutos.isAutoCreateMb = info.isAutoCreateMb
			this.formDevAutos.dtuId = info.dtuId
			this.isEdit = true
		},
		closeDialogDevAuto() {
			this.init()
			this.isEdit = false
		},
		init() {
      this.deviceNum = ""
			this.formDevAutos.deviceNum = ""
			this.formDevAutos.systemTypeId = ""
			this.formDevAutos.autoAlarmTypeId = ""
			this.formDevAutos.isAutoCreateMb = 0
			this.formDevAutos.dtuId = ""
		},
		// 设备删除
		deleteDevAuto(param) {
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
			deleteDevAuto(id)
				.then(() => {
					this.getDevAutoList()
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
					this.isLoading = true
					if (this.isEdit) {
						const param = {
							isAutoCreateMb: this.formDevAutos.isAutoCreateMb,
							autoAlarmTypeId: this.formDevAutos.autoAlarmTypeId
						}
						editDevAuto(param, this.formDevAutos.id)
							.then(() => {
								this.$message({
									type: "success",
									message: "编辑成功"
								})
								this.isLoading = false
								this.getDevAutoList()
								this.dialogVisible = false
							})
							.catch(() => {
								this.isLoading = false
								this.dialogVisible = false
							})
					} else {
						const param = {
							deviceNum: this.formDevAutos.deviceNum,
							isAutoCreateMb: this.formDevAutos.isAutoCreateMb,
							autoAlarmTypeId: this.formDevAutos.autoAlarmTypeId,
							systemTypeId: this.formDevAutos.systemTypeId,
							dtuId: this.formDevAutos.dtuId
						}
						addDevAuto(param)
							.then(() => {
								this.getDevAutoList()
								this.isLoading = false
								this.dialogVisible = false
								this.$message({
									type: "success",
									message: "添加成功"
								})
							})
							.catch(() => {
								this.isLoading = false
								this.dialogVisible = false
							})
					}
				}
			})
		}
	}
}
</script>

<style scoped lang="scss">
.form-line {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
