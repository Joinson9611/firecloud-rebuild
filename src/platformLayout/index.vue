<script lang="ts" setup>
import { computed } from "vue"
import { useAppStore, DeviceType } from "@/store/modules/app"
import { useSettingsStore } from "@/store/modules/settings"
import { AppMain, NavigationBar, Settings, Sidebar, RightPanel } from "./components"
import useResize from "./hooks/useResize"

const appStore = useAppStore()
const settingsStore = useSettingsStore()

/** Layout 布局响应式 */
useResize()

const classObj = computed(() => {
  return {
    hideSidebar: !appStore.sidebar.opened,
    openSidebar: appStore.sidebar.opened,
    withoutAnimation: appStore.sidebar.withoutAnimation,
    mobile: appStore.device === DeviceType.Mobile,
  }
})


</script>

<template>
  <div :class="classObj" class="app-wrapper">
    <NavigationBar />
    <AppMain />
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  width: 100%;
}

.showGreyMode {
  filter: grayscale(1);
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: var(--v3-sidebar-width);
  position: relative;
}


</style>
