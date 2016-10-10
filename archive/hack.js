function(ctx, args) {
  if (!args || !args.target) {
    return { ok: true, msg: 'target required (#s.u.n)'}
  }
  let keys = {};
  let msg = args.target.call(keys)
  if (msg.indexOf('hardline') > -1) {
    return {ok: true, msg: msg}
  }
  function has(lockName) {
    return msg.indexOf(lockName) > -1
  }
  let errorMsg
  (function hack() {
    if (has('EZ_21')) {
      Object.assign(keys, #s.esc.ez_21(args).msg)
    }
    if (has('EZ_35')) {
      Object.assign(keys, #s.esc.ez_35(args).msg)
    }
    if (has('EZ_40')) {
      Object.assign(keys, #s.esc.ez_40(args).msg)
    }
    if (has('EZ_prime')) {
      Object.assign(keys, #s.esc.ez_prime(args).msg)
    }             
    if (has('c001')) {
      Object.assign(keys, #s.esc.c001(args).msg)
    }
    if (has('c002')) {
      Object.assign(keys, #s.esc.c002(args).msg)
    }
    if (has('c003')) {
      Object.assign(keys, #s.esc.c002(args).msg)
    }
    msg = args.target.call(keys)
    if (msg.indexOf('LOCK_ERROR')) {
      if (msg === errorMsg) {
        return
      } else {
        errorMsg = msg
        hack()
      }
    }
  }())
  
  return { ok: true, msg: JSON.stringify(keys) + msg }
}
