// const endpoint = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API : '/api'
const endpoint = process.env.NEXT_PUBLIC_API

const _invoke = async (fn, args, fetch) => {
	const response = await fetch(`${endpoint}/${fn}`, {
		method: 'POST',
		body: JSON.stringify(args),
		duplex: 'half',
		headers: {
			'content-type': 'application/json',
		},
	})
	return await response.json()
}

const _invokeMultipart = async (fn, body, fetch) => {
	const response = await fetch(`${endpoint}/${fn}`, {
		method: 'POST',
		body,
		duplex: 'half',
	})
	return await response.json()
}

let onUnauth

export const invoke = async (fn, args, fetch, invokeFn = _invoke) => {
	const body: {
		ok: boolean
		result: any
		error?: {
			message: string
			unauth?: boolean
			notFound?: boolean
			items?: any
			validate?: any
		}
	} = await invokeFn(fn, args || {}, fetch)
	if (!body.ok) {
		const msg = body.error?.message || ''
		console.log('[api] ok=false, error=' + (msg || '{}'))
		switch (msg) {
			case 'unauthorized':
				body.error.unauth = true
				onUnauth && onUnauth()
				break
			case 'validate error':
				body.error.validate = body.error.items
				break
			default:
				if (msg.includes('not found')) {
					body.error.notFound = true
				}
				break
		}
	}
	return body
}

export const invokeMultipart = async (fn, body, fetch) => {
	return invoke(fn, body, fetch, _invokeMultipart)
}

export const setOnUnauth = (callback) => {
	onUnauth = callback
}
