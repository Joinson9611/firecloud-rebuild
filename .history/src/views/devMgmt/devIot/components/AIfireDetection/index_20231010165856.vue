<template>
	<div class="app-container">
		<el-tabs style="width: 100%; height: 100%">
			<el-tab-pane label="服务器"><Service /></el-tab-pane>
			<el-tab-pane label="摄像头" lazy><Camera /> </el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import Service from "./servce.vue"
import Camera from "./camera.vue"
export default {
	data() {
		return {}
	},
	components: {
		Service,
		Camera
	}
}
</script>
<style lang="scss" scoped>
.app-container {
	padding: 0;
	:deep(.el-tabs__content) {
		height: calc(100vh - 120px);
		padding: 0;
		padding-top: 10px;
		overflow: auto;
	}
}

</style>
