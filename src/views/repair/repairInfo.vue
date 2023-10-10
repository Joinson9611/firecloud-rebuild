<template>
	<div class="app-container">
		<el-card shadow="never">
			<el-form label-width="150px">
				<el-form-item label="设备类型：" class="item-container">
					<span class="item-text">{{ detailInfo.deviceType }}</span>
				</el-form-item>
				<el-form-item label="设备编号：" class="item-container">
					<span class="item-text">{{ detailInfo.deviceNum }}</span>
				</el-form-item>
				<el-form-item label="设备地址：" class="item-container">
					<span class="item-text"
						>{{ detailInfo.buildingName }}-{{ detailInfo.floorName }}-{{ detailInfo.deviceLabel }}</span
					>
				</el-form-item>
				<el-form-item label="报修状态：" class="item-container">
					<span :style="{ color: textColor }" class="item-text">{{ repairState[detailInfo.taskMbStateTypeId] }}</span>
				</el-form-item>
				<p style="border-bottom: 1px dotted rgba(144, 147, 153, 0.2); margin-top: 10px" />
				<el-form-item label="故障描述：" class="item-container">
					<span class="item-text">{{ detailInfo.reportedDescription }}</span>
				</el-form-item>
				<el-form-item
					v-if="isReportedImageShow[0] || isReportedImageShow[1] || isReportedImageShow[2]"
					label="故障图片："
					class="item-container"
				>
					<viewer
						v-if="isReportedImageShow[0] || isReportedImageShow[1] || isReportedImageShow[2]"
						:images="detailInfo.reportedImage"
					>
						<img v-if="isReportedImageShow[0]" :src="detailInfo.reportedImage[0]" class="item-image" />
						<img v-if="isReportedImageShow[1]" :src="detailInfo.reportedImage[1]" class="item-image" />
						<img v-if="isReportedImageShow[2]" :src="detailInfo.reportedImage[2]" class="item-image" />
					</viewer>
				</el-form-item>
				<p style="border-bottom: 1px dotted rgba(144, 147, 153, 0.2); margin-top: 10px" />
				<div v-if="isReported">
					<el-form-item label="是否停用系统：" class="item-container">
						<span :class="{ right: detailInfo.isStopSystem }" class="fail">{{
							isStopSystem[detailInfo.isStopSystem]
						}}</span>
					</el-form-item>
					<el-form-item label="消防部门备案：" class="item-container">
						<span :class="{ right: detailInfo.isFiling }" class="fail">{{ isFiling[detailInfo.isFiling] }}</span>
					</el-form-item>
					<el-form-item label="指定维修人员：" class="item-container">
						<span
							v-for="(user, index) in detailInfo.taskUserList"
							:key="index"
							class="user"
							style="background-color: rgba(144, 147, 153, 0.2)"
							>{{ user.userName }}</span
						>
					</el-form-item>
					<el-form-item label="指定维修时间：" class="item-container">
						<!-- <span class="item-text">{{ detailInfo.taskStartTime | formatDate }}<strong style="color:#000"> ~ </strong>{{ detailInfo.taskEndTime | formatDate }}</span> -->
					</el-form-item>
					<el-form-item label="任务描述：" class="item-container">
						<span class="item-text">{{ detailInfo.taskLabel }}</span>
					</el-form-item>
					<p style="border-bottom: 1px dotted rgba(144, 147, 153, 0.2); margin-top: 10px" />
					<div
						v-if="
							detailInfo.isMrr & [3, 4, 5].includes(detailInfo.taskMbStateTypeId) ||
							[6, 7].includes(detailInfo.taskMbStateTypeId)
						"
					>
						<el-form-item label="是否申请更换材料：" class="item-container">
							<span
								:class="{ right: detailInfo.isMrr }"
								class="fail"
								style="background-color: rgba(144, 147, 153, 0.2)"
								>{{ isOrnot[detailInfo.isMrr] }}</span
							>
						</el-form-item>
						<el-form-item label="更换描述：" class="item-container">
							<span class="item-text">{{ detailInfo.mrrDescription }}<strong style="color: #000" /></span>
						</el-form-item>
						<p style="border-bottom: 1px dotted rgba(144, 147, 153, 0.2); margin-top: 10px" />
					</div>
					<div
						v-if="
							detailInfo.isMrr & [3, 4, 5].includes(detailInfo.taskMbStateTypeId) ||
							[7].includes(detailInfo.taskMbStateTypeId)
						"
					>
						<el-form-item label="审批人员：" class="item-container">
							<span class="user" style="background-color: rgba(144, 147, 153, 0.2)">{{
								detailInfo.mrrApprovalUserName
							}}</span>
						</el-form-item>
						<el-form-item label="审批意见：" class="item-container">
							<span class="item-text">{{ detailInfo.mrrApprovalNote }}</span>
						</el-form-item>
						<el-form-item label="审批是否通过：" class="item-container">
							<span :class="{ right: detailInfo.isMrrPass }" class="fail">{{ isOrnot[detailInfo.isMrrPass] }}</span>
						</el-form-item>
						<p style="border-bottom: 1px dotted rgba(144, 147, 153, 0.2); margin-top: 10px" />
					</div>
					<div v-if="isChecked">
						<el-form-item label="故障修复情况：" class="item-container">
							<span class="item-text">{{ executeStateTypeId[detailInfo.executeStateTypeId] }}</span>
						</el-form-item>
						<el-form-item label="故障维修方法：" class="item-container">
							<span class="item-text">{{ executeMethodTypeId[detailInfo.executeMethodTypeId] }}</span>
						</el-form-item>
						<el-form-item label="安全保护措施：" class="item-container">
							<span class="item-text">{{ detailInfo.executeSafetyMeasure }}</span>
						</el-form-item>
						<el-form-item label="维修描述：" class="item-container">
							<span class="item-text">{{ detailInfo.executeNote }}</span>
						</el-form-item>
					</div>
					<div v-if="isChecked">
						<el-form-item
							v-if="isExecuteImageShow[0] || isExecuteImageShow[1] || isExecuteImageShow[2]"
							label="维修图片："
							class="item-container"
						>
							<viewer
								v-if="isExecuteImageShow[0] || isExecuteImageShow[1] || isExecuteImageShow[2]"
								:images="detailInfo.executeImage"
							>
								<img v-if="isExecuteImageShow[0]" :src="detailInfo.executeImage[0]" class="item-image" />
								<img v-if="isExecuteImageShow[1]" :src="detailInfo.executeImage[1]" class="item-image" />
								<img v-if="isExecuteImageShow[2]" :src="detailInfo.executeImage[2]" class="item-image" />
							</viewer>
						</el-form-item>
						<el-form-item v-if="isRepaired" label="故障是否排除：" class="item-container">
							<span :class="{ right: detailInfo.isFaultCleared }" class="fail">{{
								isFaultCleared[detailInfo.isFaultCleared]
							}}</span>
						</el-form-item>
						<p style="border-bottom: 1px dotted rgba(144, 147, 153, 0.2); margin-top: 10px" />
					</div>
				</div>
				<!-- <div class="time-line">
        <light-timeline :items="detailInfo.history">
          <template slot="tag" slot-scope="{ item }">
            {{ item.operationTime | formatTime }}
          </template>
          <template slot="content" slot-scope="{ item }">
            {{ item.label }}
          </template>
        </light-timeline>
      </div> -->
				<el-form-item>
					<el-button style="margin-top: 10px" @click="onToRecord">返回列表</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>
<script>
import { getRepairInfo } from "@/api/repair/taskmbs.js"
import split from "./components/split.vue"
import { Formattimestamp, Formattimestamp2 } from "@/utils/time"
export default {
	components: {
		split
	},
	data() {
		return {
			isOrnot: ["否", "是"],
			isStopSystem: ["否", "是"],
			isFiling: ["否", "是"],
			executeStateTypeId: ["维护中", "已处理", "未处理"],
			executeMethodTypeId: ["无", "维修", "更换", "移位", "增设", "消除"],
			isFaultCleared: ["否", "是"],

			repairState: [
				"待指派",
				"不予处理",
				"待维修",
				"待审核",
				"已修复",
				"未修复",
				"材料更换待审批",
				"材料更换审批通过",
				"材料更换审批未通过"
			],
			isReportedImageShow: [false, false, false],

			isExecuteImageShow: [false, false, false],
			deviceImg: "",
			detailInfo: {
				taskMbStateTypeId: 1
			},
			params: {
				taskmbId: undefined,
				projectId: undefined
			}
		}
	},
	computed: {
		isReported() {
			if ((this.detailInfo.taskMbStateTypeId > 1) & (this.detailInfo.taskMbStateTypeId < 8)) {
				return true
			}
			return false
		},
		isChecked() {
			if (
				(this.detailInfo.taskMbStateTypeId > 2) &
				(this.detailInfo.taskMbStateTypeId < 8) &
				(this.detailInfo.taskMbStateTypeId !== 6)
			) {
				return true
			}
			return false
		},
		isRepaired() {
			if (
				(this.detailInfo.taskMbStateTypeId > 3) &
				(this.detailInfo.taskMbStateTypeId < 8) &
				(this.detailInfo.taskMbStateTypeId !== 6)
			) {
				return true
			}
			return false
		},
		/**
		 * @Description: 返回颜色
		 * @Date: 2023/9/6
		 **/
		textColor() {
			switch (this.detailInfo.taskMbStateTypeId) {
				case 0:
					return "#409EFF"
				case 1:
					return "#909399"
				case 2:
					return "#409EFF"
				case 3:
					return "#E6A23C"
				case 4:
					return "#67C23A"
				case 5:
					return "#F56C6C"
				case 6:
					return "#E6A23C"
				case 7:
					return "#409EFF"
			}
		}
	},

	created() {
		this.getRecordDetail()
	},
	methods: {
		onToRecord() {
			this.$router.go(-1)
		},
		splitImgUrl(str) {
			if (str === "") return []
			const picArr = str.split(",")
			const newArr = []
			for (let i = 0; i < picArr.length; i++) {
				newArr.push(import.meta.env.VITE_IMAGE_PATH + picArr[i])
			}
			return newArr
		},
		// 获取报修记录详情数据
		getRecordDetail() {
			getRepairInfo(this.$route.query.id)
				.then((res) => {
					const data = res.data
					this.detailInfo = data
					if (data.taskUserList) {
						this.detailInfo.taskUserList = data.taskUserList.split(",")
					}
					if (this.detailInfo.reportedImage) {
						this.detailInfo.reportedImage = this.splitImgUrl(data.reportedImage)
					}
					if (this.detailInfo.executeImage) {
						this.detailInfo.executeImage = this.splitImgUrl(data.reportedImage)
					}
				})
				.catch(() => {})
		}
	}
}
</script>
<style scpoed lang="scss">
.img-wrapper {
	margin-left: 140px;
}
.item-container {
	color: #666666;
	margin-bottom: 0;
	.user {
		margin-right: 10px;
	}
	.fail,
	.right,
	.item-container {
		font-weight: 700;
	}
	.fail {
		color: #f56c6c;
	}
	.right {
		color: #67c23a;
	}
}
.item-image {
	margin-top: 16px;
	margin-right: 10px;
	width: 140px;
	height: 140px;
}
.time-line {
	padding-left: 39px;
}
.fail {
	color: #f56c6c;
	font-weight: 700;
}
.right {
	color: #67c23a;
	font-weight: 700;
}
</style>
