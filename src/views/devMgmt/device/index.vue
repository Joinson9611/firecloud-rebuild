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
			<div class="toolbar-wrapper">
				<div>
					<el-button type="primary" size="small" icon="Plus" @click="addDevice">新增设备</el-button>
					<el-button type="danger" :disabled="selection.length === 0" size="small" icon="Delete" @click="deleteDevice()"
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
				v-loading="isDeviceListLoading"
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
				<el-table-column align="center" prop="created_at" width="70" label="有效期">
					<template v-slot="scope">
						<span :style="{ color: isValidTime(scope.row.availableTime).color }">{{
							isValidTime(scope.row.availableTime).type
						}}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="150" align="center">
					<template #default="scope">
						<el-button type="success" text bg size="small" @click="editDevice(scope.row)">编辑</el-button>
						<el-button type="danger" text bg size="small" @click="deleteDevice(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				v-if="total > 0"
				:total="total"
				v-model:page="paramGetList.page"
				v-model:limit="paramGetList.limit"
				@pagination="getDeviceList"
			/>
		</el-card>
		<el-dialog v-model="dialogVisible" @close="closeDialogDevice" :title="isEdit ? '编辑设备' : '新建设备'">
			<el-form ref="formRef" :model="formDevices" :rules="formRules" label-width="120px" label-building="right">
				<el-form-item prop="deviceNum" label="设备编码">
					<el-input size="small" :disabled="isEdit" v-model="formDevices.deviceNum" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="description" label="设备描述">
					<el-input size="small" v-model="formDevices.description" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="系统类型" prop="systemTypeId">
					<el-select
						size="small"
						v-model="formDevices.systemTypeId"
						filterable
						clearable
            :disabled="isEdit"
						placeholder="请选择"
						@change="selectChange($event, 'systemType', 'deviceType', false)"
					>
						<el-option v-for="item in option.systemType" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<!--设备类型-->
				<el-form-item label="设备类型" prop="deviceTypeId">
					<el-select
						@change="selectChange($event, 'deviceType', '', false)"
						size="small"
            :disabled="isEdit"
						v-model="formDevices.deviceTypeId"
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
						@change="selectChange($event, 'building', 'floor', '', false)"
						size="small"
						v-model="formDevices.buildingId"
						placeholder="请选择"
						clearable
					>
						<el-option v-for="item in option.building" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<!--设备建筑-->
				<el-form-item label="所属楼层" prop="floorId">
					<el-select
						@change="selectChange($event, 'floor', '', false)"
						size="small"
						v-model="formDevices.floorId"
						placeholder="请选择"
						clearable
					>
						<el-option v-for="item in option.floor" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item prop="address" label="详细地址">
					<el-input size="small" v-model="formDevices.address" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="有效期" prop="availableTime">
					<el-date-picker
						size="small"
						v-model="formDevices.availableTime"
						type="datetime"
						placeholder="请选择"
						value-format="x"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button size="small" @click="dialogVisible = false">取消</el-button>
				<el-button size="small" :loading="isLoading" type="primary" @click="onSubmit">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import {
	getDeviceList,
	addDevice,
	editDevice,
	deleteDevice,
	getDevTypeMenu,
	getSysTypeMenu,
	importDevice,
	exportDevice
} from "@/api/devMgmt/device/devices.js"
import { getBuildingMenu } from "@/api/building/buildings.js"
import { getFloorMenu } from "@/api/building/floors.js"
import Pagination from "@/components/Pagination/index.vue"
import { genFileId } from "element-plus"
import downloadfile from "js-file-download"
export default {
	data() {
		return {
			isLoading: false,
			dialogVisible: false,
			isDeviceListLoading: false,
			dialogFloorVisible: false,
			isButtonUploadLoadingShow: false,
			isExportLoading: false,
			importVisible: false,
			isEdit: false,
			total: 0,
			deviceList: [],
			selection: [],

			paramGetList: {
				page: 1,
				limit: 10,
				deviceNum: "",
				deviceTypeId: "",
				floorId: "",
				buildingId: "",
				systemTypeId: ""
			},
			// 选择器选项
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
			},
			formRules: {
				buildingId: { required: true, message: "选择建筑" },
				floorId: { required: true, message: "选择楼层" },
				systemTypeId: { required: true, message: "选择系统类型" },
				deviceTypeId: { required: true, message: "选择设备类型" },
				description: { required: true, message: "填写描述" },
				deviceNum: { required: true, message: "填写设备编码" },
				address: { required: true, message: "填写地址" },
				availableTime: { required: true, message: "填写有效期" }
			},
			formDevices: {
				id: 0,
				address: "",
				availableTime: 0,
				description: "",
				deviceNum: "",
				deviceTypeId: "",
				floorId: "",
				buildingId: "",
				systemTypeId: ""
			},
			formData: new FormData()
		}
	},
	components: {
		Pagination
	},
	created() {
		this.getDeviceList()
		this.getSysTypeMenu()
		this.getBuildingMenu()
	},
	methods: {
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
			importDevice(formData)
				.then(() => {
					this.isButtonUploadLoadingShow = false
					this.importVisible = false
					this.$message({ type: "success", message: "导入成功" })
					this.getDeviceList()
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
			exportDevice(param)
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
		getSysTypeMenu() {
			getSysTypeMenu().then(({ data }) => {
				this.option.systemType = data.items
			})
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
		selectChange(id, type, optionType, isSearch) {
			if (type === "systemType") {
				if (id) {
					this.getDevTypeMenu(id, optionType)
				} else {
          this.paramGetList.deviceTypeId = ""
          this.formDevices.deviceTypeId = ""
					this.option[optionType] = []
				}
			} else if (type === "building") {
				if (id) {
					this.getFloorMenu(id, optionType)
				} else {
          this.paramGetList.floorId = ""
          this.formDevices.floorId = ""
					this.option[optionType] = []
				}
			}
			if (isSearch) {
        this.paramGetList.page = 1
				this.getDeviceList()
			}
		},

		handleSearch() {
			this.paramGetList.deviceNum = this.searchData.deviceNum
			if (this.paramGetList.page === 1) {
				this.getDeviceList()
			}
			this.paramGetList.page = 1
		},
		resetSearch() {
			this.$refs.searchFormRef.value?.resetFields()
			if (paramGetList.page === 1) {
				getDeviceList()
			}
			paramGetList.page = 1
		},

		isValidTime(time) {
			return Date.now() / 1000 < time ? { type: "有效", color: "#67C23A" } : { type: "无效", color: "#F56C6C" }
		},
		handleRefresh() {
			this.getDeviceList()
		},
		// 获取设备列表
		getDeviceList() {
			this.isDeviceListLoading = true
			getDeviceList(this.paramGetList)
				.then((res) => {
					this.total = res.data.total
					this.deviceList = res.data.items
					this.isDeviceListLoading = false
				})
				.catch(() => {
					this.isDeviceListLoading = false
				})
		},
		addDevice() {
			this.dialogVisible = true
			this.isEdit = false
			if (this.$refs.formRef) this.$refs.formRef.clearValidate()
		},
		editDevice(info) {
			this.dialogVisible = true
			this.formDevices.id = info.id
			this.formDevices.description = info.description
			this.formDevices.deviceNum = info.deviceNum
			this.formDevices.systemTypeId = info.systemTypeId
			this.formDevices.buildingId = info.buildingId
			this.getDevTypeMenu(info.systemTypeId, "deviceType")
			this.getFloorMenu(info.buildingId, "floor")
			this.formDevices.floorId = info.floorId
			this.formDevices.deviceTypeId = info.deviceTypeId
			this.formDevices.address = info.address
			this.formDevices.availableTime = info.availableTime * 1000
			this.isEdit = true
		},
		closeDialogDevice() {
			if (this.isEdit) {
				this.init()
			}
			this.isEdit = false
		},
		init() {
			this.formDevices.deviceNum = ""
			this.formDevices.deviceTypeId = ""
			this.formDevices.systemTypeId = ""
			this.formDevices.buildingId = ""
			this.formDevices.floorId = ""
			this.formDevices.address = ""
			this.formDevices.description = ""
			this.formDevices.availableTime = ""
		},
		// 设备删除
		deleteDevice(param) {
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
			deleteDevice(id)
				.then(() => {
					this.getDeviceList()
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
							description: this.formDevices.description,
							availableTime: this.formDevices.availableTime / 1000,
							floorId: this.formDevices.floorId,
							address: this.formDevices.address
						}
						editDevice(param, this.formDevices.id)
							.then(() => {
								this.$message({
									type: "success",
									message: "编辑成功"
								})
								this.isLoading = false
								this.getDeviceList()
								this.dialogVisible = false
							})
							.catch(() => {
								this.isLoading = false
								this.dialogVisible = false
							})
					} else {
						const param = {
							description: this.formDevices.description,
							deviceNum: this.formDevices.deviceNum,
							availableTime: this.formDevices.availableTime / 1000,
							systemTypeId: this.formDevices.systemTypeId,
							deviceTypeId: this.formDevices.deviceTypeId,
							floorId: this.formDevices.floorId,
							address: this.formDevices.address
						}
						addDevice(param)
							.then(() => {
								this.getDeviceList()
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

<style scoped lang="scss"></style>
