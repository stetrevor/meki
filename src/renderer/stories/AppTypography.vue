<template>
  <div :class="['app-typography', ...colorClasses]">
    <mdc-text typo="headline1">Headline 1</mdc-text>
    <mdc-text typo="headline2">Headline 2</mdc-text>
    <mdc-text typo="headline3">Headline 3</mdc-text>
    <mdc-text typo="headline4">Headline 4</mdc-text>
    <mdc-text typo="headline5">Headline 5</mdc-text>
    <mdc-text typo="headline6">Headline 6</mdc-text>
    <mdc-text typo="subtitle1">Subtitle 1</mdc-text>
    <mdc-text typo="subtitle2">Subtitle 2</mdc-text>
    <mdc-text typo="body1">Body 1</mdc-text>
    <mdc-text typo="body2">Body 2</mdc-text>
    <mdc-text typo="caption">Caption</mdc-text>
    <mdc-text typo="button">Button</mdc-text>
    <mdc-text typo="overline">Overline</mdc-text>
  </div>
</template>

<script>
export default {
  name: 'AppTypography',

  props: {
    colors: {
      type: String,
      default: 'background background',
    },
  },

  computed: {
    colorClasses() {
      const [bg, fg] = this.colors.split(' ')
      return [`mdc-theme--${bg}`, `mdc-theme--on-${fg}`]
    },
  },
}
</script>

<style lang="scss">
.app-typography {
  border-radius: 4px;
  padding: 40px;
}
</style>
