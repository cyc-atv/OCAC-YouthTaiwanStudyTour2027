<script setup>
defineProps({
  item: { type: Object, required: true }, // useTourData 整理好的一則新聞
  parentId: { type: String, required: true }, // 外層 accordion 的 id
})
</script>

<template>
  <div class="accordion-item">
    <h3 class="accordion-header">
      <button
        class="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="`#${item.id}`"
        aria-expanded="false"
        :aria-controls="item.id"
      >
        <i v-if="item.mark" class="bi pe-1 fw-bold" :class="[item.mark.icon, item.mark.cls]"></i>
        {{ item.title }}
      </button>
    </h3>
    <div :id="item.id" class="accordion-collapse collapse" :data-bs-parent="`#${parentId}`">
      <div class="accordion-body">
        <div class="news-content">{{ item.content }}</div>
        <img v-if="item.image" :src="item.image" :alt="item.title" class="img-fluid rounded my-2 mx-auto d-block">
        <p v-if="item.link">
          <a :href="item.link" class="btn btn-outline-primary my-2" target="_blank" rel="noopener">詳細資訊</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-content {
  white-space: pre-line; /* 讓資料裡的 \n 顯示成換行 */
}
</style>