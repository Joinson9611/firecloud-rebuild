<template>
	<div>
		<el-form ref="formNewTasks" :model="formTask" :rules="newTasksRules" label-width="140px">
			<el-form-item label="任务名称" prop="name">
				<el-input size="small" :disabled="isEdit" v-model="formTask.name" type="text" />
			</el-form-item>
			<el-form-item label="任务描述" prop="description">
				<el-input size="small" v-model="formTask.description" type="textarea" />
			</el-form-item>
			<el-form-item label="任务状态" v-if="isEdit" prop="description">
				<el-select size="small" :disabled="isEdit || isTaskNotStart" v-model="formTask.taskStateId" style="width: 100%">
					<el-option size="small" v-for="item in taskStateOptions" :key="item.id" :label="item.type" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="任务开始时间" prop="startTime">
				<el-date-picker
					size="small"
					v-model="formTask.startTime"
					:picker-options="taskTime"
					type="datetime"
					placeholder="请选择任务开始时间"
					style="width: 100%"
					value-format="x"
				/>
			</el-form-item>
			<el-form-item label="任务结束时间" prop="endTime">
				<el-date-picker
					size="small"
					v-model="formTask.endTime"
					:picker-options="taskTime"
					type="datetime"
					placeholder="请选择任务结束时间"
					style="width: 100%"
					value-format="x"
				/>
			</el-form-item>

			<el-form-item label="执行人员" prop="executeUserList">
				<el-select
					size="small"
					v-model="formTask.executeUserList"
					filterable
					multiple
					placeholder="请选择执行人员"
					style="width: 100%"
				>
					<el-option
						size="small"
						v-for="item in executorListOptions"
						:key="item.id"
						:label="item.nickname"
						:value="item.id"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="任务类型" prop="taskTypeId">
				<el-radio-group :disabled="isEdit" v-model="formTask.taskTypeId">
					<el-radio v-for="item in taskTypeOptions" :key="item.id" :label="item.id" :value="item.id">{{
						item.name
					}}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="taskPeriodTypeShow" label="周期类型" prop="periodTaskTypeId">
				<el-select
					size="small"
					v-model="formTask.periodTaskTypeId"
					placeholder="周期类型"
					clearable
					style="width: 100%"
				>
					<el-option v-for="item in taskPeriodOptions" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item v-if="taskDailyTimeRangeShow" label="是否跨天执行" prop="isNextDay">
				<el-radio-group v-model="formTask.isNextDay">
					<el-radio :label="0">不是</el-radio>
					<el-radio :label="1">是</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="taskDailyTimeRangeShow" label="开始时间" prop="dailyStartTime">
				<el-time-picker
					v-model="formTask.dailyStartTime"
					size="small"
					type="time"
					placeholder="请选择开始时间"
					style="width: 100%"
					value-format="x"
				/>
			</el-form-item>
			<el-form-item v-if="taskDailyTimeRangeShow" label="结束时间" prop="dailyEndTime">
				<el-time-picker
					v-model="formTask.dailyEndTime"
					type="time"
					size="small"
					placeholder="请选择结束时间"
					style="width: 100%"
					value-format="x"
				/>
			</el-form-item>
			<el-form-item v-if="taskDailyCountShow" label="执行次数" prop="dailyCount">
				<el-select
					size="small"
					v-model="formTask.dailyCount"
					placeholder="请选择日常执行次数"
					clearable
					style="width: 100%"
				>
					<el-option v-for="item in taskDailyCountOptions" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="任务异常审核人员" prop="abnormalApprovalUserList">
				<el-select
					v-model="formTask.abnormalApprovalUserList"
					filterable
					size="small"
					multiple
					placeholder="请选择任务异常审核人员"
					style="width: 100%"
				>
					<el-option v-for="item in executorListOptions" :key="item.id" :label="item.nickname" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="任务过期初审人员" prop="expiredApprovalUserList">
				<el-select
					size="small"
					v-model="formTask.expiredApprovalUserList"
					filterable
					multiple
					placeholder="请选择任务过期初审人员"
					style="width: 100%"
				>
					<el-option v-for="item in executorListOptions" :key="item.id" :label="item.nickname" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="任务过期复审人员" prop="expiredReApprovalUserList">
				<el-select
					size="small"
					v-model="formTask.expiredReApprovalUserList"
					filterable
					multiple
					placeholder="请选择任务过期复审人员"
					style="width: 100%"
				>
					<el-option v-for="item in executorListOptions" :key="item.id" :label="item.nickname" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="巡更点列表" style="margin-bottom: 10px">
				<div class="toolbar">
					<div>
						<el-checkbox
							:true-label="1"
							:false-label="0"
							v-model="formTask.isInOrder"
							style="margin-right: 10px"
							label="按序执行"
							@change="orderChange"
						/>
					</div>
					<div>
						<!--筛选按钮-->
						<el-button type="primary" size="small" icon="Plus" @click="openDialogPatrolAdd">添加</el-button>
						<!--删除按钮-->
						<el-button
							:disabled="selection.length === 0"
							type="danger"
							icon="Delete"
							size="small"
							@click="onDeletePatrols"
							>删除</el-button
						>
					</div>
				</div>
			</el-form-item>
			<el-table
				ref="dragTable"
				:data="tablePatrolList"
				row-key="patrolId"
				fit
				highlight-current-row
				style="width: 100%"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" align="center" width="50" />
				<el-table-column align="center" label="执行顺序" width="80">
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
						{{ scope.row.name }}
					</template>
				</el-table-column>
				<el-table-column label="地址" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.address }}</span>
					</template>
				</el-table-column>
			</el-table>
			<el-form-item style="margin-top: 20px">
				<el-button size="small" :loading="isButtonCreateLoadingShow" type="primary" @click="onTaskCreate"
					>提交任务</el-button
				>
				<!-- <el-button size="small" type="danger" @click="onCancel">重置所有信息</el-button> -->
				<!-- <el-button size="small" @click="onReturn">返回列表</el-button> -->
			</el-form-item>
		</el-form>
		<el-dialog
			style="width: 800px"
			v-model="selectPatrolsVisible"
			:append-to-body="true"
			:close-on-click-modal="false"
			title="选择巡更点"
		>
			<div style="text-align: center">
				<el-transfer
					v-model="patrolIdList"
					:filter-method="filterMethod"
					:titles="['巡更点', '选中的巡更点']"
					:format="{
						noChecked: '${total}',
						hasChecked: '${checked}/${total}'
					}"
					:render-content="renderFunc"
					:props="props"
					:data="patrolList"
					target-order="push"
					style="text-align: left; display: inline-block"
					filterable
				>
					<!-- <template v-slot="{ option }">{{ option.key }} - {{ option.label }}</template> -->
				</el-transfer>
			</div>
			<template #footer>
				<el-button @click="onSelectPatrolCancle">取消</el-button>
				<el-button type="primary" @click="onSelectPatrolSubmit">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>
<script>
import { addTask, editTask, getTaskInfo } from "@/api/task/tasklist/index.js"
import { getPatrolAllList } from "@/api/devMgmt/patrol/patrols.js"
import { getUserMenu } from "@/api/project/projectusers.ts"
import Sortable from "sortablejs"
export default {
	name: "Newtasks",
	props: {
		isEdit: {
			default: false,
			type: Boolean
		}
	},
	data() {
		return {
			seconds: 10,
			taskTime: {
				disabledDate(time) {
					const Now = Date.now()
					return time.getTime() < Now - 8.64e7
				}
			},
			// 穿梭框配置
			renderFunc(h, option) {
				return h("span", null, `${option.name}(${option.patrolNum})-${option.address}`)
			},
			props: {
				key: "id"
			},

			isNewTaskSubmit: true,
			taskDailyCountOptions: [
				{ id: 1, name: "1次/天" },
				{ id: 2, name: "2次/天" },
				{ id: 3, name: "3次/天" },
				{ id: 4, name: "4次/天" },
				{ id: 5, name: "5次/天" },
				{ id: 6, name: "6次/天" },
				{ id: 7, name: "7次/天" },
				{ id: 8, name: "8次/天" },
				{ id: 9, name: "9次/天" },
				{ id: 10, name: "10次/天" },
				{ id: 11, name: "11次/天" },
				{ id: 12, name: "12次/天" }
			],
			taskTypeOptions: [
				{ id: 0, name: "日常任务" },
				{ id: 1, name: "周期任务" },
				{ id: 2, name: "自定义任务" }
			],
			taskPeriodOptions: [
				{ id: 0, name: "每年" },
				{ id: 1, name: "每半年" },
				{ id: 2, name: "每季度" },
				{ id: 3, name: "每月" },
				{ id: 4, name: "每半月" },
				{ id: 5, name: "每周" }
			],
			executorListOptions: [],
			taskGroupsOptions: [],
			taskStateOptions: [
				{ id: 0, type: "未开始" },
				{ id: 1, type: "进行中" },
				{ id: 2, type: "已结束" }
			],
			isDraggable: false,
			isBuildingSelectLoading: false,
			isFloorSelectLoading: false,
			isButtonCreateLoadingShow: false,
			formTask: {
				abnormalApprovalUserList: [],
				dailyCount: 0,
				dailyEndTime: 0,
				dailyStartTime: 0,
				description: "",
				endTime: 0,
				executeUserList: [],
				expiredApprovalUserList: [],
				expiredReApprovalUserList: [],
				isInOrder: 0,
				isNextDay: 0,
				name: "",
				taskStateId: "",
				patrolList: [],
				periodTaskTypeId: 0,
				startTime: "",
				taskTypeId: ""
			},
			timeInt: null,
			// 建筑选项列表
			patrolTypeId: this.$route.meta.patrolTypeId,
			// 巡更点列表缓存
			tempPatrolList: [],
			// 表格中的巡更点列表
			tablePatrolList: [],

			// 缓存的选中列表
			tempCheckItem: [],
			// 表格中选中项
			selection: [],
			// 巡更点列表
			patrolList: [],
			patrolIdList: [],
			selectPatrolsVisible: false,
			selectPatrolListLoading: false,
			defaultPatrolProps: {
				children: "children",
				label: function (data, node) {
					if (node.isLeaf) {
						return data.patrolId + " " + data.patrolType + " " + data.patrolLabel
					} else {
						return data.label
					}
				}
			}
		}
	},
	computed: {
		newTasksRules() {
			const This = this
			function startTimeValidator(rule, value, callback) {
				const Now = new Date().getTime()
				const SelectedTime = This.parsetimestamp(value)
				if (value === undefined || value === null) {
					callback(new Error("请选择任务开始时间"))
				} else {
					SelectedTime < Now ? callback(new Error("选中时间不可以小于当前时间")) : callback()
				}
			}
			function endTimeValidator(rule, value, callback) {
				const StartTime = This.parsetimestamp(This.formTask.startTime)
				const EndTime = This.parsetimestamp(value)
				if (value === undefined || value === null) {
					callback(new Error("请选择任务结束时间"))
				} else {
					StartTime > EndTime ? callback(new Error("任务结束时间不可以小于开始时间")) : callback()
				}
			}
			function endTimeValidator2(rule, value, callback) {
				const StartTime = This.formTask.dailyStartTime
				const EndTime = value
				if (value === undefined || value === null) {
					callback(new Error("请选择巡查结束时间"))
				} else {
					if (This.formTask.isNextDay) {
						if (EndTime < StartTime) {
							callback()
						} else {
							callback(new Error("跨天不能超过24小时，结束时间应该小于开始时间"))
						}
					} else {
						callback()
					}
				}
			}
			return {
				isNextDay: [{ required: true, message: "是否需要跨天执行", trigger: "change" }],
				name: { required: true, message: "请输入任务名称", trigger: "change" },
				description: { required: true, message: "请输入任务详情", trigger: "change" },
				taskTypeId: [{ required: true, message: "请选择任务类型", trigger: "change" }],
				startTime: [{ required: true, trigger: "change", validator: startTimeValidator }],
				endTime: [{ required: true, trigger: "change", validator: endTimeValidator }],
				executeUserList: [{ type: "array", required: true, message: "请选择任务执行人员", trigger: "change" }],
				approvalUserList: [{ type: "array", required: true, message: "请选择任务发布审核人员", trigger: "change" }],
				periodTaskTypeId: [{ required: true, message: "请选择周期类型", trigger: "change" }],
				dailyStartTime: [{ required: true, message: "请选择巡查开始时间", trigger: "change" }],
				dailyEndTime: [{ required: true, trigger: "change", validator: endTimeValidator2 }],
				dailyCount: [{ required: true, message: "请选择巡查次数", trigger: "change" }],
				needApproval: [{ required: true, message: "是否需要审核", trigger: "change" }],
				isInOrder: [{ required: true, message: "请选择是否按顺执行", trigger: "change" }],
				expiredReApprovalUserList: [{ required: true, message: "任务过期复审人员", trigger: "change" }],
				abnormalApprovalUserList: [{ required: true, message: "任务异常审核人员", trigger: "change" }],
				expiredApprovalUserList: [{ required: true, message: "任务过期初审人员", trigger: "change" }]
			}
		},
		// 任务是否未开始
		isTaskNotStart: function () {
			return this.formTask.taskStateId === 0
		},
		taskPeriodTypeShow: function () {
			return this.formTask.taskTypeId === 1
		},
		taskDailyTimeRangeShow: function () {
			return this.formTask.taskTypeId === 0
		},
		taskDailyCountShow: function () {
			return this.formTask.taskTypeId === 0
		}
	},
	watch: {
		"formTask.taskTypeId": {
			handler(curVal) {
				if (curVal === 0) {
					this.formTask.periodTaskTypeId = undefined
				} else if (curVal === 1) {
					this.formTask.dailyStartTime = undefined
					this.formTask.dailyEndTime = undefined
					this.formTask.dailyCount = undefined
				} else {
					this.formTask.dailyStartTime = undefined
					this.formTask.dailyEndTime = undefined
					this.formTask.dailyCount = undefined
					this.formTask.periodTaskTypeId = undefined
				}
			},
			deep: true
		}
	},
	created() {
		this.getUserMenu()
		this.getPatrolAllList()
		if (this.isEdit) {
			this.getTaskInfo()
		}
	},
	mounted() {
		// this.setSort()
	},
	methods: {
		getTaskInfo() {
			getTaskInfo(this.$route.query.id, this.patrolTypeId).then(({ data }) => {
				function formateList(str) {
					return str.split(",").map((item) => +item)
				}
				this.formTask.name = data.name
				this.formTask.description = data.description
				this.formTask.isNextDay = data.isNextDay
				this.formTask.taskTypeId = data.taskTypeId
				this.formTask.periodTaskTypeId = data.periodTaskTypeId
				this.formTask.taskStateId = data.taskStateId
				this.formTask.startTime = data.startTime * 1000
				this.formTask.endTime = data.endTime * 1000
				this.formTask.dailyStartTime = data.dailyStartTime * 1000
				this.formTask.dailyEndTime = data.dailyEndTime * 1000
				this.formTask.dailyCount = data.dailyCount
				this.formTask.isInOrder = data.isInOrder
				this.formTask.abnormalApprovalUserList = formateList(data.abnormalApprovalUserList)
				this.formTask.expiredApprovalUserList = formateList(data.expiredApprovalUserList)
				this.formTask.expiredReApprovalUserList = formateList(data.expiredReApprovalUserList)
				this.formTask.executeUserList = formateList(data.executeUserList)
				this.formTask.createUserName = data.createUserName
				this.tablePatrolList = data.patrolList
				this.formTask.patrolList = this.tablePatrolList
			})
		},
		filterMethod(query, option) {
			if (query) {
				const str = `${option.name}(${option.patrolNum})-${option.address}`
				return str.indexOf(query) !== -1
			} else {
				return true
			}
		},
		getPatrolAllList() {
			getPatrolAllList()
				.then((res) => {
					this.patrolList = res.data.items
				})
				.catch(() => {})
		},

		// 返回上一页
		onReturn() {
			this.$router.go(-1)
		},
		setSort() {
			const el = this.$refs.dragTable.$el.querySelectorAll(".el-table__body-wrapper table > tbody")[0]
			this.sortable = Sortable.create(el, {
				ghostClass: "sortable-ghost", // Class name for the drop placeholder,
				setData: function (dataTransfer) {
					// to avoid Firefox bug
					// Detail see : https://github.com/RubaXa/Sortable/issues/1012
					dataTransfer.setData("Text", "")
				},
				onEnd: (evt) => {
					const targetRow = this.tablePatrolList.splice(evt.oldIndex, 1)[0]
					this.tablePatrolList.splice(evt.newIndex, 0, targetRow)
					this.patrolList = this.tablePatrolList.map((item) => item.id)
					this.formTask.patrolList = this.tablePatrolList.map((item) => item.id).slice()
				}
			})
		},
		// 删除巡更点
		onDeletePatrols() {
			for (let i = 0; i < this.selection.length; i++) {
				this.removeByValue(this.selection[i], this.tablePatrolList)
				this.removeByValue(this.selection[i].id, this.formTask.patrolList)
			}
		},
		removeByValue(val, array) {
			for (let i = 0; i < array.length; i++) {
				if (array[i] === val) {
					array.splice(i, 1)
					break
				}
			}
		},
		// timeToClosePage() {
		// 	this.timeInt = setInterval(() => {
		// 		if (this.seconds > 1) this.seconds--
		// 		else {
		// 			this.onToTasksList()
		// 			clearInterval(this.timeInt)
		// 		}
		// 	}, 1000)
		// },
		orderChange(val) {
			this.isDraggable = !!val
		},
		// 将固定格式的时间转换为timestamp ，'2019-08-09 10:49:08' ==> 1565318948 (s)
		parsetimestamp(time) {
			return new Date(time).getTime()
		},
		/**
		 * @Description: 获取执行人员列表
		 * @Date: 2023/8/18
		 **/
		getUserMenu() {
			const params = {
				projectId: this.selectedProjectId
			}
			getUserMenu(params)
				.then((res) => {
					this.executorListOptions = res.data.items
				})
				.catch(() => {})
		},

		/**
		 * @Description: 判断任务时间起始关系
		 * @Date: 2023/8/18
		 **/
		isTasksTimeLegal() {
			return this.formTask.endTime > this.formTask.startTime
		},
		formatString(arr) {
			return arr.length ? arr.join(",") : ""
		},
		onTaskCreate() {
			this.$refs.formNewTasks.validate((valid) => {
				if (valid) {
					if (this.isTasksTimeLegal()) {
						if (this.formTask.patrolList.length !== 0) {
							this.isButtonCreateLoadingShow = true
							this.formTask.projectId = this.selectedProjectId
							const param = {
								abnormalApprovalUserList: this.formatString(this.formTask.abnormalApprovalUserList),
								dailyCount: this.formTask.dailyCount,
								dailyEndTime: this.formTask.dailyEndTime / 1000,
								dailyStartTime: this.formTask.dailyStartTime / 1000,
								description: this.formTask.description,
								endTime: this.formTask.endTime / 1000,
								executeUserList: this.formatString(this.formTask.executeUserList),
								expiredApprovalUserList: this.formatString(this.formTask.expiredApprovalUserList),
								expiredReApprovalUserList: this.formatString(this.formTask.expiredReApprovalUserList),
								isInOrder: this.formTask.isInOrder,
								isNextDay: this.formTask.isNextDay,
								name: this.formTask.name,
								patrolList: this.formTask.patrolList,
								periodTaskTypeId: this.formTask.periodTaskTypeId,
								startTime: this.formTask.startTime / 1000,
								taskTypeId: this.formTask.taskTypeId
							}
							if (this.isEdit) {
								editTask(param, this.$route.query.id, this.patrolTypeId)
									.then(() => {
										this.isButtonCreateLoadingShow = false
										// this.timeToClosePage()
										// this.isNewTaskSubmit = true
										this.$message({
											type: "success",
											message: "编辑成功"
										})
										this.$router.push({ path: "taskslist" })
									})
									.catch(() => {
										this.isButtonCreateLoadingShow = false
									})
							} else {
								addTask(param, this.patrolTypeId)
									.then(() => {
										this.isButtonCreateLoadingShow = false
										// this.timeToClosePage()
										// this.isNewTaskSubmit = true
										this.$message({
											type: "success",
											message: "编辑成功"
										})
										this.$router.push({ path: "taskslist" })
									})
									.catch(() => {
										this.isButtonCreateLoadingShow = false
									})
							}
						} else {
							this.$message({
								message: "巡更点列表不能为空",
								type: "warning"
							})
						}
					} else {
						this.$message({
							message: "结束时间不能小于或者等于开始时间",
							type: "warning"
						})
					}
				} else {
					this.$message({
						message: "请确保巡更点信息已全部填写",
						type: "warning"
					})
				}
			})
		},

		/**
		 * @Description: 取消任务提交
		 * @Date: 2023/8/18
		 **/
		onCancel() {
			this.$confirm("确认重置全部信息？", "提示", {
				type: "warning"
			})
				.then(() => {
					this.resetTaskInfo()
					// 重置表单验证
					this.$refs.formNewTasks.resetFields()
				})
				.catch((err) => {
					console.error(err)
				})
		},

		/**
		 * @Description: 重置任务信息
		 * @Date: 2023/8/18
		 **/
		resetTaskInfo() {
			this.formTask.name = undefined
			this.formTask.label = undefined
			this.formTask.periodTaskTypeId = undefined
			this.formTask.startTime = undefined
			this.formTask.endTime = undefined
			this.formTask.dailyStartTime = undefined
			this.formTask.dailyEndTime = undefined
			this.formTask.dailyCount = undefined
			this.formTask.needApproval = undefined
			this.formTask.executeUserList = []
			this.formTask.patrolList = []
			this.formTask.approvalUserList = []
			this.formTask.abnormalApprovalUserList = []
			this.formTask.expiredApprovalUserList = []
			this.formTask.expiredReApprovalUserList = []
			this.tempPatrolList = []
			this.tablePatrolList = []
			this.tempCheckItem = []
			this.selection = []
		},
		/**
		 * @Description: 打开巡更点添加对话框
		 * @Date: 2023/8/18
		 **/
		openDialogPatrolAdd() {
			this.selectPatrolsVisible = true
			this.patrolIdList = this.tablePatrolList.map((item) => item.patrolId)
		},

		onSelectPatrolCancle() {
			this.selectPatrolsVisible = false
			this.tempPatrolList = this.tablePatrolList.slice()
			this.tempCheckItem = this.formTask.patrolList.slice()
		},

		onSelectPatrolSubmit() {
			this.selectPatrolsVisible = false
			this.tablePatrolList = []
			this.patrolIdList.forEach((id) => {
				this.patrolList.forEach((item) => {
					if (id === item.id) {
						this.tablePatrolList.push(item)
					}
				})
			})
			this.formTask.patrolList = this.tablePatrolList.map((item) => {
				return {
					patrolId: item.id
				}
			})
		},

		handleSelectionChange(val) {
			this.selection = val
		},

		onToTasksList() {
			if (this.patrolTypeId === 0) {
				this.$router.push({ path: this.redirect || "/patroltasks/taskslist" })
			} else {
				this.$router.push({ path: this.redirect || "/detectiontasks/taskslist" })
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.app-container {
	position: relative;
}
.toolbar {
	width: 100%;
	display: flex;
}
::v-deep .el-card__body {
	position: relative;
}
.drag-handler {
	width: 20px;
	height: 20px;
	cursor: pointer;
}

.tip-footer {
	text-align: center;
}
::v-deep .el-transfer-panel {
	width: 300px;
	height: 450px;
}
::v-deep .el-checkbox-group {
	height: 345px;
}
::v-deep .el-dialog {
	width: 800px;
	height: 90%;
}
::v-deep .el-dialog__body {
	height: 600px;
	width: 800px;
}
</style>
