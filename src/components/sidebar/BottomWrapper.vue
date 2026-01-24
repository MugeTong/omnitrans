<script setup lang="ts">
const props = defineProps({
    //是否增加分割线
    separator: {
        type: Boolean,
        default: true
    }
});
</script>

<template>
    <div class="bottom-wrapper">
        <div v-if="separator" class="separator"></div>
        <slot />
    </div>
</template>

<style scoped>
.bottom-wrapper {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    gap: 8px;
}

.separator {
    width: 2px;
    margin: 12px 0px;
    height: calc(100% - 24px);
    background-color: var(--color-separator);
    border-radius: 1px;
}
</style>
