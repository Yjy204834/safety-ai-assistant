﻿﻿﻿﻿﻿﻿﻿﻿﻿<template>
  <view class="app-layout">
    <CustomNavbar :title="title" :showBack="showBack">
      <slot name="navbar"></slot>
    </CustomNavbar>
    <view class="layout-content">
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import CustomNavbar from './CustomNavbar.vue'

defineProps<{
  title: string
  showBack?: boolean
}>()
</script>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  position: relative;
  background: $bg-gradient;
}

.layout-content {
  padding-top: 88px;
  min-height: 100vh;
}
</style>
