<template>
	<div class="app-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form :inline="true">
				<el-form-item label="月份">
					<el-date-picker
						size="small"
						v-model="paramGetList.selectTime"
						type="month"
						@change="getTaskcrList"
						value-format="x"
						placeholder="请选择月份"
					/>
				</el-form-item>
				<el-form-item label="申请状态">
					<el-select
						size="small"
						@change="getTaskcrList"
						v-model="paramGetList.taskCrStateTypeId"
						filterable
						clearable
						placeholder="请选择"
					>
						<el-option v-for="item in option.taskCrState" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="never">
			<div class="toolbar-wrapper">
				<div>
					<el-popover trigger="click" :visible="qrcodeVisible" title="申请表二维码" placement="top" :width="260">
						<GenerateQRCode :url="qrcodeUrl" />
						<div style="text-align: right; margin: 0">
							<el-button size="small" text @click="qrcodeVisible = false">取消</el-button>
							<!-- <el-button size="small" type="primary" :loading="isExportLoading" @click="onExportSubmit">确定</el-button> -->
						</div>
						<template #reference>
							<el-button size="small" type="primary" @click="showQRCode">申请表二维码</el-button>
						</template>
					</el-popover>
				</div>
				<div>
					<el-tooltip content="刷新表格">
						<el-button size="small" icon="RefreshRight" circle @click="handleRefresh" />
					</el-tooltip>
				</div>
			</div>
			<el-table
				v-loading="isLoading"
				:data="taskcrList"
				element-loading-text="Loading"
				style="width: 100%"
				fit
				highlight-current-row
				@selection-change="handleSelectionChange"
			>
				<el-table-column label="序号" align="center" width="70">
					<template v-slot="scope"
						><span>{{ scope.$index + (paramGetList.page - 1) * paramGetList.limit + 1 }} </span></template
					>
				</el-table-column>
				<el-table-column label="申请名称" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.requestName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="申请单位" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.requestUnit }}</span>
					</template>
				</el-table-column>
				<el-table-column label="申请人员" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.requestUserName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="联系方式" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.requestUserPhone }}</span>
					</template>
				</el-table-column>
				<el-table-column label="申请类型" align="center">
					<template v-slot="scope">
						<span>{{ taskcrType[scope.row.taskCrTypeId] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="申请状态" align="center">
					<template v-slot="scope">
						<span>{{ taskcrStateType[scope.row.taskCrStateTypeId] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="申请时间" width="180" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.requestTime ? getTime(scope.row.requestTime) : "/" }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="180" fixed="right">
					<template v-slot="scope">
						<el-button type="success" text bg size="small" @click="enterPageInfo(scope.row)">详情</el-button>
						<el-button class="btn" type="primary" size="small" bg text @click="onExportSubmit(scope.row)">
							下载申请表
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				v-if="total > 0"
				:total="total"
				v-model:page="paramGetList.page"
				v-model:limit="paramGetList.limit"
				@pagination="getTaskcrList"
			/>
		</el-card>
	</div>
</template>
<script>
import { useUserStoreHook } from "@/store/modules/user"
import GenerateQRCode from "@/components/generateQRCode.vue"
import { Formattimestamp } from "@/utils/time.ts"
import { getTaskcrList, generateReport } from "@/api/taskcr/index.js"
import Pagination from "@/components/Pagination/index.vue"
import downloadfile from "js-file-download"
export default {
	data() {
		return {
			qrcodeUrl: "",
			exportVisible: false,
			qrcodeVisible: false,
			formVisible: false,
			isLoading: false,
			dialogVisible: false,
			dialogFloorVisible: false,
			isButtonUploadLoadingShow: false,
			isExportLoading: false,
			total: 0,
			monthTimestamp: undefined,
			taskcrList: [],
			selection: [],
			taskcrType: ["", "动火", "动水"],
			option: {
				taskCrState: [
					{ id: 0, type: "一级审核中" },
					{ id: 1, type: "二级审核中" },
					{ id: 2, type: "三级审核中" },
					{ id: 3, type: "审核通过" },
					{ id: 4, type: "审核未通过" }
				]
			},
			taskcrStateType: ["一级审核中", "二级审核中", "三级审核中", "审核通过", "审核未通过"],
			paramGetList: {
				page: 1,
				limit: 10,
				selectTime: "",
				taskCrStateTypeId: ""
			}
		}
	},
	components: {
		Pagination,
    GenerateQRCode
	},

	created() {
    this.qrcodeUrl = import.meta.env.VITE_WEB_PATH + '/taskcr/form?pid=' + useUserStoreHook().projectId
		this.getTaskcrList()
	},
	methods: {
		showQRCode() {
      this.qrcodeVisible = true
    },

		enterPageInfo({ id }) {
			this.$router.push({ path: "/construction/detail", query: { id } })
		},
		getTime(time) {
			return Formattimestamp(time)
		},
		onExportSubmit({ id }) {
			this.isExportLoading = true
			generateReport(id)
				.then((res) => {
					this.isExportLoading = false
					this.$message({ type: "success", message: "导出成功" })
					downloadfile(res, "申请表.docx")
				})
				.catch(() => {
					this.isExportLoading = false
				})
		},

		handleSelectionChange(list) {
			this.selection = list
		},

		handleRefresh() {
			this.paramGetList.page = 1
			this.getTaskcrList()
		},
		// 获取设备列表
		getTaskcrList() {
			const param = {
				limit: this.paramGetList.limit,
				page: this.paramGetList.page,
				taskCrStateTypeId: this.paramGetList.taskCrStateTypeId,
				taskCrTypeId: this.$route.meta.taskCrTypeId
			}
			if (this.paramGetList.selectTime) {
				param.selectTime = this.paramGetList.selectTime / 1000
			}

			this.isLoading = true
			getTaskcrList(param)
				.then((res) => {
					this.total = res.data.total
					this.taskcrList = res.data.items
					this.isLoading = false
				})
				.catch(() => {
					this.isLoading = false
				})
		}
	}
}
</script>
<style scoped lang="scss">
::v-deep .el-tabs_content {
	height: calc(100vh - 111px);
	background: #fff;
	overflow: auto;
}
</style>
