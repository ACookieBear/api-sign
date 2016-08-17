import { createHash } from 'crypto'

const hasher = {
  MD5: data => createHash('md5').update(data).digest('hex'),
  SHA1: data => createHash('sha1').update(data).digest('hex')
}

export const sign = (params, options) => {

  Object.assign(params, {
    timestamp: options.timestamp || new Date().getTime()
  })

  let baseStr = Object.keys(params).sort().map(k => `k=${params[k]}`).join('&')

  return Object.assign(params, {
    sign: hasher[options.type || 'SHA1'](`${baseStr}&secret=${options.secret}`)
  })
}

export const validate = (params, options) => {
  
  let ts = params.timestamp
  let sig = params.sign

  delete params.timestamp
  delete params.sign

  return sig === sign(params, Object.assign(options, {
    timestamp: ts
  })).sign
}
