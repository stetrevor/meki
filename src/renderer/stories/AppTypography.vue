<template>
  <div :class="['app-typography', ...colorClasses]">
    <p class="typography-headline1">Headline 1</p>
    <p class="typography-headline2">Headline 2</p>
    <p class="typography-headline3">Headline 3</p>
    <p class="typography-headline4">Headline 4</p>
    <p class="typography-headline5">Headline 5</p>
    <p class="typography-body1">Body 1</p>
    <p class="typography-body2">Body 2</p>
    <p class="typography-overline">Overline</p>
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
      return [`text-color-${fg}`, `bg-color-${bg}`]
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
