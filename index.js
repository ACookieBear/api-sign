const moment = require('moment')
const crypto = require('crypto')

const hasher = {
  MD5: data => crypto.createHash('md5').update(data).digest('hex'),
  SHA1: data => crypto.createHash('sha1').update(data).digest('hex')
}

const signParam = (timestamp, params, secret, signType, spli, secretName, signParamName, tsName) => {
  params = Object.assign((typeof params !== 'object') ? {} : params, { [tsName]: timestamp })
  let baseStr = Object.keys(params).sort().map(i => `${i}=${params[i]}`).join(spli)
  baseStr = `${baseStr}${spli}${secretName}=${secret}`
  return Object.assign(params, { [signParamName]: hasher[signType](baseStr) })
}

module.exports.sign = (params, secret, options) => {
  if (typeof options !== 'object') options = {}
  options.signType = options.signType || 'SHA1'
  options.spli = options.spli || (options.spli === '') ? '' : '&'
  options.secretName = options.secretName || 'secret'
  options.signParamName = options.signParamName || 'sign'
  options.tsName = options.tsName || 'timestamp'

  let ts = moment().format('x')
  return signParam(ts, params, secret, options.signType, options.spli, options.secretName, options.signParamName, options.tsName)
}

module.exports.validate = (params, secret, options) => {
  if (typeof options !== 'object') options = {}
  options.signType = options.signType || 'SHA1'
  options.spli = options.spli || (options.spli === '') ? '' : '&'
  options.secretName = options.secretName || 'secret'
  options.signParamName = options.signParamName || 'sign'
  options.tsName = options.tsName || 'timestamp'

  let signStr = params[options.signParamName]
  let ts = params[options.tsName]
  if (!signStr) throw new Error('Can not find signed str params')
  if (ts === undefined) throw new Error('Can not find timestamp on params')
  delete params[options.signParamName]
  delete params[options.tsName]

  params = signParam(ts, params, secret, options.signType, options.spli, options.secretName, options.signParamName, options.tsName)

  if (options.expiresIn !== undefined) {
    if (typeof options.expiresIn !== 'number') throw new Error('expiresIn must be a number')
    let sendTime = parseInt(ts)
    let currentTime = parseInt(moment().format('x'))
    if (currentTime - sendTime >= options.expiresIn) throw new Error('Invalid expired')
  }

  if (signStr !== params[options.signParamName]) throw new Error('Error signature')

  return true
}