<template>
	<div class="app-main">
		<div class="app-title-item">
			<span class="tip-text">欢迎使用开拓云平台</span>
			<span class="tip-text">点击新建项目来创建一个新项目</span>
			<span class="tip-text">单机进入项目可以查看项目具体内容</span>
			<!-- <span class="tip-text"
				><el-button v-if="isMangmentShow" size="mini" type="primary" @click="$router.push('/platform/mangment')"
					>后台人员管理</el-button
				></span
			> -->
		</div>
		<div class="app-project_item">
			<el-card body-style="padding: 0;" shadow="never">
				<template #header>
					<span style="line-height: 29px">项目列表</span>
					<div class="button" style="float: right">
						<!--新建-->
						<el-button
							class="filter-item"
							style="margin-left: 10px"
							size="small"
							type="primary"
							icon="Plus"
							@click="openAddProject"
							>新建项目
						</el-button>
					</div>
				</template>
				<el-table
					v-loading="isProjectListLoadingShow"
					:data="projectList"
					element-loading-text="Loading"
					style="width: 100%"
					highlight-current-row
				>
					<el-table-column label="序号" align="center" width="70">
						<template v-slot="scope"
							><span>{{ scope.$index + 1 }} </span>
						</template>
					</el-table-column>
					<el-table-column label="项目名称" align="center">
						<template v-slot="scope">
							<span>{{ scope.row.name }}</span>
						</template>
					</el-table-column>
					<el-table-column label="项目地址" align="center">
						<template v-slot="scope">
							<span>{{ scope.row.address }}</span>
						</template>
					</el-table-column>
					<el-table-column label="项目描述" align="center">
						<template v-slot="scope">
							<span>{{ scope.row.description }}</span>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="220" align="center">
						<template #default="scope">
							<el-button type="success" text bg size="small" @click="openEditProject(scope.row)">编辑</el-button>
							<!-- <el-button type="danger" text bg size="small" @click="deleteProject(scope.row)">删除</el-button> -->
							<el-button type="primary" text bg size="small" @click="handleEnter(scope.row)">进入项目</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</div>

		<el-dialog @close="closeDialogProject" v-model="dialogProjectVisible" :title="isEdit ? '编辑项目' : '新建项目'">
			<el-form ref="formProjectRef" :model="formProject" :rules="formRules" label-width="120px" label-position="right">
				<el-form-item prop="name" label="项目名称">
					<el-input size="small" v-model="formProject.name" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="address" label="项目地址">
					<el-input size="small" v-model="formProject.address" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="description" label="项目描述">
					<el-input size="small" v-model="formProject.description" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="leader" label="项目负责人">
					<el-input size="small" v-model="formProject.leader" placeholder="请输入" />
				</el-form-item>
				<el-form-item prop="leaderPhone" label="负责人电话">
					<el-input size="small" v-model="formProject.leaderPhone" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="菜单权限" prop="subMenuPermissions">
					<el-button type="primary" size="small" @click="openDialogPermission">权限分配</el-button>
					<!-- 内嵌dialog -->
					<el-dialog v-model="innerVisible" title="菜单权限" append-to-body>
						<el-tree
							ref="menuTree"
							:accordion="true"
							@check-change="handleCheckChange"
							:data="menuTree"
							:default-checked-keys="formProject.subMenuPermissions"
							:props="{ class: customNodeClass }"
							show-checkbox
							node-key="id"
						/>
						<template #footer>
							<el-button size="small" @click="innerVisible = false">取消</el-button>
							<el-button size="small" type="primary" @click="handleInnerSubmit">确认</el-button>
						</template>
					</el-dialog>
				</el-form-item>

				<el-form-item prop="appModule" label="APP模块权限">
					<el-checkbox-group v-model="formProject.appModule">
						<div class="group-top-item">
							<el-checkbox :label="item.id" v-for="item in appModule" :key="item.id" class="checkbox-item">{{
								item.label
							}}</el-checkbox>
						</div>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogProjectVisible = false">取消</el-button>
				<el-button type="primary" v-loading="isBtnLoading" @click="onProjectFormSubmit">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>
<script>
import { getProjectList, addProject, editProject, deleteProject, getProjectInfo } from "@/api/projects"
import { menuTree } from "./data/menu.ts"
import { useUserStore } from "@/store/modules/user"
import { appModule } from "@/common/appModule"
import { rangeFilter } from "@/utils/tools"
// import { mapGetters } from 'vuex'

export default {
	data() {
		return {
			isEdit: false,
			isDeleteLoading: false,
			isBtnLoading: false,
			dialogProjectVisible: false,
			innerVisible: false,
			isProjectListLoadingShow: false,
			dialogProjectVisible: false,
			isEdit: false,
			appModule,
			projectselection: [],
			projectList: [],
			allKeys: [],
			formRules: {
				name: [{ required: true, trigger: "blur", message: "请输入项目名称" }],
				address: [{ required: true, trigger: "blur", message: "请输入项目地址" }],
				description: [{ required: true, trigger: "blur", message: "请输入项目描述" }],
				leader: [{ required: true, trigger: "blur", message: "请输入项目负责人" }],
				leaderPhone: [{ required: true, trigger: "blur", message: "请输入负责人电话" }],
				appModule: [{ required: true, trigger: "blur", message: "请选择APP权限模块" }]
			},
			paramGetProjectList: {
				page: 1,
				limit: 20
			},
			formProject: {
				id: "",
				name: undefined,
				description: undefined,
				address: undefined,
				description: undefined,
				leader: undefined,
				leaderPhone: undefined,
				latitude: 0,
				longitude: 0,
				menuPermissions: [],
				subMenuPermissions: [],
				appModule: []
			},
			menuTree,
			menuList: []
		}
	},
	computed: {
		// ...mapGetters([
		//   'user_company',
		//   'Account_Type',
		//   'permission_routers'
		// ]),
		// isCreateProjectShow: function() {
		//   return [1, 2, 10].includes(this.Account_Type)
		// },
		// isDeteteProject() {
		//   return [1, 2, 10].includes(this.Account_Type)
		// },
		// isEditProject() {
		//   return [1, 2, 10, 11].includes(this.Account_Type)
		// },
		// isMangmentShow: function() {
		//   return [1, 2].includes(this.Account
	},
	created() {
		// 获取项目列表
		this.getProjectList()
		this.menuList = this.menuTree.map((item) => item.id)
	},
	methods: {
		getKeysWithoutLeaf(tree) {
			const arr = []
			tree.forEach((ele) => {
				if (!ele.children) {
					arr.push(ele.id)
				}
			})
			return arr
		},
		imgError(event) {
			const img = event.srcElement
			img.src = process.env.PROJECT_IMAGE_URL + "0.jpg"
			img.onerror = null
		},
		// 子节点类判断
		customNodeClass(data) {
			if (data.is_children) {
				return "is-children"
			}
			return null
		},
		openDialogPermission() {
			this.innerVisible = true
			if (!this.isEdit) {
				this.$nextTick(() => {
					this.$refs.menuTree.setCheckedKeys(this.menuList)
				})
			} else {
				this.$nextTick(() => {
					this.$refs.menuTree.setCheckedKeys([
						...this.formProject.subMenuPermissions,
						// 没有子菜单的数据直接用主菜单的ID来给树状图设置Key
						...this.getKeysWithoutLeaf(this.menuTree).filter((id) => this.formProject.menuPermissions.includes(id))
					])
				})
			}
		},
		// 删除
		deleteProject({ id }) {
			this.$confirm("确认删除选中项目吗？", "提示", {
				type: "warning"
			}).then(() => {
				this.isDeleteLoading = true
				deleteProject(id)
					.then(() => {
						this.isDeleteLoading = false
						this.$message({
							type: "success",
							message: "删除成功"
						})
						this.getProjectList()
					})
					.catch(() => {
						this.isDeleteLoading = false
					})
			})
		},

		closeDialogProject() {
			if (this.$refs.formProjectRef) this.$refs.formProjectRef.clearValidate()
			this.isEdit = false
		},

		// 打开项目新增对话框
		openAddProject() {
			this.dialogProjectVisible = true
			this.innerVisible = true
			this.innerVisible = false
			this.init()
		},
		// 打开项目编辑对话框
		openEditProject(info) {
			getProjectInfo(info.id)
				.then(({ data: info }) => {
					this.isEdit = true
					this.dialogProjectVisible = true
					this.formProject.id = info.id
					this.formProject.name = info.name
					this.formProject.leader = info.leader
					this.formProject.leaderPhone = info.leaderPhone
					this.formProject.description = info.description
					this.formProject.address = info.address
					this.formProject.subMenuPermissions = info.subMenuPermissions.split(",").map((item) => item * 1)
					this.formProject.menuPermissions = info.menuPermissions.split(",").map((item) => item * 1)
					this.formProject.appModule = info.appModule.split(",")
				})
				.catch(() => {})
		},

		// 分配权限确认
		handleInnerSubmit() {
			this.innerVisible = false
		},
		// 提交编辑/信息
		onProjectFormSubmit() {
			this.$refs.formProjectRef.validate((valid) => {
				if (this.$refs.menuTree) {
					const getAllKeys = [
						...new Set([...this.$refs.menuTree.getHalfCheckedKeys(), ...this.$refs.menuTree.getCheckedKeys()])
					]
					this.allKeys = getAllKeys
				} else {
					this.allKeys = [...this.formProject.menuPermissions, ...this.formProject.subMenuPermissions]
				}

				if (this.allKeys.length === 0) {
					this.$message({
						type: "warning",
						message: "未选择菜单权限"
					})
					return
				}
				let params
				if (valid) {
					this.isBtnLoading = true
					if (!this.isEdit) {
						params = {
							name: this.formProject.name,
							address: this.formProject.address,
							description: this.formProject.description,
							leaderPhone: this.formProject.leaderPhone,
							leader: this.formProject.leader,
							latitude: 0,
							longitude: 0,
							menuPermissions: rangeFilter(0, 99, this.allKeys).join(","),
							subMenuPermissions: rangeFilter(100, 9999, this.allKeys).join(","),
							appModule: this.formProject.appModule.join(",")
						}
						addProject(params)
							.then(() => {
								this.dialogProjectVisible = false
								this.isBtnLoading = false
								this.getProjectList()
								this.$message({
									type: "success",
									message: "成功"
								})
							})
							.catch(() => {
								this.isBtnLoading = false
							})
					} else {
						params = {
							name: this.formProject.name,
							address: this.formProject.address,
							description: this.formProject.description,
							leaderPhone: this.formProject.leaderPhone,
							leader: this.formProject.leader,
							latitude: 0,
							longitude: 0,
							menuPermissions: rangeFilter(0, 99, this.allKeys).join(","),
							subMenuPermissions: rangeFilter(100, 9999, this.allKeys).join(","),
							appModule: this.formProject.appModule.join(",")
						}
						editProject(params, this.formProject.id)
							.then(() => {
								this.isBtnLoading = false
								this.dialogProjectVisible = false
								this.getProjectList()
								this.$message({
									type: "success",
									message: "编辑成功"
								})
							})
							.catch(() => {
								this.isBtnLoading = false
							})
					}
				}
			})
		},

		init() {
			this.formProject.name = undefined
			this.formProject.address = undefined
			this.formProject.description = undefined
			this.formProject.leader = undefined
			this.formProject.leaderPhone = undefined
			this.formProject.menuPermissions = []
			this.formProject.subMenuPermissions = []
			this.formProject.appModule = []
			this.$nextTick(() => {
				if (this.$refs.formProjectRef) this.$refs.formProjectRef.clearValidate()
			})
		},

		/**
		 * @Description: 获取各个项目的图片url
		 **/
		getProjectImageUrl(ID) {
			return process.env.PROJECT_IMAGE_URL + ID + ".jpg" + "?t=" + +new Date()
		},

		/**
		 * @Description: 去往管理页面
		 **/
		toMangmentPage() {
			this.$router.push({ path: "/platform/mangment" })
		},

		/**
		 * @Description: 项目选择
		 **/
		handleEnter({ id }) {
			useUserStore()
				.enterProject(id)
				.then(() => {
					this.$router.push("/")
				})
		},
		/**
		 * @Description: 获取项目列表
		 **/
		getProjectList() {
			this.isProjectListLoadingShow = true
			getProjectList(this.paramGetProjectList)
				.then((res) => {
					this.isProjectListLoadingShow = false
					this.projectList = res.data.items
				})
				.catch(() => {
					this.isProjectListLoadingShow = false
				})
		}
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-main {
	padding: 12px 24px 32px 24px;
	.group-top-item {
		padding: 4px 16px;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
		border-color: #dddddd;
		border-width: 1px;
		border-style: solid;
	}
	.app-title-item {
		margin-left: 10px;
		margin-bottom: 10px;
		margin-top: 0;
		.company-text {
			line-height: 48px;
			display: block;
			font-size: 26px;
			font-weight: 600;
		}
		.tip-text {
			display: block;
			line-height: 36px;
		}
	}
}
::v-deep .is-children > .el-tree-node__content {
	color: #626aef;
}
</style>
