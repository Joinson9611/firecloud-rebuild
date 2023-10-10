/** 免登录白名单 */
const whiteList = ["/login","/test","/taskcr/form"]

export { whiteList }

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});
}
