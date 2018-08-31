import { storiesOf } from '@storybook/vue'

const amb = storiesOf('Home Page | Add Media Button', module)

amb.add('Add Media Button', () => ({ template: '<add-media-button/>' }))

const nav = storiesOf('Home Page | Navigation')

nav.add('NavItem', () => ({
  template: `
    <div class="theme-bg-color-primary" style="width: 100vw; height: 100vh; padding: 48px 0; display: flex; flex-direction: column">
      <nav-item>Recents</nav-item>
      <nav-item class="nav-item--active">Movies</nav-item>
    </div>`,
}))

nav.add('NavBar', () => ({
  template: `
    <div class="theme-bg-color-primary" style="width: 100vw; height: 100vh; padding: 48px 0">
      <nav-bar :nav-items="['recents', 'favorites', 'movies', 'tv shows', 'videos', 'private']"/>
    </div>`,
}))
