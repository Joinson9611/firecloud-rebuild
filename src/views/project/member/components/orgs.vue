<template>
	<div class="app-wrapper">
		<div class="filter-wrapper">
			<el-button
				type="primary"
				:disabled="popoverOrg.popoverAddVisible || popoverOrg.popoverEditVisible"
				size="small"
				icon="Plus"
				@click="addCompany"
				>添加公司</el-button
			>
		</div>
		<div class="table-wrapper">
			<el-table
				v-loading="isloading"
				:data="orgsTree"
				element-loading-text="加载中"
				style="width: 100%"
				row-key="id"
				fit
				highlight-current-row
				default-expand-all
			>
				<el-table-column label="组织名称" align="left">
					<template v-slot="scope">
						<span>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="组织描述" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.description }}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="220" align="center">
					<template #default="scope">
						<el-popover
							trigger="click"
							@hide="hidePop"
							:visible="scope.row.popoverAddVisible"
							title="添加"
							placement="top"
							:width="260"
						>
							<el-form size="small" label-position="left" ref="formOrgRef" :rules="formRules" :model="formOrgs">
								<el-form-item label="部门名称" prop="name">
									<el-input v-model="formOrgs.name" type="text" />
								</el-form-item>
								<el-form-item label="部门描述" prop="description">
									<el-input v-model="formOrgs.description" type="text" />
								</el-form-item>
							</el-form>
							<div style="text-align: right; margin: 0">
								<el-button size="small" text @click="cancelPop(scope.row)">取消</el-button>
								<el-button size="small" type="primary" @click="onAddSubmit(scope.row)">确认</el-button>
							</div>
							<template #reference>
								<el-button type="primary" text bg size="small" @click="handleAdd(scope.row)">添加</el-button>
							</template>
						</el-popover>
						<el-popover
							trigger="click"
							@hide="hidePop"
							:visible="scope.row.popoverEditVisible"
							title="编辑"
							placement="top"
							:width="260"
						>
							<el-form size="small" label-position="left" ref="formOrgRef" :rules="formRules" :model="formOrgs">
								<el-form-item label="部门名称" prop="name">
									<el-input v-model="formOrgs.name" type="text" />
								</el-form-item>
								<el-form-item label="部门描述" prop="description">
									<el-input v-model="formOrgs.description" type="text" />
								</el-form-item>
							</el-form>
							<div style="text-align: right; margin: 0">
								<el-button size="small" text @click="cancelPop(scope.row)">取消</el-button>
								<el-button size="small" type="primary" @click="onEditSubmit(scope.row)">确认</el-button>
							</div>
							<template #reference>
								<el-button type="success" text bg size="small" @click="handleEdit(scope.row)">编辑</el-button>
							</template>
						</el-popover>
						<el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog v-model="dialogCompanyVisible" title="新建公司">
			<el-form ref="formCompanyRef" :model="formOrgs" :rules="formRules" label-width="120px" label-position="right">
				<el-form-item prop="name" label="公司名称">
					<el-input size="small" v-model="formOrgs.name" placeholder="请输入名称" />
				</el-form-item>
				<el-form-item prop="description" label="公司描述">
					<el-input size="small" v-model="formOrgs.description" placeholder="请输入描述" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button size="small" @click="dialogCompanyVisible = false">取消</el-button>
				<el-button size="small" type="primary" v-loading="isBtnLoading" @click="onCompanyAddSubmit">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { getOrgTree, addOrg, addCompany, editOrg, deleteOrg } from "@/api/project/orgs.ts"
export default {
	data() {
		return {
			isloading: false,
			dialogCompanyVisible: false,
			orgsTree: [],
			companyList: [],
			formRules: {
				name: { required: true, message: "填写名称" },
				description: { required: true, message: "填写描述" }
			},
			tempData: {},
			popoverOrg: {},
			formCompany: {
				name: "",
				description: ""
			},
			formOrgs: {
				name: "",
				description: ""
			}
		}
	},
	methods: {
		addPopoverVisible(treeData) {
			treeData.forEach((node) => {
				// 添加popoverVisible字段，默认为false
				node.popoverAddVisible = false
				node.popoverEditVisible = false
				// 如果有子节点，则递归调用addPopoverVisible函数处理子节点
				if (node.children && node.children.length > 0) {
					this.addPopoverVisible(node.children)
				}
			})
		},
		addCompany() {
			this.dialogCompanyVisible = true
			this.$nextTick(() => {
				if (this.$refs.formCompanyRef) this.$refs.formCompanyRef.clearValidate()
			})
		},
		onCompanyAddSubmit() {
			this.$refs.formCompanyRef.validate((valid) => {
				if (valid) {
					addCompany(this.formOrgs)
						.then(() => {
							this.getOrgsTree()
							this.dialogCompanyVisible = false
							this.$message({
								type: "success",
								message: "添加成功"
							})
						})
						.catch(() => {
							this.dialogCompanyVisible = false
						})
				}
			})
		},
		// 关闭添加对话框
		hidePop() {
      this.formOrgs.name = ""
			this.formOrgs.description = ""
		},
		cancelPop(node) {
			node.popoverAddVisible = false
			node.popoverEditVisible = false
		},
		// 获得组织树
		getOrgsTree() {
			this.isloading = true
			getOrgTree()
				.then((res) => {
					this.isloading = false
					if (res.data.orgTree) {
						this.$emit("getTreeData", res.data.orgTree)
						this.addPopoverVisible(res.data.orgTree)
						this.orgsTree = res.data.orgTree
					}
				})
				.catch(() => {
					this.isloading = false
				})
		},
		// 确认添加处理
		onAddSubmit(node) {
			// const isCompany = node.parentId === 0
			// this.isCompany = isCompany
			this.$refs.formOrgRef.validate((valid) => {
				if (valid) {
					const param = {
						name: this.formOrgs.name,
						description: this.formOrgs.description,
						parentId: node.id
					}
					addOrg(param)
						.then(() => {
							this.$message({
								type: "success",
								message: "添加成功"
							})
							this.getOrgsTree()
							this.popoverOrg.popoverAddVisible = false
						})
						.catch(() => {
							this.popoverOrg.popoverAddVisible = false
						})
				}
			})
		},

		// 确认编辑
		onEditSubmit(node) {
			this.$refs.formOrgRef.validate((valid) => {
				if (valid) {
					editOrg(this.formOrgs, node.id)
						.then(() => {
							this.$message({
								type: "success",
								message: "编辑成功"
							})
							this.getOrgsTree()
							this.popoverOrg.popoverEditVisible = false
						})
						.catch(() => {
							this.popoverOrg.popoverEditVisible = false
						})
				}
			})
		},
		// 处理添加
		handleAdd(node) {
			// 如果已经有开启popover则将其关闭
			if (this.popoverOrg.popoverAddVisible || this.popoverOrg.popoverEditVisible) {
				this.popoverOrg.popoverAddVisible = false
				this.popoverOrg.popoverEditVisible = false
			}
			this.popoverOrg = node
			node.popoverAddVisible = true
			this.$nextTick(() => {
				if (this.$refs.formOrgRef) this.$refs.formOrgRef.clearValidate()
			})
		},
		handleEdit(node) {
			// 如果已经有开启popover则将其关闭
			if (this.popoverOrg.popoverAddVisible || this.popoverOrg.popoverEditVisible) {
				this.popoverOrg.popoverAddVisible = false
				this.popoverOrg.popoverEditVisible = false
			}
			if (this.$refs.formOrgRef) this.$refs.formOrgRef.clearValidate()
			this.formOrgs.name = node.name
			this.formOrgs.description = node.description
			this.popoverOrg = node
			node.popoverEditVisible = true
		},
		handleDelete({ id }) {
			deleteOrg(id)
				.then(() => {
					this.getOrgsTree()
					this.$message({
						type: "success",
						message: "删除成功"
					})
				})
				.catch(() => {})
		}
	},
	created() {
		this.getOrgsTree()
	}
}
</script>

<style lang="scss" scoped>
.app-wrapper {
	height: 100%;
	width: 100%;
	padding: 0 !important;
	.filter-wrapper {
		padding: 0 0 5px 0;
	}
}
// ::v-deep .custom-tree-node {
// 	flex: 1;
// 	display: flex;
// 	align-items: center;
// 	justify-content: space-between;
// 	font-size: 14px;
// 	padding-right: 8px;
// }
</style>
