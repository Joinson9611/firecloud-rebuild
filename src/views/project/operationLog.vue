<template>
	<div class="app-container">
		<el-card shadow="never" >
			<el-table
				v-loading="isListLoadingShow"
				:data="list"
				element-loading-text="Loading"
				style="width: 100%"
				fit
				highlight-current-row
			>
				<el-table-column label="序号" align="center" width="70">
					<template v-slot="scope">
						<span>{{ scope.$index + (paramGetList.page - 1) * paramGetList.limit + 1 }} </span></template
					>
				</el-table-column>
				<el-table-column align="center" label="操作类型">
					<template v-slot="scope">
						<span>{{ scope.row.operationType }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作内容">
					<template v-slot="scope">
						<span>{{ scope.row.operationContent }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作时间">
					<template v-slot="scope">
						<span>{{ getTime(scope.row.operationTime) }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作人">
					<template v-slot="scope">
						<span>{{ scope.row.operator }}</span>
					</template>
				</el-table-column>
			</el-table>
			<!--页码导航-->
			<pagination
				:total="total"
				v-if="total > 0"
				v-model:page="paramGetList.page"
				v-model:limit="paramGetList.limit"
				@pagination="getOperationLogsList"
			/>
		</el-card>
	</div>
</template>
<script>
import { getOperationLogsList } from "@/api/project/operationlogs"
import Pagination from "@/components/Pagination/index.vue"
import { Formattimestamp } from "@/utils/time"
export default {
	name: "Operationlogs",
	components: { Pagination },
	data() {
		return {
			total: 0,
			list: [],
			isListLoadingShow: false,
			paramGetList: {
				page: 1,
				limit: 10
			}
		}
	},
	computed: {},
	created() {
		this.list = []
		this.getOperationLogsList()
	},
	methods: {
		getTime(time) {
			return Formattimestamp(time)
		},
		getOperationLogsList() {
			this.isListLoadingShow = true
			getOperationLogsList(this.paramGetList)
				.then((res) => {
					this.total = res.data.total
					this.isListLoadingShow = false
					this.list = res.data.items
				})
				.catch(() => {
					this.isListLoadingShow = false
				})
		}
	}
}
</script>

<style>
.app-container {
	height: 100%;
}
</style>
