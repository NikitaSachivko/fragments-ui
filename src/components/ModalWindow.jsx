import { useAtom } from 'jotai'
import { useState } from "react"
import { showModalWindowAtom } from '../../global-state'
import { deleteUserFragments } from '../services/api/delete-user-fragment'
import { putUserFragment } from '../services/api/put-user-fragment'
import { fragmentsListAtom } from '../../global-state'
import Image from 'next/image'
import mime from 'mime-types'
import { getDataFromFile } from '../services/getDataFromFile'
import { getUserFragmentData } from '../services/api/get-user-fragment-data'

const ModalWindow = ({ user, modalFragment }) => {
    const [showModalWindow, setShowModalWindow] = useAtom(showModalWindowAtom)
    const [text, setText] = useState(modalFragment.fragmentData)
    const [fragments, setFragments] = useAtom(fragmentsListAtom)

    const handleFragmentDelete = async () => {
        const res = await deleteUserFragments(user, modalFragment.id)
        if (res.status === 'ok') {
            const updatedFragments = fragments.filter(fragment => fragment.id !== modalFragment.id)
            setFragments(updatedFragments)
            setShowModalWindow(false)
        }
    }

    const handleUpdateFragment = async (newData) => {
        const res = await putUserFragment(user, modalFragment.id, newData, modalFragment.type)
        if (res.status === 'ok') {
            const updatedFragments = fragments.map(fragment => {
                if (fragment.id === modalFragment.id) {
                    fragment.fragmentData = newData
                }
                return fragment
            })
            setFragments(updatedFragments)
            setShowModalWindow(false)
        }
    }


    const handleImageChange = async (event) => {
        const file = event.target.files[0]
        const fileBlob = URL.createObjectURL(file)
        let fragmentContentType = mime.lookup(file.name)

        const data = await getDataFromFile(file, fileBlob, fragmentContentType)
        await handleUpdateFragment(data)
    }

    const handleFormat = async (e) => {
        const selectedFormat = e.target.value
        const extension = mime.extension(selectedFormat) === "markdown" ? "md" : mime.extension(selectedFormat)
        const data = await getUserFragmentData(user, `${modalFragment.id}.${extension}`, modalFragment.type)
        const buffer = selectedFormat.includes("image") ? data : Buffer.from(data, 'utf-8')
        const blob = new Blob([buffer], { type: selectedFormat })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', "file")
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)

    }

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8">
                {!modalFragment.type.includes("image") && <div className="w-[250px] content-center mt-5 mb-5">
                    <textarea onChange={(event) => setText(event.target.value)}
                        value={text} rows="4" className="
                        block p-2.5 w-[300px] h-[350px] text-sm 
                        text-gray-900 bg-white rounded-lg 
                        border border-gray-300 focus:ring-blue-500 
                        focus:border-blue-500" placeholder=""></textarea>
                </div>}

                {modalFragment.type.includes("image") &&
                    <div className="mb-5 border-dashed border-2 border-teal-900 rounded-md">
                        <label className="cursor-pointer">
                            <Image
                                src={modalFragment.src}
                                alt="Picture"
                                width={700}
                                height={700}
                            />
                            <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} />
                        </label>

                    </div >
                }

                <div className="grid grid-cols-3 gap-5">
                    <button onClick={() => setShowModalWindow(false)}
                        className="bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 border border-gray-400 rounded shadow">Close</button>
                    {!modalFragment.type.includes("image") && <button onClick={() => handleUpdateFragment(text)}
                        className="bg-white  hover:bg-gray-100 text-teal-900 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Update</button>}
                    <button onClick={() => handleFragmentDelete()}
                        className="bg-white hover:bg-gray-100 text-red-700 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Delete</button>
                </div>
                <select onChange={handleFormat} className="
                mt-5
                hover:bg-zinc-100
                col-span-2
                w-full p-2.5 
                text-black
                bg-white border 
                border-zinc-500
                shadow-sm outline-none 
                appearance-none 
                rounded-md
                ">
                    {!!modalFragment?.formats &&
                        modalFragment.formats.map((format, key) => {
                            return <option key={key}>{format}</option>
                        })
                    }
                </select>
            </div>
        </div>

    )
}

export default ModalWindow