<script setup>
import { computed } from 'vue'
import { useTourData } from '@/composables/useSession'
import { usePlaceModal } from '@/composables/usePlaceModal'
import NewsList from './NewsList.vue'

const props = defineProps({
  session: { type: Object, required: true }, // sessions 陣列裡的其中一個梯次
})

const { getSchedule, getNews, getGallery } = useTourData()
const { openPlace } = usePlaceModal()

// session 改變時會自動重新計算
const schedule = computed(() => getSchedule(props.session.id)) // 沒排行程時是 null
const news = computed(() => getNews(props.session.id))
const gallery = computed(() => getGallery(props.session.id))
</script>

<template>
  <article :id="session.anchors.root" class="container my-5">
    <hgroup>
      <h1>{{ session.nameZh }}：{{ session.area }}</h1>
      <p class="mb-0">
        {{ session.ordinal.num }}<sup>{{ session.ordinal.suffix }}</sup> Session: {{ session.areaEn }}
      </p>
      <p>{{ session.dateRangeZh }}</p>
    </hgroup>

    <!-- 舉辦資訊 -->
    <div :id="session.anchors.info" class="mb-4">
      <h2>舉辦資訊</h2>
      <ul>
        <li>報名日期：{{ session.registerRangeZh }}</li>
        <li>招收名額：{{ session.quota }}名</li>
      </ul>

      <div v-if="session.isCancelled" class="p-3 my-2 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
        <p class="m-0">本梯次已取消</p>
      </div>
      <template v-else>
        <div v-if="session.link" class="d-flex justify-content-center">
          <a class="btn btn-primary btn-lg my-2" :href="session.link" target="_blank" rel="noopener">招生簡章看這裡！</a>
        </div>
        <div v-if="session.isEnded" class="p-3 my-2 text-info-emphasis bg-info-subtle border border-info-subtle rounded-3">
          <p class="m-0">本梯次已成功結束，感謝各位學員參與。</p>
        </div>
      </template>
    </div>

    <!-- 取消的梯次到這裡就結束 -->
    <template v-if="!session.isCancelled">
      <!-- 最新消息：有才顯示 -->
      <div v-if="news.length" class="mb-4">
        <h2>最新消息</h2>
        <NewsList :items="news" />
      </div>

      <!-- 行程表 -->
      <div :id="session.anchors.schedule" class="mb-4">
        <h2>行程表</h2>

        <p v-if="!schedule" class="text-muted">敬請期待</p>

        <template v-else>
          <div class="p-3 my-2 text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3">
            <p class="m-0">◎本行程及內容，僑務委員會保留依實際執行情形調整之權利。</p>
          </div>

          <div :id="`${session.anchors.schedule}Accordion`" class="accordion accordion-flush border border-1">
            <div v-for="day in schedule" :key="day.id" class="accordion-item">
              <h3 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        :data-bs-target="`#${day.id}`" aria-expanded="false" :aria-controls="day.id">
                  {{ day.dateZh }}（{{ day.weekdayZh }}）
                  <small class="ps-2 text-secondary">{{ day.dateEn }} ({{ day.weekdayEn }})</small>
                </button>
              </h3>
              <div :id="day.id" class="accordion-collapse collapse"
                   :data-bs-parent="`#${session.anchors.schedule}Accordion`">
                <div class="accordion-body">
                  <!-- 各時段 -->
                  <section v-for="section in day.sections" :key="section.slot" class="mb-3">
                    <h4>{{ section.label.zh }}</h4>
                    <div v-for="(item, i) in section.items" :key="i" class="mb-2">
                      <h5 v-if="item.title" class="h6 mb-1">{{ item.title }}</h5>
                      <p class="mb-0">
                        <!-- place.json 有介紹的景點：可點開 Modal -->
                        <button v-if="item.placeId" type="button" class="btn btn-link p-0 align-baseline text-start"
                                @click="openPlace(item.placeId, item.place, item.placeEn)">
                          {{ item.place }}<i class="bi bi-info-circle ms-1 small"></i>
                        </button>
                        <template v-else>{{ item.place }}</template>
                        <small class="ps-2 text-secondary">{{ item.placeEn }}</small>
                      </p>
                      <p v-if="item.intro" class="intro mb-0">
                        {{ item.intro }}<small v-if="item.introEn" class="ps-2 text-secondary">{{ item.introEn }}</small>
                      </p>
                    </div>
                  </section>

                  <!-- 住宿 -->
                  <h4 class="mt-2">住宿</h4>
                  <p v-for="(acc, i) in day.accommodation" :key="i" class="mb-0">
                    <a v-if="acc.url" :href="acc.url" target="_blank" rel="noopener">{{ acc.place }}</a>
                    <template v-else>{{ acc.place }}</template>
                    <small class="ps-2 text-secondary">{{ acc.placeEn }}</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- 花絮：有照片才顯示 -->
      <div v-if="gallery.length" :id="session.anchors.photo" class="mb-4">
        <h2>花絮</h2>
        <div class="row g-3">
          <div v-for="(photo, i) in gallery" :key="i" class="col-12 col-md-6">
            <div class="card h-100">
              <img :src="photo.src" :alt="photo.description" class="card-img-top gallery-img" loading="lazy">
              <div class="card-body">
                <h3 class="card-title h6 mb-0">
                  {{ photo.description }}<br>
                  <small class="text-secondary">{{ photo.descriptionEn }}</small>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </article>
</template>

<style scoped>
.intro {
  white-space: pre-line;
}

.gallery-img {
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
</style>