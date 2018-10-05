<template>
  <div :class="['icon-button', { 'icon-button--disabled': disabled }]"
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
  },
}
</script>

<style lang="scss">
@import '../../theme';

.icon-button {
  border-radius: 8px;
  width: 48px;
  height: 48px;
  @include theme-text-color-on-primary();
  display: flex;
  align-items: center;
  justify-content: center;

  &:not(&--disabled) {
    cursor: pointer;

    &:hover {
      @include theme-bg-color-background(0.08);
    }

    &:focus {
      @include theme-bg-color-background(0.24);
    }

    &:active {
      @include theme-bg-color-background(0.32);
    }
  }

  &--disabled {
    opacity: 0.38;
  }

  &__icon {
    width: 24px;
    height: 24px;
  }
}
</style>
