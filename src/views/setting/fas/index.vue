<template>
	<div class="app-container">
		<el-card>
			<el-form ref="formSetting" :model="paramSetting" :rules="userRules" auto-complete="on" label-position="left">
				<el-form-item label="火警确认初审人员" prop="fireAlarMackApprovalUserList">
					<el-select
						v-model="paramSetting.fireAlarMackApprovalUserList"
						filterable
						multiple
						size="small"
						placeholder="请选择火警确认初审人员"
						style="width: 100%"
					>
						<el-option v-for="item in userListOptions" :key="item.id" :label="item.nickname" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="火警确认复审人员" prop="fireAlarMackReApprovalUserList">
					<el-select
						v-model="paramSetting.fireAlarMackReApprovalUserList"
						filterable
						multiple
						size="small"
						placeholder="请选择火警确认复审人员"
						style="width: 100%"
					>
						<el-option v-for="item in userListOptions" :key="item.id" :label="item.nickname" :value="item.id" />
					</el-select>
				</el-form-item>

				<el-form-item label="超时3分钟审核人员" prop="overTimeApprovalUserList1">
					<el-select
						v-model="paramSetting.overTimeApprovalUserList1"
						filterable
						multiple
						size="small"
						placeholder="请选择超时3分钟审核人员"
						style="width: 100%"
					>
						<el-option v-for="item in userListOptions" :key="item.id" :label="item.nickname" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="超时5分钟审核人员" prop="overTimeApprovalUserList2">
					<el-select
						v-model="paramSetting.overTimeApprovalUserList2"
						filterable
						multiple
						size="small"
						placeholder="请选择超时5分钟审核人员"
						style="width: 100%"
					>
						<el-option v-for="item in userListOptions" :key="item.id" :label="item.nickname" :value="item.id" />
					</el-select>
				</el-form-item>
				<div class="save-button-wrapper">
					<el-button type="primary" @click="onSaveSubmit" size="small">保存设置</el-button>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import { getUserMenu } from "@/api/project/projectusers.ts"
import { setting, getSettingInfo } from "@/api/setting/approvalfas.js"
export default {
	data() {
		return {
			paramSetting: {
				fireAlarMackApprovalUserList: [],
				fireAlarMackReApprovalUserList: [],
				overTimeApprovalUserList1: [],
				overTimeApprovalUserList2: []
			},
			id: undefined,
			userListOptions: [],
			userRules: {
				fireAlarMackApprovalUserList: [{ required: true, message: "请选择火警确认初审人员", trigger: "change" }],
				fireAlarMackReApprovalUserList: [{ required: true, message: "请选择火警确认复审人员", trigger: "change" }],
				overTimeApprovalUserList1: [{ required: true, message: "请选择超时3分钟审核人员", trigger: "change" }],
				overTimeApprovalUserList2: [{ required: true, message: "请选择超时5分钟审核人员", trigger: "change" }]
			}
		}
	},
	computed: {},
	created() {
		this.getUserMenu()
		this.getSettingInfo()
	},
	methods: {
		/**
		 * @Description: 获取人员列表
		 * @Date: 2023/10/8
		 **/
		getUserMenu() {
			getUserMenu()
				.then((res) => {
					this.userListOptions = res.data.items
				})
				.catch(() => {})
		},

		onSaveSubmit() {
			this.$refs.formSetting.validate((valid) => {
				function toString(arr) {
					if (arr.length) {
						return arr.join(",")
					} else {
						return ""
					}
				}
				if (valid) {
					const params = {
						fireAlarMackApprovalUserList: toString(this.paramSetting.fireAlarMackApprovalUserList),
						fireAlarMackReApprovalUserList: toString(this.paramSetting.fireAlarMackReApprovalUserList),
						overTimeApprovalUserList1: toString(this.paramSetting.overTimeApprovalUserList1),
						overTimeApprovalUserList2: toString(this.paramSetting.overTimeApprovalUserList2)
					}
					setting(params, this.id)
						.then(() => {
							this.$message({
								type: "success",
								message: "设置成功"
							})
						})
						.catch(() => {})
				}
			})
		},
		getSettingInfo() {
			getSettingInfo()
				.then((res) => {
					const data = res.data
					for (const key in data) {
						if (!['id','projectId'].includes(key)) {
							const ele = data[key]
							this.paramSetting[key] = ele.split(',').map((item) => +item)

						} else if(key ==='id') {
							this.id = data[key]
						}
					}
				})
				.catch(() => {})
		}
	}
}
</script>
<style></style>
