// src/api.js

// fragments microservice API, defaults to localhost:9000
const apiUrl = process.env.API_URL || 'http://localhost:9000'

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragmentData(user, fragmentId, contentType) {
    let data = {}
    let headers = user.authorizationHeaders()

    try {
        const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
            method: 'GET',
            headers: headers,
        })

        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`)
        }

        const buffer = Buffer.from(await res.arrayBuffer())
        data = contentType.includes("image") ? buffer : buffer.toString()

    } catch (err) {
        // console.error('Unable to call GET /v1/fragment', { err })
    }

    return Promise.resolve(data)
}