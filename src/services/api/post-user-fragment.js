// src/api.js

// fragments microservice API, defaults to localhost:9000
const apiUrl = process.env.API_URL || 'http://localhost:9000'


export async function postUserFragment(user, contentType = "text/plain", text = "") {
    let data = {}

    if (text === "") {
        throw new Error('Can not add empty fragment')
    }

    let headers = user.authorizationHeaders()
    headers["Content-Type"] = contentType
    try {
        const res = await fetch(`${apiUrl}/v1/fragments`, {
            method: 'POST',
            headers: headers,
            body: text
        })

        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`)
        }

        data = await res.json()
    } catch (err) {
        throw new Error(`Can not add fragment, server error: ${err.message}`)
    }

    return Promise.resolve(data)
}