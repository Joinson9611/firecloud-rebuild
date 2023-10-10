<template>
	<div class="app-container" style="padding: 0">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true" :model="searchData">
				<el-form-item label="巡更点名称">
					<el-input
						placeholder="请输入"
						size="small"
						v-model="searchData.name"
						@keydown.enter="handleSearch"
						clearable
					></el-input>
				</el-form-item>
				<el-form-item label="巡更点编码">
					<el-input
						placeholder="请输入"
						size="small"
						v-model="searchData.patrolNum"
						@keydown.enter="handleSearch"
						clearable
					></el-input>
				</el-form-item>
				<el-form-item label="巡更点地址">
					<el-input
						placeholder="请输入"
						size="small"
						v-model="searchData.address"
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
					<el-button type="primary" size="small" icon="Plus" @click="addPatrol">新增巡更点</el-button>
					<el-button type="danger" :disabled="selection.length === 0" size="small" icon="Delete" @click="deletePatrol()"
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
				v-loading="isPatrolListLoading"
				:data="patrolList"
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
				<el-table-column label="巡更点名称" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="巡更点编码" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.patrolNum }}</span>
					</template>
				</el-table-column>
				<el-table-column label="巡更点描述" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.description }}</span>
					</template>
				</el-table-column>
				<el-table-column label="主要参数" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.mainParameter }}</span>
					</template>
				</el-table-column>
				<el-table-column label="用途" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.scopeOfUse }}</span>
					</template>
				</el-table-column>
				<el-table-column label="地址" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.address }}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="150" align="center">
					<template #default="scope">
						<el-button type="success" text bg size="small" :loading="isEditLoading" @click="editPatrol(scope.row)"
							>编辑</el-button
						>
						<el-button type="danger" :loading="isloading" text bg size="small" @click="deletePatrol(scope.row)"
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
				@pagination="getPatrolList"
			/>
		</el-card>
		<el-dialog v-model="dialogVisible" @close="closeDialogPatrol" :title="isEdit ? '编辑巡更点' : '新建巡更点'">
			<el-form ref="formRef" :model="formPatrols" :rules="formRules" label-width="120px" label-building="right">
				<el-form-item prop="name" label="巡更点名称">
					<el-input size="small" v-model="formPatrols.name" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="patrolNum" label="巡更点编码">
					<el-input size="small" v-model="formPatrols.patrolNum" :disabled="isEdit" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="description" label="巡更点描述">
					<el-input size="small" type="textarea" v-model="formPatrols.description" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="系统类型" prop="systemTypeId">
					<el-select
						size="small"
						v-model="formPatrols.systemTypeId"
						filterable
						clearable
						placeholder="请选择"
						@change="selectChange"
					>
						<el-option v-for="item in option.system" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<!--设备类型-->
				<el-form-item label="设备类型" prop="deviceTypeId">
					<el-select
						@change="selectChange"
						size="small"
						v-model="formPatrols.deviceTypeId"
						filterable
						clearable
						placeholder="请选择"
					>
						<el-option v-for="item in option.device" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item prop="address" label="地址">
					<el-input size="small" v-model="formPatrols.address" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="mainParameter" label="主要参数">
					<el-input size="small" type="textarea" v-model="formPatrols.mainParameter" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="scopeOfUse" label="用途范围">
					<el-input size="small" type="textarea" v-model="formPatrols.scopeOfUse" placeholder="请输入" />
				</el-form-item>

				<el-form-item label="巡更点照片">
					<div class="image-wrapper">
						<UploadImage :url="imageUrl" @getImgFile="getImgFile" />
					</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button size="small" @click="dialogVisible = false">取消</el-button>
				<el-button size="small" type="primary" :loading="isloading" @click="onSubmit">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>
<script>
import UploadImage from "@/components/uploadImage"
import {
	getPatrolList,
	addPatrol,
	editPatrol,
	deletePatrol,
	importPatrol,
	exportPatrol,
	getPatrolSysMenu,
	getPatrolDevMenu,
	getPatrolInfo
} from "@/api/devMgmt/patrol/patrolsecs.js"
import Pagination from "@/components/Pagination/index.vue"
import { genFileId } from "element-plus"
import downloadfile from "js-file-download"
export default {
	data() {
		return {
			isloading: false,
			isEditLoading: false,
			dialogVisible: false,
			isPatrolListLoading: false,
			dialogFloorVisible: false,
			isButtonUploadLoadingShow: false,
			isExportLoading: false,
			importVisible: false,
			isEdit: false,
			total: 0,
			patrolList: [],
			selection: [],
			option: {
				system: [],
				device: []
			},
			paramGetList: {
				page: 1,
				limit: 10,
				patrolNum: "",
				address: "",
				name: ""
			},
			// 选择器选项
			searchData: {
				patrolNum: "",
				address: "",
				name: ""
			},
			formRules: {
				name: { required: true, message: "填写巡更点名称" },
				patrolNum: { required: true, message: "填写巡更点编码" },
				address: { required: true, message: "填写地址" },
				availableTime: { required: true, message: "填写有效期" },
				deviceTypeId: { required: true, message: "选择设备类型" },
				systemTypeId: { required: true, message: "选择设系统类型" }
				// mainParameter: { required: true, message: "填写主要参数" },
				// scopeOfUse: { required: true, message: "填写用途范围" },
				// description: { required: true, message: "填写描述" },
			},
			formPatrols: {
				id: 0,
				address: "",
				availableTime: 0,
				description: "",
				patrolNum: "",
				name: "",
				deviceTypeId: undefined,
				systemTypeId: undefined,
				scopeOfUse: undefined,
				mainParameter: undefined
			},
			imageUrl: "",
			file: null
		}
	},
	components: {
		Pagination,
		UploadImage
	},

	created() {
		this.getPatrolList()
		this.getPatrolSysMenu()
	},
	methods: {
		getImgFile(file) {
			this.file = file
		},
		getPatrolSysMenu() {
			getPatrolSysMenu().then(({ data }) => {
				this.option.system = data.items
			})
		},
		getPatrolDevMenu(systemTypeId) {
			getPatrolDevMenu({ systemTypeId }).then(({ data }) => {
				this.option.device = data.items
			})
		},
		selectChange(id) {
			if (id) {
				this.getPatrolDevMenu(id)
			} else {
				this.option.device = []
				this.formPatrols.deviceTypeId = ""
			}
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
			importPatrol(formData)
				.then(() => {
					this.isButtonUploadLoadingShow = false
					this.importVisible = false
					this.$message({ type: "success", message: "导入成功" })
					this.getPatrolList()
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
			exportPatrol()
				.then((res) => {
					this.isExportLoading = false
					this.$message({ type: "success", message: "导出成功" })
					downloadfile(res, "巡更点列表.xlsx")
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
			this.paramGetList.patrolNum = this.searchData.patrolNum
			this.paramGetList.address = this.searchData.address
			this.paramGetList.name = this.searchData.name
			if (this.paramGetList.page === 1) {
				this.getPatrolList()
			}
			this.paramGetList.page = 1
		},
		handleSelectionChange(list) {
			this.selection = list
		},
		isValidTime(time) {
			return Date.now() / 1000 < time ? { type: "有效", color: "#67C23A" } : { type: "无效", color: "#F56C6C" }
		},
		handleRefresh() {
			this.paramGetList.page = 1
			this.getPatrolList()
		},
		// 获取巡更点列表
		getPatrolList() {
			this.isPatrolListLoading = true
			getPatrolList(this.paramGetList)
				.then((res) => {
					this.total = res.data.total
					this.patrolList = res.data.items
					this.isPatrolListLoading = false
				})
				.catch(() => {
					this.isPatrolListLoading = false
				})
		},
		addPatrol() {
			this.dialogVisible = true
			this.isEdit = false
			if (this.$refs.formRef) this.$refs.formRef.clearValidate()
		},
		async editPatrol({ id }) {
			this.isEditLoading = true
			const { data: info } = await getPatrolInfo(id)
			this.formPatrols.id = info.id
			this.formPatrols.description = info.description
			this.formPatrols.name = info.name
			this.formPatrols.patrolNum = info.patrolNum
			this.formPatrols.address = info.address
			this.formPatrols.mainParameter = info.mainParameter
			this.formPatrols.scopeOfUse = info.scopeOfUse
			this.formPatrols.availableTime = info.availableTime * 1000
			this.formPatrols.systemTypeId = info.systemTypeId
			this.formPatrols.deviceTypeId = info.deviceTypeId
			if (info.icon) {
				this.imageUrl = import.meta.env.VITE_IMAGE_PATH + info.icon
			}
			const {
				data: { items }
			} = await getPatrolDevMenu({ systemTypeId: info.systemTypeId })
			this.option.device = items
			this.isEditLoading = false
			this.dialogVisible = true

			this.isEdit = true
		},
		closeDialogPatrol() {
			if (this.isEdit) {
				this.init()
			}
			this.isEdit = false
		},
		init() {
			this.formPatrols.name = ""
			this.formPatrols.patrolNum = ""
			this.formPatrols.address = ""
			this.formPatrols.description = ""
			this.formPatrols.availableTime = ""
			this.formPatrols.mainParameter = ""
			this.formPatrols.scopeOfUse = ""
			this.formPatrols.systemTypeId = ""
			this.formPatrols.deviceTypeId = ""
			this.option.device = []

			this.imageUrl = ""
		},
		// 巡更点删除
		deletePatrol(param) {
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
			deletePatrol(id)
				.then(() => {
					this.isloading = false
					this.getPatrolList()
					this.$message({
						type: "success",
						message: "删除成功"
					})
				})
				.catch(() => {
					this.isloading = false
				})
		},
		objectToFormData(obj) {
			const formData = new FormData()
			for (let key in obj) {
				if (obj.hasOwnProperty(key)) {
					formData.append(key, obj[key])
				}
			}
			return formData
		},
		onSubmit() {
			this.$refs.formRef.validate((valid) => {
				if (valid) {
					this.isloading = true
					let formdata = new FormData()
					if (this.isEdit) {
						const param = {
							name: this.formPatrols.name,
							description: this.formPatrols.description,
							patrolNum: this.formPatrols.patrolNum,
							availableTime: this.formPatrols.availableTime / 1000,
							address: this.formPatrols.address,
							systemTypeId: this.formPatrols.systemTypeId,
							deviceTypeId: this.formPatrols.deviceTypeId,
							mainParameter: this.formPatrols.mainParameter,
							scopeOfUse: this.formPatrols.scopeOfUse
						}
						formdata = this.objectToFormData(param)
						if (this.file) {
							formdata.append("icon", this.file)
						}
						editPatrol(formdata, this.formPatrols.id)
							.then(() => {
								this.$message({
									type: "success",
									message: "编辑成功"
								})
								this.getPatrolList()
								this.dialogVisible = false
								this.isloading = false
							})
							.catch(() => {
								this.isloading = false
							})
					} else {
						const param = {
							name: this.formPatrols.name,
							description: this.formPatrols.description,
							patrolNum: this.formPatrols.patrolNum,
							availableTime: this.formPatrols.availableTime / 1000,
							address: this.formPatrols.address,
							systemTypeId: this.formPatrols.systemTypeId,
							deviceTypeId: this.formPatrols.deviceTypeId,
							mainParameter: this.formPatrols.mainParameter,
							scopeOfUse: this.formPatrols.scopeOfUse
						}
						formdata = this.objectToFormData(param)
						if (this.file) {
							formdata.append("icon", this.file)
						}
						addPatrol(formdata)
							.then(() => {
								this.getPatrolList()
								this.dialogVisible = false
								this.isloading = false
								this.$message({
									type: "success",
									message: "添加成功"
								})
                this.init()
							})
							.catch(() => {
								this.isloading = false
							})
					}
				}
			})
		}
	}
}
</script>

<style scoped lang="scss">
.app-container {
	padding: 0;
	.image-wrapper {
		width: 120px;
		height: 120px;
	}
	:deep(.el-tabs__content) {
		height: calc(100vh - 111px);
		background: #fff;
		overflow: auto;
	}
}
</style>
