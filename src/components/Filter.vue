<template>
  <select @change="$emit('change', $event)">
    <option selected value="">Все</option>
    <option
      v-for="(value, i) of values"
      :key="i"
    >
      {{value}}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    values: Array,
  },
}
</script>
