<template>
  <div :class="['icon-toggle-button', { 'icon-toggle-button--toggling': toggling }]" 
       @click="toggled_ = !toggled_">
    <transition name="fade-out-in" 
                mode="out-in"
                @before-leave="toggling = true"
                @after-enter="toggling = false">
      <svg :key="toggled_" 
           class="icon-toggle-button__icon">
        <use :xlink:href="`#icon-${toggled_ ? iconToggled : iconNormal}`" 
        />
      </svg>
    </transition>
  </div>
</template>

<script>
import IconButton from './IconButton'

export default {
  name: 'IconToggleButton',

  components: { IconButton },

  props: {
    iconNormal: {
      type: String,
      required: true,
    },

    iconToggled: {
      type: String,
      required: true,
    },

    toggled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      toggled_: false,
      toggling: false,
    }
  },

  watch: {
    toggled: {
      immediate: true,
      handler(newValue) {
        this.toggled_ = newValue
      },
    },
  },
}
</script>

<style lang="scss">
@import '../../theme';

.icon-toggle-button {
  border-radius: 8px;
  width: 48px;
  height: 48px;
  @include theme-text-color-on-primary();
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &__icon {
    width: 24px;
    height: 24px;
    opacity: 0.54;
    position: relative;
  }

  &::before {
    content: '';
    width: 48px;
    height: 48px;
    position: absolute;
    @include theme-bg-color-background();
    opacity: 0;
    transition: opacity 100ms $mdc-animation-standard-curve-timing-function;
    will-change: opacity;
  }

  &:hover {
    &::before {
      opacity: 0.38;
    }

    .icon-toggle-button__icon {
      opacity: 1;
    }
  }

  &--toggling {
    &::before {
      opacity: 0.54 !important;
    }
  }
}
</style>
