<template>
	<div class="app-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true" :model="searchData">
				<el-form-item label="设备编码">
					<el-input
						placeholder="请输入"
						size="small"
						v-model="searchData.deviceNum"
						@keydown.enter="handleSearch"
						clearable
					></el-input>
				</el-form-item>
				<el-form-item label="详细地址">
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
					<el-button type="primary" size="small" icon="Plus" @click="addDTU">新增设备</el-button>
					<el-button type="danger" :disabled="selection.length === 0" size="small" icon="Delete" @click="deleteDTU()"
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
				v-loading="isDTUListLoading"
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
				<el-table-column label="DTU名称" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="设备编码" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.deviceNum }}</span>
					</template>
				</el-table-column>
				<el-table-column label="设备描述" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.description }}</span>
					</template>
				</el-table-column>

				<el-table-column label="详细地址" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.address }}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" prop="created_at" width="70" label="有效期">
					<template v-slot="scope">
						<span :style="{ color: isValidTime(scope.row.availableTime).color }">{{
							isValidTime(scope.row.availableTime).type
						}}</span>
					</template>
				</el-table-column> -->
				<el-table-column fixed="right" label="操作" width="150" align="center">
					<template #default="scope">
						<el-button type="success" text bg size="small" @click="editDTU(scope.row)">编辑</el-button>
						<el-button type="danger" :loading="isloading" text bg size="small" @click="deleteDTU(scope.row)"
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
				@pagination="getDTUList"
			/>
		</el-card>
		<el-dialog v-model="dialogVisible" @close="closeDialogDTU" :title="isEdit ? '编辑设备' : '新建设备'">
			<el-form ref="formRef" :model="formDTUs" :rules="formRules" label-width="120px" label-building="right">
				<el-form-item prop="name" label="DTU名称">
					<el-input size="small" v-model="formDTUs.name" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="deviceNum" label="设备编码">
					<el-input :disabled="isEdit" size="small" v-model="formDTUs.deviceNum" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="description" label="设备描述">
					<el-input size="small" v-model="formDTUs.description" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="address" label="详细地址">
					<el-input size="small" v-model="formDTUs.address" placeholder="请输入" />
				</el-form-item>
				<!-- <el-form-item label="有效期" prop="availableTime">
					<el-date-picker
						size="small"
						v-model="formDTUs.availableTime"
						type="datetime"
						placeholder="请选择"
						value-format="x"
					/>
				</el-form-item> -->
			</el-form>
			<template #footer>
				<el-button size="small" @click="dialogVisible = false">取消</el-button>
				<el-button size="small" type="primary" :loading="isloading" @click="onSubmit">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>
<script>
import { getDTUList, addDTU, editDTU, deleteDTU } from "@/api/devMgmt/device/dtus.js"
import Pagination from "@/components/Pagination/index.vue"

export default {
	data() {
		return {
			isloading: false,
			dialogVisible: false,
			isDTUListLoading: false,
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
				address: ""
			},
			// 选择器选项
			searchData: {
				deviceNum: "",
				address: ""
			},
			formRules: {
        name: { required: true, message: "填写名称" },
				description: { required: true, message: "填写描述" },
				deviceNum: { required: true, message: "填写设备编码" },
				address: { required: true, message: "填写地址" },
				availableTime: { required: true, message: "填写有效期" }
			},
			formDTUs: {
				id: 0,
				name: "",
				address: "",
				availableTime: 0,
				description: "",
				deviceNum: "",
				dtuTypeId: 0
			}
		}
	},
	components: {
		Pagination
	},

	created() {
		this.getDTUList()
	},
	methods: {
		handleSearch() {
			this.paramGetList.deviceNum = this.searchData.deviceNum
			this.paramGetList.address = this.searchData.address
			if (this.paramGetList.page === 1) {
				this.getDTUList()
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
			this.getDTUList()
		},
		// 获取设备列表
		getDTUList() {
			this.isDTUListLoading = true
			getDTUList(this.paramGetList)
				.then((res) => {
					this.total = res.data.total
					this.deviceList = res.data.items
					this.isDTUListLoading = false
				})
				.catch(() => {
					this.isDTUListLoading = false
				})
		},
		addDTU() {
			this.dialogVisible = true
			this.isEdit = false
			if (this.$refs.formRef) this.$refs.formRef.clearValidate()
		},
		editDTU(info) {
			this.dialogVisible = true
			this.formDTUs.id = info.id
      this.formDTUs.name = info.name
			this.formDTUs.description = info.description
			this.formDTUs.deviceNum = info.deviceNum
			this.formDTUs.address = info.address
			this.formDTUs.availableTime = info.availableTime * 1000
			this.isEdit = true
		},
		closeDialogDTU() {
			if (this.isEdit) {
				this.init()
			}
			this.isEdit = false
		},
		init() {
			this.formDTUs.deviceNum = ""
			this.formDTUs.address = ""
			this.formDTUs.description = ""
			this.formDTUs.availableTime = ""
		},
		// 设备删除
		deleteDTU(param) {
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
			deleteDTU(id)
				.then(() => {
					this.isloading = false
					this.getDTUList()
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
					this.isloading = true
					if (this.isEdit) {
						const param = {
							name: this.formDTUs.name,
							description: this.formDTUs.description,
							deviceNum: this.formDTUs.deviceNum,
							availableTime: this.formDTUs.availableTime / 1000,
							address: this.formDTUs.address,
							dtuTypeId: this.formDTUs.dtuTypeId
						}
						editDTU(param, this.formDTUs.id)
							.then(() => {
								this.$message({
									type: "success",
									message: "编辑成功"
								})
								this.getDTUList()
								this.dialogVisible = false
								this.isloading = false
							})
							.catch(() => {
								this.dialogVisible = false
								this.isloading = false
							})
					} else {
						const param = {
							name: this.formDTUs.name,
							description: this.formDTUs.description,
							deviceNum: this.formDTUs.deviceNum,
							availableTime: this.formDTUs.availableTime / 1000,
							address: this.formDTUs.address,
							dtuTypeId: this.formDTUs.dtuTypeId
						}
						addDTU(param)
							.then(() => {
								this.getDTUList()
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
			})
		}
	}
}
</script>

<style scoped lang="scss">
.app-container {
	padding: 0;
	:deep(.el-tabs__content) {
		height: calc(100vh - 111px);
		background: #fff;
		overflow: auto;
	}
}
</style>
