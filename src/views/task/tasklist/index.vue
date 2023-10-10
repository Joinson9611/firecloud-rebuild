<template>
	<div class="app-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true">
				<el-form-item label="任务状态">
					<el-select
						size="small"
						@change="selectChange"
						v-model="paramGetList.taskStateId"
						filterable
						clearable
						placeholder="请选择"
					>
						<el-option v-for="item in option.taskState" :key="item.id" :label="item.type" :value="item.id" />
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
				<el-form-item prop="name" label="任务名称">
					<el-input
						placeholder="请输入"
						size="small"
						v-model="searchData.name"
						@keydown.enter="handleSearch"
						clearable
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" icon="Search" @click="handleSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card shadow="never">
			<div class="toolbar-wrapper">
				<div>
					<el-button type="primary" size="small" icon="Plus" @click="addTask">新增任务</el-button>
					<el-button type="danger" :disabled="selection.length === 0" size="small" icon="Delete" @click="deleteTask()"
						>批量删除</el-button
					>
				</div>
				<div>
					<el-tooltip content="刷新表格">
						<el-button size="small" icon="RefreshRight" circle @click="handleRefresh" />
					</el-tooltip>
				</div>
			</div>
			<el-table
				v-loading="isTaskLoadingShow"
				:data="taskList"
				element-loading-text="Loading"
				style="width: 100%"
				highlight-current-row
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" align="center" width="50" />
				<el-table-column label="任务名称" align="center">
					<template v-slot="scope">
						<span @click="toTasksInfoPage(scope.row)">{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="任务描述" align="center">
					<template v-slot="scope">
						{{ scope.row.description }}
					</template>
				</el-table-column>
				<el-table-column label="发布人员" width="130" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.createUserName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="任务类型" width="100" align="center">
					<template v-slot="scope">
						<span>{{ taskType[scope.row.taskTypeId] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="任务状态" width="100" align="center">
					<template v-slot="scope">
						<span :style="{ color: taskStateColor[scope.row.taskStateId] }">{{
							taskState[scope.row.taskStateId]
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
				<el-table-column fixed="right" label="操作" width="130" align="center">
					<template #default="scope">
						<el-button type="success" text bg size="small" @click="editTask(scope.row)">编辑</el-button>
						<el-button type="danger" text bg size="small" @click="deleteTask(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				v-if="total > 0"
				:total="total"
				v-model:page="paramGetList.page"
				v-model:limit="paramGetList.limit"
				@pagination="getTaskList"
			/>
		</el-card>
	</div>
</template>
<script>
import { Formattimestamp } from "@/utils/time"
import { getTaskList, deleteTask } from "@/api/task/tasklist/index.js"
import Pagination from "@/components/Pagination"
export default {
	name: "TaskList",
	components: { Pagination },
	data() {
		return {
			dialogVisible: false,
			// 任务列表
			taskList: [],
			total: 0,
			isBtnLoadingShow: false,
			isTaskLoadingShow: false,
			isEdit: false,
			paramGetList: {
				page: 1,
				limit: 10,
				name: "",
				taskStateId: "",
				taskTypeId: ""
			},
			searchData: {
				name: ""
			},
			taskState: ["未开始", "进行中", "已结束"],
			taskStateColor: ["#909399", "#409EFF", "#F56C6C"],

			taskType: ["日常任务", "周期任务", "自定义任务"],

			option: {
				taskState: [
					{ id: 0, type: "未开始" },
					{ id: 1, type: "进行中" },
					{ id: 2, type: "已结束" }
				],
				taskType: [
					{ id: 0, type: "日常任务" },
					{ id: 1, type: "周期任务" },
					{ id: 2, type: "自定义任务" }
				]
			},
			patrolTypeId: this.$route.meta.patrolTypeId,
			taskRules: {
				type: [{ required: true, trigger: "blur", message: "请填写任务名称" }]
			},
			formTask: {
				id: 0,
				deviceTypeId: undefined,
				type: undefined,
				label: undefined
			},
			selection: []
		}
	},

	created() {
		this.getTaskList()
	},
	methods: {
		getTime(time) {
			return Formattimestamp(time)
		},
		selectChange() {
			this.getTaskList()
		},
		closeDialog() {
			this.init()
			this.dialogVisible = false
		},

		init() {
			this.formTask.type = ""
			this.formTask.label = ""
		},
		handleRefresh() {
			this.getTaskList()
		},

		addTask() {
      if(this.patrolTypeId === 0) {
        this.$router.push({ path: "/patrolSectasks/newtasks" })
      } else {
        this.$router.push({ path: "/patrolDevtasks/newtasks" })
      }

		},

		editTask({ id }) {
      if(this.patrolTypeId === 0) {
        this.$router.push({ path: "/patrolSectasks/tasksinfo" , query: { id }})
      } else {
        this.$router.push({ path: "/patrolDevtasks/tasksinfo" , query: { id }})
      }
		},
		deleteTask(param) {
			let id
			if (param) {
				id = param.id
			} else {
				if (this.selection.length === 0) {
					id = ""
				} else {
					id = this.selection.map((item) => item.id).join(",")
				}
			}

			deleteTask(id, this.patrolTypeId)
				.then(() => {
					this.getTaskList()
					this.$message({
						type: "success",
						message: "删除成功"
					})
				})
				.catch(() => {})
		},
		handleSearch() {
			this.paramGetList.name = this.searchData.name
			if (this.paramGetList.page === 1) {
				this.getTaskList()
			}
			this.paramGetList.page = 1
		},
		deleteTask(param) {
			let id
			if (param) {
				id = param.id
			} else {
				if (this.selection.length === 0) {
					id = ""
				} else {
					id = this.selection.map((item) => item.id).join(",")
				}
			}
			deleteTask(id, this.patrolTypeId)
				.then(() => {
					this.getTaskList()
					this.$message({
						type: "success",
						message: "删除成功"
					})
				})
				.catch(() => {})
		},
		getTaskList() {
			this.isTaskLoadingShow = true
			getTaskList(this.paramGetList, this.patrolTypeId)
				.then((res) => {
          this.total = res.data.total
					this.isTaskLoadingShow = false
					this.taskList = res.data.items
				})
				.catch(() => {
					this.isTaskLoadingShow = false
				})
		},

		handleSelectionChange(list) {
			this.selection = list
		}
	}
}
</script>
