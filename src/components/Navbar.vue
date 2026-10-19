<script setup>
import { ref } from 'vue'
import { useTourData } from '@/composables/useSession'
import { getBootstrap } from '@/utils/bootstrap'

const { sessions, getSchedule, getGallery } = useTourData()

// 每個梯次的下拉選單項目（沒有資料的區塊不列出來）
const menuFor = (s) => [
  { label: '舉辦資訊', href: `#${s.anchors.info}` },
  { label: '行程表', href: `#${s.anchors.schedule}` },
  ...(getGallery(s.id).length ? [{ label: '花絮', href: `#${s.anchors.photo}` }] : []),
]

// 手機版：點了選單裡的連結後，自動收起選單
const collapseRef = ref(null)
async function closeOnNavigate(event) {
  const link = event.target.closest('a[href^="#"]')
  if (!link || link.classList.contains('dropdown-toggle')) return
  if (!collapseRef.value?.classList.contains('show')) return
  const { Collapse } = await getBootstrap()
  Collapse.getOrCreateInstance(collapseRef.value, { toggle: false }).hide()
}
</script>

<template>
  <nav class="main-nav navbar navbar-expand-xl p-2 sticky-top text-bg-light">
    <div class="navbar-brand">
      <slot name="brand"></slot>
    </div>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar"
            aria-controls="mainNavbar" aria-expanded="false" aria-label="切換選單">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div id="mainNavbar" ref="collapseRef" class="collapse navbar-collapse justify-content-end">
      <ul class="navbar-nav" @click="closeOnNavigate">
        <li class="nav-item"><a class="nav-link" href="#about">關於觀摩團</a></li>
        <li class="nav-item"><a class="nav-link" href="#news">最新消息</a></li>

        <template v-for="s in sessions" :key="s.id">
          <!-- 已取消：單純連結 -->
          <li v-if="s.isCancelled" class="nav-item">
            <a class="nav-link text-secondary" :href="`#${s.anchors.root}`">{{ s.nameZh }}（已取消）</a>
          </li>

          <!-- 尚未排行程：單純連結 -->
          <li v-else-if="!getSchedule(s.id)" class="nav-item">
            <a class="nav-link" :href="`#${s.anchors.root}`">{{ s.nameZh }}</a>
          </li>

          <!-- 一般梯次：下拉選單 -->
          <li v-else class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ s.nameZh }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li v-for="m in menuFor(s)" :key="m.href">
                <a class="dropdown-item" :href="m.href">{{ m.label }}</a>
              </li>
            </ul>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>