<script setup lang="ts">
import { computed, type DefineComponent, type PropType } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  routerName: {
    type: String,
    required: true,
  },
});

// 检查当前的路由是否与routerName匹配
const route = useRoute();
const isActive = computed(() => {
  return props.routerName ? route.name === props.routerName : false;
});
</script>

<template>
  <router-link :to="{ name: props.routerName }" :class="['sidebar-item', { active: isActive }]" draggable="false">
    <span class="sidebar-item-name">{{ name }}</span>
  </router-link>
</template>

<style scoped>
.sidebar-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
  /* 正常鼠标箭头 */
  cursor: default;
  color: var(--color-text);
  text-decoration: none;
}

.sidebar-item:hover {
  background-color: var(--color-btn-hover);
}

.sidebar-item-name {
  user-select: none;
}

.sidebar-item::before{
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 3px;
  height: 3px;
  width: 0px;
  background-color: var(--color-accent);
  border-radius: 2px;
  transition: width .1s;
}


.sidebar-item.active::before {
  width: 16px;
}

</style>
