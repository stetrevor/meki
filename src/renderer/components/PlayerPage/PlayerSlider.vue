<template>
  <div class="player-slider" 
       @click="setValue">
    <div :style="valueStyle" 
         class="player-slider__value"/>
    <div ref="thumb" 
         :style="thumbStyle"
         class="player-slider__thumb"
         @mousedown="dragging = true"/>
    <div class="player-slider__label"/>
  </div>
</template>

<script>
export default {
  name: 'PlayerSlider',

  props: {
    initialValue: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },

    discrete: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      dragging: false,
      value: this.initialValue,
      thumbStyle: '',
      valueStyle: '',
    }
  },

  watch: {
    initialValue: {
      immediate: true,
      handler(newValue) {
        this.setThumbAndValueStyle(newValue)
      },
    },

    value: {
      immediate: true,
      handler(newValue) {
        this.setThumbAndValueStyle(newValue)
        this.$emit('value-changed', newValue)
      },
    },
  },

  mounted() {
    this.rect = this.$el.getBoundingClientRect()

    document.body.addEventListener('mouseup', e => {
      this.dragging = false
    })

    document.body.addEventListener('mousemove', e => {
      if (this.dragging) {
        this.setValue(e)
      }
    })
  },

  methods: {
    setValue(e) {
      const { clientX, clientY } = e
      const movedLeft = clientX - this.rect.left
      const left = Math.min(this.rect.width, Math.max(movedLeft, 0))
      const value = (left / this.rect.width) * this.max

      this.value = this.discrete ? Math.round(value) : value
    },

    setThumbAndValueStyle(value) {
      this.thumbStyle = `left: ${(value / this.max) * 100}%`
      this.valueStyle = `width: ${(value / this.max) * 100}%`
    },
  },
}
</script>

<style lang="scss">
@import '../../theme';

.player-slider {
  box-sizing: border-box;
  border-radius: 2px;
  border-left: 24px solid transparent;
  border-right: 24px solid transparent;
  width: 100%;
  height: 48px;
  position: relative;
  cursor: pointer;

  &::before {
    position: absolute;
    top: 20px;
    left: 0;
    content: '';
    border-radius: 2px;
    width: 100%;
    height: 8px;
    @include theme-bg-color-background();
    opacity: 0.54;
  }

  &__value {
    position: absolute;
    left: 0;
    top: 20px;
    border-radius: 2px;
    height: 8px;
    @include theme-bg-color-secondary();
  }

  &__thumb {
    position: absolute;
    top: 14px;
    left: 0;
    width: 16px;
    height: 20px;
    transform: translateX(-50%);

    &::before {
      content: '';
      border-radius: 8px;
      width: 48px;
      height: 48px;
      position: absolute;
      left: -16px;
      top: -14px;
      @include theme-bg-color-secondary();
      opacity: 0;
      transition: opacity 100ms $mdc-animation-standard-curve-timing-function;
      will-change: opacity;
    }

    &::after {
      content: '';
      border-radius: 2px;
      width: 16px;
      height: 20px;
      position: absolute;
      left: 0;
      top: 0;
      @include theme-bg-color-background();
    }

    &:hover::before {
      opacity: 0.38;
    }

    &:active::before {
      opacity: 0.54;
    }
  }
}
</style>
