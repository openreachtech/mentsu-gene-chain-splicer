import { default as GeneChainSplicerActual } from '../../lib/GeneChainSplicer.js'

import {
  GeneChainSplicer,
} from '../../index.js'

describe('Main exports', () => {
  describe('should export required classes', () => {
    const cases = [
      {
        ExportedClass: GeneChainSplicer,
        MatchingClass: GeneChainSplicerActual,
      },
    ]

    test.each(cases)('Class: $ExportedClass.name', ({ ExportedClass, MatchingClass }) => {
      expect(ExportedClass)
        .toBe(MatchingClass)
    })
  })
})
