const SYSTEM_NAME = "firecloud"

/** 缓存数据时用到的 Key */
class CacheKey {
  static TOKEN = `${SYSTEM_NAME}-token-key`
  static SIDEBAR_STATUS = `${SYSTEM_NAME}-sidebar-status-key`
  static ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name-key`
  static USER_ID = `${SYSTEM_NAME}-user-id`
  static PROJECT_ID = `${SYSTEM_NAME}-project-id`
}

export default CacheKey
