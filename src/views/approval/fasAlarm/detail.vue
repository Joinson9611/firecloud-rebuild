<template>
	<div class="detail-container">
		<el-form ref="formfas" :model="approvalInfo" label-position="left" :rules="fasInfoRules" label-width="110px">
			<el-form-item label="设备编号：" class="item-container">
				<span class="text">{{ approvalInfo.deviceNum }}</span>
			</el-form-item>
			<el-form-item label="设备类型：" class="item-container">
				<span class="text">{{ approvalInfo.deviceType }}</span>
			</el-form-item>
			<el-form-item label="报警时间：" class="item-container">
				<span class="text">
					{{ approvalInfo.alarmTime ? getTime(approvalInfo.alarmTime) : "/" }}
				</span>
			</el-form-item>
			<el-form-item label="报警类型：" class="item-container">
				<span class="text">{{ alarmMap[approvalInfo.alarmTypeId] }}</span>
			</el-form-item>
			<el-form-item label="核查结果：" class="item-container">
				<span :style="{ color: colorMap[approvalInfo.handleTypeId] }" class="item-text">{{
					handleState[approvalInfo.handleTypeId]
				}}</span>
			</el-form-item>
			<el-form-item label="核查时间：" class="item-container">
				<span class="text">{{ approvalInfo.handleTime ? getTime(approvalInfo.handleTime) : "/" }}</span>
			</el-form-item>
			<el-form-item label="现场核查人员：" class="item-container">
				<span class="text">{{ approvalInfo.handleUserName || "/" }}</span>
			</el-form-item>
			<el-form-item label="核查原因" class="item-container" prop="handleSuggestion">
				<span class="text">{{ approvalInfo.handleSuggestion  || "/" }}</span>
			</el-form-item>
			<el-form-item label="审核类型：">
				<span class="text">{{ approvalTypeMap[approvalInfo.approvalTypeId] }}</span>
			</el-form-item>
			<!-- <el-form-item label="审核人：">
				<span class="text">{{ approvalInfo.approvalUserName }}</span>
			</el-form-item> -->

			<el-form-item label="审核内容：">
				<el-input :disabled="!isButtonSubmitShow" v-model="paramsUpdateFasDetail.approvalContent" type="textarea" />
			</el-form-item>

			<el-form-item label="审核时间：" v-show="approvalInfo.isApproval">
				<span class="text">{{ approvalInfo.approvalTime ? getTime(approvalInfo.approvalTime) : "/" }}</span>
			</el-form-item>

			<el-form-item label="审核人签名：" v-show="approvalInfo.isApproval">
				<span class="text">{{ approvalInfo.approver || "/" }}</span>
			</el-form-item>

			<el-form-item v-if="isButtonSubmitShow">
				<el-button size="small" :loading="isBtnSubmitLoading" style="margin-top: 10px" type="primary" @click="onSubmitFas">提交</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import { Formattimestamp } from "@/utils/time"
import { getApprovalInfo, approval } from "@/api/approval/fasAlarm/index.js"

export default {
	name: "FasInfo",
  watch:{
    id:{
      handler() {
        this.getApprovalInfo()
      },
      immediate:true
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
      isBtnSubmitLoading:false,
			tableDeviceList: [],
			isMap: ["否", "是"],
			colorMap: ["#F56C6C", "#67C23A", "#E6A23C", "#67C23A", "#909399"],
			handleState: ["未核查", "火警确认", "误报", "测试"],
			approvalTypeMap: ["火警确认初审", "火警确认复审", "超时三分钟审核", "超时五分钟审核"],
			alarmMap: ["正常", "火警", "预警", "联动", "反馈", "屏蔽", "故障", "其他"],
			fasInfoRules: {
				approvalContent: [{ required: true, trigger: "blur", message: "请输入审核内容" }]
			},
			approvalInfo: {
				alarmTime: undefined,
				alarmTypeId: undefined,
				approvalContent: undefined,
				approvalTime: undefined,
				approvalTypeId: undefined,
				approvalUserName: undefined,
				approver: undefined,
				deviceName: undefined,
				deviceType: undefined,
				handleImage: undefined,
				handleSuggestion: undefined,
				handleTime: undefined,
				handleTypeId: undefined,
				handleUserName: undefined,
				historyFasId: undefined,
				isApproval: undefined,
				label: undefined
			},
			paramsUpdateFasDetail: {
				approvalContent: undefined,
				approver: undefined
			}
		}
	},
	computed: {
		isButtonSubmitShow() {
			return this.approvalInfo.isApproval === 0
		}
	},

	methods: {
		onSubmitFas() {
			this.$refs.formfas.validate((valid) => {
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
							this.paramsUpdateFasDetail.approver = value
              this.isBtnSubmitLoading = true
							approval(this.paramsUpdateFasDetail,this.id)
								.then(() => {
									this.$message.success("提交成功")
									this.getApprovalInfo()
                  this.isBtnSubmitLoading = false
                  this.approvalInfo.isApproval = 1
                  this.$emit('updateList')
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
			getApprovalInfo(this.id)
				.then((res) => {
					this.approvalInfo = res.data
					this.paramsUpdateFasDetail.approvalContent = this.approvalInfo.approvalContent
				})
				.catch((err) => {
					console.log(err)
				})
		},
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
