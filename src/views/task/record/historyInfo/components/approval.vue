<template>
	<div style="margin-top: 10px">
		<el-table
			v-loading="isTrackListLoadingShow"
			:data="tasksTrackList"
			element-loading-text="加载中"
			style="width: 100%"
			fit
			highlight-current-row
		>
			<el-table-column label="序号" align="center" width="70">
				<template v-slot="scope"
					><span>{{ scope.$index + (paramGetTrackList.page - 1) * paramGetTrackList.limit + 1 }} </span></template
				>
			</el-table-column>

			<el-table-column label="审核类型" align="center" width="180">
				<template v-slot="scope">
					<span>{{ approvalTypeMap[scope.row.approvalTypeId] }}</span>
				</template>
			</el-table-column>

			<el-table-column label="审核人" align="center" width="140">
				<template v-slot="scope">
					{{ scope.row.approvalUserName }}
				</template>
			</el-table-column>

			<el-table-column label="是否已审核" align="center" width="100px">
				<template v-slot="scope">
					<span>{{ isMap[scope.row.isApproval] }}</span>
				</template>
			</el-table-column>

			<el-table-column label="审核内容" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.approvalContent || "/" }}</span>
				</template>
			</el-table-column>

			<el-table-column label="审核人签名" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.approver || "/" }}</span>
				</template>
			</el-table-column>

			<el-table-column label="审核时间" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.approvalTime ? getTime(scope.row.approvalTime) : "/" }}</span>
				</template>
			</el-table-column>
		</el-table>
		<!--页码导航-->
		<pagination
			v-show="total > 0"
			:total="total"
			v-model:page="paramGetTrackList.page"
			v-model:limit="paramGetTrackList.limit"
			@pagination="getCheckedTracks"
		/>
	</div>
</template>

<script>
import { getApprovalInfo } from "@/api/task/record/historytasks.js"
import { Formattimestamp } from "@/utils/time"
import Pagination from "@/components/Pagination"
export default {
	name: "Track",
	components: { Pagination },
	data() {
		return {
			isMap: ["否", "是"],
			approvalTypeMap: ["异常审核", "过期初审", "过期复审"],
			isTrackListLoadingShow: false,
			tasksTrackList: [],
			total: 0,
			paramGetTrackList: {
				projectId: undefined,
				historyTaskId: undefined,
				page: 1,
				limit: 10
			}
		}
	},
	created() {
		this.getCheckedTracks()
	},
	methods: {
		getCheckedTracks() {
			this.isTrackListLoadingShow = true
			getApprovalInfo(this.$route.query.id, this.$route.meta.patrolTypeId)
				.then((res) => {
					this.tasksTrackList = res.data.items
					this.total = res.data.total
					this.isTrackListLoadingShow = false
				})
				.catch((err) => {
					console.log(err)
					this.isTrackListLoadingShow = false
				})
		},

		getTime(time) {
			return Formattimestamp(time)
		}
	}
}
</script>
