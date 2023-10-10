<template>
	<div class="addTaskcr">
		<div class="main-title">施工申请表</div>
		<div class="info">
			<el-form ref="addTaskcr" :model="paramsAddtaskcrs" :rules="taskcrsTules">
				<div class="base-info">
					<div class="title">基本信息</div>
					<el-row style="padding: 0 10px">
						<el-col :span="24">
							<el-form-item :size="size" label="申请类型：" class="dialog-form-item" prop="taskCrTypeId">
								<el-radio-group v-model="paramsAddtaskcrs.taskCrTypeId" @change="typeChange">
									<el-radio :label="1">动火</el-radio>
									<el-radio :label="2">动水</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item :size="size" label="申请名称：" prop="requestName">
								<el-input v-model="paramsAddtaskcrs.requestName" type="text" />
							</el-form-item>
							<el-form-item :size="size" label="申请单位：" prop="requestUnit">
								<el-input v-model="paramsAddtaskcrs.requestUnit" type="text" />
							</el-form-item>
							<el-form-item :size="size" label="申请人员：" prop="requestUserName">
								<el-input v-model="paramsAddtaskcrs.requestUserName" type="text" />
							</el-form-item>
							<el-form-item :size="size" label="联系电话：" prop="requestUserPhone">
								<el-input v-model="paramsAddtaskcrs.requestUserPhone" type="text" />
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<transition name="fade" mode="out-in">
					<div v-if="paramsAddtaskcrs.taskCrTypeId" class="request-content">
						<div class="title">申请内容</div>
						<el-row style="padding: 0 10px">
							<el-col :span="24">
								<el-form-item :size="size" label="建筑名称：" prop="building">
									<el-input v-model="paramsAddtaskcrs.building" type="text" />
								</el-form-item>
								<el-form-item :size="size" label="楼层名称：" prop="floor">
									<el-input v-model="paramsAddtaskcrs.floor" type="text" />
								</el-form-item>
								<el-form-item :size="size" label="单元：" prop="room">
									<el-input v-model="paramsAddtaskcrs.room" type="text" />
								</el-form-item>
								<el-form-item
									:size="size"
									:label="`${paramsAddtaskcrs.taskCrTypeId === 1 ? '动火' : '放水'}开始时间：`"
									prop="startTime"
									width="100%"
								>
									<el-date-picker
										v-model="paramsAddtaskcrs.startTime"
										:placeholder="`请选择${paramsAddtaskcrs.taskCrTypeId === 1 ? '动火' : '放水'}开始时间`"
										value-format="x"
										type="datetime"
									/>
								</el-form-item>
								<el-form-item
									:size="size"
									:label="`${paramsAddtaskcrs.taskCrTypeId === 1 ? '动火结束时间' : '重新注水时间'}：`"
									prop="endTime"
									width="100%"
								>
									<el-date-picker
										v-model="paramsAddtaskcrs.endTime"
										:placeholder="`请选择${paramsAddtaskcrs.taskCrTypeId === 1 ? '动火结束时间' : '重新注水时间'}`"
										type="datetime"
										value-format="x"
									/>
								</el-form-item>

								<div v-if="paramsAddtaskcrs.taskCrTypeId === 1" class="fire">
									<el-form-item :size="size" label="动火楼层：" prop="fireFloor">
										<el-input v-model="paramsAddtaskcrs.fireFloor" type="text" />
									</el-form-item>
									<el-form-item :size="size" label="动火原因：" prop="reason">
										<el-input v-model="paramsAddtaskcrs.reason" type="textarea" />
									</el-form-item>
									<el-form-item :size="size" label="动火区域：" prop="fireZone">
										<el-input v-model="paramsAddtaskcrs.fireZone" />
									</el-form-item>
									<el-form-item :size="size" label="动火负责人：" prop="leader">
										<el-input v-model="paramsAddtaskcrs.leader" type="text" />
									</el-form-item>
									<el-form-item :size="size" label="动火负责联系电话：" prop="leaderPhone">
										<el-input
											v-model="paramsAddtaskcrs.leaderPhone"
											oninput="value=value.replace(/[^\d.]/g,'')"
											type="text"
										/>
									</el-form-item>
									<el-form-item :size="size" label="动火作业人：" prop="operator">
										<el-input v-model="paramsAddtaskcrs.operator" type="text" />
									</el-form-item>
									<el-form-item :size="size" label="动火作业人联系电话：" prop="operatorPhone">
										<el-input
											v-model="paramsAddtaskcrs.operatorPhone"
											oninput="value=value.replace(/[^\d.]/g,'')"
											type="text"
										/>
									</el-form-item>
									<el-form-item :size="size" label="动火作业人身份证：" prop="operatorIdNum">
										<el-input v-model="paramsAddtaskcrs.operatorIdNum" type="text" />
									</el-form-item>
									<el-form-item :size="size" label="动火作业人操作证号：" prop="operatorId">
										<el-input v-model="paramsAddtaskcrs.operatorId" type="text" />
									</el-form-item>
									<el-form-item :size="size" label="动火方式及设备：" prop="mode">
										<el-input v-model="paramsAddtaskcrs.mode" type="text" />
									</el-form-item>
									<el-form-item :size="size" label="是否已申请临时油漆作业：" prop="isPaintingRequest">
										<el-radio-group v-model="paramsAddtaskcrs.isPaintingRequest">
											<el-radio :label="1">已申请</el-radio>
											<el-radio :label="0">未申请</el-radio>
										</el-radio-group>
									</el-form-item>
									<el-form-item :size="size" label="动火安全措施：" prop="safetyMeasure">
										<el-input v-model="paramsAddtaskcrs.safetyMeasure" type="areatext" />
									</el-form-item>
									<el-form-item :size="size" label="装修单位负责人：" prop="leaderSignature">
										<el-input v-model="paramsAddtaskcrs.leaderSignature" type="text" />
									</el-form-item>
								</div>
								<div v-if="paramsAddtaskcrs.taskCrTypeId === 2" class="water">
									<el-form-item :size="size" label="动水区域：" prop="waterZone">
										<el-input v-model="paramsAddtaskcrs.waterZone" />
									</el-form-item>
									<el-form-item :size="size" label="系统无水累计时间（小时）：" prop="cumulativeHour">
										<el-input-number v-model="paramsAddtaskcrs.cumulativeHour" />
									</el-form-item>
									<el-form-item :size="size" label="申请消防分区：" prop="fireCompartment">
										<el-input v-model="paramsAddtaskcrs.fireCompartment" type="text" />
									</el-form-item>
									<el-form-item :size="size" label="施工类型：" prop="constructionType">
										<el-radio-group v-model="paramsAddtaskcrs.constructionType">
											<el-radio :label="0">新增</el-radio>
											<el-radio :label="1">延期</el-radio>
											<el-radio :label="2">换区</el-radio>
										</el-radio-group>
									</el-form-item>
									<el-form-item :size="size" label="现场防火器材配备情况：" prop="fireFacilities">
										<el-input v-model="paramsAddtaskcrs.fireFacilities" type="textarea" />
									</el-form-item>
									<el-form-item :size="size" label="现场值班防火员：" prop="fireGuard">
										<el-input v-model="paramsAddtaskcrs.fireGuard" type="text" />
									</el-form-item>
									<el-form-item :size="size" label="租户/装修责人" prop="leader">
										<el-input v-model="paramsAddtaskcrs.leader" type="text" />
									</el-form-item>
								</div>
							</el-col>
						</el-row>
					</div>
				</transition>
			</el-form>
			<div class="submit">
				<el-button :loading="isLoading" type="primary" size="mini" @click="onSubmitTaskcrs">提交施工申请表</el-button>
				<el-button size="mini" @click="init">重置</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import { addTaskcr } from "@/api/taskcr/index.js"
export default {
	data() {
		return {
			isLoading: false,
			size: "small",
			paramsAddtaskcrs: {
				taskCrTypeId: undefined, // 申请类型:1=动火、2=动水
				requestName: undefined, // 申请名称
				requestContent: undefined, // 申请内容,json字符串
				requestUnit: undefined, // 申请单位
				requestUserName: undefined, // 申请人员
				requestUserPhone: undefined,

				// 动火动水的共用参数
				building: "",
				floor: "", // 楼层名称		string
				room: "", // 单元			string
				oZone: "", // 放水区域		string
				startTime: "", // 开始放水时间		int
				endTime: "", // 重新注水时间		int
				leader: "",
				// 申请内容为动火的参数
				fireFloor: "", // 动火楼层		string
				reason: "", // 动火原因		string		//增加动火原因
				leaderPhone: "", // 动火负责人联系方式	string
				operator: "", // 动火作业人		string
				operatorPhone: "", // 动火作业人联系方式	string
				operatorIdNum: "", // 动火作业人 身份证号	string
				operatorId: "", // 动火作业人 操作证号	string
				mode: "", // 动火方式及设备		string
				isPaintingRequest: "", // 是否已申请临时油漆作业	int  1=申请、0=未申请
				safetyMeasure: "", // 动火作业安全措施
				leaderSignature: "", // 装修单位负责人
				fireZone: "",
				// 申请内容为动水时的参数
				cumulativeHour: 0, // 系统无水累计时间 		int
				fireCompartment: "", // 申请消防分区		string
				constructionType: "", // 施工情况		int	0=新增、1=延期、2=换区
				fireFacilities: "", // 现场防火器材配备情况	string
				fireGuard: "", // 现场直播防火员		string
				waterZone: ""
			}
		}
	},
	computed: {
		taskcrsTules() {
			return {
				taskCrTypeId: [{ required: true, trigger: "change", message: "请选择申请类型" }],
				requestName: [{ required: true, trigger: "blur", message: "请输入申请名称" }],
				requestUnit: [{ required: true, trigger: "blur", message: "请输入申请单位" }],
				requestUserName: [{ required: true, trigger: "blur", message: "请输入申请人员" }],
				requestUserPhone: [{ required: true, trigger: "blur", message: "请输入申请人员联系方式" }],
				// 共用参数
				building: [{ required: true, trigger: "blur", message: "请输入建筑名称" }],
				floor: [{ required: true, trigger: "blur", message: "请输入楼层名称" }],
				room: [{ required: true, trigger: "blur", message: "请输入单元" }],
				oZone: [
					{
						required: true,
						trigger: "blur",
						message: `${this.paramsAddtaskcrs.taskCrTypeId === 1 ? "动火" : "放水"}区域：`
					}
				],
				startTime: [
					{
						required: true,
						trigger: "change",
						message: `请选择 ${this.paramsAddtaskcrs.taskCrTypeId === 1 ? "动火" : "放水"}开始时间：`
					}
				],
				endTime: [
					{
						required: true,
						trigger: "change",
						message: `请选择${this.paramsAddtaskcrs.taskCrTypeId === 1 ? "动火结束时间" : "重新注水时间"}`
					}
				],
				leaderSignature: [{ required: true, trigger: "blur", message: "请输入装修单位负责人" }],
				// 动火
				fireZone: [{ required: true, trigger: "blur", message: "请输入动火区域" }],
				fireFloor: [{ required: true, trigger: "blur", message: "请输入动火楼层" }],
				reason: [{ required: true, trigger: "blur", message: "请输入动火原因" }],
				leader: [{ required: true, trigger: "blur", message: "请输入负责人" }],
				leaderPhone: [{ required: true, trigger: "blur", message: "请输入动火负责人联系方式" }],
				operator: [{ required: true, trigger: "blur", message: "请输入动火作业人" }],
				operatorPhone: [{ required: true, trigger: "blur", message: "请输入动火作业人联系方式" }],
				operatorIdNum: [{ required: true, trigger: "blur", message: "请输入动火作业人身份证号" }],
				operatorId: [{ required: true, trigger: "blur", message: "请输入动火作业人操作证号" }],
				mode: [{ required: true, trigger: "blur", message: "请输入动火方式及设备" }],
				isPaintingRequest: [{ required: true, trigger: "change", message: "请选择是否已申请临时油漆作业" }],
				safetyMeasure: [{ required: true, trigger: "blur", message: "请输入动火作业安全措施" }],
				// 动水
				waterZone: [{ required: true, trigger: "blur", message: "请输入放水区域" }],
				cumulativeHour: [{ required: true, trigger: "blur", message: "请输入系统无水累计时间" }],
				fireCompartment: [{ required: true, trigger: "blur", message: "请输入申请消防分区" }],
				constructionType: [{ required: true, trigger: "change", message: "请选择施工情况" }],
				fireFacilities: [{ required: true, trigger: "blur", message: "请输入现场防火器材配备情况" }],
				fireGuard: [{ required: true, trigger: "blur", message: "请输入现场直播防火员" }]
			}
		}
	},
	methods: {
		typeChange() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.addTaskcr.clearValidate()
				}, 0)
			})
		},
		init() {
			for (const key in this.paramsAddtaskcrs) {
				if (this.paramsAddtaskcrs.hasOwnProperty(key)) {
					this.paramsAddtaskcrs[key] = undefined
					if (key === "cumulativeHour") {
						this.paramsAddtaskcrs[key] = 0
					}
				}
			}
			setTimeout(() => {
				this.$refs.addTaskcr.clearValidate()
			}, 0)
		},
		onSubmitTaskcrs() {
			this.$refs.addTaskcr.validate((valid) => {
				if (valid) {
					this.isLoading = true
					const params = {
						projectId: this.$route.query.pid,
						taskCrTypeId: this.paramsAddtaskcrs.taskCrTypeId, // 申请类型:1=动火、2=动水
						requestName: this.paramsAddtaskcrs.requestName, // 申请名称
						requestUnit: this.paramsAddtaskcrs.requestUnit, // 申请单位
						requestUserName: this.paramsAddtaskcrs.requestUserName, // 申请人员
						requestUserPhone: this.paramsAddtaskcrs.requestUserPhone
					}

					const tempParams = {
						// 动火动水的共用参数
						building: this.paramsAddtaskcrs.building,
						floor: this.paramsAddtaskcrs.floor, // 楼层名称		string
						room: this.paramsAddtaskcrs.room, // 单元			string
						startTime: parseInt(this.paramsAddtaskcrs.startTime / 1000), // 开始放水时间		int
						endTime: parseInt(this.paramsAddtaskcrs.endTime / 1000), // 重新注水时间		int
						leader: this.paramsAddtaskcrs.leader
					}
					if (this.paramsAddtaskcrs.taskCrTypeId === 1) {
						const fire = [
							"fireFloor",
							"fireZone",
							"reason",
							"leaderPhone",
							"operator",
							"operatorPhone",
							"operatorIdNum",
							"operatorId",
							"mode",
							"isPaintingRequest",
							"safetyMeasure",
							"leaderSignature"
						]
						fire.forEach((key) => {
							tempParams[key] = this.paramsAddtaskcrs[key]
						})
						const requestContent = JSON.stringify(tempParams)
						params.requestContent = requestContent
					}
					if (this.paramsAddtaskcrs.taskCrTypeId === 2) {
						const water = [
							"cumulativeHour",
							"fireCompartment",
							"constructionType",
							"fireFacilities",
							"fireGuard",
							"waterZone"
						]
						water.forEach((key) => {
							tempParams[key] = this.paramsAddtaskcrs[key]
						})
						const requestContent = JSON.stringify(tempParams)
						params.requestContent = requestContent
					}
					addTaskcr(params)
						.then(() => {
							this.isLoading = false
							this.$message({ type: "success", message: "施工申请表提交成功" })
							this.init()
						})
						.catch((err) => {
							this.isLoading = false
							console.log(err)
						})
				} else {
					this.$message({ type: "warning", message: "请完善施工申请表信息" })
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.addTaskcr {
	.main-title {
		text-align: center;
		font-size: 18px;
		font-weight: 700;
		margin: 12px 0;
	}
	.info {
		:deep(.el-form-item--mini.el-form-item) {
			margin-bottom: 10px;
		}
		:deep(.el-form-item) {
			display: flex;
		}
		:deep(.el-date-editor.el-input) {
			width: 100%;
		}
		:deep(.el-form-item_content) {
			flex: 1;
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
			margin-bottom: 15px;
		}
	}
	.submit {
		text-align: center;
		margin-bottom: 10px;
	}
}
</style>
