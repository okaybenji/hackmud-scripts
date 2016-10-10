function(ctx, args) {
  let passwords = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
  let key = args.key
  passwords.some((pw) => {
    key = Object.assign({}, key, {ez_prime: pw})
    let ret = args.target.call(key)
    return ret.indexOf('correct') === -1
  });
  return { ok: true, msg: key };
}
