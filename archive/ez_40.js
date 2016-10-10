function(ctx, args) {
  let passwords = ['open', 'release', 'unlock']
  let key
  passwords.some((pw) => {
    key = {ez_40: pw}
    let ret = args.target.call(key)
    return ret.indexOf('LOCK_ERROR') === -1
  })
  //var argsWithKey = Object.assign({}, args, key)
  //key = Object.assign(key, #s.esc.ez_prime(argsWithKey).msg)
  let tempKey = Object.assign({}, key)
  let primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
  let rett
  primes.some((prime) => {
    key = Object.assign({}, tempKey, {ez_prime: prime})
    let ret = args.target.call(key)
    rett = ret
    return ret.indexOf('correct') === - 1
  })
  return { ok: true, msg: rett };
}