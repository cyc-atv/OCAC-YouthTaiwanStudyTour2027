<script setup></script>

<template>
    <header class="site-header">
        <slot></slot>
    </header>
</template>

<style scoped>
.site-header :slotted(img) {
    height: auto;
    width: 100%;
    display: block;
}
</style>