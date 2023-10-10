<template>
	<div class="app-container">
		<el-card shadow="never">
			<div class="info">
				<el-form label-width="170px">
					<div class="base">
						<div class="title">基本内容</div>
						<el-form-item label="申请类型：" class="item-container">
							<span class="item-text">{{ taskcrType[detailInfo.taskCrTypeId] }}</span>
						</el-form-item>
						<el-form-item label="申请状态：" class="item-container">
							<span :style="{ color: checkColor[detailInfo.taskCrStateTypeId] }" class="item-text">{{
								taskcrStateType[detailInfo.taskCrStateTypeId]
							}}</span>
						</el-form-item>
						<el-form-item label="申请名称：" class="item-container">
							<span class="item-text">{{ detailInfo.requestName }}</span>
						</el-form-item>
						<el-form-item label="申请单位：" class="item-container">
							<span class="item-text">{{ detailInfo.requestUnit }}</span>
						</el-form-item>
						<el-form-item label="申请人员：" class="item-container">
							<span class="item-text">{{ detailInfo.requestUserName }}</span>
						</el-form-item>
						<el-form-item label="联系电话：" class="item-container">
							<span class="item-text">{{ detailInfo.requestUserPhone }}</span>
						</el-form-item>
					</div>
					<div class="request-content">
						<div class="title">申请内容</div>
						<el-form-item label="建筑名称：" prop="building">
							<span class="item-text">{{ detailInfo.requestContent.building }}</span>
						</el-form-item>
						<el-form-item label="楼层名称：" prop="floor">
							<span class="item-text">{{ detailInfo.requestContent.floor }}</span>
						</el-form-item>
						<el-form-item label="单元：" prop="room">
							<span class="item-text">{{ detailInfo.requestContent.room }}</span>
						</el-form-item>
						<el-form-item :label="`${detailInfo.taskCrTypeId === 1 ? '动火' : '放水'}区域：`">
							<span class="item-text">{{
								detailInfo.requestContent[`${detailInfo.taskCrTypeId === 1 ? "fireZone" : "waterZone"}`]
							}}</span>
						</el-form-item>
						<el-form-item
							:label="`${detailInfo.taskCrTypeId === 1 ? '动火' : '放水'}开始时间：`"
							prop="startTime"
							width="100%"
						>
							<span class="item-text">{{ getTime(detailInfo.requestContent.startTime) }}</span>
						</el-form-item>
						<el-form-item
							:label="`${detailInfo.taskCrTypeId === 1 ? '动火结束时间' : '重新注水时间'}：`"
							prop="endTime"
							width="100%"
						>
							<span class="item-text">{{ getTime(detailInfo.requestContent.endTime) }}</span>
						</el-form-item>

						<div v-if="detailInfo.taskCrTypeId === 1" class="fire">
							<el-form-item label="动火楼层：">
								<span class="item-text">{{ detailInfo.requestContent.fireFloor }}</span>
							</el-form-item>
							<el-form-item label="动火原因：" prop="reason">
								<span class="item-text">{{ detailInfo.requestContent.reason }}</span>
							</el-form-item>
							<el-form-item label="动火负责人：" prop="leader">
								<span class="item-text">{{ detailInfo.requestContent.leader }}</span>
							</el-form-item>
							<el-form-item label="动火负责联系电话：" prop="leaderPhone">
								<span class="item-text">{{ detailInfo.requestContent.leaderPhone }}</span>
							</el-form-item>
							<el-form-item label="动火作业人：" prop="operator">
								<span class="item-text">{{ detailInfo.requestContent.operator }}</span>
							</el-form-item>
							<el-form-item label="动火作业人联系电话：" prop="operatorPhone">
								<span class="item-text">{{ detailInfo.requestContent.operatorPhone }}</span>
							</el-form-item>
							<el-form-item label="动火作业人身份证：" prop="operatorIdNum">
								<span class="item-text">{{ detailInfo.requestContent.operatorIdNum }}</span>
							</el-form-item>
							<el-form-item label="动火作业人操作证号：" prop="operatorId">
								<span class="item-text">{{ detailInfo.requestContent.operatorId }}</span>
							</el-form-item>
							<el-form-item label="动火方式及设备：" prop="mode">
								<span class="item-text">{{ detailInfo.requestContent.mode }}</span>
							</el-form-item>
							<el-form-item label="是否申请临时油漆作业：" prop="isPaintingRequest">
								<span class="item-text">{{ requestMap[detailInfo.requestContent.isPaintingRequest] }}</span>
							</el-form-item>
							<el-form-item label="动火安全措施：" prop="safetyMeasure">
								<span class="item-text">{{ detailInfo.requestContent.safetyMeasure }}</span>
							</el-form-item>
							<el-form-item label="装修单位负责人：" prop="leaderSignature">
								<span class="item-text">{{ detailInfo.requestContent.leaderSignature }}</span>
							</el-form-item>
						</div>
						<div v-else class="water">
							<el-form-item label="系统无水累计时间：" prop="cumulativeHour">
								<span class="item-text">{{ detailInfo.requestContent.cumulativeHour }}</span>
							</el-form-item>
							<el-form-item label="申请消防分区：" prop="fireCompartment">
								<span class="item-text">{{ detailInfo.requestContent.fireCompartment }}</span>
							</el-form-item>
							<el-form-item label="施工类型：" prop="constructionType">
								<span class="item-text">{{ rTypeMap[detailInfo.requestContent.constructionType] }}</span>
							</el-form-item>
							<el-form-item label="现场防火器材配备情况：" prop="fireFacilities">
								<span class="item-text">{{ detailInfo.requestContent.fireFacilities }}</span>
							</el-form-item>
							<el-form-item label="现场直播防火员：" prop="fireGuard">
								<span class="item-text">{{ detailInfo.requestContent.fireGuard }}</span>
							</el-form-item>
						</div>
					</div>
					<div v-if="firstInstance" class="first">
						<div class="title">一级审核</div>
						<el-form-item label="一级审核人：">
							<span class="item-text">{{ detailInfo.approval1UserName }}</span>
						</el-form-item>
						<el-form-item label="一级审核时间：">
							<span class="item-text">{{ detailInfo.approval1Time ? getTime(detailInfo.approval1Time) : "/" }}</span>
						</el-form-item>
						<el-form-item label="一级审核意见：">
							<span class="item-text">{{ detailInfo.approval1Note || "/" }}</span>
						</el-form-item>
					</div>
					<div v-if="secondInstance" class="second">
						<div class="title">二级审核</div>
						<el-form-item label="二级审核人：">
							<span class="item-text">{{ detailInfo.approval2UserName }}</span>
						</el-form-item>
						<el-form-item label="二级审核时间：">
							<span class="item-text">{{ detailInfo.approval2Time ? getTime(detailInfo.approval2Time) : "/" }}</span>
						</el-form-item>
						<el-form-item label="二级审核意见：">
							<span class="item-text">{{ detailInfo.approval2Note || "/" }}</span>
						</el-form-item>
					</div>
					<div v-if="thirdInstance" class="third">
						<div class="title">三级审核</div>
						<el-form-item label="三级审核人：">
							<span class="item-text">{{ detailInfo.approval3UserName }}</span>
						</el-form-item>
						<el-form-item label="三级审核时间：">
							<span class="item-text">{{ detailInfo.approval3Time ? getTime(detailInfo.approval3Time) : "/" }}</span>
						</el-form-item>
						<el-form-item label="三级审核意见：">
							<span class="item-text">{{ detailInfo.approval3Note || "/" }}</span>
						</el-form-item>
					</div>
					<div class="title">申请进度</div>
					<!-- <div class="time-line">
					<light-timeline :items="detailInfo.history">
						<template slot="tag" slot-scope="{ item }">
							{{ getTime(item.operationTime) }}
						</template>
						<template slot="content" slot-scope="{ item }">
							{{ item.label }}
						</template>
					</light-timeline>
				</div> -->
					<el-form-item>
						<el-button v-waves style="margin-top: 10px" @click="onToRecord">返回列表</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>
import Pagination from "@/components/Pagination"
import { Formattimestamp } from "@/utils/time"
import { getTaskcrInfo } from "@/api/taskcr/index.js"

export default {
	name: "Taskcrs",
	components: { Pagination },
	data() {
		return {
			detailInfo: {
				taskCrTypeId: undefined,
				taskCrStateTypeId: undefined,
				requestContent: {
					// 动火动水的共用参数
					building: "",
					floor: "", // 楼层名称		string
					room: "", // 单元			string
					startTime: "", // 开始放水时间		int
					endTime: "", // 重新注水时间		int
					leaderSignature: "", // 装修单位负责人
					leader: "", // 动火负责人		string
					// 申请内容为动火的参数
					fireFloor: "", // 动火楼层		string
					reason: "", // 动火原因		string		//增加动火原因
					leaderPhone: "", // 动火负责人联系方式	string
					operator: "", // 动火作业人		string
					operatorPhone: "", // 动火作业人联系方式	string
					operatorIdNum: "", // 动火作业人 身份证号	string
					operatorId: "", // 动火作业人 操作证号	string
					mode: "", // 动火方式及设备		string
					isPaintingRequest: "", // 是否申请临时油漆作业	int  1=申请、0=未申请
					safetyMeasure: "", // 动火作业安全措施
					fireZone: "",
					// 申请内容为动水时的参数
					cumulativeHour: 0, // 系统无水累计时间 		int
					fireCompartment: "", // 申请消防分区		string
					constructionType: "", // 施工情况		int	0=新增、1=延期、2=换区
					fireFacilities: "", // 现场防火器材配备情况	string
					fireGuard: "", // 现场直播防火员		string
					waterZone: ""
				}
			},
			multipleSelection: [],
			taskcrList: [],
			checkColor: ["#F56C6C", "#409EFF", "#409EFF", "#409EFF", "#67C23A", "#E6A23C"],
			requestMap: ["未申请", "已申请"],
			rTypeMap: ["新增", "延期", "换区"],
			taskcrType: ["", "动火", "动水"],
			taskcrStateType: ["审核不通过", "一级审核中", "二级审核中", "三级审核中", "审核通过", "消控中心已确认收到通知"]
		}
	},

	computed: {
		firstInstance() {
			const info = this.detailInfo
			return (
				[2, 3, 4, 5].includes(info.taskCrStateTypeId) || (info.taskCrStateTypeId === 0 && info.approval1UserName !== "")
			)
		},
		secondInstance() {
			const info = this.detailInfo
			return (
				[3, 4, 5].includes(info.taskCrStateTypeId) || (info.taskCrStateTypeId === 0 && info.approval2UserName !== "")
			)
		},
		thirdInstance() {
			const info = this.detailInfo
			return [4, 5].includes(info.taskCrStateTypeId) || (info.taskCrStateTypeId === 0 && info.approval3UserName !== "")
		},
		inform() {
			const info = this.detailInfo
			return [5].includes(info.taskCrStateTypeId)
		}
	},

	created() {
		this.getParams()
		this.getDetail()
	},

	methods: {
		getParams() {
			// this.detailInfo.taskCrStateTypeId = this.$route.query.taskCrStateTypeId
			this.detailInfo.taskCrTypeId = this.$route.meta.taskCrTypeId
		},
		getTime(timeStamp) {
			return Formattimestamp(timeStamp)
		},
		onToRecord() {
			this.$router.go(-1)
		},
		getDetail() {
			getTaskcrInfo(this.$route.query.id)
				.then((res) => {
					const data = res.data
					data.requestContent = JSON.parse(data.requestContent)
					this.detailInfo = data
				})
				.catch(() => {})
		}
	}
}
</script>

<style lang="scss" scoped>
.app-container {
	:deep(.el-card__body) {
		padding: 0;
	}
}
.info {
	word-break: break-all;
	flex: 1;
	overflow: auto;
	padding-bottom: 10px;
	:deep(.el-form-item) {
		margin-bottom: 0;
	}

	.title {
		width: 100%;
		height: 50px;
		font-size: 17px;
		line-height: 50px;
		color: #666c75;
		padding-left: 25px;
		font-weight: 500;
		border-top: 1px solid #dcdfe6;
		border-bottom: 1px solid #dcdfe6;
	}
}
</style>
