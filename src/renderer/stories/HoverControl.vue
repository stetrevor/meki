<template>
  <div v-stream:mousemove="{ subject: mousemove$, options: { capture: true } }" 
       v-stream:mouseup="{ subject: mouseup$, options: { capture: true } }"
       :class="['hover-control', { 'hover-control--hide': !controlShow$ }]">
    <div v-show="controlShow$" 
         class="hover-control__header"/>
    <div class="hover-control__content">
      <div>Counter: {{ counter$ }}</div>
      <div>show$: {{ show$ }}</div>
      <div>hide$: {{ hide$ }}</div>
      <div>controlShow$: {{ controlShow$ }}</div>
      
      Hover to show the controls for 5 seconds.
    </div>
    <div v-show="controlShow$" 
         class="hover-control__footer"/>
  </div>
</template>

<script>
import { merge, of, timer } from 'rxjs'
import {
  mapTo,
  switchMap,
  delay,
  startWith,
  scan,
  takeWhile,
} from 'rxjs/operators'

export default {
  name: 'HoverControl',

  domStreams: ['mousemove$', 'mouseup$'],

  subscriptions() {
    const events$ = merge(this.mousemove$, this.mouseup$).pipe(startWith(null))
    const show$ = events$.pipe(mapTo(true))
    const hide$ = events$.pipe(
      startWith(false),
      switchMap(() => of(false).pipe(delay(5000))),
    )
    const controlShow$ = merge(show$, hide$)

    const counter$ = show$.pipe(
      switchMap(() =>
        timer(0, 1000).pipe(
          mapTo(-1),
          scan((acc, curr) => acc + curr, 6),
          takeWhile(v => v >= 0),
        ),
      ),
    )

    return { show$, hide$, counter$, controlShow$ }
  },
}
</script>

<style lang="scss">
@import '../theme';

.hover-control {
  position: relative;
  @include theme-text-color-on-primary();
  @include theme-bg-color-primary();
  display: flex;
  align-items: center;
  justify-content: center;

  &--hide {
    cursor: none;
  }

  &__header,
  &__footer {
    position: absolute;
    left: 0;
    width: 100%;
    height: 96px;
    @include theme-bg-color-secondary();
  }

  &__header {
    top: 0;
  }

  &__footer {
    bottom: 0;
  }
}
</style>
