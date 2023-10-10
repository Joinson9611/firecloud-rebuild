<template>
	<div class="app-container">
		<el-card shadow="never">
			<TaskForm :isEdit="false" />
		</el-card>
	</div>
</template>
<script>
import TaskForm from "./components/taskForm.vue"
export default {
	components: {
		TaskForm
	}
}
</script>
