<template>
    <div id="top">
        <nuxt v-if="!$slots.default"/>
        <slot/>
    </div>
</template>

<script<% if(language === 'ts') { %> lang="ts"<% } %>>
export default {
  name: 'Layout'
}
</script>
