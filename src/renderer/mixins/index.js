import path from 'path'

function areSamePath(path1, ...path2Segments) {
  return path1 === path.join(path2Segments)
}

const PathFuncMixin = {
  methods: {
    areSamePath,
    pathJoin: path.join,
  },
}

export { PathFuncMixin }
