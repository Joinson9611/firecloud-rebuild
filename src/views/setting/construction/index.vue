<template>
	<div class="app-container">
		<el-card>
			<el-form ref="formSetting" :model="paramSetting" :rules="userRules" auto-complete="on" label-position="left">
				<el-form-item label="一级审核人员" prop="approval1UserList">
					<el-select
						v-model="paramSetting.approval1UserList"
						filterable
						multiple
						size="small"
						placeholder="请选择一级审核人员"
						style="width: 100%"
					>
						<el-option v-for="item in userListOptions" :key="item.id" :label="item.nickname" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="二级审核人员" prop="approval2UserList">
					<el-select
						v-model="paramSetting.approval2UserList"
						filterable
						multiple
						size="small"
						placeholder="请选择二级审核人员"
						style="width: 100%"
					>
						<el-option v-for="item in userListOptions" :key="item.id" :label="item.nickname" :value="item.id" />
					</el-select>
				</el-form-item>

				<el-form-item label="三级审核人员" prop="approval3UserList">
					<el-select
						v-model="paramSetting.approval3UserList"
						filterable
						multiple
						size="small"
						placeholder="请选择三级审核人员"
						style="width: 100%"
					>
						<el-option v-for="item in userListOptions" :key="item.id" :label="item.nickname" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="消控通知确认人员" prop="fccUserList">
					<el-select
						v-model="paramSetting.fccUserList"
						filterable
						multiple
						size="small"
						placeholder="请选择消控通知确认人员"
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
import { setting, getSettingInfo } from "@/api/setting/approvalcr.js"
export default {
	data() {
		return {
			paramSetting: {
				approval1UserList: [],
				approval2UserList: [],
				approval3UserList: [],
				fccUserList: []
			},
			id: undefined,
			userListOptions: [],
			userRules: {
				approval1UserList: [{ required: true, message: "请选择一级审核人员", trigger: "change" }],
				approval2UserList: [{ required: true, message: "请选择二级审核人员", trigger: "change" }],
				approval3UserList: [{ required: true, message: "请选择三级审核人员", trigger: "change" }],
				fccUserList: [{ required: true, message: "请选择消控通知确认人员", trigger: "change" }]
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
						approval1UserList: toString(this.paramSetting.approval1UserList),
						approval2UserList: toString(this.paramSetting.approval2UserList),
						approval3UserList: toString(this.paramSetting.approval3UserList),
						fccUserList: toString(this.paramSetting.fccUserList)
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
						if (!["id", "projectId"].includes(key)) {
							const ele = data[key]
							this.paramSetting[key] = ele.split(",").map((item) => +item)
						} else if (key === "id") {
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
