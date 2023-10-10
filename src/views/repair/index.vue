<template>
	<div class="app-container">
		<el-card shadow="never" class="search-wrapper">
			<el-form ref="searchFormRef" :inline="true">
				<el-form-item label="任务时间">
					<el-date-picker
						size="small"
						v-model="paramGetList.selectTime"
						type="month"
						value-format="x"
						placeholder="请选择月份"
						@change="getRepairList"
					/>
				</el-form-item>
				<el-form-item label="报修状态">
					<el-select
						size="small"
						@change="getRepairList"
						v-model="paramGetList.taskMbStateTypeId"
						filterable
						clearable
						placeholder="请选择"
					>
						<el-option v-for="item in option.state" :key="item.id" :label="item.type" :value="item.id" />
					</el-select>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="never">
			<div class="toolbar-wrapper">
				<div>
					<el-tooltip content="导出">
						<el-button :loading="isExportLoading" size="small" icon="Download" circle @click="handleExport" />
					</el-tooltip>
					<el-tooltip content="刷新表格">
						<el-button size="small" icon="RefreshRight" circle @click="handleRefresh" />
					</el-tooltip>
				</div>
			</div>
			<el-table v-loading="isListLoading" :data="list" fit style="width: 100%">
				<el-table-column label="序号" align="center" width="70">
					<template v-slot="scope"
						><span>{{ scope.$index + (paramGetList.page - 1) * paramGetList.limit + 1 }} </span></template
					>
				</el-table-column>
				<el-table-column label="设备编号" width="180" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.deviceNum }}</span>
					</template>
				</el-table-column>
				<el-table-column label="设备类型" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.deviceType }}</span>
					</template>
				</el-table-column>
				<el-table-column label="所属建筑" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.buildingName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="楼层" width="60" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.floorName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="地址描述" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.deviceAddress }}</span>
					</template>
				</el-table-column>
				<el-table-column class-name="status-col" label="任务状态" width="150" align="center">
					<template v-slot="scope">
            <span :style="{color:stateColor[scope.row.taskMbStateTypeId]}">{{ repairState[scope.row.taskMbStateTypeId] }}</span>
					</template>
				</el-table-column>

				<el-table-column class-name="status-col" label="报修人" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.reportedUserName }}</span>
					</template>
				</el-table-column>
				<el-table-column class-name="status-col" label="报修时间" width="180" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.reportedTime ? getTime(scope.row.reportedTime) : "/" }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="70">
					<template v-slot="scope">
						<el-button type="success" size="small" bg text @click="enterPageInfo(scope.row)"> 详情 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				v-if="total > 0"
				:total="total"
				v-model:page="paramGetList.page"
				v-model:limit="paramGetList.limit"
				@pagination="getRepairList"
			/>
		</el-card>
	</div>
</template>

<script>
import { Formattimestamp } from "@/utils/time.ts"
import { getRepairList, exportRepair } from "@/api/repair/taskmbs.js"
import Pagination from "@/components/Pagination/index.vue"
import downloadfile from "js-file-download"
export default {
	data() {
		return {
			dialogVisible: false,
			isListLoading: false,
			isButtonUploadLoadingShow: false,
			isExportLoading: false,
			total: 0,
			list: [],
			selection: [],
			option: {
				state: [
					{ id: 0, type: "待指派" },
					{ id: 1, type: "不予处理" },
					{ id: 2, type: "待维修" },
					{ id: 3, type: "待审核" },
					{ id: 4, type: "已修复" },
					{ id: 5, type: "未修复" },
					{ id: 6, type: "材料更换待审批" },
					{ id: 7, type: "材料更换审批通过" },
					{ id: 8, type: "材料更换审批未通过" }
				]
			},
			stateColor: [
				"#409EFF",
				"#909399",
				"#409EFF",
				"#E6A23C",
				"#67C23A",
				"#F56C6C",
				"#E6A23C",
				"#67C23A",
				"#F56C6C"
			],
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
			paramGetList: {
				page: 1,
				limit: 10,
				selectTime: "",
				taskMbStateTypeId: ""
			}
		}
	},
	components: {
		Pagination
	},

	created() {
		this.getRepairList()
	},
	methods: {
		enterPageInfo({ id }) {
      this.$router.push({ path: "/repair/repairInfo", query: { id } })
		},
		getTime(time) {
			return Formattimestamp(time)
		},
		handleExport() {
      this.isExportLoading = true
			const param = {
			}
      if (this.paramGetList.selectTime) {
				param.selectTime = this.paramGetList.selectTime / 1000
			}
			exportRepair(param)
				.then((res) => {
					this.isExportLoading = false
					this.$message({ type: "success", message: "导出成功" })
					downloadfile(res, "报修记录.xlsx")
				})
				.catch(() => {
					this.isExportLoading = false
				})
		},

		handleSelectionChange(list) {
			this.selection = list
		},
		handleRefresh() {
			this.paramGetList.page = 1
			this.getRepairList()
		},
		// 获取设备列表
		getRepairList() {
			this.isListLoading = true
			const param = {
				limit: this.paramGetList.limit,
				page: this.paramGetList.page,
				taskMbStateTypeId: this.paramGetList.taskMbStateTypeId
			}
			if (this.paramGetList.selectTime) {
				param.selectTime = this.paramGetList.selectTime / 1000
			}
			getRepairList(param)
				.then((res) => {
					this.total = res.data.total
					this.list = res.data.items
					this.isListLoading = false
				})
				.catch(() => {
					this.isListLoading = false
				})
		}
	}
}
</script>
