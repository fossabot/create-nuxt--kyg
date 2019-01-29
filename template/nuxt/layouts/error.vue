<template>
  <div id="error">
    <h2> {{ error.statusCode }} </h2>
    <p>{{ error.message }}</p>
  </div>
</template>

<script>
export default {
  name: 'Error',
  props: {
    error: {
      type: Object,
      required: true
    }
  }
}
</script>
