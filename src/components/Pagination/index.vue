<template>
	<div :class="{ hidden: hidden }" class="pagination-container">
		<el-pagination
			:background="background"
			v-model:current-page="currentPage"
			v-model:page-size="pageSize"
			:layout="layout"
      small
			:page-sizes="pageSizes"
			:total="total"
			v-bind="$attrs"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
	</div>
</template>

<script>
// import { scrollTo } from '@/utils/scrollTo'

export default {
	name: "Pagination",
  watch :{
    limit(val) {
      console.log(val);
    }
  },
	props: {
		to: {
			type: Number,
			default: 0
		},
		total: {
			required: true,
			type: Number
		},
		page: {
			type: Number,
			default: 1
		},
		limit: {
			type: Number,
			default: 20
		},
		pageSizes: {
			type: Array,
			default() {
				return [10, 20, 30]
			}
		},
		layout: {
			type: String,
			default: "total, sizes, prev, pager, next"
		},
		background: {
			type: Boolean,
			default: false
		},
		autoScroll: {
			type: Boolean,
			default: true
		},
		hidden: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		currentPage: {
			get() {
				return this.page
			},
			set(val) {
				this.$emit("update:page", val)
			}
		},
		pageSize: {
			get() {
				return this.limit
			},
			set(val) {
				this.$emit("update:limit", val)
			}
		}
	},
  methods: {
		handleSizeChange(val) {
			// 这里利用计时器 使limit的赋值提前，而handleSizeChange内的同步操作延后（插入到异步队列） ,解决pagesize改变时的BUG
			setTimeout(() => {
				this.$emit("pagination")
			}, 0) // 0ms
		},
		handleCurrentChange() {
			this.$emit("pagination")
			// if (this.autoScroll) {
			//   scrollTo(this.to, 800)
			// }
		}
	}
}
</script>

<style scoped>
.pagination-container {
	background: #fff;
	padding: 16px 8px;
}
.pagination-container.hidden {
	display: none;
}
</style>
