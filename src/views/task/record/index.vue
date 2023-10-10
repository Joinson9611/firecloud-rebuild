<template>
	<div class="app-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true" :model="searchData">
				<el-form-item label="任务时间">
					<el-date-picker
						v-model="timeList"
						size="small"
						type="datetimerange"
						align="right"
						value-format="x"
						unlink-panels
						range-separator="-"
						start-placeholder="任务开始时间"
						end-placeholder="任务结束时间"
						@change="dateRangeChange"
					/>
				</el-form-item>
				<el-form-item label="任务状态">
					<el-select
						size="small"
						@change="selectChange"
						v-model="paramGetList.historyTaskStateId"
						filterable
						clearable
						placeholder="请选择"
					>
						<el-option v-for="item in option.historyTaskState" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<!--设备类型-->
				<el-form-item label="任务类型">
					<el-select
						size="small"
						@change="selectChange"
						v-model="paramGetList.taskTypeId"
						filterable
						clearable
						placeholder="请选择"
					>
						<el-option v-for="item in option.taskType" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="任务名称">
					<el-input
						placeholder="请输入"
						size="small"
						v-model="searchData.taskName"
						@keydown.enter="handleSearch"
						clearable
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" icon="Search" @click="handleSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="never">
			<div class="toolbar-wrapper">
				<div>
					<el-popover trigger="click" :visible="exportVisible" title="导出" placement="top" :width="260">
						<el-date-picker
							size="small"
							v-model="monthTimestamp"
							type="month"
							value-format="x"
							style="width: 100px"
							placeholder="请选择月份"
						/>
						<div style="text-align: right; margin: 0">
							<el-button size="small" text @click="exportVisible = false">取消</el-button>
							<el-button size="small" type="primary" :loading="isExportLoading" @click="onExportSubmit">导出</el-button>
						</div>
						<template #reference>
							<el-button
								ref="btnExport"
								:loading="isExportLoading"
								size="small"
								icon="Download"
								circle
								@click="handleExport"
							/>
						</template>
					</el-popover>
					<el-tooltip :virtual-triggering="true" content="导出" :virtual-ref="$refs.btnExport" />

					<el-tooltip content="刷新表格">
						<el-button size="small" icon="RefreshRight" circle @click="handleRefresh" />
					</el-tooltip>
				</div>
			</div>
			<el-table
				v-loading="isHistoryTaskListLoading"
				:data="historyTaskList"
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
				<el-table-column label="任务名称" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.taskName }}</span>
					</template>
				</el-table-column>
				<el-table-column class-name="status-col" label="任务状态" width="120" align="center">
					<template v-slot="scope">
						<span :style="{ color: stateColorMap[scope.row.historyTaskStateId] }">{{
							taskState[scope.row.historyTaskStateId]
						}}</span>
					</template>
				</el-table-column>
				<el-table-column label="发布人" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.createUserName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="执行人" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.executeUserName || "/" }}</span>
					</template>
				</el-table-column>
				<el-table-column label="任务开始时间" width="180" align="center">
					<template v-slot="scope">
						<span>{{ getTime(scope.row.startTime) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="任务结束时间" width="180" align="center">
					<template v-slot="scope">
						<span>{{ getTime(scope.row.endTime) }}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="70" align="center">
					<template #default="scope">
						<el-button type="success" text bg size="small" @click="enterPageInfo(scope.row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				v-if="total > 0"
				:total="total"
				v-model:page="paramGetList.page"
				v-model:limit="paramGetList.limit"
				@pagination="getHistoryTaskList"
			/>
		</el-card>
	</div>
</template>
<script>
import { Formattimestamp } from "@/utils/time.ts"
import { getHistoryTaskList, exportHistoryTask } from "@/api/task/record/historyTasks.js"
import Pagination from "@/components/Pagination/index.vue"
import downloadfile from "js-file-download"
export default {
	data() {
		return {
			exportVisible: false,
			isloading: false,
			dialogVisible: false,
			isHistoryTaskListLoading: false,
			dialogFloorVisible: false,
			isButtonUploadLoadingShow: false,
			isExportLoading: false,
			total: 0,
			monthTimestamp: undefined,
			historyTaskList: [],
			selection: [],
			timeList: [],
			option: {
				historyTaskState: [
					{ id: 0, type: "执行中" },
					{ id: 1, type: "已执行" },
					{ id: 2, type: "已过期" },
					{ id: 3, type: "异常待审核" },
					{ id: 4, type: "异常已审核" },
					{ id: 5, type: "过期已初审" },
					{ id: 6, type: "过期已复审" }
				],
				taskType: [
					{ id: 0, type: "日常任务" },
					{ id: 1, type: "周期任务" },
					{ id: 2, type: "自定义任务" }
				]
			},
			// 蓝00D2FF 绿#36FF7D 黄#ffff00 橙 #FF8A00 红 #F56C6C
      stateColorMap: ["#00D2FF", "#36FF7D", "#F56C6C", "#F56C6C", "#ffcc00", "#36FF7D", "#00D2FF", "#36FF7D"],
			taskState: ["执行中", "已执行", "已暂停", "已过期", "异常待审核", "异常已审核", "过期初审", "过期已审"],
			paramGetList: {
				page: 1,
				limit: 10,
				taskName: "",
				historyTaskStateId: "",
				endTime: "",
				startTime: "",
				taskTypeId: ""
			},
			// 选择器选项
			searchData: {
				taskName: ""
			}
		}
	},
	components: {
		Pagination
	},

	created() {
		this.getHistoryTaskList()
	},
	methods: {
		selectChange() {
			this.getHistoryTaskList()
		},
		dateRangeChange(timeArr) {
			if (timeArr) {
				this.paramGetList.endTime = timeArr[0] / 1000
				this.paramGetList.startTime = timeArr[1] / 1000
			} else {
				this.paramGetList.endTime = ""
				this.paramGetList.startTime = ""
			}
			this.getHistoryTaskList()
		},
		enterPageInfo({ id }) {
			if (this.$route.meta.patrolTypeId === 0) {
				this.$router.push({ path: "/patrolSectasks/historyInfo", query: { id } })
			} else {
				this.$router.push({ path: "/patrolDevtasks/historyInfo", query: { id } })
			}
		},
		getTime(time) {
			return Formattimestamp(time)
		},
		onExportSubmit() {
			if (this.monthTimestamp) {
				this.isExportLoading = true
				exportHistoryTask({ selectTime: this.monthTimestamp / 1000 }, this.$route.meta.patrolTypeId)
					.then((res) => {
						this.isExportLoading = false
						this.$message({ type: "success", message: "导出成功" })
						downloadfile(res, "任务记录.xlsx")
					})
					.catch(() => {
						this.isExportLoading = false
					})
			} else {
				this.$message({ type: "warning", message: "请选择月份" })
			}
		},
		handleExport() {
			this.exportVisible = true
			this.monthTimestamp = undefined
		},

		handleSearch() {
			this.paramGetList = Object.assign(this.paramGetList, this.searchData)
			this.paramGetList.address = this.searchData.address
			if (this.paramGetList.page === 1) {
				this.getHistoryTaskList()
			}
			this.paramGetList.page = 1
		},
		handleSelectionChange(list) {
			this.selection = list
		},

		handleRefresh() {
			this.paramGetList.page = 1
			this.getHistoryTaskList()
		},
		// 获取设备列表
		getHistoryTaskList() {
			this.isHistoryTaskListLoading = true
			getHistoryTaskList(this.paramGetList, this.$route.meta.patrolTypeId)
				.then((res) => {
					this.total = res.data.total
					this.historyTaskList = res.data.items
					this.isHistoryTaskListLoading = false
				})
				.catch(() => {
					this.isHistoryTaskListLoading = false
				})
		}
	}
}
</script>

<style scoped lang="scss">
::v-deep .el-tabs__content {
	height: calc(100vh - 111px);
	background: #fff;
	overflow: auto;
}
</style>
