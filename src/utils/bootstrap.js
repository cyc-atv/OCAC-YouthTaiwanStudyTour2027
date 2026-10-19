// 取得 Bootstrap 的 JS 類別（Modal、Collapse…）
// 只能在瀏覽器裡呼叫（例如點擊事件、onMounted 裡），build 時沒有 document。
// main.js 已經載入過同一個檔案，這裡不會重複下載。
export async function getBootstrap() {
  const mod = await import('bootstrap/dist/js/bootstrap.bundle.min.js')
  return mod.default ?? mod
}