<template>
  <svg class="base-icon">
    <use :xlink:href="`#icon-${icon}`"/>
  </svg>
</template>

<script>
export default {
  name: 'BaseIcon',

  props: {
    icon: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss">
.base-icon {
  width: 24px;
  height: 24px;
}
</style>
