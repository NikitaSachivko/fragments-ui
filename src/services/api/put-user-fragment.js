
// fragments microservice API, defaults to localhost:9000
const apiUrl = process.env.API_URL || 'http://localhost:9000'


export async function putUserFragment(user, id, text = "", contentType) {
    let data = {}

    if (text === "") {
        throw new Error('Can not add empty fragment')
    }

    let headers = user.authorizationHeaders()
    headers["Content-Type"] = contentType

    try {
        const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
            method: 'PUT',
            headers: headers,
            body: text
        })

        data = await res.json()
    } catch (err) {
        throw new Error(`Can not add fragment, server error: ${err.message}`)
    }

    return Promise.resolve(data)
}