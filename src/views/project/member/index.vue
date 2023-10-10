<template>
	<div class="app-container">
		<div class="org-wrapper">
			<el-card box-shadow="never" style="height: calc(100vh - 70px)">
				<template #header>组织结构</template>
				<el-tree
					ref="orgsTree"
					:expand-on-click-node="false"
					:loading="isloading"
					:data="orgsTree"
					default-expand-all
					:highlight-current="true"
					@node-click="handleTreeClick"
					:props="{
						label: (data) => {
							return data.name
						},
						class: customNodeClass
					}"
					node-key="id"
				>
				</el-tree>
			</el-card>
		</div>
		<div class="tab-wrapper">
			<el-tabs @tab-click="changeTab" type="border-card" style="width: 100%;">
				<el-tab-pane label="组织">
					<Orgs @getTreeData="getOrgsTree" />
				</el-tab-pane>
				<el-tab-pane label="岗位" lazy>
					<Positions :id="id" />
				</el-tab-pane>
				<el-tab-pane label="角色" lazy>
					<roles :id="id" />
				</el-tab-pane>
				<el-tab-pane label="成员" lazy>
					<Member :id="id" :key="key" />
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import Orgs from "./components/orgs.vue"
import Positions from "./components/positions.vue"
import Member from "./components/projectusers.vue"
import roles from "./components/roles.vue"
// import { getOrgTree } from "@/api/project/orgs.ts"
export default {
	components: { Orgs, Member, Positions, roles },

	data() {
		return {
			key: 0,
			isloading: false,
			orgsTree: [],
			id: 0
		}
	},
	computed: {},
	created() {
		this.getOrgsTree()
	},
	methods: {
		// 获得组织树
		getOrgsTree(data) {
			this.orgsTree = data
		},
		// 给根节点设置样式
		customNodeClass(data) {
			if (data.parentId === 0) {
				return "is-company"
			}
			return null
		},

		// getOrgsTree() {
		// 	this.isloading = true
		// 	getOrgTree()
		// 		.then((res) => {
		// 			this.isloading = false
		// 			this.orgsTree = res.data.orgTree
		// 		})
		// 		.catch(() => {
		// 			this.isloading = false
		// 		})
		// },
		// 组织结构点击方法处理
		handleTreeClick(node) {
			if (node.parentId === 0) {
				return
			} else {
				this.id = node.id
			}
		},
		changeTab() {
			this.key++
		}
	}
}
</script>
<style lang="scss" scoped>
.app-container {
	width: 100%;
	padding: 10px;
	display: flex;
	.org-wrapper {
		flex: 0 0 270px;
		margin-right: 5px;
	}
	.tab-wrapper {
		flex-grow: 1;
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
::v-deep .el-card__header {
	padding: 10px 10px 10px 15px;
	font-weight: bold;
}
::v-deep .is-company > .el-tree-node__content {
	color: #409eff;
}
</style>
