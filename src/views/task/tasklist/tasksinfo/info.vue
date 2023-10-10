<template>
	<TaskForm :isEdit="true" />
</template>
<script>
import TaskForm from "../components/taskForm.vue"
export default {
	components: {
		TaskForm
	}
}
</script>
