<template>
  <div id="app">
    <transition name="fade-out-in" 
                mode="out-in">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Paw',
}
</script>

<style lang="scss">
/* CSS */
</style>
