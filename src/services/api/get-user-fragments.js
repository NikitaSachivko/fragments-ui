// src/api.js


// fragments microservice API, defaults to localhost:9000
const apiUrl = process.env.API_URL || 'http://localhost:9000'
const { getUserFragmentData } = require('./get-user-fragment-data')
const { getUserFragmentFormats } = require('./get.user-fragment-formats')

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  let data = {}

  console.log('Requesting user fragments data...')
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    })
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`)
    }

    data = await res.json()

    // console.log(data)
    const fragmentsDataPromises = data.fragments.map(async (fragment) => {
      fragment.fragmentData = await getUserFragmentData(user, fragment.id, fragment.type) || {}
      fragment.formats = await getUserFragmentFormats(user, fragment.id) || []
      return fragment
    })

    data = await Promise.all(fragmentsDataPromises)
    console.log(data)

  } catch (err) {
    // console.error('Unable to call GET /v1/fragment', { err })
  }

  return Promise.resolve(data)
}