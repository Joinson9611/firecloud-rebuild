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
						@change="selectChange($event, 'systemType', 'searchDevExpireType', true)"
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
						<el-option v-for="item in option.searchDevExpireType" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<!--设备建筑-->
				<el-form-item label="所属建筑" prop="buildingId">
					<el-select
						@change="selectChange($event, 'building', 'searchFloor', '', true)"
						size="small"
            filterable
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
            filterable
						v-model="paramGetList.floorId"
						placeholder="请选择"
						clearable
					>
						<el-option v-for="item in option.searchFloor" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item prop="name" label="临期天数">
					<el-input
						placeholder="请输入"
						size="small"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
						v-model="searchData.offsetTime"
						@keydown.enter="handleSearch"
						clearable
					>
						<template #append>天</template>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" icon="Search" @click="handleSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="never">
			<div class="toolbar-wrapper">
				<div>
					<el-button type="success" :disabled="selection.length === 0" size="small" @click="editDevExpire()"
						>批量修改</el-button
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
				v-loading="isDevExpireListLoading"
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
			</el-table>
			<pagination
				v-if="total > 0"
				:total="total"
				v-model:page="paramGetList.page"
				v-model:limit="paramGetList.limit"
				@pagination="getDevExpireList"
			/>
		</el-card>
		<el-dialog v-model="dialogVisible" title="编辑有效期">
			<el-form ref="formRef" :model="formDevExpires" :rules="formRules" label-width="120px" label-building="right">
				<el-form-item label="选中列表">
					<el-table :data="selection" style="width: 100%">
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
						<!-- <el-table-column align="center" prop="created_at" width="70" label="有效期">
							<template v-slot="scope">
								<span :style="{ color: isValidTime(scope.row.availableTime).color }">{{
									isValidTime(scope.row.availableTime).type
								}}</span>
							</template>
						</el-table-column> -->
					</el-table>
				</el-form-item>

				<el-form-item label="有效期" prop="availableTime">
					<el-date-picker
						size="small"
						v-model="formDevExpires.availableTime"
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
	getDevExpireList,
	editDevExpire,
	importDevExpire,
	exportDevExpire
} from "@/api/devMgmt/expireddevices/index.js"
import { getDevTypeMenu, getSysTypeMenu } from "@/api/devMgmt/device/devices.js"
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
			isDevExpireListLoading: false,
			dialogFloorVisible: false,
			isButtonUploadLoadingShow: false,
			isExportLoading: false,
			importVisible: false,
			total: 0,
			deviceList: [],
			selection: [],
			paramGetList: {
				page: 1,
				limit: 10,
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
				searchDevExpireType: []
			},
			searchData: {
				deviceNum: ""
			},
			formRules: {
				availableTime: { required: true, message: "填写有效期" }
			},
			formDevExpires: {
				id: 0,
				availableTime: 0
			}
		}
	},
	components: {
		Pagination
	},
	created() {
		this.getDevExpireList()
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
			importDevExpire(formData)
				.then(() => {
					this.isButtonUploadLoadingShow = false
					this.importVisible = false
					this.$message({ type: "success", message: "导入成功" })
					this.getDevExpireList()
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
			exportDevExpire(param)
				.then((res) => {
					this.isExportLoading = false
					this.$message({ type: "success", message: "导出成功" })
					downloadfile(res, "过期设备列表.xlsx")
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
					this.formDevExpires.deviceTypeId = ""
					this.option[optionType] = []
				}
			} else if (type === "building") {
				if (id) {
					this.getFloorMenu(id, optionType)
				} else {
					this.paramGetList.floorId = ""
					this.formDevExpires.floorId = ""
					this.option[optionType] = []
				}
			}
			this.getDevExpireList()
		},

		handleSearch() {
			this.paramGetList.offsetTime = this.searchData.offsetTime
			if (this.paramGetList.page === 1) {
				this.getDevExpireList()
			}
			this.paramGetList.page = 1
		},
		resetSearch() {
			this.$refs.searchFormRef.value?.resetFields()
			if (paramGetList.page === 1) {
				getDevExpireList()
			}
			paramGetList.page = 1
		},

		isValidTime(time) {
			return Date.now() / 1000 < time ? { type: "有效", color: "#67C23A" } : { type: "无效", color: "#F56C6C" }
		},
		handleRefresh() {
			this.getDevExpireList()
		},
		// 获取设备列表
		getDevExpireList() {
			this.isDevExpireListLoading = true
			getDevExpireList(this.paramGetList)
				.then((res) => {
					this.total = res.data.total
					this.deviceList = res.data.items
					this.isDevExpireListLoading = false
				})
				.catch(() => {
					this.isDevExpireListLoading = false
				})
		},
		editDevExpire() {
			this.dialogVisible = true
		},

		init() {},
		onSubmit() {
			this.$refs.formRef.validate((valid) => {
				if (valid) {
					const param = {
						deviceList: this.selection.map((item) => {
							return {
								id: item.id,
								availableTime: this.formDevExpires.availableTime
							}
						})
					}
					editDevExpire(param).then(() => {
						this.$message({
							type: "success",
							message: "批量修改成功"
						})
						this.dialogVisible = false
            this.getDevExpireList()
					})
				}
			})
		}
	}
}
</script>

<style scoped lang="scss"></style>
