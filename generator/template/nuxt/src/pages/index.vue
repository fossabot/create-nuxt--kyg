<template>
    <div id="index">
        <h1><% if((typeof nuxtModules) !== 'undefined' && nuxtModules.includes('nuxt-i18n')) { %>{{ $t('title') }}<% } else { %>Hello Vue!<% } %></h1>
    </div>
</template>

<script<% if(language === 'ts') { %> lang="ts"<% } %>>
export default {
  name: 'Index'
}
</script>
