function(ctx, args) {
  let passwords = ['open', 'release', 'unlock']
  let key
  passwords.some((pw) => {
    key = {ez_21: pw}
    let ret = args.target.call(key)
    return ret.indexOf('correct') === -1
  });
  return { ok: true, msg: key };
}
