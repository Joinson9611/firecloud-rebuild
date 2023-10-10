<template>
	<div class="app-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true" :model="searchData">
				<el-form-item label="服务器编码">
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
					<el-button type="primary" size="small" icon="Plus" @click="addDevice">新增服务器</el-button>
					<el-button type="danger" :disabled="selection.length === 0" size="small" icon="Delete" @click="deleteDevice()"
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
				<el-table-column label="服务器名称" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="服务器编码" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.deviceNum }}</span>
					</template>
				</el-table-column>
				<el-table-column label="服务器描述" align="center">
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
						<el-button type="success" text bg size="small" @click="editDevice(scope.row)">编辑</el-button>
						<el-button type="danger" :loading="isloading" text bg size="small" @click="deleteDevice(scope.row)"
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
				@pagination="getDeviceList"
			/>
		</el-card>
		<el-dialog v-model="dialogVisible" @close="closeDialogDevice" :title="isEdit ? '编辑服务器' : '新建服务器'">
			<el-form ref="formRef" :model="formDevices" :rules="formRules" label-width="120px" label-building="right">
				<el-form-item prop="name" label="服务器名称">
					<el-input size="small" v-model="formDevices.name" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="deviceNum" label="服务器编码">
					<el-input size="small" :disabled="isEdit" v-model="formDevices.deviceNum" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="description" label="服务器描述">
					<el-input size="small" v-model="formDevices.description" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="address" label="详细地址">
					<el-input size="small" v-model="formDevices.address" placeholder="请输入" />
				</el-form-item>
				<!-- <el-form-item label="有效期" prop="availableTime">
					<el-date-picker
						size="small"
						v-model="formDevices.availableTime"
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
import { getDeviceList, addDevice, editDevice, deleteDevice } from "@/api/devMgmt/device/deviceserver401s.js"
import Pagination from "@/components/Pagination/index.vue"

export default {
	data() {
		return {
			isloading: false,
			dialogVisible: false,
			isDeviceListLoading: false,
			isButtonUploadLoadingShow: false,
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
				name: { required: true, message: "填写服务器名称" },
				description: { required: true, message: "填写描述" },
				deviceNum: { required: true, message: "填写服务器编码" },
				address: { required: true, message: "填写地址" },
				availableTime: { required: true, message: "填写有效期" }
			},
			formDevices: {
				id: 0,
				address: "",
				availableTime: 0,
				description: "",
				deviceNum: "",
				name: ""
			}
		}
	},
	components: {
		Pagination
	},

	created() {
		this.getDeviceList()
	},
	methods: {
		handleSearch() {
			this.paramGetList.deviceNum = this.searchData.deviceNum
			this.paramGetList.address = this.searchData.address
			if (this.paramGetList.page === 1) {
				this.getDeviceList()
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
			this.getDeviceList()
		},
		// 获取服务器列表
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
			this.formDevices.address = ""
			this.formDevices.description = ""
			this.formDevices.availableTime = ""
		},
		// 服务器删除
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
			this.isloading = true
			deleteDevice(id)
				.then(() => {
					this.isloading = false
					this.getDeviceList()
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
							id: this.formDevices.id,
							name: this.formDevices.name,
							description: this.formDevices.description,
							deviceNum: this.formDevices.deviceNum,
							availableTime: this.formDevices.availableTime / 1000,
							address: this.formDevices.address,
							latitude: 0,
							longitude: 0
						}
						editDevice(param, this.formDevices.id)
							.then(() => {
								this.$message({
									type: "success",
									message: "编辑成功"
								})
								this.getDeviceList()
								this.dialogVisible = false
								this.isloading = false
							})
							.catch(() => {
								this.dialogVisible = false
								this.isloading = false
							})
					} else {
						const param = {
							description: this.formDevices.description,
							deviceNum: this.formDevices.deviceNum,
              name: this.formDevices.name,
							availableTime: this.formDevices.availableTime / 1000,
							address: this.formDevices.address,
							latitude: 0,
							longitude: 0
						}
						addDevice(param)
							.then(() => {
								this.getDeviceList()
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
