<template>
	<div class="app-container">
		<el-tabs tab-position="left" type="border-card" style="width: 100%; height: 100%">
			<el-tab-pane label="无线烟感"><Smoke /> </el-tab-pane>
			<el-tab-pane label="水位监测模块" lazy><WaterLevel /> </el-tab-pane>
			<el-tab-pane label="水压监测模块" lazy> <HydraulicPressure /> </el-tab-pane>
			<el-tab-pane label="水浸监测模块" lazy> <WaterImmersion /> </el-tab-pane>
			<el-tab-pane label="电气火灾监测模块" lazy> <ElectricalFire /> </el-tab-pane>
			<el-tab-pane label="AI火灾识别摄像头" lazy> <AIcarmera /> </el-tab-pane>
			<el-tab-pane label="AI火灾识别系统管理" lazy> <AIfireDetection /> </el-tab-pane>
			<el-tab-pane label="DTU" lazy> <DTU /> </el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import Smoke from "./components/smoke.vue"
import WaterLevel from "./components/waterLevel.vue"
import HydraulicPressure from "./components/hydraulicPressure.vue"
import WaterImmersion from "./components/waterImmersion.vue"
import ElectricalFire from "./components/electricalFire.vue"
import AIcarmera from "./components/AIcarmera.vue"
import DTU from "./components/DTU.vue"
import AIfireDetection from "./components/AIfireDetection"
export default {
	components: {
    AIcarmera,
		Smoke,
    DTU,
		WaterLevel,
		HydraulicPressure,
		WaterImmersion,
		ElectricalFire,
    AIfireDetection
	},
	created() {},
	data() {
		return {
			labelMap: {
				0: "deivce51s",
				1: "deivce101s",
				2: "deivce102s",
				3: "deivce103s",
				4: "deivce104s",
				5: "deivce401s",
				6: "deviceserver401s",
				7: "dtu"
			}
		}
	},
	methods: {
		// changTab(label) {
		// 	this.$router.push({ query: { type: this.labelMap[label] } })
		// }
	}
}
</script>

<style lang="scss" scoped>
.app-container {
	height: calc(100vh - 50px);
}
::v-deep .el-tabs__header {
	margin-bottom: 0;
	margin-right: 0px !important;
}
::v-deep .el-tabs__content {
	overflow: auto;
}
</style>
