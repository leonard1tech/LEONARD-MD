const {
  zokou
} = require("../framework/zokou");
const axios = require("axios");
const Genius = require("genius-lyrics");
const Client = new Genius.Client("jKTbbU-6X2B9yWWl-KOm7Mh3_Z6hQsgE4mmvwV3P3Qe7oNa9-hsrLxQV5l5FiAZO");
zokou({
  'nomCom': 'poll',
  'reaction': '💠',
  'categorie': "General"
}, async (_0x30c4fc, _0x12f9f4, _0x257571) => {
  const {
    repondre: _0x394782,
    arg: _0x3aacc5,
    ms: _0x50fea5
  } = _0x257571;
  const _0x24dbc4 = _0x3aacc5.join(" ");
  let [_0x48d7c3, _0x3c6856] = _0x24dbc4.split('/');
  if (_0x24dbc4.split('/') < 0x2) {
    return _0x394782("Incorrect format.\nExample: poll what is 1+1/2, 3, 4");
  }
  let _0x28e247 = [];
  for (let _0x44e06d of _0x3c6856.split(',')) {
    _0x28e247.push(_0x44e06d);
  }
  await _0x12f9f4.sendMessage(_0x30c4fc, {
    'poll': {
      'name': _0x48d7c3,
      'values': _0x28e247
    }
  });
});