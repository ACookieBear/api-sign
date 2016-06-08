## usage ##

	npm install api-sign --save
	const aps = require('api-sign')

	let params = {
		key1: '123345',
		key2: 'asdf'
	}

	let secret = 'mysecret'

	let options = {
		signType: 'MD5'
	}

	let signed = aps.sign(params, secret, options)

	console.log(signed) // { key1: '123345',
							 key2: 'asdf',
							 timestamp: '1465373051957',
							 sign: '0d684e7f2fb88e568f8e5a0fbdd1a126' }

	let options2 = {
		signType: 'MD5',
		expiresIn: 200
	}

	console.log(aps.validate(signed, secret, options2))


aps.sign(params, secret, options)

options(非必需):
>signType: `MD5``SHA1`,默认`SHA1`
>
>spli: 默认 `&`
>
>secretName: 默认 `secret`
>
>signParamName: 默认 `sign`
>
>tsName: 默认 `timestamp`


aps.validate(params, secret, options)
options(非必需):
>signType: `MD5``SHA1`,默认`SHA1`
>
>spli: 默认 `&`
>
>secretName: 默认 `secret`
>
>signParamName: 默认 `sign`
>
>tsName: 默认 `timestamp`
>
>expiresIn: 过期时间 `单位(ms)`