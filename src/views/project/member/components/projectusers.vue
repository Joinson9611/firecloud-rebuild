<template>
	<div class="app-wrapper">
		<div class="filter-wrapper">
			<el-button type="primary" icon="Plus" size="small" @click="addUser">添加用户</el-button>
		</div>
		<el-table
			v-loading="isUserListLoading"
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
			<el-table-column label="用户姓名" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="账号名称" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="用户手机" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.phone }}</span>
				</template>
			</el-table-column>
			<el-table-column label="用户描述" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.description }}</span>
				</template>
			</el-table-column>
			<el-table-column label="有效期" align="center">
				<template v-slot="scope">
					<span>{{ formatTime(scope.row.availableTime) }}</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="130" align="center">
				<template #default="scope">
					<el-button type="success" text bg size="small" @click="editUser(scope.row)">编辑</el-button>
					<el-button type="danger" text bg size="small" @click="deleteUser(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			:total="total"
			v-model:page="paramGetList.page"
			v-model:limit="paramGetList.limit"
			@pagination="getUserList"
		/>
		<el-dialog @close="closeDialogUser" v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新建用户'">
			<el-form ref="formRef" :model="formUsers" :rules="formRules" label-width="120px" label-position="right">
				<el-form-item prop="nickname" label="用户名称">
					<el-input size="small" v-model="formUsers.nickname" placeholder="请输入用户名称" />
				</el-form-item>
				<el-form-item prop="name" label="账号名称">
					<el-input size="small" v-model="formUsers.name" placeholder="请输入账号名称" />
				</el-form-item>
				<el-form-item prop="description" label="用户描述">
					<el-input size="small" v-model="formUsers.description" placeholder="请输入描述" textarea />
				</el-form-item>
				<el-form-item prop="phone" label="用户手机">
					<el-input size="small" v-model="formUsers.phone" placeholder="请输入用户手机" textarea />
				</el-form-item>
				<el-form-item prop="isWebPermit" label="web端访问">
					<el-checkbox v-model="formUsers.isWebPermit" :true-label="1" :false-label="0">允许访问</el-checkbox>
				</el-form-item>
				<el-form-item label="岗位" prop="positionId">
					<el-select size="small" v-model="formUsers.positionId" placeholder="请选择岗位">
						<el-option v-for="item in positionOption" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="角色" prop="roleId">
					<el-select size="small" v-model="formUsers.roleId" placeholder="请选择角色">
						<el-option v-for="item in roleOption" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="有效期" prop="availableTime">
					<el-date-picker
						size="small"
						v-model="formUsers.availableTime"
						type="datetime"
						value-format="x"
						placeholder="请选择有效期"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button size="small" @click="dialogVisible = false">取消</el-button>
				<el-button size="small" type="primary" @click="onSubmit">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>
<script>
import { Formattimestamp } from "@/utils/time"
import { getUserList, addUser, editUser, deleteUser } from "@/api/project/projectusers.ts"
import { getRoleMenu } from "@/api/project/roles.ts"
import Pagination from "@/components/Pagination/index.vue"
import { getPositionMenu } from "@/api/project/positions.ts"

export default {
	data() {
		return {
			dialogVisible: false,
			isUserListLoading: false,
			isEdit: false,
			total: 0,
			positionList: [],
			dataLevelOption: [],
			positionOption: [],
			roleOption: [],
			paramGetList: {
				page: 1,
				limit: 20,
				orgId: 0
			},
			formRules: {
				name: { required: true, message: "填写账号名称", trigger: "trigger" },
				description: { required: true, message: "填写描述" },
				availableTime: { required: true, message: "选择有效期" },
				isWebPermit: { required: true, message: "是否允许web端访问此项目" },
				nickname: { required: true, message: "填写用户名称" },
				phone: { required: true, message: "填写用户手机" },
				positionId: { required: true, message: "选择岗位" },
				roleId: { required: true, message: "选择角色" }
			},
			formUsers: {
				description: "",
				name: "",
				id: 0,
				availableTime: 0,
				isWebPermit: 0,
				nickname: "",
				phone: "",
				positionId: undefined,
				roleId: undefined
			}
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
					this.getUserList()
					getRoleMenu({ orgId: newId }).then((res) => {
						this.roleOption = res.data.items
					})
					this.getPositionMenu(newId)
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
	created() {},
	methods: {
		formatTime(timestamp) {
			return Formattimestamp(timestamp)
		},
		// 获取用户列表
		getUserList() {
			this.isUserListLoading = true
			getUserList(this.paramGetList)
				.then((res) => {
					this.total = res.data.total
					this.positionList = res.data.items
					this.isUserListLoading = false
				})
				.catch(() => {
					this.isUserListLoading = false
				})
		},
		closeDialogUser() {
			if (this.isEdit) {
				this.init()
			}
		},
		// 获取岗位菜单
		getPositionMenu(orgId) {
			getPositionMenu({ orgId }).then((res) => {
				this.positionOption = res.data.items
			})
		},
		addUser() {
			if (this.id) {
				this.dialogVisible = true
				this.isEdit = false
				this.$nextTick(() => {
					this.$refs.formRef.clearValidate()
				})
			} else {
				this.$message({
					type: "warning",
					message: "请选择部门"
				})
			}
		},
		init() {
			this.formUsers.name = ""
			this.formUsers.description = ""
			this.formUsers.phone = ""
			this.formUsers.nickname = ""
			this.formUsers.isWebPermit = 0
			this.formUsers.positionId = undefined
			this.formUsers.roleId = undefined
			this.formUsers.availableTime = undefined
		},
		editUser(info) {
			this.dialogVisible = true
			this.formUsers.id = info.id
			this.formUsers.description = info.description
			this.formUsers.name = info.name
			this.formUsers.positionId = info.positionId
			this.formUsers.roleId = info.roleId
			this.formUsers.nickname = info.nickname
			this.formUsers.phone = info.phone
			this.formUsers.availableTime = info.availableTime * 1000
			this.formUsers.isWebPermit = info.isWebPermit
			this.isEdit = true
		},
		// 用户删除
		deleteUser({ id }) {
			deleteUser(id)
				.then(() => {
					this.getUserList()
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
					if (this.isEdit) {
						const param = {
							name: this.formUsers.name,
							description: this.formUsers.description,
							orgId: this.paramGetList.orgId,
							isWebPermit: this.formUsers.isWebPermit,
							nickname: this.formUsers.nickname,
							phone: this.formUsers.phone,
							positionId: this.formUsers.positionId,
							roleId: this.formUsers.roleId,
							availableTime: this.formUsers.availableTime / 1000
						}
						editUser(param, this.formUsers.id)
							.then(() => {
								this.$message({
									type: "success",
									message: "编辑成功"
								})
								this.getUserList()
								this.dialogVisible = false
							})
							.catch(() => {
								this.dialogVisible = false
							})
					} else {
						const param = {
							name: this.formUsers.name,
							description: this.formUsers.description,
							orgId: this.paramGetList.orgId,
							isWebPermit: this.formUsers.isWebPermit,
							nickname: this.formUsers.nickname,
							phone: this.formUsers.phone,
							positionId: this.formUsers.positionId,
							roleId: this.formUsers.roleId,
							availableTime: this.formUsers.availableTime / 1000
						}
						addUser(param)
							.then(() => {
								this.getUserList()
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
.filter-wrapper {
	padding: 0 0 5px 0;
}
</style>
