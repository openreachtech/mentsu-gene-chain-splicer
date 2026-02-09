/**
 * Gene Chain Splicer.
 */
export default class GeneChainSplicer {
  /**
   * Constructor.
   *
   * @param {{
   *   core: *
   * }} params - Parameters.
   */
  constructor ({
    core,
  }) {
    this.core = core
  }

  /**
   * Factory method of this class.
   *
   * @template {X extends typeof GeneChainSplicer ? X : never} T, X
   * @param {{
   *   core: *
   * }} params - Parameters.
   * @returns {InstanceType<T>} Instance.
   * @this {T}
   */
  static create ({
    core,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        core,
      })
    )
  }

  /**
   * Splice gene chains.
   *
   * @param {{
   *   mixin: Record<string | symbol, *>
   * }} params - Parameters.
   * @returns {GeneChainSplicer} For method chaining.
   */
  spliceGene ({
    mixin,
  }) {
    Object.setPrototypeOf(
      this.core,
      {
        ...mixin,

        __proto__: Object.getPrototypeOf(this.core),
      }
    )

    return this
  }
}
