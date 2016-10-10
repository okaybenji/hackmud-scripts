function(ctx, args) {
  if (!args || !args.target) {
    return { ok: true, msg: 'target required (#s.t.l)'}
  }
  let locks = ["EZ_21", "EZ_35", "EZ_40", "EZ_Prime", "c001", "c002", "c003"]
  let ret = args.target.call({})
  if (ret.indexOf('hardline') > -1) {
    return {ok: true, msg: ret}
  }
  let keys = {};
  locks
    .filter((lock) => {
      return ret.indexOf(lock) > -1
    })
    .forEach((lock) => {
      // apparently you can't say '#s.esc[lock](args)' :(
      let key = #s.esc.ez_21(args)
      Object.assign(keys, key.msg)
    })
  let msg = args.target.call(keys)
  return { ok: true, msg: msg }
}
