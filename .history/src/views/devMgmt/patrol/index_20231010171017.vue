<template>
	<div class="app-container">
		<div class="tab-wrapper">
			<el-tabs type="border-card" style="width: 100%">
				<el-tab-pane label="消防巡更点">
					<Patrolsec />
				</el-tab-pane>
				<el-tab-pane label="设备巡更点">
					<Patroldev />
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script>
import Patrolsec from "./patrolsec.vue"
import Patroldev from "./patroldev.vue"
export default {
	components: { Patrolsec, Patroldev },
	methods: {}
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
</style>
