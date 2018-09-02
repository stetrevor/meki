<template>
  <div :class="{ 'icon-toggle-button': true, 'icon-toggle-button--toggling': toggling }" 
       @click="toggled = !toggled">
    <transition name="cross-fade" 
                mode="out-in"
                @before-leave="toggling = true"
                @after-enter="toggling = false">
      <svg :key="toggled" 
           class="icon-toggle-button__icon">
        <use :xlink:href="`#icon-${toggled ? iconToggled : iconNormal}`" 
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
  },

  data() {
    return {
      toggled: false,
      toggling: false,
    }
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
  cursor: pointer;

  &__icon {
    width: 24px;
    height: 24px;
    opacity: 0.54;
    position: relative;
  }

  &::before {
    content: '';
    border-radius: 8px;
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

.cross-fade-enter,
.cross-fade-leave-to {
  opacity: 0;
}
.cross-fade-enter-to,
.cross-fade-leave {
  opacity: 1;
}
.cross-fade-enter-active {
  transition: opacity 125ms $mdc-animation-deceleration-curve-timing-function;
}
.cross-fade-leave-active {
  transition: opacity 75ms $mdc-animation-acceleration-curve-timing-function;
}
</style>
