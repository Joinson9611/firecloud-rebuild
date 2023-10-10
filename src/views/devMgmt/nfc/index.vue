<template>
	<div class="app-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true" :model="searchData">
				<el-form-item label="巡更点类型" prop="devicePatrolTypeId">
					<el-select
						@change="selectChange($event, 'NFC')"
						size="small"
						v-model="paramGetList.devicePatrolTypeId"
						filterable
						clearable
						placeholder="请选择"
					>
						<el-option
							v-for="item in [
								{ id: 0, type: '消防巡更点' },
								{ id: 1, type: 'NFC巡更点' }
							]"
							:key="item.id"
							:label="item.type"
							:value="item.id"
						/>
					</el-select>
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
				<el-form-item label="详细地址">
					<el-input
						placeholder="请输入"
						size="small"
						v-model="searchData.patrolAddress"
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
					<el-button type="primary" size="small" icon="Plus" @click="addNfc">新增NFC</el-button>
					<el-button type="danger" :disabled="selection.length === 0" size="small" icon="Delete" @click="deleteNfc()"
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
				v-loading="isNfcListLoading"
				:data="nfcList"
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
				<el-table-column label="NFC卡编号" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.nfcNum }}</span>
					</template>
				</el-table-column>
				<el-table-column label="巡更点编号" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.patrolNum }}</span>
					</template>
				</el-table-column>
				<el-table-column label="巡更点名称" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.patrolName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="巡更点类型" align="center">
					<template v-slot="scope">
						<span>{{ patrolTypeMap[scope.row.devicePatrolTypeId] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="巡更点地址" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.patrolAddress }}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="150" align="center">
					<template #default="scope">
						<el-button type="success" text bg size="small" @click="editNfc(scope.row)">编辑</el-button>
						<el-button type="danger" :loading="isloading" text bg size="small" @click="deleteNfc(scope.row)"
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
				@pagination="getNfcList"
			/>
		</el-card>
		<el-dialog v-model="dialogVisible" @close="closeDialogNfc" :title="isEdit ? '编辑NFC' : '新建NFC'">
			<el-form ref="formRef" :model="formNfcs" :rules="formRules" label-width="120px" label-building="right">
				<el-form-item prop="nfcNum" label="NFC卡编号">
					<el-input size="small" v-model="formNfcs.nfcNum" :disabled="isEdit" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="绑定列表" class="dialog-form-item">
					<div style="float: right">
						<el-button size="small" type="primary" icon="Plus" @click="selectPatrol">绑定巡更点</el-button>
					</div>
				</el-form-item>
				<el-table :data="tempPatrolList" element-loading-text="Loading" style="width: 100%" fit highlight-current-row>
					<el-table-column label="巡更点名称" align="center" width="100">
						<template v-slot="scope">
							<span>{{ scope.row.name }}</span>
						</template>
					</el-table-column>
					<el-table-column label="巡更点编码" align="center" width="100">
						<template v-slot="scope">
							<span>{{ scope.row.patrolNum }}</span>
						</template>
					</el-table-column>
					<el-table-column label="巡更点类型" align="center" width="100">
						<template v-slot="scope">
							<span>{{ patrolTypeMap[scope.row.devicePatrolTypeId] }}</span>
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

			<el-dialog
				style="width: 60%"
				v-model="selectPatrolsVisible"
				:append-to-body="true"
				:close-on-click-modal="false"
				title="绑定巡更点"
			>
				<el-card shadow="never" class="search-wrapper">
					<el-form ref="searchFormRef" :inline="true" :model="searchPatrolData">
						<el-form-item label="巡更点类型" prop="devicePatrolTypeId">
							<el-select
								@change="selectChange($event, 'patrol')"
								size="small"
								v-model="paramGetPatrolList.devicePatrolTypeId"
								filterable
								clearable
								placeholder="请选择"
							>
								<el-option
									v-for="item in [
										{ id: 0, type: '消防巡更点' },
										{ id: 1, type: '设备巡更点' }
									]"
									:key="item.id"
									:label="item.type"
									:value="item.id"
								/>
							</el-select>
						</el-form-item>
						<el-form-item label="巡更点编码">
							<el-input
								placeholder="请输入"
								size="small"
								v-model="searchPatrolData.patrolNum"
								@keydown.enter="handlePatrolSearch"
								clearable
							></el-input>
						</el-form-item>
						<el-form-item label="巡更点名称">
							<el-input
								placeholder="请输入"
								size="small"
								v-model="searchPatrolData.name"
								@keydown.enter="handlePatrolSearch"
								clearable
							></el-input>
						</el-form-item>

						<el-form-item>
							<el-button type="primary" size="small" icon="Search" @click="handlePatrolSearch">查询</el-button>
						</el-form-item>
					</el-form>
				</el-card>
				<el-card shadow="never">
					<el-table
						v-loading="isPatrolLoading"
						ref="patrolTable"
						:data="patrolList"
						element-loading-text="Loading"
						style="width: 100%"
						fit
						highlight-current-row
						@selection-change="handlePatrolChange"
						@select="patrolSelect"
						@select-all="patrolSelectAll"
					>
						<el-table-column type="selection" align="center" width="50" />
						<el-table-column label="序号" align="center" width="70">
							<template v-slot="scope">
								<span
									>{{ scope.$index + (paramGetPatrolList.page - 1) * paramGetPatrolList.limit + 1 }}
								</span></template
							>
						</el-table-column>
						<el-table-column label="巡更点名称" align="center" width="100">
							<template v-slot="scope">
								<span>{{ scope.row.name }}</span>
							</template>
						</el-table-column>
						<el-table-column label="巡更点编码" align="center" width="100">
							<template v-slot="scope">
								<span>{{ scope.row.patrolNum }}</span>
							</template>
						</el-table-column>
						<el-table-column label="巡更点类型" align="center" width="100">
							<template v-slot="scope">
								<span>{{ patrolTypeMap[scope.row.devicePatrolTypeId] }}</span>
							</template>
						</el-table-column>
						<el-table-column label="巡更点描述" align="center" width="100">
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
					</el-table>
					<pagination
						v-if="patrolTotal > 0"
						:total="patrolTotal"
						v-model:page="paramGetPatrolList.page"
						v-model:limit="paramGetPatrolList.limit"
						@pagination="getPatrolList"
					/>
				</el-card>

				<template #footer>
					<el-button size="small" @click="selectPatrolsVisible = false">取消</el-button>
					<el-button size="small" type="primary" @click="onSelectPatrolSubmit">确定</el-button>
				</template>
			</el-dialog>
		</el-dialog>
	</div>
</template>
<script>
import { getNfcList, addNfc, editNfc, deleteNfc, importNfc, exportNfc } from "@/api/devMgmt/nfc/index.js"
import { getPatrolList } from "@/api/devMgmt/patrol/patrols.js"
import Pagination from "@/components/Pagination/index.vue"
import { genFileId } from "element-plus"
import downloadfile from "js-file-download"
export default {
	data() {
		return {
			isloading: false,
			dialogVisible: false,
			isNfcListLoading: false,
			dialogFloorVisible: false,
			selectPatrolsVisible: false,
			isButtonUploadLoadingShow: false,
			isExportLoading: false,
			importVisible: false,
			isPatrolLoading: false,
			isEdit: false,
			total: 0,
			patrolTotal: 0,
			nfcList: [],
			patrolList: [],
			selection: [],
			patrolSelection: [],
			tempPatrolList: [],
			patrolTypeMap: ["消防巡更点", "设备巡更点"],
			paramGetList: {
				page: 1,
				limit: 10,
				patrolNum: "",
				patrolAddress: ""
			},

			paramGetPatrolList: {
				page: 1,
				limit: 10,
				devicePatrolTypeId: undefined,
				patrolNum: "",
				name: ""
			},
			// 选择器选项
			searchData: {
				patrolNum: "",
				patrolAddress: ""
			},
			searchPatrolData: {
				patrolNum: "",
				name: ""
			},
			formRules: {
				nfcNum: { required: true, message: "填写NFC编码" }
			},
			formNfcs: {
				id: 0,
				nfcNum: "",
				patrolId: ""
			}
		}
	},
	components: {
		Pagination
	},

	created() {
		this.getNfcList()
	},
	methods: {
		onSelectPatrolSubmit() {
			this.selectPatrolsVisible = false
			this.tempPatrolList = this.patrolSelection
		},
		selectChange(id, type) {
			if (type === "patrol") {
				this.paramGetPatrolList.devicePatrolTypeId = id
				this.getPatrolList()
			} else {
				this.paramGetList.devicePatrolTypeId = id
				this.getNfcList()
			}
		},
		handlePatrolChange(list) {
			this.patrolSelection = list.map((item) => {
				return {
					id: item.id,
					devicePatrolTypeId: item.devicePatrolTypeId,
					name: item.name,
					patrolNum: item.patrolNum,
					address: item.address,
					patrolId: item.id,
					description: item.description
				}
			})
		},
		selectPatrol() {
			this.getPatrolList()
			this.selectPatrolsVisible = true
		},
		patrolSelect(selection) {
			if (selection.length > 1) {
				const del_row = selection.shift()
				this.$refs.patrolTable.toggleRowSelection(del_row, false) // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
			}
		},
		patrolSelectAll(selection) {
			if (selection.length > 1) {
				selection.length = 1
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
			importNfc(formData)
				.then(() => {
					this.isButtonUploadLoadingShow = false
					this.importVisible = false
					this.$message({ type: "success", message: "导入成功" })
					this.getNfcList()
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
			exportNfc()
				.then((res) => {
					this.isExportLoading = false
					this.$message({ type: "success", message: "导出成功" })
					downloadfile(res, "NFC列表.xlsx")
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
			this.paramGetList.patrolAddress = this.searchData.patrolAddress
			if (this.paramGetList.page === 1) {
				this.getNfcList()
			}
			this.paramGetList.page = 1
		},
		handlePatrolSearch() {
			this.paramGetPatrolList.name = this.searchPatrolData.name
			this.paramGetPatrolList.patrolNum = this.searchPatrolData.patrolNum
			this.paramGetPatrolList.patrolAddress = this.searchPatrolData.patrolAddress
			if (this.paramGetPatrolList.page === 1) {
				this.getPatrolList()
			}
			this.paramGetPatrolList.page = 1
		},
		handleSelectionChange(list) {
			this.selection = list
		},
		handleRefresh() {
			this.paramGetList.page = 1
			this.getNfcList()
		},
		// 获取NFC列表
		getNfcList() {
			this.isNfcListLoading = true
			getNfcList(this.paramGetList)
				.then((res) => {
					this.total = res.data.total
					this.nfcList = res.data.items
					this.isNfcListLoading = false
				})
				.catch(() => {
					this.isNfcListLoading = false
				})
		},
		getPatrolList() {
			this.isPatrolLoading = true
			getPatrolList(this.paramGetPatrolList)
				.then((res) => {
					const data = res.data
					this.patrolTotal = data.total
					this.isPatrolLoading = false
					this.patrolList = data.items
					if (this.tempPatrolList.length !== 0) {
						this.patrolList.forEach((item) => {
							if (item.patrolNum === this.tempPatrolList[0].patrolNum) {
								this.$nextTick(() => {
									this.$refs.patrolTable.toggleRowSelection(item, true)
								})
							}
						})
					}
				})
				.catch(() => {
					this.isPatrolLoading = false
				})
		},
		addNfc() {
			this.dialogVisible = true
			this.isEdit = false
			if (this.$refs.formRef) this.$refs.formRef.clearValidate()
		},

		editNfc(info) {
			this.dialogVisible = true
			this.formNfcs.id = info.id
			this.formNfcs.patrolId = info.patrolId
			this.formNfcs.nfcNum = info.nfcNum
			const patrolInfo = {
				id: info.id,
				devicePatrolTypeId: info.devicePatrolTypeId,
				name: info.patrolName,
				patrolNum: info.patrolNum,
				address: info.patrolAddress,
				patrolId: info.patrolId
			}
			this.tempPatrolList = [patrolInfo]
			this.isEdit = true
		},
		closeDialogNfc() {
			if (this.isEdit) {
				this.init()
			}
			this.isEdit = false
		},
		init() {
			this.formNfcs.nfcNum = ""
			this.tempPatrolList = []
		},
		// NFC删除
		deleteNfc(param) {
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
			deleteNfc(id)
				.then(() => {
					this.isloading = false
					this.getNfcList()
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
					if (this.tempPatrolList.length === 0) {
						this.$message({
							type: "warning",
							message: "请选择绑定的巡更点"
						})
					} else {
						this.isloading = true
						if (this.isEdit) {
							console.log(this.tempPatrolList)
							const param = {
								patrolId: this.tempPatrolList[0].patrolId
							}
							editNfc(param, this.formNfcs.id)
								.then(() => {
									this.$message({
										type: "success",
										message: "编辑成功"
									})
									this.getNfcList()
									this.dialogVisible = false
									this.isloading = false
								})
								.catch(() => {
									this.dialogVisible = false
									this.isloading = false
								})
						} else {
							const param = {
								nfcNum: this.formNfcs.nfcNum,
								patrolId: this.tempPatrolList[0].id
							}
							addNfc(param)
								.then(() => {
									this.getNfcList()
									this.dialogVisible = false
									this.isloading = false
									this.$message({
										type: "success",
										message: "添加成功"
									})
								})
								.catch(() => {
									this.isloading = false
									this.dialogVisible = false
								})
						}
					}
				}
			})
		}
	}
}
</script>

<style scoped lang="scss">
.app-container {
	height: calc(100vh - 111px);
	background: #fff;
	overflow: auto;
}
</style>
