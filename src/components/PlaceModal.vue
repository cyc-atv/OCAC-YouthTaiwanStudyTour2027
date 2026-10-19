<script setup>
import { ref, onMounted } from 'vue'
import { usePlaceModal } from '@/composables/usePlaceModal'

const { current, registerModal } = usePlaceModal()
const modalRef = ref(null)

onMounted(() => registerModal(modalRef.value))
</script>

<template>
  <div ref="modalRef" class="modal fade" tabindex="-1" aria-labelledby="placeModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="placeModalTitle" class="modal-title fs-5 fw-bold">
            {{ current?.name }}
            <small v-if="current?.nameEn" class="ps-2 fw-normal text-secondary">{{ current.nameEn }}</small>
          </h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉"></button>
        </div>
        <div class="modal-body">
          <template v-if="current">
            <p v-for="(line, i) in current.paragraphs" :key="i">{{ line }}</p>
            <img v-if="current.image" :src="current.image" :alt="current.name" class="img-fluid rounded mb-3 mx-auto d-block">
          </template>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>