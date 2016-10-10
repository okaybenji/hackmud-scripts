function(context, args) {
  if (!args || !args.target) {
    return { ok: true, msg: 'Please provide a target loc in the form of "#s.user.script" (without quotes)'}
  }
  var digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  var colors = ['red', 'orange', 'yellow', 'green', 'lime', 'blue', 'cyan', 'purple'];
  var locks = {
    ez_21: ['open', 'release', 'unlock'],
    ez_35: digits,
    ez_40: primes,
    ez_prime: primes,
    c001: digits,
    c002: colors,
    c003: colors
  };
  var msg = '';
  /*passwords.forEach((pw) => {
    msg += args.target.call({ez_21: pw});
  });*/
  var ret = args.target.call({});
  for (let key in locks) {
    if (ret.indexOf(key) < 0) {
      msg += key;
    }
  }
  return { ok: true, msg: msg };
}
