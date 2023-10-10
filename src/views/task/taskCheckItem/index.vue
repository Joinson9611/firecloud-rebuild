<template>
	<div class="app-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true">
				<el-form-item label="系统类型">
					<el-select
						size="small"
						@change="systemTypeChange"
						v-model="paramGetList.systemTypeId"
						filterable
						placeholder="请选择"
					>
						<el-option v-for="item in option.systemType" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<!--设备类型-->
				<el-form-item label="设备类型">
					<el-select
						size="small"
						@change="devTypeChange"
						v-model="paramGetList.deviceTypeId"
						filterable
						placeholder="请选择"
					>
						<el-option v-for="item in option.deviceType" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card shadow="never">
			<div class="toolbar-wrapper">
				<div>
					<el-button type="primary" size="small" icon="Plus" @click="addDevItem">新增巡查项</el-button>
					<el-button
						type="danger"
						:disabled="selection.length === 0"
						size="small"
						icon="Delete"
						@click="deleteDevItem()"
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
				v-loading="isItemLoadingShow"
				:data="deviceItem"
				element-loading-text="Loading"
				style="width: 100%"
				highlight-current-row
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" align="center" width="50" />
				<el-table-column label="巡查项名称" align="center">
					<template v-slot="scope">
						{{ scope.row.type }}
					</template>
				</el-table-column>
				<el-table-column label="描述" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.label }}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="150" align="center">
					<template #default="scope">
						<el-button type="success" text bg size="small" @click="editDevItem(scope.row)">编辑</el-button>
						<el-button type="danger" text bg size="small" @click="deleteDevItem(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<el-dialog
			v-model="dialogVisible"
			@close="closeDialog"
			:append-to-body="true"
			:close-on-click-modal="false"
			:title="isEdit ? '编辑巡查项' : '新建巡查项'"
		>
			<el-form ref="formRef" :model="formDevItem" :rules="devItemRules" label-width="120px">
				<el-form-item label="巡查项名称" prop="type">
					<el-input v-model="formDevItem.type" type="text" />
				</el-form-item>
				<el-form-item label="描述">
					<el-input v-model="formDevItem.label" type="textarea" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button size="small" @click="closeDialog">取消</el-button>
				<el-button size="small" :loading="isBtnLoadingShow" type="primary" @click="onSubmit">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { getPatrolSysMenu, getPatrolDevMenu } from "@/api/devMgmt/patrol/patrolsecs.js"
import { getDevTypeMenu, getSysTypeMenu } from "@/api/devMgmt/device/devices.js"
import { getDevItemList, addDevItem, deleteDevItem, editDevItem } from "@/api/task/deviceItem/index.js"
import Pagination from "@/components/Pagination"
export default {
	name: "TaskCheckItem",
	components: { Pagination },
	data() {
		return {
			deviceTypeLoading: false,
			dialogVisible: false,
			// 巡查项列表
			deviceItem: [],
			isBtnLoadingShow: false,
			isItemLoadingShow: false,
			isEdit: false,
			paramGetList: {
				systemTypeId: "",
				deviceTypeId: ""
			},
			option: {
				systemType: [],
				deviceType: []
			},
			devItemRules: {
				type: [{ required: true, trigger: "blur", message: "请填写巡查项名称" }]
			},
			patrolTypeId: this.$route.meta.patrolTypeId,
			formDevItem: {
				id: 0,
				deviceTypeId: undefined,
				type: undefined,
				label: undefined
			},
			selection: []
		}
	},

	created() {
		this.getSysTypeMenu()
		this.patrolTypeId = this.$route.meta.patrolTypeId
	},
	methods: {
		closeDialog() {
			this.init()
			this.dialogVisible = false
		},

		getSysTypeMenu() {
			if (this.patrolTypeId === "0") {
				getPatrolSysMenu().then(({ data }) => {
					this.option.systemType = data.items
					if (data.items.length) {
						this.paramGetList.systemTypeId = data.items[0].id
						this.getDevTypeMenu(this.paramGetList.systemTypeId)
					}
				})
			} else {
				getSysTypeMenu().then(({ data }) => {
					this.option.systemType = data.items
					if (data.items.length) {
						this.paramGetList.systemTypeId = data.items[0].id
						this.getDevTypeMenu(this.paramGetList.systemTypeId)
					}
				})
			}
		},
		getDevTypeMenu(systemTypeId) {
			this.deviceTypeLoading = true
			const params = {
				systemTypeId
			}
			if (this.patrolTypeId === "0") {
				getPatrolDevMenu(params)
					.then((res) => {
						if (res.data.items.length !== 0) {
							this.paramGetList.deviceTypeId = res.data.items[0].id
							this.option.deviceType = res.data.items
							this.getDevItemList()
						} else {
							this.paramGetList.deviceTypeId = ""
							this.option.deviceType = []
							this.deviceItem = []
						}
						this.deviceTypeLoading = false
					})
					.catch(() => {})
			} else {
				getDevTypeMenu(params)
					.then((res) => {
						if (res.data.items.length !== 0) {
							this.paramGetList.deviceTypeId = res.data.items[0].id
							this.option.deviceType = res.data.items
							this.getDevItemList()
						} else {
							this.paramGetList.deviceTypeId = ""
							this.option.deviceType = []
							this.deviceItem = []
						}
						this.deviceTypeLoading = false
					})
					.catch(() => {})
			}
		},
		devTypeChange(id) {
			this.paramGetList.deviceTypeId = id
			this.getDevItemList()
		},
		init() {
			this.formDevItem.type = ""
			this.formDevItem.label = ""
		},
		handleRefresh() {
			this.getDevItemList()
		},
		systemTypeChange(id) {
			this.getDevTypeMenu(id)
		},
		addDevItem() {
			this.isEdit = false
			// 每次打开对话框重置表单验证
			if (this.$refs.formRef !== undefined) this.$refs.formRef.clearValidate()
			this.dialogVisible = true
		},
		onSubmit() {
			this.$refs.formRef.validate((valid) => {
				if (valid) {
					this.isBtnLoadingShow = true
					if (this.isEdit) {
						const param = {
							deviceTypeId: this.paramGetList.deviceTypeId,
							label: this.formDevItem.label,
							type: this.formDevItem.type
						}
						editDevItem(param, this.formDevItem.id, this.patrolTypeId)
							.then(() => {
								this.$message({
									type: "success",
									message: "编辑成功"
								})
								this.isBtnLoadingShow = false
								this.getDevItemList()
								this.dialogVisible = false
							})
							.catch(() => {
								this.isBtnLoadingShow = false
								this.dialogVisible = false
							})
					} else {
						const param = {
							deviceTypeId: this.paramGetList.deviceTypeId,
							label: this.formDevItem.label,
							type: this.formDevItem.type
						}
						addDevItem(param, this.patrolTypeId)
							.then(() => {
								this.getDevItemList()
								this.isBtnLoadingShow = false
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
		},
		editDevItem(info) {
			this.dialogVisible = true
			this.formDevItem.id = info.id
			this.formDevItem.deviceTypeId = info.deviceTypeId
			this.formDevItem.label = info.label
			this.formDevItem.type = info.type
			this.isEdit = true
		},
		deleteDevItem(param) {
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
			deleteDevItem(id, this.patrolTypeId)
				.then(() => {
					this.getDevItemList()
					this.$message({
						type: "success",
						message: "删除成功"
					})
				})
				.catch(() => {})
		},
		getDevItemList() {
			this.isItemLoadingShow = true
			const params = {
				deviceTypeId: this.paramGetList.deviceTypeId
			}
			getDevItemList(params, this.patrolTypeId)
				.then((res) => {
					this.isItemLoadingShow = false
					this.deviceItem = res.data.items
				})
				.catch(() => {
					this.isItemLoadingShow = false
				})
		},

		handleSelectionChange(arr) {
			this.selection = arr
		}
	}
}
</script>
