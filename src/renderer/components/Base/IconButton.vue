<template>
  <div :class="['icon-button', `icon-button--theme-${theme}`, { 'icon-button--disabled': disabled }]"
       @click="disabled ? '' : $emit('clicked')">
    <transition name="fade-out-in" 
                mode="out-in">
      <svg :key="toggled" 
           class="icon-button__icon">
        <use :xlink:href="`#icon-${toggled ? iconToggled : icon}`" 
        />
      </svg>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'IconButton',

  props: {
    icon: {
      type: String,
      required: true,
    },

    iconToggled: {
      type: String,
      default: '',
    },

    toggled: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    theme: {
      type: String,
      /* Applicable values are:
       *  'on-primary', 'on-primary-lighter', 'on-secondary', 'on-background',
       *  'primary', 'primary-lighter', 'secondary'.
       */
      default: 'on-primary',
    },
  },
}
</script>

<style lang="scss">
@import '../../theme';

@mixin icon-button-theme($theme) {
  &--theme-#{$theme}:not(&--disabled) {
    @include theme-text-color($theme);

    &:hover {
      background-color: rgba(map-get($theme-text-color-map, $theme), 0.08);
    }

    &:focus {
      background-color: rgba(map-get($theme-text-color-map, $theme), 0.24);
    }

    &:active {
      background-color: rgba(map-get($theme-text-color-map, $theme), 0.32);
    }
  }

  &--theme-#{$theme}#{&}--disabled {
    @include theme-text-color($theme, 0.38);
  }
}

.icon-button {
  border-radius: 8px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: background-color, color;
  transition-property: background-color, color;
  transition-duration: 100ms;
  transition-timing-function: $mdc-animation-sharp-curve-timing-function;

  &:not(&--disabled) {
    cursor: pointer;
  }

  @each $theme in 'on-primary', 'on-primary-lighter', 'on-secondary',
    'on-background', 'primary', 'primary-lighter', 'secondary'
  {
    @include icon-button-theme($theme);
  }

  &__icon {
    width: 24px;
    height: 24px;
  }
}
</style>
