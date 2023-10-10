<template>
	<div class="app-wrapper">
		<div class="toolbar-wrapper">
			<el-button type="primary" :disabled="isFloorListLoading" icon="Plus" size="small" @click="addFloor"
				>添加楼层</el-button
			>
		</div>
		<el-table
			ref="dragTable"
			v-loading="isFloorListLoading"
			row-key="id"
			:data="floorList"
			element-loading-text="Loading"
			style="width: 100%"
			highlight-current-row
		>
			<el-table-column label="序号" align="center" width="70">
				<template v-slot="scope"
					><span>{{ scope.$index + 1 }} </span>
				</template>
			</el-table-column>
			<el-table-column label="楼层名称" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="楼层描述" align="center">
				<template v-slot="scope">
					<span>{{ scope.row.description }}</span>
				</template>
			</el-table-column>

			<el-table-column fixed="right" label="操作" width="130" align="center">
				<template #default="scope">
					<el-button type="success" text bg size="small" @click="editFloor(scope.row)">编辑</el-button>
					<el-button type="danger" text bg size="small" @click="deleteFloor(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog @close="closeDialogFloor" v-model="dialogVisible" :title="isEdit ? '编辑楼层' : '新建楼层'">
			<el-form ref="formRef" :model="formFloors" :rules="formRules" label-width="120px" label-floor="right">
				<el-form-item prop="name" label="楼层名称">
					<el-input size="small" v-model="formFloors.name" placeholder="请输入名称" />
				</el-form-item>
				<el-form-item prop="description" label="楼层描述">
					<el-input size="small" v-model="formFloors.description" placeholder="请输入描述" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button size="small" @click="dialogVisible = false">取消</el-button>
				<el-button size="small" type="primary" @click="onSubmit">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { getFloorList, addFloor, editFloor, deleteFloor, setFloorOrder } from "@/api/building/floors"
import Pagination from "@/components/Pagination/index.vue"
import Sortable from "sortablejs"

export default {
	data() {
		return {
			dialogVisible: false,
			isFloorListLoading: false,
			isEdit: false,
			total: 0,
			floorList: [],
			floorIdList: [],
			dataLevelOption: [],
			formRules: {
				name: { required: true, message: "填写名称" },
				description: { required: true, message: "填写描述" }
			},
			formFloors: {
				description: "",
				name: "",
				order: 0,
				id: 0
			},
			bid: this.$route.query.bid,
			// 在Vue的data选项中，直接将`this.bid`赋值给`paramSetOrder.buildingId`是不正确的。在Vue的组件中，data选项是在组件实例化之前进行初始化的，此时`this`还没有指向Vue实例，因此无法访问到`this.bid`。
			paramSetOrder: {
				buildingId: this.$route.query.bid,
				orderList: []
			}
		}
	},
	// watch: {
	// 	floorList: {
	// 		handler(val) {
	// 			console.log(val.map((item) => item.id))
	// 		},
	// 		deep: true
	// 	}
	// },
	components: {
		Pagination
	},
	created() {
		this.getFloorList()
	},
	mounted() {
		this.setSort()
	},
	methods: {
		setSort() {
			const el = this.$refs.dragTable.$el.querySelectorAll(".el-table__body-wrapper table > tbody")[0]
			// 创建sortable实例
			this.sortable = Sortable.create(el, {
				ghostClass: "sortable-ghost", // Class name for the drop placeholder,
				setData: function (dataTransfer) {
					// to avoid Firefox bug
					// Detail see : https://github.com/RubaXa/Sortable/issues/1012
					dataTransfer.setData("Text", "")
				},

				// 拖拽结束的方法
				onEnd: (evt) => {
					const oIndex = evt.oldIndex
					const nIndex = evt.newIndex
					// 拖拽时不在在原列表项时候在进行其他操作
					if (oIndex !== nIndex) {
						// 交换对调元素的order
						;[this.floorList[nIndex].order, this.floorList[oIndex].order] = [
							this.floorList[oIndex].order,
							this.floorList[nIndex].order
						]

						const startRow = this.floorList.splice(evt.oldIndex, 1)[0]
						// const endRow = this.floorList.splice(evt.newIndex, 1)[0]

						// this.floorList.splice(evt.oldIndex, 0, endRow)
						this.floorList.splice(evt.newIndex, 0, startRow)
						// 解构用数组下表的方式没法使vue的视图发生改变必须要用数组的splice方法
						// [this.floorList[evt.oldIndex],this.floorList[evt.newIndex]] = [this.floorList[evt.newIndex],this.floorList[evt.oldIndex]]
						this.paramSetOrder.orderList = this.floorList
							.map(({ order, id }) => {
								return {
									order,
									id
								}
							})
							.slice()
						this.setFloorOrder()
					}

					// for show the changes, you can delete in you code
					// const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
					// this.newList.splice(evt.newIndex, 0, tempIndex)
				}
			})
		},
		// 获取楼层列表
		getFloorList() {
			this.isFloorListLoading = true
			getFloorList({ buildingId: this.bid })
				.then((res) => {
					this.total = res.data.total
					this.floorList = res.data.items
					this.isFloorListLoading = false
				})
				.catch(() => {
					this.isFloorListLoading = false
				})
		},
		closeDialogFloor() {
			this.init()
		},
		setFloorOrder() {
			this.paramSetOrder.buildingId = this.bid
			setFloorOrder(this.paramSetOrder).then(() => {
				this.$message({
					type: "success",
					message: "楼层更新成功"
				})
			})
		},
		addFloor() {
			this.dialogVisible = true
			this.isEdit = false
			this.$nextTick(() => {
				if (this.$refs.formRef) this.$refs.formRef.clearValidate()
			})
		},
		init() {
			this.formFloors.name = ""
			this.formFloors.description = ""
		},
		editFloor(info) {
			this.dialogVisible = true
			this.formFloors.id = info.id
			this.formFloors.description = info.description
			this.formFloors.name = info.name
			this.isEdit = true
			if (this.$refs.formRef) this.$refs.formRef.clearValidate()
		},
		// 楼层删除
		deleteFloor({ id }) {
			deleteFloor(id)
				.then(() => {
					this.getFloorList()
					this.$message({
						type: "success",
						message: "删除成功"
					})
				})
				.catch(() => {})
		},
		onSubmit() {
			this.$refs.formRef.validate((valid) => {
				if (valid) {
					if (this.isEdit) {
						const param = {
							name: this.formFloors.name,
							description: this.formFloors.description,
							buildingId: this.bid,
							extension: ""
						}
						editFloor(this.formFloors, this.formFloors.id)
							.then(() => {
								this.$message({
									type: "success",
									message: "编辑成功"
								})
								this.getFloorList()
								this.dialogVisible = false
							})
							.catch(() => {
								this.dialogVisible = false
							})
					} else {
						const param = {
							name: this.formFloors.name,
							description: this.formFloors.description,
							buildingId: this.bid,
							extension: "",
							order: this.floorList.length === 0 ? 1 : this.floorList[this.floorList.length - 1].order + 1
						}
						addFloor(param)
							.then(() => {
								this.getFloorList()
								this.dialogVisible = false
								this.$message({
									type: "success",
									message: "添加成功"
								})
							})
							.catch(() => {
								this.dialogVisible = false
							})
					}
				}
			})
		}
	}
}
</script>

<style scoped lang="scss">
.filter-wrapper {
	padding: 0 0 5px 0;
}
</style>
