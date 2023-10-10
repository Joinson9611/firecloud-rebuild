<template>
	<div class="infoWrapper">
		<el-form ref="formEditBuilding" :model="formBuildings"  label-width="110px">
			<el-form-item label="建筑名称：">
				<span>{{ formBuildings.name || "/" }}</span>
			</el-form-item>
			<el-form-item label="建筑物描述：">
				<span>{{ formBuildings.description  || "/" }}</span>
			</el-form-item>
			<el-form-item label="地下层数：" class="dialog-form-item" prop="startFloor">
				<span>{{ formBuildings.startFloor  || "/" }}</span>
			</el-form-item>
			<el-form-item label="地上楼层：" class="dialog-form-item" prop="endFloor">
				<span>{{ formBuildings.endFloor  || "/" }}</span>
			</el-form-item>
			<el-form-item label="自动消防设施：" class="dialog-form-item" prop="autoFireFightingEquipment">
				<span>{{ isMap[formBuildings.autoFireFightingEquipment] }}</span>
			</el-form-item>
			<el-form-item label="建筑面积：" class="dialog-form-item" prop="buildingArea">
				<span>{{ formBuildings.buildingArea  || "/" }}</span>
			</el-form-item>
			<el-form-item label="占地面积：" class="dialog-form-item" prop="coverArea">
				<span>{{ formBuildings.coverArea  || "/" }}</span>
			</el-form-item>
			<el-form-item label="建筑高度：" class="dialog-form-item" prop="buildingHeight">
				<span>{{ formBuildings.buildingHeight  || "/" }}</span>
			</el-form-item>
			<el-form-item label="建筑层数：" class="dialog-form-item" prop="countFloor">
				<span>{{ formBuildings.countFloor  || "/" }}</span>
			</el-form-item>
			<el-form-item label="紧急出口数量：" class="dialog-form-item">
				<span>{{ formBuildings.countEmergencyExit  || "/" }}</span>
			</el-form-item>
			<el-form-item label="疏散楼梯个数：" class="dialog-form-item">
				<span>{{ formBuildings.countEvacuationStaircase  || "/" }}</span>
			</el-form-item>
			<el-form-item label="消防电梯个数：" class="dialog-form-item">
				<span>{{ formBuildings.countFireElevator  || "/" }}</span>
			</el-form-item>
			<el-form-item label="避难层位置：" class="dialog-form-item">
				<span>{{ formBuildings.refugeLayer  || "/" }}</span>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { getBuildingInfo } from "@/api/building/buildings.js"
export default {
	data() {
		return {
			isMap: ["无", "有"],
			formBuildings: {
				description: "",
				name: "",
				startFloor: "",
				endFloor: "",
				address: "",
				building_type_id: "",
				autoFireFightingEquipment: "",
				coverArea: "",
				buildingArea: "",
				countFloor: "",
				buildingHeight: "",
				countEmergencyExit: "",
				countEvacuationStaircase: "",
				countFireElevator: "",
				refugeLayer: ""
			}
		}
	},
	created() {
		this.getBuildingInfo()
	},
	methods: {
		// 获取建筑信息
		getBuildingInfo() {
			const id = this.$route.query.bid
			getBuildingInfo(id).then(({ data }) => {
				let extension
				this.formBuildings.name = data.name
				this.formBuildings.description = data.description
        if (typeof data.extension === "string") {
					extension = JSON.parse(data.extension)
				}
				this.formBuildings = Object.assign(this.formBuildings, extension)
			})
		}
	}
}
</script>
<style scoped lang="scss">
.infoWrapper {
  :deep(.el-form-item) {
    margin-bottom: 6px;
  }
}
</style>
