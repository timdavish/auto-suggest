'use strict'

module.exports = function createSuggester (lines, options = {}) {
  return suggester.init(lines, options)
}

const suggester = {
  init (lines, options) {
    this.add = this.add.bind(this)
    this._addHelper = this._addHelper.bind(this)
    this.remove = this.remove.bind(this)
    this._removeHelper = this._removeHelper.bind(this)
    this.search = this.search.bind(this)
    this._searchHelper = this._searchHelper.bind(this)

    const { EOL = '$', limit = 10, highComplexity = true, enableWeight = false } = options

    this.trie = {}
    this.EOL = EOL
    this.limit = limit
    this.highComplexity = highComplexity
    this.enableWeight = enableWeight

    this.add(lines)

    return this
  },

  add (lines = []) {
    if (Array.isArray(lines)) {
      for (const line of lines) {
        this._addHelper(line)
      }
    } else {
      this._addHelper(lines)
    }
  },

  _addHelper (line) {
    if (typeof line === 'string') {
      if (line[line.length - 1] !== this.EOL) line += this.EOL
      line = line.toLowerCase()

      let pointer = this.trie
      for (const letter of line) {
        if (!pointer[letter]) pointer[letter] = {}
        pointer = pointer[letter]
      }
    }
  },

  remove (lines = []) {
    if (Array.isArray(lines)) {
      for (const line of lines) {
        this._removeHelper(line)
      }
    } else {
      this._removeHelper(lines)
    }
  },

  _removeHelper (line) {},

  search (prefix, limitOverride) {
    prefix = prefix.toLowerCase()

    const limit = limitOverride || this.limit

    let pointer = this.trie

    // Navigate through the trie to the point of the current search phrase
    for (const letter of prefix) {
      if (pointer[letter]) {
        pointer = pointer[letter]
      } else {
        return []
      }
    }

    return this._searchHelper(pointer, prefix, limit)
  },

  _searchHelper (pointer, prefix, limit, suggestions = []) {
    const suffixes = Object.keys(pointer)

    for (const suffix of suffixes) {
      if (suggestions.length >= limit) break

      if (suffix === this.EOL) {
        suggestions.push(prefix)
      } else {
        suggestions.concat(this._searchHelper(pointer[suffix], prefix + suffix, limit, suggestions))
      }
    }

    return suggestions
  }
}
