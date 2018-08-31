<template>
  <div class="nav-bar">
    <nav-item v-for="item in navItems" 
              :key="item" 
              :class="{'nav-item--active': activeNavItem === item}" 
              @click.native="activeNavItem = item">
      {{ item }}
    </nav-item>
  </div>
</template>

<script>
import NavItem from './NavItem'

export default {
  name: 'NavBar',

  components: {
    NavItem,
  },

  props: {
    navItems: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      activeNavItem: this.navItems[0],
    }
  },
}
</script>

<style lang="scss">
.nav-bar {
  display: grid;
  grid-gap: 24px;
  grid-template-columns: 1fr;
}
</style>
