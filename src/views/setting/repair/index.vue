<template>
	<div class="app-container">
		<el-card>
			<el-form ref="formSetting" :model="paramSetting" :rules="userRules" auto-complete="on" label-position="left">
				<el-form-item label="任务指派人员" prop="assignedUserList">
					<el-select
						v-model="paramSetting.assignedUserList"
						filterable
						multiple
						size="small"
						placeholder="请选择任务指派人员"
						style="width: 100%"
					>
						<el-option v-for="item in userListOptions" :key="item.id" :label="item.nickname" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="维修完成审核人员" prop="finishedApprovalUserList">
					<el-select
						v-model="paramSetting.finishedApprovalUserList"
						filterable
						multiple
						size="small"
						placeholder="请选择维修完成审核人员"
						style="width: 100%"
					>
						<el-option v-for="item in userListOptions" :key="item.id" :label="item.nickname" :value="item.id" />
					</el-select>
				</el-form-item>

				<el-form-item label="材料更换审核人员" prop="mrrApprovalUserList">
					<el-select
						v-model="paramSetting.mrrApprovalUserList"
						filterable
						multiple
						size="small"
						placeholder="请选择材料更换审核人员"
						style="width: 100%"
					>
						<el-option v-for="item in userListOptions" :key="item.id" :label="item.nickname" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="系统停用通知人员" prop="notifyUserList">
					<el-select
						v-model="paramSetting.notifyUserList"
						filterable
						multiple
						size="small"
						placeholder="请选择系统停用通知人员"
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
import { setting, getSettingInfo } from "@/api/setting/approvalmb.js"
export default {
	data() {
		return {
			paramSetting: {
				assignedUserList: [],
				finishedApprovalUserList: [],
				mrrApprovalUserList: [],
				notifyUserList: []
			},
			id: undefined,
			userListOptions: [],
			userRules: {
				assignedUserList: [{ required: true, message: "请选择任务指派人员", trigger: "change" }],
				finishedApprovalUserList: [{ required: true, message: "请选择维修完成审核人员", trigger: "change" }],
				mrrApprovalUserList: [{ required: true, message: "请选择材料更换审核人员", trigger: "change" }],
				notifyUserList: [{ required: true, message: "请选择系统停用通知人员", trigger: "change" }]
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
						assignedUserList: toString(this.paramSetting.assignedUserList),
						finishedApprovalUserList: toString(this.paramSetting.finishedApprovalUserList),
						mrrApprovalUserList: toString(this.paramSetting.mrrApprovalUserList),
						notifyUserList: toString(this.paramSetting.notifyUserList)
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
