<template>
	<div class="app-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true" :model="searchData">
				<el-form-item label="是否完成">
					<el-select
						size="small"
						v-model="paramsGetplan.isFinished"
						style="width: 100%"
						clearable
						@change="getPlanList"
					>
						<el-option size="small" v-for="(item, index) in ['否', '是']" :key="index" :label="item" :value="index" />
					</el-select>
				</el-form-item>
				<el-form-item label="是否出具报告">
					<el-select
						size="small"
						v-model="paramsGetplan.isReported"
						style="width: 100%"
						clearable
						@change="getPlanList"
					>
						<el-option size="small" v-for="(item, index) in ['否', '是']" :key="index" :label="item" :value="index" />
					</el-select>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="never">
			<div class="toolbar-wrapper">
				<div>
					<el-button type="primary" size="small" icon="Plus" @click="addPlan">新增计划</el-button>
					<el-button type="danger" :disabled="selection.length === 0" size="small" icon="Delete" @click="deletePlan()"
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
				v-loading="isListLoadingShow"
				:data="list"
				element-loading-text="Loading"
				style="width: 100%"
				fit
				highlight-current-row
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" align="center" width="50" />
				<el-table-column label="序号" align="center" width="70">
					<template v-slot="scope">
						<span>{{ scope.$index + (paramsGetplan.page - 1) * paramsGetplan.limit + 1 }} </span>
					</template>
				</el-table-column>
				<el-table-column label="计划名称" align="center" width="180">
					<template v-slot="scope">
						<span>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="是否完成" align="center">
					<template v-slot="scope">
						<span :style="{ color: whethercolor[scope.row.isFinished] }">{{ whether[scope.row.isFinished] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="是否出具报告" align="center">
					<template v-slot="scope">
						<span :style="{ color: whethercolor[scope.row.isReported] }">{{ whether[scope.row.isReported] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="计划起止日期" align="center" width="220">
					<template v-slot="scope">
						<span>{{ getTime2(scope.row.startTime) }} 至 {{ getTime2(scope.row.endTime) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="220">
					<template v-slot="scope">
						<el-button type="success" text bg size="small" @click="editPlan(scope.row)">编辑</el-button>
						<!-- <el-button type="danger" :loading="isloading" text bg size="small" @click="deleteNfc(scope.row)"
							>删除</el-button
						> -->
						<el-button size="small" text bg type="success" @click="openDetailplan(scope.row)"> 详情 </el-button>
						<el-button
							:disabled="!scope.row.isReported || !scope.row.isFinished"
							text
							bg
							type="primary"
							size="small"
							@click="downloadReport(scope.row)"
						>
							下载报告
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				v-show="total > 0"
				:total="total"
				v-model:page="paramsGetplan.page"
				v-model:limit="paramsGetplan.limit"
				@pagination="getPlanList"
			/>
		</el-card>

		<el-dialog
			v-model="isDialogplansShow"
			:append-to-body="true"
			:close-on-click-modal="false"
			:title="isEdit ? '编辑计划' : '新建计划'"
			@close="closeDialogplan"
		>
			<el-form ref="formRef" :model="formPlan" :rules="planRules" label-width="120px">
				<el-form-item v-if="!isEdit" label="计划年份：" class="dialog-form-item" prop="planYear">
					<el-date-picker
						size="small"
						:disabled-date="disabledTime"
						v-model="formPlan.planYear"
						type="year"
						placeholder="请选择计划年份"
						style="width: 100%"
						value-format="x"
						@change="planyearChange"
					/>
				</el-form-item>
				<el-form-item v-if="!isEdit" label="计划月份：" class="dialog-form-item" prop="planMonthList">
					<div class="checkbox">
						<el-checkbox-group size="small" v-if="planNameOptions.length !== 0" v-model="formPlan.planMonthList">
							<el-checkbox v-for="item in planNameOptions" :key="item.id" :label="item.id">{{ item.type }}</el-checkbox>
						</el-checkbox-group>
						<div style="height: 22px; line-height: 22px; width: 100%" v-else>-</div>
					</div>
				</el-form-item>
				<el-form-item label="项目负责人：" class="dialog-form-item" prop="leader">
					<!-- <el-select
						size="small"
						v-model="formPlan.leader"
						value-key="userId"
						filterable
						placeholder="项目负责人"
						class="filter-item"
					>
						<el-option v-for="item in userOptions" :key="item.id" :label="item.nickname" :value="item.nickname" />
					</el-select> -->
					<el-input placeholder="请输入" size="small" v-model="formPlan.leader" clearable></el-input>
				</el-form-item>
				<el-form-item label="维保人员：" class="dialog-form-item" prop="mcUsers">
					<el-select
						v-model="formPlan.mcUsers"
						multiple
						filterable
						size="small"
						placeholder="维保人员"
						value-key="userId"
					>
						<el-option v-for="item in userOptions" :key="item.id" :label="item.nickname" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="维保内容：" prop="mcSystemList">
					<div class="checkbox">
						<el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
							>全选</el-checkbox
						>
						<div style="margin: 15px 0" />
						<el-checkbox-group v-model="formPlan.mcSystemList" @change="handleCheckedChange">
							<el-checkbox v-for="item in maintenancesysoptions" :key="item.id" :label="item.id">{{
								item.type
							}}</el-checkbox>
						</el-checkbox-group>
					</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button size="small" @click="isDialogplansShow = false">取消</el-button>
				<el-button size="small" :loading="isButtonLoadingShow" type="primary" @click="onSumbit">确定</el-button>
			</template>
		</el-dialog>
		<el-drawer ref="drawer" v-model="dialogDetailplan" title="计划详情" direction="ltr" size="47%">
			<div class="content">
				<div class="header">
					<div class="planDetail">
						<div class="content">
							<ul>
								<li class="item">
									计划名称: <span>{{ planDetail.name || "-" }}</span>
								</li>
								<li class="item">
									起止日期: <span>{{ getTime2(planDetail.startTime) }} 至 {{ getTime2(planDetail.endTime) }}</span>
								</li>
								<li class="item">
									项目负责人: <span>{{ planDetail.leader }}</span>
								</li>
								<li class="item">
									维保人员: <span>{{ planDetail.mcUsers }}</span>
								</li>
								<li class="item">
									维保内容: <span>{{ planDetail.maintenanceSystem }}</span>
								</li>
								<li class="item">维保系统</li>
								<el-table :data="planDetail.mcSystems" style="width: 100%" fit height="240">
									<el-table-column label="序号" align="center" width="70">
										<template v-slot="scope">
											<span>{{ scope.$index + 1 }} </span>
										</template>
									</el-table-column>
									<el-table-column label="系统名称" align="center">
										<template v-slot="scope">
											<span>{{ scope.row.systemType }}</span>
										</template>
									</el-table-column>
									<el-table-column label="检测项数量" align="center">
										<template v-slot="scope">
											<span>{{ scope.row.countAll }}</span>
										</template>
									</el-table-column>
									<el-table-column label="已完成数量" align="center">
										<template v-slot="scope">
											<span>{{ scope.row.countChecked }}</span>
										</template>
									</el-table-column>
								</el-table>
							</ul>
						</div>
					</div>
				</div>
				<div class="footer">
					<el-button type="primary" @click="openConclusion">维保结论</el-button>
					<el-button :loading="isGenerateRepLoadingShow" type="primary" @click="generateReport">生成报告</el-button>
				</div>
			</div>
		</el-drawer>
		<el-dialog
			v-model="isDialogConclusionShow"
			:append-to-body="true"
			:close-on-click-modal="false"
			:title="'维保结论'"
			width="40%"
			style="width：300px"
		>
			<el-form ref="formRef" :model="planDetail" :rules="planRules">
				<el-form-item class="dialog-form-item">
					<el-input
						v-model="planDetail.reportConclusion"
						:autosize="{ minRows: 6, maxRows: 6 }"
						placeholder="请填写维保结论"
						type="textarea"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button size="small" @click="isDialogConclusionShow = false">取消</el-button>
				<el-button
					size="small"
					:loading="isSaveConcluLoadingShow"
					:disabled="!planDetail.reportConclusion"
					type="primary"
					@click="onSaveConclusion"
					>保存</el-button
				>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { getMcsystemTypes } from "@/api/maintenance/mcsystemtypes.js"
import { Formattimestamp, Formattimestamp2 } from "@/utils/time.ts"
import Pagination from "@/components/Pagination"
import {
	getPlanList,
	addPlan,
	deletePlan,
	editPlan,
	getPlanInfo,
	editConlusion,
	generateReport
} from "@/api/maintenance/planmcs.js"
import { getUserMenu } from "@/api/project/projectusers.ts"

export default {
	components: {
		Pagination
	},

	data() {
		return {
			planState: ["未开始", "进行中", "已结束"],
			isPlanEdit: false,
			planRules: {
				planYear: { required: true, message: "请选择计划年份", trigger: "change" },
				planMonthList: { required: true, message: "请选择计划名称", trigger: "blur" },
				leader: { required: true, message: "请选择项目负责人", trigger: "change" },
				mcUsers: { required: true, message: "请选择维保人员", trigger: "blur" },
				mcSystemList: { required: true, message: "请选择维保内容", trigger: "blur" },
				reportConclusion: { required: true, message: "请填写维保结论", trigger: "blur" }
			},

			whethercolor: ["#F56C6C", "#67C23A"],
			whether: ["否", "是"],
			isEdit: false,
			maintenancesysoptions: [],
			planNameOptions: [],
			fileList: [],
			list: [],
			userOptions: [],
			groupOptions: [],

			planFile: "",
			historyFile: "",
			isPlan: false,
			isHistory: false,
			isDeleteLoading: false,
			isButtonUploadLoadingShow: false,
			isButtonLoadingShow: false,
			isDialogFileShow: false,
			isDialogplansShow: false,
			isFileLoadingShow: false,
			isListLoadingShow: false,
			detailVisible: false,
			dialogDetailplan: false,
			isDialogConclusionShow: false,
			isSaveConcluLoadingShow: false,
			selection: [],
			tempFilterOptions: {
				name: undefined
			},

			checkAll: false,
			isIndeterminate: false,

			total: 0,
			// 请求计划组列表信息参数
			paramsGetplan: {
				page: 1,
				limit: 10,
				isFinished: "",
				isReported: ""
			},
			formPlan: {
				planId: undefined,
				planYear: undefined,
				name: undefined,
				label: undefined,
				planMonthList: [],
				leader: undefined,
				mcUsers: undefined,
				mcSystemList: [],
				taskmcGroupId: []
			},
			planDetail: {
				id: "",
				planId: undefined,
				startTime: undefined,
				endTime: undefined,
				planType: undefined,
				planYear: undefined,
				planMonthList: [],
				leader: undefined,
				mcUsers: undefined,
				maintenanceSystem: "",
				mcSystems: "",
				reportConclusion: ""
			}
		}
	},
	created() {
		this.getPlanList()
		this.getUserMenu()
		this.getMcsystemTypes()
	},
	methods: {
		disabledTime(time) {
			const Now = Date.now()
			return time.getTime() < Now - 8.64e7
		},
		// 下载报告
		downloadReport(info) {
			if (info.reportPath) {
				window.open(import.meta.env.VITE_FILE_PATH + info.reportPath)
			}
		},
		// 保存维保结论
		onSaveConclusion() {
			this.isSaveConcluLoadingShow = true
			editConlusion(
				{
					reportConclusion: this.planDetail.reportConclusion
				},
				this.planDetail.id
			)
				.then(() => {
					this.isDialogConclusionShow = false
					this.isSaveConcluLoadingShow = false
					this.$message({
						type: "success",
						message: "保存成功"
					})
				})
				.catch(() => {
					this.isSaveConcluLoadingShow = false
					this.isDialogConclusionShow = false
				})
		},
		// 打开维保结论对话框
		openConclusion() {
			this.isDialogConclusionShow = true
		},
		// 生成报告
		generateReport() {
			this.isGenerateRepLoadingShow = true
			generateReport(this.planDetail.id)
				.then(() => {
					this.isGenerateRepLoadingShow = false
					this.$message({
						type: "success",
						message: "生成成功"
					})
					this.getPlanList()
				})
				.catch(() => {
					this.isGenerateRepLoadingShow = false
				})
		},
		addPlan() {
			this.isDialogplansShow = true
			this.isEdit = false
			if (this.$refs.formRef) this.$refs.formRef.clearValidate()
		},
		handleRefresh() {
			this.paramsGetplan.page = 1
			this.getPlanList()
		},
		openDetailplan({ id }) {
			this.planDetail.id = id
			getPlanInfo(id).then((res) => {
				this.dialogDetailplan = true
				const data = res.data
				if (data.mcUsers) {
					let userlist = ""
					data.mcUsers.split(",").forEach((userName, key) => {
						if (key === 0) {
							userlist += userName
						} else {
							userlist = userlist + "、" + userName
						}
					})
					data.mcUsers = userlist
				} else {
					data.mcUsers = "-"
				}
				if (data.mcSystems.length !== 0) {
					let list = ""
					data.mcSystems.forEach((item, key) => {
						if (key === 0) {
							list += item.systemType
						} else {
							list = list + "、" + item.systemType
						}
					})
					data.maintenanceSystem = list
				} else {
					data.maintenanceSystem = "-"
				}
				this.planDetail = data
			})
		},
		planyearChange(time) {
			if (time) {
				const stime = new Date(time).getFullYear()
				this.getMonthOptions(stime)
			} else {
				this.planNameOptions = []
			}
		},
		getMonthOptions(planYear) {
			this.planNameOptions = []
			const currentMonth = new Date().getMonth() + 1 // 当前月份的前一个月
			const currentYear = new Date().getFullYear()
			let sMonth
			let eMonth
			if (planYear === currentYear) {
				sMonth = currentMonth
				eMonth = 12
			} else {
				sMonth = 1
				eMonth = 12
			}
			for (let i = sMonth; i <= eMonth; i++) {
				const type = i + "月"
				this.planNameOptions.push({
					id: i,
					type
				})
			}
		},
		getMcsystemTypes() {
			getMcsystemTypes()
				.then((res) => {
					this.maintenancesysoptions = res.data.items
				})
				.catch(() => {})
		},
		getUserMenu() {
			const params = {
				projectId: this.selectedProjectId
			}
			getUserMenu(params)
				.then((res) => {
					this.userOptions = res.data.items
				})
				.catch((err) => {
					console.error(err)
				})
		},

		handleSelectionChange(arr) {
			this.selection = arr
		},
		handleCheckAllChange(val) {
			this.formPlan.mcSystemList = val ? this.maintenancesysoptions.map((item) => item.systemTypeId) : []
			this.isIndeterminate = false
		},

		handleCheckedChange(value) {
			const checkedCount = value.length
			this.checkAll = checkedCount === this.maintenancesysoptions.length
			this.isIndeterminate = checkedCount > 0 && checkedCount < this.maintenancesysoptions.length
		},
		onSearch() {
			this.paramsGetplan.name = this.tempFilterOptions.name
			this.paramsGetplan.page = 1
			this.getPlanList()
		},
		// 提交表单
		onSumbit() {
			this.$refs.formRef.validate((valid) => {
				if (valid) {
					if (this.isEdit) {
						const params = {
							leader: this.formPlan.leader,
							mcUsers: this.formPlan.mcUsers.join(","),
							mcSystemList: this.formPlan.mcSystemList.join(",")
						}
						editPlan(params, this.formPlan.id)
							.then(() => {
								this.isDialogplansShow = false
								this.getPlanList()
								this.$message({
									type: "success",
									message: "编辑成功"
								})
								this.init()
							})
							.catch((err) => {
								console.error(err)
							})
					} else {
						const params = {
							planYear: new Date(this.formPlan.planYear).getFullYear(),
							planMonthList: this.formPlan.planMonthList,
							leader: this.formPlan.leader,
							mcUsers: this.formPlan.mcUsers.join(","),
							mcSystemList: this.formPlan.mcSystemList.join(",")
						}
						addPlan(params)
							.then(() => {
								this.isDialogplansShow = false
								this.getPlanList()
								this.$message({
									type: "success",
									message: "新建成功"
								})
								this.init()
							})
							.catch((err) => {
								console.error(err)
							})
					}
				}
			})
		},

		editPlan({ id }) {
			getPlanInfo(id).then((res) => {
				const info = res.data
				this.isEdit = true
				this.isDialogplansShow = true
				this.formPlan.id = id
				this.formPlan.mcUsers = info.mcUserIds.split(",").map((item) => +item)
				this.formPlan.leader = info.leader
				this.formPlan.mcSystemList = info.mcSystems.map((item) => item.systemTypeId)
				this.checkAll = this.maintenancesysoptions.length === this.formPlan.mcSystemList.length
				this.isIndeterminate =
					this.maintenancesysoptions.length > this.formPlan.mcSystemList.length && this.formPlan.mcSystemList.length > 0
			})
		},
		closeDialogplan() {
			if (this.isEdit) {
				if (this.$refs.formRef !== undefined) this.$refs.formRef.resetFields()
				this.init()
			} else {
				if (this.$refs.formRef !== undefined) this.$refs.formRef.clearValidate()
			}
			this.isEdit = false
		},
		closeDialogFile() {
			this.isPlan = false
			this.isHistory = false
			this.fileList = []
		},
		init() {
			for (const key in this.formPlan) {
				if (Object.hasOwnProperty.call(this.formPlan, key)) {
					if (["mcSystemList"].includes(key)) {
						this.formPlan[key] = []
					} else if (["planMonthList", "mcUsers", "leader"].includes(key)) {
						this.formPlan[key] = []
					} else {
						this.formPlan[key] = undefined
					}
					this.planNameOptions = []
					this.isIndeterminate = false
					this.checkAll = false
				}
			}
		},
		deletePlan(param) {
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
			deletePlan(id)
				.then(() => {
					this.isloading = false
					this.getPlanList()
					this.$message({
						type: "success",
						message: "删除成功"
					})
				})
				.catch(() => {
					this.isloading = false
				})
		},

		getPlanList() {
			this.isListLoadingShow = true
			getPlanList(this.paramsGetplan)
				.then((res) => {
					this.isListLoadingShow = false
					this.total = res.data.total
					this.list = res.data.items
				})
				.catch(() => {
					this.isListLoadingShow = false
				})
		},
		formateTime(timpstamp) {
			return Formattimestamp(timpstamp)
		},
		getTime2(timpstamp) {
			return Formattimestamp2(timpstamp)
		}
	}
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__body {
	padding: 0;
}
.checkbox {
	padding: 0 5px;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	flex: 1;
}
.content {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 10px;
	.header {
		flex: 1;
		.planDetail {
			overflow: auto;
			.content {
				.image-wrapper {
					font-size: 0;
					margin-top: 12px;
					.image {
						cursor: zoom-in;
						width: 170px;
						height: 120px;
						margin-right: 5px;
						margin-bottom: 5px;
						&:last-child {
							margin-right: 0;
						}
					}
				}
				font-family: "arial";
				ul {
					list-style: none;
					padding: 0;
					.item {
						word-break: break-all;
						line-height: 16px;
						font-size: 15px;
						padding: 10px 0;
						border-bottom: 1px solid rgba(144, 147, 153, 0.3);

						&:last-of-type {
							border-bottom: none;
						}

						span {
							font-size: 14px;
							color: #909399;
						}

						.standard {
							margin-top: 10px;
							font-size: 14px;
							white-space: pre-line;
							color: #909399;
							line-height: 20px;
						}
					}
				}
			}
		}
	}

	.footer {
		display: flex;
		flex: 0 0 30px;
		justify-content: space-between;
		button {
			flex: 1;
		}
	}
}
</style>
