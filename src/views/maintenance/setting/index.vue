<template>
	<div class="app-container">
		<el-table
			v-loading="isSettingLoadingShow"
			:data="settingList"
			:span-method="deviceListMerge"
			element-loading-text="Loading"
			fit
			border
			highlight-current-row
		>
			<el-table-column label="系统类型" align="center">
				<template v-slot="scope">
					{{ scope.row.systemType }}
				</template>
			</el-table-column>
			<el-table-column label="设备类型" align="center">
				<template v-slot="scope">
					{{ scope.row.deviceType }}
				</template>
			</el-table-column>
			<el-table-column label="设置" align="center" width="80">
				<template v-slot="scope">
					<el-checkbox v-model="scope.row.result" :true-label="1" :false-label="0" />
				</template>
			</el-table-column>
		</el-table>
		<div class="footer">
			<el-button
				v-loading="isBtnLoadingShow"
				:disabled="settingList.length === 0"
				type="primary"
				size="small"
				@click="onSaveSubmit"
				>保存设置</el-button
			>
		</div>
	</div>
</template>

<script>
import Pagination from "@/components/Pagination"
import { getMcitemList, setMcitem } from "@/api/maintenance/settings.js"
export default {
	name: "Setting",
	components: {
		Pagination
	},
	data() {
		return {
			isEdit: false,
			isButtonLoadingShow: false,
			dialogVisible: false,
			isSettingLoadingShow: false,
			total: 0,
			paramsSettingInfo: {
				settingId: undefined,
				label: undefined,
				name: undefined
			},
			settingList: [],
			multipleSelection: [],
			deviceItems: []
		}
	},

	created() {
		this.getSetting()
	},
	methods: {
		onSaveSubmit() {
			this.$confirm("确认保存设置？", "提示", {
				type: "warning"
			}).then(() => {
				this.isBtnLoadingShow = true
				setMcitem({
					settingsList: this.settingList
				})
					.then(() => {
						this.getSetting()
						this.$message({
							type: "success",
							message: "设置成功"
						})
						this.isBtnLoadingShow = false
					})
					.catch(() => {
						this.isBtnLoadingShow = false
					})
			})
		},
		merage() {
			let contactDot = 0
			this.spanArr = []
			this.deviceItems.forEach((item, index) => {
				if (index === 0) {
					this.spanArr.push(1)
				} else {
					if (item.systemType === this.deviceItems[index - 1].systemType) {
						this.spanArr[contactDot] += 1
						this.spanArr.push(0)
					} else {
						contactDot = index
						this.spanArr.push(1)
					}
				}
			})
		},
		deviceListMerge({ row, column, rowIndex, columnIndex }) {
			// 是否为第一列
			if (columnIndex === 0) {
				if (this.spanArr[rowIndex]) {
					return {
						rowspan: this.spanArr[rowIndex],
						colspan: 1
					}
				} else {
					return {
						rowspan: 0,
						colspan: 0
					}
				}
			}
		},
		bulidGroupData(list) {
			const src = list
			this.deviceItems = []
			for (let i = 0; i < src.length; i++) {
				this.deviceItems.push(src[i])
			}
		},
		getSetting() {
			this.isSettingLoadingShow = true
			getMcitemList({ projectId: this.selectedProjectId })
				.then((res) => {
					this.settingList = res.data.items
					this.isSettingLoadingShow = false
					this.bulidGroupData(res.data.items)
					this.merage()
				})
				.catch(() => {
					this.isSettingLoadingShow = false
				})
		}
	}
}
</script>

<style scoped lang="scss">
.footer {
	width: 100%;
	padding: 20px;
	text-align: center;
}
</style>
