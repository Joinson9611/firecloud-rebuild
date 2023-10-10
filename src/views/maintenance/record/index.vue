<template>
	<div class="app-container">
		<div class="tab-wrapper">
			<el-tabs type="border-card" style="width: 100%">
				<el-tab-pane label="巡查">
					<History :mcTypeId="0"/>
				</el-tab-pane>
				<el-tab-pane label="测试">
					<History :mcTypeId="1"/>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script>
import History from "./history.vue"
export default {
	components: { History },
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
