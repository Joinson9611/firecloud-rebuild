<template>
	<div class="detail-container">
		<el-form ref="formTasksInfo" :model="historyInfo" label-width="110px">
			<el-form-item label="任务名称">
				<span class="text">{{ historyInfo.taskName }}</span>
			</el-form-item>
			<el-form-item label="任务描述">
				<span class="text">{{ historyInfo.description || "/" }}</span>
			</el-form-item>
			<el-form-item label="任务状态">
				<span :style="{ color: stateColorMap[historyInfo.historyTaskStateId] }">{{
					taskState[historyInfo.historyTaskStateId]
				}}</span>
			</el-form-item>
			<el-form-item label="任务时段">
				<span class="text"> {{ getTime(historyInfo.startTime) }} — {{ getTime(historyInfo.endTime) }} </span>
			</el-form-item>
			<el-form-item label="执行人员">
				<span class="text" v-for="(person, index) in executorListOptions" :key="index">{{ person }} </span>
			</el-form-item>
			<el-form-item label="任务过期初审人">
				<span class="text" v-for="(person, index) in expiredApprovalUserList" :key="index">{{ person }} </span>
			</el-form-item>
			<el-form-item label="任务过期初审人">
				<span class="text" v-for="(person, index) in expiredReApprovalUserList" :key="index">{{ person }} </span>
			</el-form-item>
      <el-form-item label="任务异常审核人">
				<span class="text" v-for="(person, index) in abnormalApprovalUserList" :key="index">{{ person }} </span>
			</el-form-item>
			<el-form-item label="任务发布人">
				<span class="text">
					{{ historyInfo.createUserName || "/" }}
				</span>
			</el-form-item>
			<el-form-item label="提交人">
				<span class="text">
					{{ historyInfo.executeUserName || "/" }}
				</span>
			</el-form-item>
			<!-- <el-form-item v-if="historyInfo.delayUserName" label="延迟人">
				<span class="text">
					{{ historyInfo.delayUserName || "/" }}
				</span>
			</el-form-item>
			<el-form-item v-if="historyInfo.delayUserName" label="延迟原因">
				<span class="text">
					{{ historyInfo.delayNote || "/" }}
				</span>
			</el-form-item> -->
			<el-form-item label="执行时间">
				<span class="text">
					{{ historyInfo.executeTime }}
				</span>
			</el-form-item>
			<el-form-item label="总执行时间">
				<span class="text">
					{{ historyInfo.consumeTime }}
				</span>
			</el-form-item>
			<el-form-item label="巡更点列表" style="margin-bottom: 10px">
				<el-table :data="tablePatrolList" row-key="patrolId" fit highlight-current-row style="width: 100%">
					<el-table-column align="center" label="序号" width="80">
						<template v-slot="scope">
							{{ scope.$index + 1 }}
						</template>
					</el-table-column>
					<el-table-column label="巡更点编号" align="center" width="180">
						<template v-slot="scope">
							{{ scope.row.patrolNum }}
						</template>
					</el-table-column>
					<el-table-column label="巡更点名称" align="center" width="160">
						<template v-slot="scope">
							{{ scope.row.patrolName }}
						</template>
					</el-table-column>
					<el-table-column label="巡更点描述" align="center" width="180">
						<template v-slot="scope">
							{{ scope.row.patrolDescription }}
						</template>
					</el-table-column>
					<el-table-column label="地址" align="center">
						<template v-slot="scope">
							<span>{{ scope.row.patrolAddress }}</span>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import { getHistoryTaskInfo } from "@/api/task/record/historytasks.js"
import { Formattimestamp, FormatDateTime } from "@/utils/time"

export default {
	name: "TasksInfo",

	data() {
		return {
			missionlabel: "",
			isEditDisable: true,
			tablePatrolList: [],
			executorListOptions: [],
			expiredApprovalUserList: [],
			expiredReApprovalUserList: [],
      abnormalApprovalUserList:[],
			stateColorMap: ["#00D2FF", "#36FF7D", "#F56C6C", "#F56C6C", "#ffcc00", "#36FF7D", "#00D2FF", "#36FF7D"],
			taskState: ["执行中", "已执行", "已暂停", "已过期", "异常待审核", "异常已审核", "过期初审", "过期已审"],
			historyInfo: {
				taskName: undefined,
				taskLabel: undefined,
				historyTaskStateId: undefined,
				taskTypeId: undefined,
				startTime: undefined,
				endTime: undefined,
				executeUserList: [],
				deviceList: [],
				delayNote: undefined,
				delayUserName: undefined
			}
		}
	},

	created() {
		this.getHistoryTaskInfo()
	},
	methods: {
		getTime(time) {
			return FormatDateTime(time)
		},

		/**
		 * @Description: 获取指定任务基本信息
		 * @Date: 2023/8/30
		 **/
		getHistoryTaskInfo() {
			getHistoryTaskInfo(this.$route.query.id, this.$route.meta.patrolTypeId)
				.then((res) => {
					this.historyInfo.executeUserName = res.data.executeUserName
					this.historyInfo.executeTime = res.data.executeTime
					this.historyInfo.consumeTime = res.data.consumeTime
					this.historyInfo.taskName = res.data.taskName
					this.historyInfo.description = res.data.description
					this.historyInfo.historyTaskStateId = res.data.historyTaskStateId
					this.historyInfo.taskTypeId = res.data.taskTypeId
					this.expiredApprovalUserList = res.data.expiredApprovalUserList.split(",")
					this.expiredReApprovalUserList = res.data.expiredReApprovalUserList.split(",")
					this.abnormalApprovalUserList = res.data.expiredReApprovalUserList.split(",")
          this.historyInfo.startTime = new Date(Formattimestamp(res.data.startTime))
					this.historyInfo.endTime = new Date(Formattimestamp(res.data.endTime))
					// 清空人员列表中的信息，并重新填充数据
					if (res.data.executeUserList) {
						this.executorListOptions = res.data.executeUserList.split(",")
					} else {
						this.executorListOptions = []
					}
					this.tablePatrolList = res.data.patrolList
				})
				.catch(() => {})
		}
	}
}
</script>

<style lang="scss" scoped>
.detail-container {
	.text {
		color: #99a9bf;
	}
	.box {
		color: #909399;
		.inner {
			display: inline-block;
			color: #909399;
		}
	}
}
</style>
