// 景點介紹 Modal 的共用狀態
// 任何元件呼叫 openPlace() 都會打開同一個 <PlaceModal>。

import { shallowRef } from 'vue'
import { getPlace } from '@/composables/useSession'
import { getBootstrap } from '@/utils/bootstrap'

// 放在函式外面 → 整個網站共用同一份
const current = shallowRef(null) // { name, nameEn, image, paragraphs }
let modalEl = null

export function usePlaceModal() {
  /** PlaceModal 掛載後把自己的 DOM 元素登記進來 */
  function registerModal(el) {
    modalEl = el
  }

  /** 打開某個景點的介紹 */
  async function openPlace(placeId, name, nameEn = '') {
    // 點擊一定發生在瀏覽器裡，這裡讀 navigator 是安全的
    const lang = navigator.language || 'zh-TW'
    const place = getPlace(placeId, lang)
    if (!place || !modalEl) return

    current.value = { ...place, name, nameEn }

    const { Modal } = await getBootstrap()
    Modal.getOrCreateInstance(modalEl).show()
  }

  return { current, openPlace, registerModal }
}