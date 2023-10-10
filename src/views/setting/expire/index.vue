<template>
	<div class="app-container">
		<el-card>
			<el-form ref="formSetting" :model="paramSetting" :rules="userRules" auto-complete="on" label-position="left">
				<el-form-item label="过期通知天数" prop="days">
					<el-input placeholder="请输入" size="small" v-model="paramSetting.days" clearable></el-input>
				</el-form-item>
				<el-form-item label="是否开启通知" prop="enable">
					<el-checkbox v-model="paramSetting.enable" :true-label="1" :false-label="0"></el-checkbox>
				</el-form-item>

				<el-form-item label="通知人员" prop="notifyUserList">
					<el-select
						v-model="paramSetting.notifyUserList"
						filterable
						multiple
						size="small"
						placeholder="请选择"
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
import { setting, getSettingInfo } from "@/api/setting/deviceexpired.js"
export default {
	data() {
		return {
			paramSetting: {
				days: [],
				enable: [],
				notifyUserList: []
			},
			id: undefined,
			userListOptions: [],
			userRules: {
				days: [{ required: true, message: "请输入设备过期提前通知天数	", trigger: "change" }],
				enable: [{ required: true, message: "是否开启通知", trigger: "change" }],
				notifyUserList: [{ required: true, message: "请选择通知人员", trigger: "change" }]
			}
		}
	},
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
						days: this.paramSetting.days,
						enable: this.paramSetting.enable,
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
						if (key === 'notifyUserList') {
							const ele = data[key]
							this.paramSetting[key] = ele.split(",").map((item) => +item)
						} else if (key === "id") {
							this.id = data[key]
						} else if(['days','enable']) {
              this.paramSetting[key] = data[key]
            }
					}
				})
				.catch(() => {})
		}
	}
}
</script>
<style></style>
