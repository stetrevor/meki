<template>
  <div :class="['app-typography', ...colorClasses]">
    <p class="theme-typography-headline1">Headline 1</p>
    <p class="theme-typography-headline2">Headline 2</p>
    <p class="theme-typography-headline3">Headline 3</p>
    <p class="theme-typography-headline4">Headline 4</p>
    <p class="theme-typography-headline5">Headline 5</p>
    <p class="theme-typography-body1">Body 1</p>
    <p class="theme-typography-body2">Body 2</p>
    <p class="theme-typography-overline">Overline</p>
  </div>
</template>

<script>
export default {
  name: 'AppTypography',

  props: {
    colors: {
      type: String,
      default: 'primary background',
    },
  },

  computed: {
    colorClasses() {
      const [fg, bg] = this.colors.split(' ')
      console.log(fg, bg)
      return [`theme-text-color-${fg}`, `theme-bg-color-${bg}`]
    },
  },
}
</script>

<style lang="scss">
.app-typography {
  margin: 20px;
  border-radius: 4px;
  padding: 40px;
  box-shadow: 0 0 4px;
}
</style>
