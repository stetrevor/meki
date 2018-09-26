import { remote } from 'electron'

import path from 'path'

import Datastore from 'nedb'

let media

if (process.env.NODE_ENV !== 'testing') {
  const app = remote.app
  const filename =
    process.env.NODE_ENV === 'production'
      ? path.join(app.getPath('userData'), 'paw.db')
      : path.join(__dirname, '../../../temp', 'paw.db')
  media = new Datastore({ filename, timestampData: true, autoload: true })
} else {
  media = new Datastore({ timestampData: true })
}

export default { media }
