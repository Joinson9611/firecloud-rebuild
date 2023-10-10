<script lang="ts" setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useAppStore } from "@/store/modules/app"
import { useSettingsStore } from "@/store/modules/settings"
import { useUserStore } from "@/store/modules/user"
import { UserFilled } from "@element-plus/icons-vue"

import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import Screenfull from "@/components/Screenfull/index.vue"

const router = useRouter()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const userStore = useUserStore()

const showThemeSwitch = computed(() => {
	return settingsStore.showThemeSwitch
})
const showScreenfull = computed(() => {
	return settingsStore.showScreenfull
})
const toPlatform = () => {

}
const logout = () => {
	userStore.logout().then(() => {
		router.push("/login")
	})
}
</script>
<template>
	<div class="navigation-bar">
		<div class="left-menu">
			<span class="left-menu-item hover-effect">开拓消防云平台</span>
		</div>
		<div class="right-menu">
			<Screenfull v-if="showScreenfull" class="right-menu-item" />
			<ThemeSwitch v-if="showThemeSwitch" class="right-menu-item" />
			<el-dropdown class="right-menu-item">
				<div class="right-menu-avatar">
					<el-avatar :icon="UserFilled" :size="30" />
					<span>{{ userStore.username }}</span>
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item divided @click="logout">
							<span style="display: block">退出登录</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.navigation-bar {
	height: var(--v3-navigationbar-height);
	overflow: hidden;
	background: #fff;
	// box-shadow: 0px 0 10px 0px black;
	border-bottom: 1px solid rgba(0, 0, 0, 0.2);
	.left-menu {
		float: left;
		height: 100%;
		line-height: 50px;
		margin-left: 20px;

		&:focus {
			outline: none;
		}

		.left-menu-item {
			display: inline-block;
			padding: 0 16px 0 0;
			height: 100%;
			// width: 100px;
			font-size: 16px;
			color: #263445;
			vertical-align: text-bottom;

			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				&:hover {
					background: rgba(0, 0, 0, 0.1);
				}
			}
		}
	}
	.right-menu {
		float: right;
		margin-right: 10px;
		height: 100%;
		display: flex;
		align-items: center;
		color: #606266;
		.right-menu-item {
			padding: 0 10px;
			cursor: pointer;
			.right-menu-avatar {
				display: flex;
				align-items: center;
				.el-avatar {
					margin-right: 10px;
				}
				span {
					font-size: 16px;
				}
			}
		}
	}
}
</style>
