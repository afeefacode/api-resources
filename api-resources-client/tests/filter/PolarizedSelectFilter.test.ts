// Die Filter-Basisklasse zieht über ActionFilter → ApiRequest einen
// zyklischen Import nach, der unter ts-jest beim Laden crasht (vorbestehend,
// betrifft jeden Filter-Import im Test). Da PolarizedSelectFilter nicht auf
// super zugreift, stubben wir die Basis als leere Klasse — getestet werden
// nur die reinen Methoden.
jest.mock('../../src/filter/Filter', () => ({ Filter: class {} }))

import { PolarizedSelectFilter } from '../../src/filter/filters/PolarizedSelectFilter'

function filter (): PolarizedSelectFilter {
  return new PolarizedSelectFilter()
}

describe('valueToQuery (token array → query)', () => {
  test('empty / null', () => {
    expect(filter().valueToQuery(null)).toBeUndefined()
    expect(filter().valueToQuery([])).toBeUndefined()
  })

  test('include only', () => {
    expect(filter().valueToQuery(['2', '4'])).toBe('2,4')
  })

  test('include + exclude (n- prefix)', () => {
    expect(filter().valueToQuery(['2', 'n-5', 'n-6'])).toBe('2,n-5,n-6')
  })
})

describe('queryToValue (query → token array)', () => {
  test('empty', () => {
    expect(filter().queryToValue('')).toBeUndefined()
  })

  test('include only stays backward compatible', () => {
    expect(filter().queryToValue('2,4')).toEqual(['2', '4'])
  })

  test('include + exclude', () => {
    expect(filter().queryToValue('2,4,n-5')).toEqual(['2', '4', 'n-5'])
  })

  test('string id after n- survives', () => {
    expect(filter().queryToValue('n-none')).toEqual(['n-none'])
  })
})

describe('round-trip query → value → query', () => {
  test.each([
    '2',
    '2,4',
    '2,n-5',
    'n-none'
  ])('%s', (query) => {
    const f = filter()
    expect(f.valueToQuery(f.queryToValue(query))).toBe(query)
  })
})
