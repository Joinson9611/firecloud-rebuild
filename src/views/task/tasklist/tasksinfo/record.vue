<template>
	<div class="record-container">
		<!--任务列表-->
		<el-table
			v-loading="isTaskListLoadingShow"
			:data="taskList"
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
			<el-table-column label="任务名称" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.taskName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="任务状态" width="120" align="center">
				<template v-slot="scope">
					<span :style="{ color: stateColorMap[scope.row.historyTaskStateId] }">{{
						taskState[scope.row.historyTaskStateId]
					}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="任务开始时间" width="180">
				<template v-slot="scope">
					<span>{{ getTime(scope.row.startTime) }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="任务结束时间" width="180">
				<template v-slot="scope">
					<span>{{ getTime(scope.row.endTime) }}</span>
				</template>
			</el-table-column>
			<el-table-column label="执行人" width="100" align="center">
				<template v-slot="scope">
					{{ scope.row.executeUserName || "/" }}
				</template>
			</el-table-column>
			<el-table-column label="执行时间" width="180" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.executeTime ? getTime(scope.row.executeTime) : "/" }}</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="70" align="center">
				<template #default="scope">
					<el-button type="success" text bg size="small" @click="openDetailDrawer(scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--页码导航-->
		<pagination
			v-show="total > 0"
			:total="total"
			v-model:page="paramGetList.page"
			v-model:limit="paramGetList.limit"
			@pagination="getHistoryTaskList"
		/>
		<el-drawer v-model="drawer" :title="drawerInfo.title" size="50%">
			<div>
				<recordDetail :historyTaskId="drawerInfo.historyTaskId" />
			</div>
		</el-drawer>
	</div>
</template>

<script>
import { getHistoryTaskList } from "@/api/task/record/historyTasks.js"
import { Formattimestamp } from "@/utils/time"
import Pagination from "@/components/Pagination"
import recordDetail from "./subrecordDetail"
export default {
	components: { Pagination, recordDetail },

	props: {
		taskId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			drawerInfo: {
				historyTaskId: undefined,
				title: ""
			},
			drawer: false,

			stateColorMap: ["#00D2FF", "#36FF7D", "#F56C6C", "#F56C6C", "#ffcc00", "#36FF7D", "#00D2FF", "#36FF7D"],
			taskState: ["执行中", "已执行", "已暂停", "已过期", "异常待审核", "异常已审核", "过期初审", "过期已审"],
			multipleSelection: [],
			taskList: [],
			total: 0,
			isTaskListLoadingShow: true,

			paramGetList: {
				page: 1,
				limit: 10,
				taskId: ""
			}
		}
	},
	computed: {},
	created() {
		this.getHistoryTaskList()
	},
	methods: {
		getHistoryTaskList() {
			this.isTaskListLoadingShow = true
			this.paramGetList.taskId = this.$route.query.id
			getHistoryTaskList(this.paramGetList, this.$route.meta.patrolTypeId)
				.then((res) => {
					this.taskList = res.data.items
					this.total = res.data.total
					this.isTaskListLoadingShow = false
				})
				.catch(() => {
					this.isTaskListLoadingShow = false
				})
		},

		handleSelectionChange(val) {
			this.multipleSelection = val
		},
		/**
		 * @Description: 详情页抽屉
		 * @Date: 2023/8/28
		 **/
		openDetailDrawer(info) {
			this.drawerInfo.title = info.taskName
			this.drawerInfo.historyTaskId = info.id
			this.drawer = true
			console.log(this.drawerInfo)
		},

		getTime(time) {
			return Formattimestamp(time)
		}
	}
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
	padding: 0;
	overflow: auto;
}
</style>
