function print(result) {
	if (result.ok) {
  	console.log('SUCCESS')
  } else {
  	console.log('FAILURE')
  }
  console.log(result.msg)
}

function Npc(name) {
  return function() {
    console.log('this:', this)
    if (!this.target) {
      return 'Connected to ' + name
    }
    if (!this.target.c003) {
      return 'LOCK_ERROR\nDenied access by CORE c003 lock.'
    }
    if (!this.target.c003 === 'lime') {
    	return '"' + this.target.c003 + '" is not the correct color name.'
    }
  }
}

function crack(ctx, args) {
  if (!args || !args.target || !args.pws || !args.type) {
    return { ok: true, msg: 'target, pws (passwords array) and type (lock name) req\'d'}
  }
  console.log("cracking: " + args.type + " with pws: " + JSON.stringify(args.pws))
  let keys = args.keys || {}
  let ok = false
  let key = {}
  args.pws.some((pw) => {
    let testKey = {}
    testKey[args.type] = pw
    let result = args.target.call(Object.assign({}, keys, testKey))
    // return the key when the return message doesn't say, e.g.
    // 'that is not the correct unlock code'
    let wasSuccess = result.indexOf('correct') === -1
    if (wasSuccess) {
      console.log(args.type + " cracked w/ pw: " + pw)
      ok = true
      key = testKey
    } else {
      console.log({to: "esc", msg: result})
    }
    // break out of loop once we're successful
    return wasSuccess
  });

  console.log("got key:", key)
  return { ok: ok, key: key };
}

let npc = Npc("unknown_8he0rq.info_ec8dav")
let args = {
	target: npc,
  pws: ['red', 'orange', 'yellow', 'green', 'lime', 'blue', 'cyan', 'purple'],
  type: "c003"
}
print(crack(npc, args))