<template>
	<div class="app-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true" :model="searchData">
				<el-form-item label="关联编码">
					<el-input
						placeholder="请输入"
						size="small"
						v-model="searchData.deviceNum"
						@keydown.enter="handleSearch"
						clearable
					></el-input>
				</el-form-item>
				<el-form-item label="关联设备编码">
					<el-input
						placeholder="请输入"
						size="small"
						v-model="searchData.deviceNumRelation"
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
					<el-button type="primary" size="small" icon="Plus" @click="addDevRelation">新增关联</el-button>
					<el-button
						type="danger"
						:disabled="selection.length === 0"
						size="small"
						icon="Delete"
						@click="deleteDevRelation()"
						>批量删除</el-button
					>
				</div>
				<div>
					<el-tooltip :virtual-triggering="true" content="导入" :virtual-ref="$refs.importBtn" />
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

					<el-tooltip content="导出">
						<el-button :loading="isExportLoading" size="small" icon="Download" circle @click="handleExport" />
					</el-tooltip>
					<el-tooltip content="刷新表格">
						<el-button size="small" icon="RefreshRight" circle @click="handleRefresh" />
					</el-tooltip>
				</div>
			</div>
			<el-table
				v-loading="isDevRelationListLoading"
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
				<el-table-column label="地址" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.address }}</span>
					</template>
				</el-table-column>
				<el-table-column label="关联设备编码" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.deviceNumRelation }}</span>
					</template>
				</el-table-column>
				<el-table-column label="关联设备所属建筑" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.buildingNameRelation }}</span>
					</template>
				</el-table-column>
				<el-table-column label="关联设备所属楼层" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.floorNameRelation }}</span>
					</template>
				</el-table-column>
				<el-table-column label="关联设备地址" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.addressRelation }}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="70" align="center">
					<template #default="scope">
						<el-button type="danger" :loading="isloading" text bg size="small" @click="deleteDevRelation(scope.row)"
							>删除</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				v-if="total > 0"
				:total="total"
				v-model:page="paramGetList.page"
				v-model:limit="paramGetList.limit"
				@pagination="getDevRelationList"
			/>
		</el-card>
		<el-dialog v-model="dialogVisible" @close="closeDialogDevRelation" title="关联绑定">
			<el-form label-position="left" ref="formRef" :model="formDevRelations" :rules="formRules" label-building="right">
				<el-form-item label="设备列表" class="dialog-form-item">
					<div style="float: right">
						<el-button size="small" type="primary" icon="Plus" @click="selectDevice('device')">选择设备</el-button>
					</div>
				</el-form-item>
				<el-table :data="devList" element-loading-text="Loading" style="width: 100%" fit highlight-current-row>
					<el-table-column label="设备编码" align="center" width="100">
						<template v-slot="scope">
							<span>{{ scope.row.deviceNum }}</span>
						</template>
					</el-table-column>
					<el-table-column label="设备类型" align="center">
						<template v-slot="scope">
							<span>{{ scope.row.deviceType }}</span>
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
					<el-table-column label="地址" align="center">
						<template v-slot="scope">
							<span>{{ scope.row.address }}</span>
						</template>
					</el-table-column>
				</el-table>
				<el-form-item label="关联设备" class="dialog-form-item">
					<div style="float: right">
						<el-button size="small" type="primary" icon="Plus" @click="selectDevice('deviceRel')">选择设备</el-button>
					</div>
				</el-form-item>
				<el-table :data="devRelList" element-loading-text="Loading" style="width: 100%" fit highlight-current-row>
					<el-table-column label="设备编码" align="center" width="100">
						<template v-slot="scope">
							<span>{{ scope.row.deviceNum }}</span>
						</template>
					</el-table-column>
					<el-table-column label="设备类型" align="center">
						<template v-slot="scope">
							<span>{{ scope.row.deviceType }}</span>
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
					<el-table-column label="地址" align="center">
						<template v-slot="scope">
							<span>{{ scope.row.address }}</span>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
			<template #footer>
				<el-button size="small" @click="dialogVisible = false">取消</el-button>
				<el-button size="small" type="primary" :loading="isloading" @click="onSubmit">确认</el-button>
			</template>
		</el-dialog>
		<el-dialog v-model="dialogSelectVisible" title="设备选择">
			<RadioTable ref="radioTable" @getSelectedItem="radioChange" :deviceNum="deviceNum" />
			<template #footer>
				<el-button size="small" @click="dialogSelectVisible = false">取消</el-button>
				<el-button size="small" type="primary" @click="onDevSelectSubmit">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>
<script>
import {
	getDevRelationList,
	addDevRelation,
	deleteDevRelation,
	importDevRelation,
	exportDevRelation
} from "@/api/devMgmt/devicerelations/index.js"
import Pagination from "@/components/Pagination/index.vue"
import { genFileId } from "element-plus"
import downloadfile from "js-file-download"
import RadioTable from "@/components/RadioTable"
export default {
	data() {
		return {
			isloading: false,
			dialogSelectVisible: false,
			dialogVisible: false,
			isDevRelationListLoading: false,
			isButtonUploadLoadingShow: false,
			isExportLoading: false,
			importVisible: false,
			isEdit: false,
			total: 0,
			tempList: [],
			devList: [],
			deviceList: [],
			devRelList: [],
			selection: [],
			deviceNum: "",
			paramGetList: {
				page: 1,
				limit: 10,
				deviceNum: "",
				deviceNumRelation: ""
			},
			// 选择器选项
			searchData: {
				deviceNum: "",
				deviceNumRelation: ""
			},
			formRules: {
				deviceNum: { required: true, message: "填写设备编码" }
			},
			formDevRelations: {
				id: 0,
				deviceNumRelation: "",
				deviceNum: ""
			},
			type: ""
		}
	},
	components: {
		Pagination,
		RadioTable
	},

	created() {
		this.getDevRelationList()
	},
	methods: {
		selectDevice(type) {
			this.type = type
			if (type === "device") {
				if (this.devList.length) {
					this.deviceNum = this.devList[0].deviceNum
				}
			} else {
				if (this.devRelList.length) {
					this.deviceNum = this.devRelList[0].deviceNum
				}
			}
			this.dialogSelectVisible = true
		},
		radioChange(list) {
			this.tempList = list
		},
		onDevSelectSubmit() {
			if (this.type === "device") {
				this.devList = this.tempList
			} else {
				this.devRelList = this.tempList
			}
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
			importDevRelation(formData)
				.then(() => {
					this.isButtonUploadLoadingShow = false
					this.importVisible = false
					this.$message({ type: "success", message: "导入成功" })
					this.getDevRelationList()
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
			exportDevRelation()
				.then((res) => {
					this.isExportLoading = false
					this.$message({ type: "success", message: "导出成功" })
					downloadfile(res, "关联列表.xlsx")
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
		handleSearch() {
			this.paramGetList.deviceNum = this.searchData.deviceNum
			this.paramGetList.deviceNumRelation = this.searchData.deviceNumRelation
			if (this.paramGetList.page === 1) {
				this.getDevRelationList()
			}
			this.paramGetList.page = 1
		},
		handleSelectionChange(list) {
			this.selection = list
		},

		handleRefresh() {
			this.paramGetList.page = 1
			this.getDevRelationList()
		},
		// 获取关联列表
		getDevRelationList() {
			this.isDevRelationListLoading = true
			getDevRelationList(this.paramGetList)
				.then((res) => {
					this.total = res.data.total
					this.deviceList = res.data.items
					this.isDevRelationListLoading = false
				})
				.catch(() => {
					this.isDevRelationListLoading = false
				})
		},
		addDevRelation() {
			this.dialogVisible = true
			this.isEdit = false
			if (this.$refs.formRef) this.$refs.formRef.clearValidate()
		},
		// editDevRelation(info) {
		// 	const devInfo = {
		// 		deviceNum: info.deviceNum,
		// 		buildingName: info.buildingName,
		// 		address: info.address,
		// 		floorName: info.floorName
		// 	}
		// 	const devRelInfo = {
		// 		deviceNum: info.deviceNumRelation,
		// 		buildingName: info.buildingNameRelation	,
		// 		address: info.addressRelation,
		// 		floorName: info.floorNameRelation
		// 	}
		//   this.devList = [devInfo]
		//   this.devRelList = [devInfo]
		// 	this.dialogVisible = true
		// 	this.formDevRelations.id = info.id
		// 	this.isEdit = true
		// },
		closeDialogDevRelation() {
			this.init()
		},

		init() {
      this.deviceNum = ''
			this.devList = []
			this.devRelList = []
		},
		// 关联删除
		deleteDevRelation(param) {
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
			this.isloading = true
			deleteDevRelation(id)
				.then(() => {
					this.isloading = false
					this.getDevRelationList()
					this.$message({
						type: "success",
						message: "删除成功"
					})
				})
				.catch(() => {
					this.isloading = false
				})
		},
		onSubmit() {
			this.$refs.formRef.validate((valid) => {
				if (valid) {
					if (!this.devList.length || !this.devRelList.length) {
						this.$message({ type: "warning", message: "未选择设备" })
            return
					}
					this.isloading = true
					const param = {
						deviceNum: this.devList[0].deviceNum,
						deviceNumRelation: this.devRelList[0].deviceNum
					}
					addDevRelation(param)
						.then(() => {
							this.getDevRelationList()
							this.dialogVisible = false
							this.isloading = false
							this.$message({
								type: "success",
								message: "关联成功"
							})
						})
						.catch(() => {
							this.isloading = false
							this.dialogVisible = false
						})
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
	padding: 20px;
}
</style>
