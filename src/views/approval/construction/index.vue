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
				<el-table-column label="申请名称" align="center">
					<template v-slot="scope">
						<span>{{ scope.row.requestName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="申请类型" align="center">
					<template v-slot="scope">
						<span>{{ taskCrType[scope.row.taskCrTypeId] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="申请状态" align="center">
					<template v-slot="scope">
						<span>{{ taskCrStateType[scope.row.taskCrStateTypeId] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="审核类型" align="center">
					<template v-slot="scope">
						<span>{{ approvalTypeMap[scope.row.approvalTypeId] }}</span>
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
		<el-drawer v-model="detailVisible" title="审核" direction="ltr" size="50%">
			<Info :id="id" @updateList="getApprovalList" />
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
import { getApprovalList } from "@/api/approval/construction/index.js"

export default {
	components: {
		Pagination,
		Info
	},
	data() {
		return {
			isMap: ["否", "是"],
			list: [],
			taskCrType: ["动火", "动水"],
			id: 0,
			isListLoadingShow: false,
			paramGetList: {
				page: 1,
				limit: 10
			},
			detailVisible: false,
			total: 0,
			approvalTypeMap: ["一级审核", "二级审核", "三级审核"],
			taskCrStateType: ["一级审核中", "二级审核中", "三级审核中", "审核通过", "审核未通过"]
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
			getApprovalList(this.paramGetList, this.$route.meta.taskApprovalTypeId)
				.then((res) => {
					this.list = res.data.items
					this.total = res.data.total
					this.isListLoadingShow = false
				})
				.catch(() => {
					this.isListLoadingShow = false
				})
		}
	}
}
</script>
<style lang="scss" scoped>
.app-container {
	:deep(.el-drawer__body) {
		padding: 0 10px 10px 10px;
		overflow: auto;
	}
}
</style>
