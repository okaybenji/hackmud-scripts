function(ctx, args) {
  if (!args || !args.target || !args.pws || !args.type) {
    return { ok: true, msg: 'target, pws (passwords array) and type (lock name) req\'d'}
  }
#s.chats.tell({to: "esc", msg: "cracking " + args.type + " with pws: " + JSON.stringify(args.pws) + " and keys: " + JSON.stringify(args.keys)})
  let msg
  let keys = args.keys || {}
  let ok = false

  let key = args.pws
    .map((pw) => {
      let testKey = {}
      testKey[args.type] = pw
      return testKey
    })
    .find((testKey) => {
      msg = args.target.call(Object.assign({}, keys, testKey))
      // return the key when the return message doesn't say, e.g.
      // 'that is not the correct unlock code'
      let gotResult = typeof msg === 'string'
      let wasSuccess = gotResult && msg.indexOf('correct') === -1
      return wasSuccess
    });

  if (key) {
    ok = true
    #s.chats.tell({to: "esc", msg: "key for " + args.type + " is " + JSON.stringify(key)})
  }

  return { ok, msg, key: key || {} };
}
