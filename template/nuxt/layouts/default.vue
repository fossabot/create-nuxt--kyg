<template>
  <div id="top">
    <nuxt v-if="!$slots.default" />
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Layout'
}
</script>
