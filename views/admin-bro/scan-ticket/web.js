export function requestJson(ajax) {
	return request({
		...ajax,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(ajax.body)
	})
}

export function request(ajax) {
	return fetch(ajax.url, {
			...ajax,
		})
}

export function getLanUser(id) {
  return requestJson({
    url: `/api/getLanUser/${id}`,
    method: 'GET'
  })
}