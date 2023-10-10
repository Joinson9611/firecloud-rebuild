<script lang="ts" setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useTagsViewStore } from "@/store/modules/tags-view"
const route = useRoute()
const tagsViewStore = useTagsViewStore()
const key = computed(() => {
	return route.path
})
</script>
<template>
	<section class="app-main">
		<div>
			<el-scrollbar id="scroller-box" class="scroller">
				<router-view v-slot="{ Component }">
					<transition name="fade-transform" mode="out-in">
						<keep-alive :include="tagsViewStore.cachedViews">
							<component :is="Component" :key="key" />
						</keep-alive>
					</transition>
				</router-view>
			</el-scrollbar>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.app-main {
	min-height: calc(100vh - var(--v3-navigationbar-height));
	width: 100%;
	overflow: hidden;
	background-color: #f2f3f5;
	// .scroller {
	// 	position: absolute;
	// 	top: 0;
	// 	left: 0;
	// 	right: 0;
	// 	bottom: 0;
	// }
}

.fixed-header + .app-main {
	padding-top: var(--v3-navigationbar-height);
	height: 100vh;
	overflow: auto;
}

.hasTagsView {
	.app-main {
		min-height: calc(100vh - var(--v3-header-height));
	}
	.fixed-header + .app-main {
		padding-top: var(--v3-header-height);
	}
}
</style>
