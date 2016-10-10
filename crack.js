function(ctx, args) {
  // TODO: refactor to use array.find instead of array.some. really, you're looking for the entry that was successful.
  // setting key should be separate logic from finding the appropriate entry.
  if (!args || !args.target || !args.pws || !args.type) {
    return { ok: true, msg: 'target, pws (passwords array) and type (lock name) req\'d'}
  }
#s.chats.tell({to: "esc", msg: "cracking: " + args.type + " with pws: " + JSON.stringify(args.pws) + " and keys: " + JSON.stringify(args.keys)})
  let msg
  let keys = args.keys || {}
  let ok = false
  let key = {}

  args.pws.some((pw) => {
    let testKey = {}
    testKey[args.type] = pw
    msg = args.target.call(Object.assign({}, keys, testKey))
    // #s.chats.tell({to: "esc", msg: "result is:" + result})
    // return the key when the return message doesn't say, e.g.
    // 'that is not the correct unlock code'
    let gotResult = typeof msg === 'string'
    let wasSuccess = gotResult && msg.indexOf('correct') === -1
    if (wasSuccess) {
      ok = true
      key = testKey
       #s.chats.tell({to: "esc", msg: "key for " + args.type + " is " + JSON.stringify(key)})
    }
    // break out of loop once we're successful
    return wasSuccess
  });

  // note: if this was the last lock to crack, the result will start with "Received"
  // might use this somehow to keep hack from continuing at that point?
  return { ok, msg, key };
}
