<template>
	<div class="app-wrapper">
		<div class="filter-wrapper">
			<el-button type="primary" icon="Plus" size="small" @click="addPosition">添加岗位</el-button>
		</div>
		<el-table
			v-loading="isPositionListLoading"
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
			<el-table-column label="岗位名称" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="岗位描述" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.description }}</span>
				</template>
			</el-table-column>

			<el-table-column fixed="right" label="操作" width="130" align="center">
				<template #default="scope">
					<el-button type="success" text bg size="small" @click="editPosition(scope.row)">编辑</el-button>
					<el-button type="danger" text bg size="small" @click="deletePosition(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			v-if="total > 0"
			:total="total"
			v-model:page="paramGetList.page"
			v-model:limit="paramGetList.limit"
			@pagination="getPositionList"
		/>
		<el-dialog v-model="dialogVisible" :title="isEdit ? '编辑岗位' : '新建岗位'">
			<el-form ref="formRef" :model="formPositions" :rules="formRules" label-width="120px" label-position="right">
				<el-form-item prop="name" label="岗位名称">
					<el-input size="small" v-model="formPositions.name" placeholder="请输入名称" />
				</el-form-item>
				<el-form-item prop="description" label="岗位描述">
					<el-input size="small" v-model="formPositions.description" placeholder="请输入描述" />
				</el-form-item>
				<el-form-item label="数据权限等级" prop="dataPermissionLevel">
					<el-select size="small" v-model="formPositions.dataPermissionLevel" placeholder="请选择数据权限等级">
						<el-option v-for="item in dataLevelOption" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
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
import { getPositionList, addPosition, editPosition, deletePosition, getPermissionMenu } from "@/api/project/positions"
import Pagination from "@/components/Pagination/index.vue"
export default {
	data() {
		return {
			dialogVisible: false,
			isPositionListLoading: false,
			isEdit: false,
			total: 0,
			positionList: [],
			dataLevelOption: [],
			paramGetList: {
				page: 1,
				limit: 20,
				orgId: 0
			},
			formRules: {
				name: { required: true, message: "填写名称" },
				description: { required: true, message: "填写描述" },
				dataPermissionLevel: { required: true, message: "选择数据权限等级" }
			},
			formPositions: {
				dataPermissionLevel: undefined,
				description: "",
				name: "",
				id: 0
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
					this.getPositionList()
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
		this.getPermissionMenu()
	},
	methods: {
		// 获取岗位列表
		getPositionList() {
			this.isPositionListLoading = true
			getPositionList(this.paramGetList)
				.then((res) => {
					this.total = res.data.total
					this.positionList = res.data.items
					this.isPositionListLoading = false
				})
				.catch(() => {
					this.isPositionListLoading = false
				})
		},
		// 获取数据权限菜单
		getPermissionMenu() {
			getPermissionMenu()
				.then((res) => {
					this.dataLevelOption = res.data.items
				})
				.catch(() => {})
		},
		addPosition() {
			if (this.id) {
				this.formPositions.name = ""
				this.formPositions.description = ""
				this.formPositions.dataPermissionLevel = undefined
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
		editPosition(info) {
			this.dialogVisible = true
			this.formPositions.id = info.id
			this.formPositions.description = info.description
			this.formPositions.dataPermissionLevel = info.dataPermissionLevel
			this.formPositions.name = info.name
			this.isEdit = true
			if (this.$refs.formRef) this.$refs.formRef.clearValidate()
		},
		// 岗位删除
		deletePosition({ id }) {
			deletePosition(id)
				.then(() => {
					this.getPositionList()
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
							dataPermissionLevel: this.formPositions.dataPermissionLevel,
							name: this.formPositions.name,
							description: this.formPositions.description,
							orgId: this.paramGetList.orgId
						}
						editPosition(this.formPositions, this.formPositions.id)
							.then(() => {
								this.$message({
									type: "success",
									message: "编辑成功"
								})
								this.getPositionList()
								this.dialogVisible = false
							})
							.catch(() => {
								this.dialogVisible = false
							})
					} else {
						const param = {
							dataPermissionLevel: this.formPositions.dataPermissionLevel,
							name: this.formPositions.name,
							description: this.formPositions.description,
							orgId: this.paramGetList.orgId
						}
						addPosition(param)
							.then(() => {
								this.getPositionList()
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
