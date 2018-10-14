<template>
  <div class="base-slider"
       @mouseenter.capture="onMouseEnter"
       @mousemove.capture="onMouseMove"
       @mouseout.capture="onMouseOut"
       @click.capture="onClick">
    <div ref="track" 
         class="base-slider__track" />

    <div :style="valueStyle" 
         class="base-slider__value"/>

    <div ref="thumb" 
         :style="thumbStyle"
         class="base-slider__thumb"
         @mousedown="dragging = true"/>

    <transition name="fade-out-in" 
                mode="out-in">
      <div v-show="hovered" 
           :style="labelStyle"
           class="base-slider__label">{{ label }}</div>
    </transition>
  </div>
</template>

<script>
import { fromEvent } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'

export default {
  name: 'BaseSlider',

  props: {
    value: {
      type: Number,
      required: true,
    },

    step: {
      type: Number, // Integer
      default: 1,
    },

    max: {
      type: Number,
      required: true,
    },

    discrete: {
      type: Boolean,
      default: false,
    },

    format: {
      type: Function,
      default: v => v,
    },
  },

  data() {
    return {
      dragging: false,
      hovered: false,
      value_: this.value,
      thumbStyle: '',
      valueStyle: '',
      labelStyle: '',
      label: '',
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.setThumbAndValueStyle(newValue)
      },
    },

    value_: {
      immediate: true,
      handler(newValue) {
        this.setThumbAndValueStyle(newValue)
        this.$emit('value-changed', newValue)
      },
    },
  },

  mounted() {
    this.rect = this.$refs.track.getBoundingClientRect()

    this.mouseup = e => {
      this.dragging = false
    }

    this.mousemove = e => {
      if (this.dragging) {
        this.setValue(e)
      }
    }

    document.body.addEventListener('mouseup', this.mouseup)
    document.body.addEventListener('mousemove', this.mousemove)

    // Update track bounding box when window resizes.
    this.resize = e => {
      this.rect = this.$refs.track.getBoundingClientRect()
    }
    this.$subscribeTo(
      fromEvent(window, 'resize').pipe(
        debounceTime(200),
        map(this.resize),
      ),
    )
  },

  beforeDestroy() {
    document.body.removeEventListener('mouseup', this.mouseup)
    document.body.removeEventListener('mousemove', this.mousemove)
  },

  methods: {
    getValueFromMousePosition(e) {
      const movedLeft = e.clientX - this.rect.left
      const left = Math.min(this.rect.width, Math.max(movedLeft, 0))
      const value = (left / this.rect.width) * this.max

      return this.discrete ? Math.round(value / this.step) * this.step : value
    },

    setValue(e) {
      this.value_ = this.getValueFromMousePosition(e)
    },

    setThumbAndValueStyle(value) {
      this.thumbStyle = `left: ${(value / this.max) * 100}%`
      this.valueStyle = `width: ${(value / this.max) * 100}%`
    },

    setLabel(value) {
      this.label = this.format(value).toString()
    },

    setLabelStyle(value) {
      this.labelStyle = `left: ${(value / this.max) * 100}%`
    },

    updateLabel(e) {
      const value = this.getValueFromMousePosition(e)
      this.setLabel(value)
      this.setLabelStyle(value)
    },

    onMouseEnter(e) {
      if (e.target !== this.$el) {
        this.hovered = true
      }
    },

    onMouseMove(e) {
      if (e.target !== this.$el) {
        this.updateLabel(e)
      }
    },

    onMouseOut(e) {
      if (e.target !== this.$el) {
        this.hovered = false
      }
    },

    onClick(e) {
      if (e.target !== this.$el) {
        this.setValue(e)
      }
    },
  },
}
</script>

<style lang="scss">
@import '../../theme';

.base-slider {
  box-sizing: border-box;
  border-left: 24px solid transparent;
  border-right: 24px solid transparent;
  width: 100%;
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;

  &__track {
    border-radius: 2px;
    width: 100%;
    height: 8px;
    @include theme-bg-color-background();
    opacity: 0.54;
    cursor: pointer;
  }

  &__value {
    position: absolute;
    left: 0;
    top: 20px;
    border-radius: 2px;
    height: 8px;
    @include theme-bg-color-secondary();
    cursor: pointer;
  }

  &__thumb {
    position: absolute;
    top: 14px;
    left: 0;
    width: 16px;
    height: 20px;
    transform: translateX(-50%);
    cursor: pointer;

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

  &__label {
    position: absolute;
    top: -8px;
    transform: translate(-50%, -100%);
    box-sizing: border-box;
    border-radius: 8px;
    padding: 0 16px;
    min-width: 48px;
    width: fit-content;
    height: 48px;
    @include theme-typography-body2();
    @include theme-text-color-on-background();
    @include theme-bg-color-background();
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
