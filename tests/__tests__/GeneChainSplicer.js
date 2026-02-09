import GeneChainSplicer from '../../lib/GeneChainSplicer.js'

describe('GeneChainSplicer', () => {
  describe('constructor', () => {
    describe('should keep properties', () => {
      describe('#core', () => {
        const cases = [
          {
            input: {
              core: {
                first: Symbol('first'),
              },
            },
          },
          {
            input: {
              core: {
                second: Symbol('second'),
              },
            },
          },
        ]

        test.each(cases)('core; core: $input.core', ({ input }) => {
          const splicer = new GeneChainSplicer(input)

          expect(splicer)
            .toHaveProperty('core', input.core)
        })
      })
    })
  })
})

describe('GeneChainSplicer', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            core: {
              first: Symbol('first'),
            },
          },
        },
        {
          input: {
            core: {
              second: Symbol('second'),
            },
          },
        },
      ]

      test.each(cases)('core; core: $input.core', ({ input }) => {
        const received = GeneChainSplicer.create(input)

        expect(received)
          .toBeInstanceOf(GeneChainSplicer)
      })
    })

    describe('should call constructor', () => {
      const cases = [
        {
          input: {
            core: {
              first: Symbol('first'),
            },
          },
        },
        {
          input: {
            core: {
              second: Symbol('second'),
            },
          },
        },
      ]

      test.each(cases)('core; core: $input.core', ({ input }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(GeneChainSplicer)

        SpyClass.create(input)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(input)
      })
    })
  })
})

describe('GeneChainSplicer', () => {
  describe('#spliceGene()', () => {
    class AlphaCore {
      /**
       * @returns {number}
       */
      firstValue () {
        return 1001
      }

      /**
       * @returns {number}
       */
      secondValue () {
        return 2001
      }

      /**
       * @returns {{
       *   first: number
       *   second: number
       * }}
       */
      unifyValues () {
        return {
          first: this.firstValue(),
          second: this.secondValue(),
        }
      }
    }

    class BetaCore extends AlphaCore {
      /**
       * @returns {number}
       */
      secondValue () {
        return 22002
      }
    }

    describe('with overridden members by mixin', () => {
      const cases = [
        {
          input: {
            core: new AlphaCore(),
          },
          mixinCases: [
            {
              mixin: {
                firstValue () {
                  return 1111
                },
              },
              expected: {
                first: 1111, // mixin.firstValue()
                second: 2001, // AlphaCore#secondValue()
              },
            },
            {
              mixin: {
                secondValue () {
                  return 2222
                },
              },
              expected: {
                first: 1111, // mixin.firstValue()
                second: 2222, // mixin.secondValue()
              },
            },
          ],
        },
        {
          input: {
            core: new BetaCore(),
          },
          mixinCases: [
            {
              mixin: {
                firstValue () {
                  return 1111001
                },
              },
              expected: {
                first: 1111001, // mixin.firstValue()
                second: 22002, // BetaCore#secondValue()
              },
            },
            {
              mixin: {
                secondValue () {
                  return 2222002
                },
              },
              expected: {
                first: 1111001, // mixin.firstValue()
                second: 2222002, // mixin.secondValue()
              },
            },
          ],
        },
        {
          input: {
            core: {
              firstValue () {
                return 1001001
              },
              secondValue () {
                return 2002002
              },
              unifyValues () {
                return {
                  first: this.firstValue(),
                  second: this.secondValue(),
                }
              },
            },
          },
          mixinCases: [
            {
              mixin: {
                firstValue () {
                  return 1111001
                },
              },
              expected: {
                first: 1001001, // NOTE: not overridden, because own property is prior to prototype chain
                second: 2002002, // core.secondValue()
              },
            },
            {
              mixin: {
                secondValue () {
                  return 2222002
                },
              },
              expected: {
                first: 1001001, // NOTE: not overridden, because own property is prior to prototype chain
                second: 2002002, // NOTE: not overridden, because own property is prior to prototype chain
              },
            },
          ],
        },
      ]

      describe.each(cases)('core; core: $input.core', ({ input, mixinCases }) => {
        const splicer = GeneChainSplicer.create(input)

        test.each(mixinCases)('mixin: $mixin', ({ mixin, expected }) => {
          splicer.spliceGene({
            mixin,
          })

          const received = input.core.unifyValues()

          expect(received)
            .toEqual(expected)
        })
      })
    })

    describe('with new members by mixin', () => {
      const cases = [
        {
          input: {
            core: new AlphaCore(),
          },
          mixinCases: [
            {
              mixin: {
                thirdValue () {
                  return 3333003
                },
                unifyValues () {
                  return {
                    first: this.firstValue(),
                    second: this.secondValue(),

                    third: this.thirdValue(),
                  }
                },
              },
              expected: {
                first: 1001, // AlphaCore#firstValue()
                second: 2001, // AlphaCore#secondValue()
                third: 3333003, // mixin.thirdValue()
              },
            },
            {
              mixin: {
                fourthValue () {
                  return 4444004
                },
                unifyValues () {
                  return {
                    first: this.firstValue(),
                    second: this.secondValue(),
                    third: this.thirdValue(),

                    fourth: this.fourthValue(),
                  }
                },
              },
              expected: {
                first: 1001, // AlphaCore#firstValue()
                second: 2001, // AlphaCore#secondValue()
                third: 3333003, // mixin.thirdValue()
                fourth: 4444004, // mixin.fourthValue()
              },
            },
          ],
        },
        {
          input: {
            core: new BetaCore(),
          },
          mixinCases: [
            {
              mixin: {
                thirdValue () {
                  return 333003
                },
                unifyValues () {
                  return {
                    first: this.firstValue(),
                    second: this.secondValue(),

                    third: this.thirdValue(),
                  }
                },
              },
              expected: {
                first: 1001, // AlphaCore#firstValue()
                second: 22002, // BetaCore#secondValue()
                third: 333003, // mixin.thirdValue()
              },
            },
            {
              mixin: {
                fourthValue () {
                  return 4444004
                },
                unifyValues () {
                  return {
                    first: this.firstValue(),
                    second: this.secondValue(),
                    third: this.thirdValue(),

                    fourth: this.fourthValue(),
                  }
                },
              },
              expected: {
                first: 1001, // AlphaCore#firstValue()
                second: 22002, // BetaCore#secondValue()
                third: 333003, // mixin.thirdValue()
                fourth: 4444004, // mixin.fourthValue()
              },
            },
          ],
        },
      ]

      describe.each(cases)('core; core: $input.core', ({ input, mixinCases }) => {
        const splicer = GeneChainSplicer.create(input)

        test.each(mixinCases)('mixin: $mixin', ({ mixin, expected }) => {
          splicer.spliceGene({
            mixin,
          })

          const received = input.core.unifyValues()

          expect(received)
            .toEqual(expected)
        })
      })
    })
  })
})
