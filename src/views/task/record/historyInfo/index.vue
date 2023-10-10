<template>
	<div class="app-container">
		<div class="tab-wrapper">
			<el-tabs type="border-card" style="width: 100%">
				<el-tab-pane label="任务信息">
					<Info />
				</el-tab-pane>
				<el-tab-pane label="巡更结果">
					<Patrol />
				</el-tab-pane>
				<el-tab-pane label="审核信息">
					<Approval />
				</el-tab-pane>
			</el-tabs>
		</div>
		<div class="back">
			<el-button @click="back">返回</el-button>
		</div>
	</div>
</template>
<script>
import Info from "./components/info.vue"
import Patrol from "./components/patrol.vue"
import Approval from "./components/approval.vue"
export default {
	components: { Info, Patrol, Approval },

	methods: {
		back() {
			this.$router.go(-1)
		}
	}
}
</script>
<style lang="scss" scoped>
.app-container {
	width: 100%;
	padding: 10px;

	.tab-wrapper {
		width: 100%;
	}
}
::v-deep .el-tabs__header {
	margin: 0;
}
::v-deep .el-tabs__content {
	height: calc(100vh - 111px);
	background: #fff;
	overflow: auto;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
	background: #fff;
}
::v-deep .el-card__body {
	padding: 5px;
}
.back {
	position: fixed;
	right: 40px;
	bottom: 40px;
	z-index: 999;
}
::v-deep .el-card__header {
	padding: 10px 10px 10px 15px;
	font-weight: bold;
}
</style>
