function(ctx, args) {
  /**
   * cracktory: a crack factory
   * @param {Object}  args
   *  @param {Array}  pws Passwords to try using as property value.
   *  @param {String} type  Type/name of lock to use as property key.
   *  @param {Object} keys      Keys for other locks required to access th1s lock.
   * @return {Object}
   *  @return {Boolean} ok  Whether lock-break was successful.
   *  @return {Object}  key Has property named after lock type with value which successfully unlocks the lock (if found) or is empty object.
   */
  let ok = false
  let key = {}
  args.pws.some((pw) => {
    let testKey = {}
    testKey[args.type] = pw
    let result = args.target.call(testKey)
    // return the key when the return message doesn't say, e.g.
    // 'that is not the correct unlock code'
    let wasSuccess = result.indexOf('correct') === -1
    if (wasSuccess) {
      ok = true
      key = testKey
    }
    // break out of loop once we're successful
    return wasSuccess
  });
  
  return { ok: ok, key: key };
}
