<template>
  <div class="subtitle-menu">
    <div v-if="subtitles.length" 
         class="subtitle-menu__subtitles">
      <div v-for="subtitle in subtitles" 
           :key="subtitle._id" 
           :class="['subtitle-menu__subtitle', { 'subtitle-menu__subtitle--active': activeSubtitle._id === subtitle._id }]">
        <icon-button :toggled="activeSubtitle._id === subtitle._id" 
                     :radio="true" 
                     :class="['subtitle-menu__radio', { 'subtitle-menu__radio--active': activeSubtitle._id === subtitle._id }]"
                     icon="radio-unchecked"
                     icon-toggled="radio-checked"
                     @clicked.stop="activeSubtitle = subtitle; $emit('active-subtitle-changed', activeSubtitle)"/>
        <div class="subtitle-menu__title">{{ subtitle.title }}</div>
        <icon-button icon="delete" 
                     class="subtitle-menu__delete"
                     @clicked.stop/>
      </div>
    </div>

    <div v-else 
         class="subtitle-menu__empty">No Subtitles. Click "+" to add subtitles.</div>

    <icon-button icon="add"
                 class="subtitle-menu__add-button"/>
  </div>
</template>

<script>
import IconButton from '../Base/IconButton'

import '../../assets/icons/icon-radio-unchecked.svg'
import '../../assets/icons/icon-radio-checked.svg'

export default {
  name: 'SubtitleMenu',

  components: { IconButton },

  props: {
    subtitles: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      activeSubtitle: this.subtitles.find(s => s.default),
    }
  },

  mounted() {
    this.dissmissHandler = e => {
      this.$emit('dismiss')
    }

    document.body.addEventListener('click', this.dissmissHandler)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.dissmissHandler)
  },
}
</script>

<style lang="scss">
@import '../../theme';

.subtitle-menu {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  min-height: 96px;
  @include theme-text-color-on-background();
  @include theme-bg-color-background();
  display: grid;

  &__subtitles {
    margin-bottom: 16px + 48px;
    @include theme-typography-headline5();
  }

  &__subtitle {
    height: 48px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-gap: 16px;
    align-items: center;
  }

  &__radio {
    border-radius: 0 8px 8px 0;

    &--active {
      @include theme-text-color-secondary();
    }
  }

  &__delete {
    border-radius: 8px 0 0 8px;
    @include theme-text-color-on-background();
    opacity: 0;
  }

  &__subtitle:hover &__delete {
    opacity: 1;
  }

  &__empty {
    padding: 16px;
    @include theme-typography-body2();
  }

  &__add-button {
    position: absolute;
    left: 0;
    bottom: 0;
    border-radius: 0 8px 0 8px;
  }
}
</style>
