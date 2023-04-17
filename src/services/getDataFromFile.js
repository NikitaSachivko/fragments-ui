
export async function getDataFromFile(file, fileBlob, fragmentContentType) {
    let blobData

    fragmentContentType = !fragmentContentType ? "unsupported/type" : fragmentContentType

    // If we don't have image
    if (!fragmentContentType.includes("image")) {
        // Reading data from blob url
        blobData = async () => {
            const response = await fetch(fileBlob)
            const blob = await response.blob()

            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsText(blob)
                reader.onload = () => {
                    resolve(reader.result)
                }
                reader.onerror = () => {
                    reject(reader.error)
                }
            })
        }
    } else { // If we have image file

        blobData = async () =>
            new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => {
                    resolve(reader.result)
                }

                reader.onerror = reject
                reader.readAsArrayBuffer(file)
            })
    }

    // Get data from promise
    const dataFromBlob = await blobData()

    return dataFromBlob
}