<script setup>
import { useId } from 'vue'
import NewsItem from './NewsItem.vue'

defineProps({
  items: { type: Array, default: () => [] },
})

// Vue 自動產生、整頁唯一的 id，給 accordion 的 data-bs-parent 用
const accordionId = useId()
</script>

<template>
  <div v-if="items.length" :id="accordionId" class="accordion accordion-flush border border-1">
    <NewsItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      :parent-id="accordionId"
    />
  </div>
</template>