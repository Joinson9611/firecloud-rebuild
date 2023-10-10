<template>
	<div>{{ visible }}</div>
  <el-button @click="trigger"> trigger</el-button>
	<!-- <input v-model="internalValue" /> -->
</template>
<script>
export default {
	props: {
		visible: {
			type: Boolean,
			required:true
		}
	},
  // watch:{
  //   modelValue(val) {
  //     console.log(val);
  //   }
  // },
	data() {
		return {
			v: ""
		}
	},
	computed: {

	},
	created() {
  },
	methods: {
    trigger() {
      this.$emit('update:visible',!this.visible)
    }
  }
}
</script>
