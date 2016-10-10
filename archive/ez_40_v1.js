function(ctx, args) {
  let passwords = ['open', 'release', 'unlock']
  let key
  passwords.some((pw) => {
    key = {ez_21: pw}
    let ret = args.target.call(key)
    return ret.indexOf('correct') === -1
  });
  var argsWithKey = Object.assign({}, args, key)
  key = Object.assign(key, #s.esc.ez_prime(argsWithKey).msg)
  return { ok: true, msg: key };
}
