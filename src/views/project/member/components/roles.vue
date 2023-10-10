<template>
	<div class="app-wrapper">
		<div class="filter-wrapper">
			<el-button type="primary" icon="Plus" size="small" @click="addRole">添加角色</el-button>
		</div>
		<el-table
			v-loading="isRoleListLoading"
			:data="positionList"
			element-loading-text="Loading"
			style="width: 100%"
			highlight-current-row
		>
			<el-table-column label="序号" align="center" width="70">
				<template v-slot="scope"
					><span>{{ scope.$index + 1 }} </span>
				</template>
			</el-table-column>
			<el-table-column label="角色名称" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="角色描述" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.description }}</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="130" align="center">
				<template #default="scope">
					<el-button type="success" text bg size="small" @click="editRole(scope.row)">编辑</el-button>
					<el-button type="danger" text bg size="small" @click="deleteRole(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			v-if="total > 0"
			:total="total"
			v-model:page="paramGetList.page"
			v-model:limit="paramGetList.limit"
			@pagination="getRoleList"
		/>
		<el-dialog @close="closeDialogRole" v-model="dialogVisible" :title="isEdit ? '编辑角色' : '新建角色'">
			<el-form ref="formRef" label-position="left" :model="formRoles" :rules="formRules" label-width="80px">
				<el-form-item prop="name" label="角色名称">
					<el-input size="small" v-model="formRoles.name" placeholder="请输入名称" />
				</el-form-item>
				<el-form-item prop="description" label="角色描述">
					<el-input size="small" v-model="formRoles.description" type="textarea" placeholder="请输入描述" />
				</el-form-item>
			</el-form>
			<el-tabs>
				<el-tab-pane label="权限选择">
					<div class="tab-wrapper">
						<el-tree
							ref="menuTree"
							v-model="formRoles.projectPermissions"
							:data="menuTree"
							show-checkbox
							node-key="id"
						/>
					</div>
				</el-tab-pane>
				<el-tab-pane label="消息通知">
					<!-- 权限选择 -->
					<el-tree ref="appNotification" :data="appNotification" show-checkbox node-key="id" />
				</el-tab-pane>
				<el-tab-pane label="APP功能模块">
					<div class="tab-wrapper">
						<el-checkbox-group v-model="formRoles.appModule">
							<div class="group-top-item">
								<div v-for="item in appModule" :key="item.id" class="group-item">
									<el-checkbox :label="item.id" v-if="isModuleShow(item.id)" :key="item.id" class="checkbox-item">{{
										item.label
									}}</el-checkbox>
								</div>
							</div>
						</el-checkbox-group>
					</div>
				</el-tab-pane>
			</el-tabs>
			<template #footer>
				<el-button size="small" @click="dialogVisible = false">取消</el-button>
				<el-button size="small" type="primary" @click="onSubmit">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>
<script>
import { getRoleList, addRole, editRole, deleteRole, getRoleInfo } from "@/api/project/roles.ts"
import Pagination from "@/components/Pagination/index.vue"
import { useUserStore } from "@/store/modules/user"
import { menuTree, appNotification } from "./data/index.ts"
import { removeNodes } from "@/utils/tree"
import { appModule } from "@/common/appModule"
import { rangeFilter } from "@/utils/tools"
export default {
	data() {
		return {
			dialogVisible: false,
			isRoleListLoading: false,
			isEdit: false,
			total: 0,
			menuTree: [],
			positionList: [],
			allMenuKeys: [],
			allNotKeys: [],
			paramGetList: {
				page: 1,
				limit: 20,
				orgId: 0
			},
			formRules: {
				name: { required: true, message: "填写名称" },
				description: { required: true, message: "填写描述" }
			},
			formRoles: {
				description: "",
				name: "",
				id: 0,
				appModule: [],
				appNotification: [],
				menuPermissions: [],
				projectPermissions: [],
				subMenuPermissions: []
			},
			appModule,
			appNotification,
			checkedKeys: []
		}
	},
	components: {
		Pagination
	},
	watch: {
		// 监听ID变化
		id: {
			handler(newId) {
				if (newId) {
					this.paramGetList.orgId = newId
					this.getRoleList()
				}
			},
			deep: true,
			immediate: true
		}
	},
	props: {
		id: {
			required: true
		}
	},
	created() {
		const condition = (node) => {
			return !useUserStore().roles.includes(node.id + "") && !node.is_last
		}
		this.menuTree = removeNodes(menuTree, condition)
		// this.projectPermissions = this.getLastLevel(this.menuTree)
	},
	methods: {
		isModuleShow(id) {
			return useUserStore().appModule.includes(id + "")
		},
		// 获取角色列表
		getRoleList() {
			this.isRoleListLoading = true
			getRoleList(this.paramGetList)
				.then((res) => {
					this.total = res.data.total
					this.positionList = res.data.items
					this.isRoleListLoading = false
				})
				.catch(() => {
					this.isRoleListLoading = false
				})
		},
		addRole() {
			if (this.id) {
				this.init()
				this.dialogVisible = true
				this.isEdit = false
				if (this.$refs.formRef) this.$refs.formRef.clearValidate()
			} else {
				this.$message({
					type: "warning",
					message: "请选择部门"
				})
			}
		},
		init() {
			this.formRoles.name = ""
			this.formRoles.description = ""
			this.formRoles.appNotification = []
			this.formRoles.appModule = []
			this.formRoles.projectPermissions = []
			this.formRoles.subMenuPermissions = []
			this.formRoles.menuPermissions = []
			this.allNotKeys = []
			this.allMenuKeys = []
			this.$nextTick(() => {
				this.$refs.menuTree.setCheckedNodes([])
				this.$refs.appNotification.setCheckedNodes([])
			})
		},
		editRole({ id }) {
			getRoleInfo(id).then((res) => {
				const info = res.data
				this.isEdit = true
				this.dialogVisible = true
				this.formRoles.id = info.id
				this.formRoles.description = info.description
				this.formRoles.name = info.name
				this.formRoles.appModule = info.appModule.split(",")
        function formatArr(Str) {
         return Str ? Str.split(",").map((item) => 1 * item) : []
        }
				this.formRoles.appNotification = formatArr(info.appNotification)
				this.formRoles.menuPermissions = formatArr(info.menuPermissions)
				this.formRoles.subMenuPermissions = formatArr(info.subMenuPermissions)
				this.formRoles.projectPermissions = formatArr(info.projectPermissions)
				this.allMenuKeys = [
					...this.formRoles.projectPermissions,
					...this.formRoles.subMenuPermissions,
					...this.formRoles.menuPermissions
				]
				this.allNotKeys = this.formRoles.appNotification
        console.log(this.allNotKeys.length)
				this.$nextTick(() => {
					this.$refs.menuTree.setCheckedKeys(this.formRoles.projectPermissions)
					this.$refs.appNotification.setCheckedKeys(this.formRoles.appNotification)
					this.$refs.formRef.clearValidate()
				})
			})
		},

		deleteRole({ id }) {
			deleteRole(id)
				.then(() => {
					this.getRoleList()
					this.$message({
						type: "success",
						message: "删除成功"
					})
				})
				.catch(() => {})
		},
		closeDialogRole() {
			if (this.$refs.formRef) this.$refs.formRef.clearValidate()
			this.isEdit = false
		},

		onSubmit() {
			this.$refs.formRef.validate((valid) => {
				const getAllKeys = [
					...new Set([...this.$refs.menuTree.getHalfCheckedKeys(), ...this.$refs.menuTree.getCheckedKeys()])
				]
				this.allMenuKeys = getAllKeys
				this.allNotKeys = this.$refs.appNotification.getCheckedKeys()
				// if (this.allNotKeys.length === 0) {
				// 	this.$message({ type: "warning", message: "未选择通知权限" })
				// 	return
				// }
				if (this.allMenuKeys.length === 0) {
					this.$message({ type: "warning", message: "未选择操作权限" })
					return
				}

				if (valid) {
					if (this.isEdit) {
						const param = {
							name: this.formRoles.name,
							description: this.formRoles.description,
							orgId: this.paramGetList.orgId,
							appModule: this.formRoles.appModule.join(","),
							appNotification: rangeFilter(0, 9999, this.allNotKeys).join(","),
							menuPermissions: rangeFilter(0, 99, this.allMenuKeys).join(","),
							subMenuPermissions: rangeFilter(100, 9999, this.allMenuKeys).join(","),
							projectPermissions: rangeFilter(10000, 999999, this.allMenuKeys).join(",")
						}
						editRole(param, this.formRoles.id)
							.then(() => {
								this.$message({
									type: "success",
									message: "编辑成功"
								})
								this.getRoleList()
								this.dialogVisible = false
							})
							.catch(() => {
								this.dialogVisible = false
							})
					} else {
						const param = {
							name: this.formRoles.name,
							description: this.formRoles.description,
							orgId: this.paramGetList.orgId,
							appModule: this.formRoles.appModule.join(","),
							appNotification: rangeFilter(0, 9999, this.allNotKeys).join(","),
							menuPermissions: rangeFilter(0, 99, this.allMenuKeys).join(","),
							subMenuPermissions: rangeFilter(100, 9999, this.allMenuKeys).join(","),
							projectPermissions: rangeFilter(10000, 999999, this.allMenuKeys).join(",")
						}
						addRole(param)
							.then(() => {
								this.getRoleList()
								this.dialogVisible = false
								this.$message({
									type: "success",
									message: "添加成功"
								})
							})
							.catch(() => {
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
.app-wrapper {
	.filter-wrapper {
		padding: 0 0 5px 0;
	}
	.tab-wrapper {
		padding-top: 8px;
	}
	.group-top-item {
		padding: 4px 16px;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
		border-color: #dddddd;
		border-width: 1px;
		border-style: solid;
		width: 100%;
		.group-item {
			display: inline-block;
			margin-left: 5px;
		}
	}
}
::v-deep .el-tabs__content {
	height: 100% !important;
}
</style>
