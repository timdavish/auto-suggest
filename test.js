import test from 'ava'

import createSuggester from './'
import lines from './lines'

test('it works', t => {
  const suggester = createSuggester(lines)
  console.log(suggester.search('a', 1000))

  t.pass()
})
