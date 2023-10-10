<template>
	<div style="margin-top: 10px">
		<el-form label-width="110px">
			<el-table
				v-loading="isLoading"
				:data="tableDeviceList"
				element-loading-text="加载中"
				style="width: 100%"
				fit
				max-height="560px"
				highlight-current-row
			>
				<el-table-column type="expand">
					<template v-slot="scope">
						<el-form label-position="left" inline class="demo-table-expand">
							<el-form-item label="巡更点地址">
								<span>{{ scope.row.patrolAddress }}</span>
							</el-form-item>
							<el-form-item label="用途范围">
								<span>{{ scope.row.scopeOfUse || "/" }}</span>
							</el-form-item>
							<el-form-item label="主要参数">
								<span>{{ scope.row.mainParameter || "/" }}</span>
							</el-form-item>
							<el-form-item label="巡查人">
								<span >{{ scope.row.checkUserName || "/"  }}</span>
							</el-form-item>
							<el-form-item label="巡查时间">
								<span>{{ scope.row.checkedTime ? getTime(scope.row.checkedTime) : '/' }}</span>
							</el-form-item>
							<!-- <el-form-item v-if="scope.row.deviceChecked" label="`巡更结果`">
								<span :style="fontColor(scope.row.deviceRepaired)">
									{{ getCheckedText(scope.row.deviceRepaired) }}
								</span>
							</el-form-item> -->
						</el-form>
					</template>
				</el-table-column>
				<el-table-column align="center" type="index" width="60" label="序号" />
				<el-table-column label="巡更点编号" align="center" width="180">
					<template v-slot="scope">
						{{ scope.row.patrolNum }}
					</template>
				</el-table-column>

				<el-table-column label="提交方式" align="center">
					<template v-slot="scope">
						<span>{{ submitTypeMap[scope.row.submitTypeId] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="巡查结果" align="center">
					<template v-slot="scope">
						<span>
							<el-tag :type="tagType[scope.row.deviceChecked]">{{ deviceCheckedMap[scope.row.deviceChecked] }}</el-tag>
						</span>
					</template>
				</el-table-column>
			</el-table>
		</el-form>
	</div>
</template>
<script>
import { getHistoryPatrolList } from "@/api/task/record/historypatrols.js"
import { Formattimestamp } from "@/utils/time"
import Pagination from "@/components/Pagination"

export default {
	name: "CheckedRecord",
	components: { Pagination },
	props: {
		historyTaskId: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			checkedTextColor: {},
			isLoading: false,
			checkedTableDeviceList: [],
			tableDeviceList: [],
			isDeviceListLoadingShow: false,
			tasksDeviceList: [],
			total: 0,
			// 提交方式映射
			submitTypeMap: ["未提交", "任务中提交", "二维码扫描提交", "nfc扫描提交"],
			CheckedStyle: ["gray", "success", "warning"],
			deviceCheckedMap: ["未检", "已检", "跳过"]
		}
	},
	watch: {
		historyTaskId: {
			handler() {
				this.getHistoryPatrolList()
			},
			immediate: true
		}
	},
	created() {
		// this.getHistoryPatrolList()
	},
	methods: {
		tagType(id) {
			const typeMap = ["danger", "success", "warning"]
			return typeMap[id]
		},
		fontColor(status) {
			if (status === 0) {
				return { color: "#409EFF" }
			} else if (status === 1) {
				return { color: "#67C23A" }
			} else if (status === 2) {
				return { color: "#F56C6C" }
			} else if (status === 3) {
				return { color: "#E6A23C" }
			} else {
				return { color: "#909399 " }
			}
		},
		getHistoryPatrolList() {
			this.isLoading = true
			console.log(this.historyTaskId)
			const params = {
				historyTaskId: this.historyTaskId
			}
			getHistoryPatrolList(params, this.$route.meta.patrolTypeId)
				.then((res) => {
					this.tableDeviceList = res.data.items
					this.isLoading = false
				})
				.catch(() => {
					this.isLoading = false
				})
		},

		getCheckedText(status) {
			if (status === 0) {
				this.checkedTextColor = { color: "#409EFF" }
				return "正常"
			} else if (status === 1) {
				this.checkedTextColor = { color: "#67C23A" }
				return "已修复"
			} else if (status === 2) {
				this.checkedTextColor = { color: "#F56C6C" }
				return "未修复"
			} else if (status === 3) {
				this.checkedTextColor = { color: "#E6A23C" }
				return "已跳过"
			} else {
				return "异常数据"
			}
		},
		/**
		 * @Description: 时间格式转换
		 * @Date: 2019/5/7
		 **/
		getTime(time) {
			return Formattimestamp(time)
		}
	}
}
</script>

<style lang="scss" scoped>
.demo-table-expand {
	font-size: 0;
  padding: 0 10px;

}
.demo-table-expand span {
	// width: 90px;
	color: #99a9bf;
}
::v-deep .el-form-item {
	margin-right: 0;
	margin-bottom: 0;
	width: 50%;
}
</style>
