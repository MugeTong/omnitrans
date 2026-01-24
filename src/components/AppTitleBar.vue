<script setup lang="ts">
const props = defineProps({
  useBottomBorder: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="title-bar drag-region" :class="{ 'with-bottom-border': useBottomBorder }">
    <!-- 标题部分 -->
    <div class="logo-area">
      <img class="logo" src="/logo.svg" alt="Omnitrans Logo" />
      <div class="title">Omnitrans</div>
    </div>

    <!-- 主体部分 -->
    <div class="title-bar-main">
      <div class="main-left no-drag">
        <slot name="left"> </slot>
      </div>
      <div class="main-center">
        <slot name="center"> </slot>
      </div>
      <div class="main-right no-drag">
        <slot name="right"></slot>
      </div>
    </div>

    <!-- 右侧的应用级按钮的覆盖层的占位符 -->
    <div class="overlay-placeholder no-drag"></div>
  </div>

  <!-- 缩小、放大和关闭控件 -->
</template>

<style scoped>
.title-bar {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  position: relative;
}
.title-bar.with-bottom-border {
  height: 47px;
  border-bottom: 1px solid var(--color-border);
}

.logo-area {
  display: flex;
  align-items: center;

  .logo {
    width: 28px;
    height: 28px;
    margin-right: 10px;
    filter: drop-shadow(0 1px 2px rgba(222, 222, 222, 0.15));
    transition: transform 0.2s;
  }

  .title {
    color: var(--color-text-title);
    font-size: 1.2rem;
    font-weight: 600;
    text-align: center;
    letter-spacing: 1px;
  }
}

.overlay-placeholder {
  height: 36px;
  width: 134px;
}

.title-bar-main {
  padding: 0 8px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-bar-main .main-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.title-bar-main .main-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-bar-main .main-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.drag-region {
  /* allow the user to drag the window by dragging on this element */
  -webkit-app-region: drag;
  user-select: none;
}

.no-drag {
  /* prevent the user from dragging the window by dragging on this element */
  -webkit-app-region: no-drag;
}
</style>
