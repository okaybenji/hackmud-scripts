// hack: general purpose script for hacking t1's
function(ctx, args) {
  if (!args || !args.target) {
    return { ok: true, msg: 'target required, e.g. #s.user.name'}
  }
  let keys = {};
  // get initial call result and lock error
  let msg = args.target.call(keys)
  // if result is warning that player needs to enter hardline mode, just return that
  if (msg.indexOf('hardline') > -1) {
    return {ok: true, msg: msg}
  }
  // checks to see if current result is a particular type of lock error
  // if so, cracks that lock and updates our keys
  function crack(lock) {
    let needsCrack = msg.indexOf(lock.type) > -1
    if (needsCrack) {
      #s.chats.tell({to: "esc", msg: "cracking: " + lock.type})
      Object.assign(keys, #s.esc.cracktory(lock))
    }
  }
  let errorMsg // used to break out of recursion if we're repeatedly getting the same error

  // each of the password sets we might need for a lock
  let passwords = ['open', 'release', 'unlock']
  let digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  let primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
  let colors = ['red', 'orange', 'yellow', 'green', 'lime', 'blue', 'cyan', 'purple']

  let locks = [
    { type: 'EZ_21', passwords },
    { type: 'EZ_35', passwords: digits },
    { type: 'EZ_40', passwords },
    { type: 'EZ_Prime', passwords: primes },
    { type: 'c001', passwords: colors },
    { type: 'color_digit', passwords: colors },
    { type: 'c002', passwords: colors },
    { type: 'c002_complement', passwords: colors },
    { type: 'c003', passwords: colors },
    { type: 'c003_triad_1', passwords: colors },
    { type: 'c003_triad_2', passwords: colors },
  ];

  // recursively hack until we have keys to crack all locks
  (function hack() {
    locks.forEach(crack) // gets key for next lock to crack
    msg = args.target.call(keys) // attempts to open locks with keys
    if (msg.indexOf('LOCK_ERROR')) {
      // if we got the same error message twice, abort hack
      if (msg === errorMsg) {
        return
      } else {
        // update our current lock error and crack the next lock
        errorMsg = msg
        hack()
      }
    }
  }())
  
  return { ok: true, msg: msg }
}
