function(ctx, args) {
  if (!args || !args.target) {
    return { ok: true, msg: 'target required, e.g. #s.user.name'}
  }
  let keys = {}
  let ok = true
  let msg = args.target.call(keys) // get initial call result and lock error

  // checks to see if current result is a particular type of lock error
  let needsCrack = function(lock) {
    // see if msg from server has name of lock... but not followed by an underscore!
    // (this prevents false positive for e.g. c002 when it's actually c002_complement)
    return msg.indexOf(lock.type) > -1 && msg.indexOf(lock.type + '_' === -1)
  }

  // each of the password sets we might need for a lock
  let passwords = ['open', 'release', 'unlock']
  let digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  let primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
  let colors = ['red', 'orange', 'yellow', 'green', 'lime', 'blue', 'cyan', 'purple']

  // each of the lock types we might have to crack and the pws they use
  let locks = [
    { type: 'EZ_21', pws: passwords },
    { type: 'EZ_35', pws: digits },
    { type: 'EZ_40', pws: passwords },
    { type: 'ez_prime', pws: primes },
    { type: 'c001', pws: colors },
    { type: 'color_digit', pws: digits },
    { type: 'c002', pws: colors },
    { type: 'c002_complement', pws: colors },
    { type: 'c003', pws: colors },
    { type: 'c003_triad_1', pws: colors },
    { type: 'c003_triad_2', pws: colors },
  ];

  // recursively hack until we have keys to crack all locks
  (function hack() {
    let lock = locks.find(needsCrack) // gets next lock to crack
    // if no locks need cracking, we're done!
    if (!lock) {
      return;
    }
    let result = #s.esc.crack({type: lock.type, pws: lock.pws, target: args.target, keys})
    // if the crack failed or we got the same error msg twice, abort hack
    let crackFailed = !result.ok
    let msgRepeated = result.msg === msg // break out of recursion if we're repeatedly getting the same error
    if (crackFailed || msgRepeated) {
      ok = false
      return
    }
    // otherwise, crack was successful
    msg = result.msg
    // TODO: at this point, msg will start with 'Received' if our hack was successful
    // should we use this to break out of the loop instead of checking to see if no locks need breaking?
    Object.assign(keys, result.key) // update our keys
    hack() // move onto next lock
  }())
  
//  return { ok: ok, msg: JSON.stringify(keys) + msg }
  return { ok, msg }
}
