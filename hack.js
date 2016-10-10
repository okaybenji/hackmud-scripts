function(ctx, args) {
  // TODO: refactor hack and crack to use array.find instead of array.some. really, you're looking for the entry that needs cracking in this case, and the one that was successful in that case. calling crack (in hack) or setting key (there) should be separate logic from finding the appropriate entry.
  if (!args || !args.target) {
    return { ok: true, msg: 'target required, e.g. #s.user.name'}
  }
  let keys = {}
  let ok = true
  // get initial call result and lock error
  let msg = args.target.call(keys)

  // checks to see if current result is a particular type of lock error
  // if so, cracks that lock and updates our keys
  function crack(lock) {
    // see if msg from server has name of lock...
    // ...but not followed by an underscore!
    // this prevents false positivve for e.g. c002 when it's actually c002_complement
    let needsCrack = msg.indexOf(lock.type) > -1 && msg.indexOf(lock.type + '_' === -1)
    if (needsCrack) {
      // TODO: fit in (under hackmud length limit) check for success
      // if the crack failed, bail and fail the hack
      let result = #s.esc.crack({type: lock.type, pws: lock.pws, target: args.target, keys: keys})
      Object.assign(keys, result.key)
    }
    return needsCrack
  }
  let errorMsg // used to break out of recursion if we're repeatedly getting the same error

  // each of the password sets we might need for a lock
  let passwords = ['open', 'release', 'unlock']
  let digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  let primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
  let colors = ['red', 'orange', 'yellow', 'green', 'lime', 'blue', 'cyan', 'purple']

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
    locks.some(crack) // gets key for next lock to crack
    msg = args.target.call(keys) // attempts to open locks with keys
     #s.chats.tell({to: "esc", msg: "msg is:" + msg + ". does it have a lock_error? if not we are done"})
    if (msg.indexOf('LOCK_ERROR')) {
       #s.chats.tell({to: "esc", msg: "LOCK_ERROR: " + msg + " keys: " + JSON.stringify(keys)})
      // if we got the same error message twice, abort hack
      if (msg === errorMsg) {
        ok = false
        return
      } else {
        // update our current lock error and crack the next lock
        errorMsg = msg
        hack()
      }
    }
  }())
  
//  return { ok: ok, msg: JSON.stringify(keys) + msg }
  return { ok: ok, msg: msg }
}
