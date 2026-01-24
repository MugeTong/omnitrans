<script setup lang="ts">
import { computed, ref, type DefineComponent, type PropType, type ComponentPublicInstance } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  icon: {
    type: Object as DefineComponent<{}, {}, any> | null | PropType<any>,
    required: true,
  },
  description: {
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

const showTooltip = ref(false);
const tooltipStyle = ref({ top: '0px', left: '0px' });
const itemRef = ref<ComponentPublicInstance | null>(null);

const onMouseEnter = () => {
  if (itemRef.value && itemRef.value.$el) {
    const el = itemRef.value.$el as HTMLElement;
    const rect = el.getBoundingClientRect();
    tooltipStyle.value = {
      top: `${rect.bottom + 8}px`,
      left: `${rect.left + rect.width / 2}px`
    };
    showTooltip.value = true;
  }
};

const onMouseLeave = () => {
  showTooltip.value = false;
};
</script>

<template>
  <router-link
    ref="itemRef"
    :to="{ name: props.routerName }"
    :class="['sidebar-item', { active: isActive }]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    draggable="false"
  >
    <component :is="icon" class="sidebar-item-icon" />
  </router-link>

  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showTooltip" class="custom-tooltip" :style="tooltipStyle">
        {{ props.description }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sidebar-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 4px;
  transition: background-color 0.2s;
  /* 正常鼠标箭头 */
  cursor: default;
  color: var(--color-text);
  text-decoration: none;
}

.sidebar-item:hover {
  background-color: var(--color-bg-hover);
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
  width: 1rem;
}

.sidebar-item-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text);
}

.custom-tooltip {
  position: fixed;
  transform: translateX(-50%);
  background-color: var(--color-bg-base);
  color: var(--color-text);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  pointer-events: none;
  border: 1px solid var(--color-border-hard);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
