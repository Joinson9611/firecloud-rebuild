<template>
	<div class="app-container">
		<div class="tab-wrapper">
			<el-tabs @tab-click="changeTab" type="border-card" style="width: 100%">
				<el-tab-pane label="建筑信息">
					<Building />
				</el-tab-pane>
				<el-tab-pane label="楼层管理">
					<Floor />
				</el-tab-pane>
			</el-tabs>
		</div>
		<div class="back">
			<el-button @click="back">返回</el-button>
		</div>
	</div>
</template>
<script>
import Building from "./building.vue"
import Floor from "./floor.vue"
export default {
	components: { Building, Floor },

	methods: {
		changeTab() {
			this.key++
		},
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
	:deep(.el-tabs__header) {
		margin: 0;
	}
	:deep(.el-tabs__content) {
		height: calc(100vh - 111px);
		background: #fff;
		overflow: auto;
	}
	:deep(el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
		background: #fff;
	}
	:deep(.el-card__body) {
		padding: 5px;
	}
	:deep(.el-card__header) {
		padding: 10px 10px 10px 15px;
		font-weight: bold;
	}
	.back {
		position: fixed;
		right: 40px;
		bottom: 40px;
		z-index: 999;
	}
}
</style>
