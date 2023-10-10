<template>
	<div class="app-container">
		<el-card shadow="never">
			<el-table
				v-loading="isListLoadingShow"
				:data="list"
				element-loading-text="Loading"
				style="width: 100%"
				fit
				highlight-current-row
			>
				<el-table-column label="序号" align="center" width="70">
					<template v-slot="scope"
						><span>{{ scope.$index + (paramGetList.page - 1) * paramGetList.limit + 1 }} </span></template
					>
				</el-table-column>
				<el-table-column label="设备编码" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.deviceNum }}</span>
					</template>
				</el-table-column>
				<el-table-column label="位置" align="center">
					<template v-slot="scope">
						{{ scope.row.address || "/" }}
					</template>
				</el-table-column>
				<el-table-column label="报警时间" align="center" width="110">
					<template v-slot="scope">
						{{ getTime(scope.row.alarmTime, "date") }}<br />{{ getTime(scope.row.alarmTime, "day") }}
					</template>
				</el-table-column>
				<el-table-column label="审核类型" align="center">
					<template v-slot="scope">
						{{ approvalTypeMap[scope.row.approvalTypeId] }}
					</template>
				</el-table-column>
				<el-table-column label="是否已审核" align="center" width="100">
					<template v-slot="scope">
						<span :style="{ color: scope.row.isApproval === 0 ? '#F56C6C' : '#67C23A' }">{{
							isMap[scope.row.isApproval]
						}}</span>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" align="center" width="110">
					<template v-slot="scope">
						{{ getTime(scope.row.createTime, "date") }}<br />{{ getTime(scope.row.createTime, "day") }}
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="80">
					<template v-slot="scope">
						<el-button size="small" text bg type="success" @click="handleDetail(scope.row)">审核</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-drawer v-model="detailVisible" title="审核" direction="ltr" size="400">
			<Info :id="id" @updateList="getApprovalList"/>
		</el-drawer>
		<!--页码导航-->
		<pagination
			v-show="total > 0"
			:total="total"
			v-model:page="paramGetList.page"
			v-model:limit="paramGetList.limit"
			@pagination="getApprovalList"
		/>
	</div>
</template>

<script>
import Info from "./detail.vue"
import Pagination from "@/components/Pagination"
import { Formattimestamp } from "@/utils/time.ts"
import { getApprovalList } from "@/api/approval/fasAlarm/index.js"

export default {
	components: {
		Pagination,
		Info
	},
	data() {
		return {
			isMap: ["否", "是"],
			list: [],
			id: 0,
			isListLoadingShow: false,
			paramGetList: {
				page: 1,
				limit: 10
			},
			detailVisible: false,
			total: 0,
			approvalTypeMap: ["火警确认初审", "火警确认复审", "超时三分钟审核", "超时五分钟审核"]
		}
	},
	created() {
		this.getApprovalList()
	},
	methods: {
		handleDetail({ id }) {
			this.id = id
			this.detailVisible = true
		},
		getTime(time, type) {
			if (time) {
				time = Formattimestamp(time)
				const date = time.split(" ")[0]
				const day = time.split(" ")[1]
				if (type === "date") {
					return date
				} else {
					return day
				}
			}
		},
		// 获取审核列表
		getApprovalList() {
			this.isListLoadingShow = true
			getApprovalList(this.paramGetList)
				.then((res) => {
					this.list = res.data.items
					this.total = res.data.total
					this.isListLoadingShow = false
				})
				.catch(() => {
					this.isListLoadingShow = false
				})
		},
		toPageApproval(hid, historyFasId) {
			this.$router.push({
				path: "/approval/fasApprovalDetail",
				query: {
					hid,
					historyFasId
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.app-container {
	:deep(.el-drawer__body) {
		padding: 0 10px;
    overflow: auto;
	}
}
</style>
