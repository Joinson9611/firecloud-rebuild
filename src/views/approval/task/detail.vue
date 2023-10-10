<template>
	<div class="detail-container">
		<el-form
			ref="formRef"
			label-position="left"
			:model="paramsUpdateFasDetail"
			:rules="fasInfoRules"
			label-width="110px"
		>
			<el-form-item label="任务名称">
				<span class="text">{{ info.taskInfo.taskName }}</span>
			</el-form-item>
			<el-form-item label="任务描述">
				<span class="text">{{ info.taskInfo.description || "/" }}</span>
			</el-form-item>
			<el-form-item label="任务状态">
				<span :style="{ color: stateColorMap[info.taskInfo.historyTaskStateId] }">{{
					taskState[info.taskInfo.historyTaskStateId]
				}}</span>
			</el-form-item>
			<el-form-item label="任务开始时间">
				<span class="text">{{ getTime(info.taskInfo.startTime) }}</span>
			</el-form-item>
			<el-form-item label="任务结束时间">
				<span class="text">{{ getTime(info.taskInfo.endTime) }} </span>
			</el-form-item>
			<el-form-item label="执行人员">
				<span class="text" v-for="(person, index) in executorListOptions" :key="index">{{ person }} </span>
			</el-form-item>
			<el-form-item label="提交人">
				<span class="text">
					{{ info.taskInfo.executeUserName || "/" }}
				</span>
			</el-form-item>
			<el-form-item label="执行时间">
				<span class="text">
					{{ info.taskInfo.executeTime }}
				</span>
			</el-form-item>
			<el-form-item label="总执行时间">
				<span class="text">
					{{ info.taskInfo.consumeTime }}
				</span>
			</el-form-item>
			<el-form-item label="巡查结果" style="margin-bottom: 10px">
				<el-table :data="info.taskInfo.patrolList" row-key="patrolId" fit highlight-current-row style="width: 100%">
					<el-table-column label="巡更点编号" align="center">
						<template v-slot="scope">
							{{ scope.row.patrolNum }}
						</template>
					</el-table-column>
					<el-table-column label="巡更点名称" align="center">
						<template v-slot="scope">
							{{ scope.row.patrolName }}
						</template>
					</el-table-column>
					<el-table-column label="地址" align="center">
						<template v-slot="scope">
							<span>{{ scope.row.patrolAddress }}</span>
						</template>
					</el-table-column>
					<el-table-column label="巡查备注" align="center">
						<template v-slot="scope">
							{{ scope.row.checkedNote || "/" }}
						</template>
					</el-table-column>
					<el-table-column label="巡查时间" align="center" width="180">
						<template v-slot="scope">
							{{ getTime(scope.row.checkedTime) }}
						</template>
					</el-table-column>
					<el-table-column label="巡查人" align="center">
						<template v-slot="scope">
							{{ scope.row.checkedUserName || "/" }}
						</template>
					</el-table-column>
					<el-table-column label="巡查结果" fixed="right" align="center" width="80">
						<template v-slot="scope">
							<span :style="{ color: checkColor[scope.row.deviceChecked] }">{{
								devChecked[scope.row.deviceChecked]
							}}</span>
						</template>
					</el-table-column>
					<el-table-column label="设备修复情况" fixed="right" align="center" width="120">
						<template v-slot="scope">
							<span v-if="scope.row.deviceChecked === 1" :style="{ color: repairColor[scope.row.deviceRepaired] }">{{
								devRepair[scope.row.deviceRepaired]
							}}</span>
							<span v-else>/</span>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item label="审核类型">
				<span class="text">{{ approvalTypeMap[info.approvalInfo.approvalTypeId] }}</span>
			</el-form-item>
			<!-- <el-form-item label="审核人">
				<span class="text">{{ info.approvalInfo.approvalUserName }}</span>
			</el-form-item> -->
			<el-form-item label="审核内容">
				<el-input :disabled="!isButtonSubmitShow" v-model="paramsUpdateFasDetail.approvalContent" type="textarea" />
			</el-form-item>
			<el-form-item label="审核时间" v-show="info.approvalInfo.isApproval">
				<span class="text">{{ info.approvalInfo.approvalTime ? getTime(info.approvalInfo.approvalTime) : "/" }}</span>
			</el-form-item>
			<el-form-item label="审核人签名" v-show="info.approvalInfo.isApproval">
				<span class="text">{{ info.approvalInfo.approver || "/" }}</span>
			</el-form-item>
			<el-form-item v-if="isButtonSubmitShow">
				<el-button
					style="margin-top: 10px"
					:loading="isBtnSubmitLoading"
					size="small"
					type="primary"
					@click="onSubmitFas"
					>提交</el-button
				>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import { Formattimestamp } from "@/utils/time"
import { getApprovalInfo, approval } from "@/api/approval/task/index.js"

export default {
	name: "FasInfo",
	watch: {
		id: {
			handler() {
				this.getApprovalInfo()
			},
			immediate: true
		}
	},
	props: {
		id: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			isMap: ["否", "是"],
			approvalTypeMap: ["异常审核", "过期初审", "过期复审"],
			fasInfoRules: {
				approvalContent: [{ required: true, trigger: "blur", message: "请输入审核内容" }]
			},

			devChecked: ["未检", "已检", "跳过"],
			checkColor: ["#F56C6C", "#67C23A", "#E6A23C"],
			devRepair: ["正常", "已整改", "未整改"],
			repairColor: ["#67C23A", "#67C23A", "#F56C6C"],
			stateColorMap: ["#00D2FF", "#36FF7D", "#F56C6C", "#F56C6C", "#ffcc00", "#36FF7D", "#00D2FF", "#36FF7D"],
			taskState: ["执行中", "已执行", "已暂停", "已过期", "异常待审核", "异常已审核", "过期初审", "过期已审"],
			executorListOptions: [],
			info: {
				approvalInfo: {
					approvalContent: "",
					approvalTime: 0,
					approvalTypeId: 0,
					approvalUserName: "",
					approver: "",
					isApproval: 0
				},
				taskInfo: {
					abnormalApprovalUserList: "",
					consumeTime: "",
					createUserName: "",
					endTime: 0,
					executeTime: "",
					executeUserList: "",
					executeUserName: "",
					expiredApprovalUserList: "",
					expiredReApprovalUserList: "",
					historyTaskStateId: 0,
					id: 0,
					isInOrder: 0,
					patrolList: [
						{
							checkedNote: "",
							checkedTime: 0,
							checkedUserName: "",
							deviceChecked: 0,
							deviceRepaired: 0,
							patrolAddress: "",
							patrolName: "",
							patrolNum: ""
						}
					],
					startTime: 0,
					taskDescription: "",
					taskName: "",
					taskTypeId: 0
				}
			},
			paramsUpdateFasDetail: {
				approvalContent: undefined,
				approver: undefined
			},
			isBtnSubmitLoading: false
		}
	},
	computed: {
		isButtonSubmitShow() {
			return this.info.approvalInfo.isApproval === 0
		}
	},
	methods: {
		onSubmitFas() {
			this.$refs.formRef.validate((valid) => {
				if (valid) {
					this.$prompt("请签名", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						inputValidator(val) {
							if (!val) {
								return false
							}
						},
						inputErrorMessage: "请填写审核人"
					})
						.then(({ value }) => {
							this.isBtnSubmitLoading = true
							this.paramsUpdateFasDetail.approver = value
							approval(this.paramsUpdateFasDetail, this.id, this.$route.meta.taskApprovalTypeId)
								.then(() => {
									this.$message.success("提交成功")
									this.getApprovalInfo()
									this.$emit("updateList")
									this.isBtnSubmitLoading = false
								})
								.catch(() => {
									this.isBtnSubmitLoading = false
								})
						})
						.catch(() => {})
				}
			})
		},
		getTime(time) {
			return Formattimestamp(time)
		},

		getApprovalInfo() {
			getApprovalInfo(this.id, this.$route.meta.taskApprovalTypeId)
				.then((res) => {
					this.info = res.data
					this.paramsUpdateFasDetail.approvalContent = this.info.approvalInfo.approvalContent
					// 清空人员列表中的信息，并重新填充数据
					if (this.info.taskInfo.executeUserList) {
						this.executorListOptions = this.info.taskInfo.executeUserList.split(",")
					} else {
						this.executorListOptions = []
					}
				})
				.catch((err) => {
					console.log(err)
				})
		}
	}
}
</script>
<style lang="scss" scoped>
.detail-container {
	.text {
		color: #99a9bf;
	}
	:deep(.el-form-item) {
		margin: 0;
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
