<script setup>
import { computed } from 'vue'

const props = defineProps({
    topGapLevel: {
        type: Number,
        default: 1
    },
    bottomGapLevel: {
        type: Number,
        default: 1
    }
})

const clamp = (n) => Math.min(5, Math.max(1, Math.round(Number(n) || 3)))

const gapClass = computed(() => [
    `mt-${clamp(props.topGapLevel)}`,
    `mb-${clamp(props.bottomGapLevel)}`
])
</script>

<template>
    <section class="section-block container" :class="gapClass">
        <slot></slot>
    </section>
</template>