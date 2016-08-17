import { sign, validate } from './entry'

let params = {
  haha: '213'
}

let query = sign(params, { secret: '123' })

console.log(query)

console.log(validate(params, { secret: '123' }))