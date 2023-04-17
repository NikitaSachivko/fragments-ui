import Button from "../components/Button"
import Title from "../components/Title"
import { Auth, getUser } from '../services/auth'
import { useEffect, useState } from "react"
import { getUserFragments } from '../services/api/get-user-fragments'
import Dropdown from '../components/Dropdown'
import { postUserFragment } from '../services/api/post-user-fragment'
import Notification from '../components/Notification'
import { fragmentTypeAtom } from '../../global-state'
import { useAtom } from 'jotai'
import ModalWindow from '../components/ModalWindow'
import { showModalWindowAtom } from '../../global-state'
import { fragmentsListAtom } from '../../global-state'
import Image from 'next/image'
import mime from 'mime-types'
import { getDataFromFile } from '../services/getDataFromFile'
import { getUserFragmentFormats } from '../services/api/get.user-fragment-formats'

export default function Home() {
  /*
    Creating initial state for buttons
    will us it in future to activate or deactivate them.

    Default state will be true (disabled), because we need to wait for 
    user status first
  */
  const [loginButtonStatus, setLoginButtonStatus] = useState(false)
  const [logoutButtonStatus, setLogoutButtonStatus] = useState(true)
  const [fragmentType, setFragmentType] = useAtom(fragmentTypeAtom)
  const [fragments, setFragments] = useAtom(fragmentsListAtom)


  const [text, setText] = useState("")
  const [notificationText, setNotificationText] = useState("")
  const [isError, setIsError] = useState(false)
  const [isLoadingMain, setIsLoadingMain] = useState(false)
  const [showModalWindow, setShowModalWindow] = useAtom(showModalWindowAtom)
  const [isFile, setIsFile] = useState(false)
  const [modalFragment, setModalFragment] = useState({})
  const [isFragmentSidebarLoad, setIsFragmentSidebarLoad] = useState(true)

  /*
    Object that will hold logged user data
  */
  const [user, setUser] = useState({})


  const handleLoginButtonClick = async () => {
    try {
      /*
        Uses configuration from services/auth.js
        to redirect user to host login page
      */
      await Auth.federatedSignIn()
    } catch (error) {
      console.log("Cannot login:", error)
    }
  }

  const handleLogoutButtonClick = async () => {
    try {
      /*
        User logout
      */
      await Auth.signOut()
    } catch (error) {
      console.log("Cannot log out:", error)
    }
  }


  // Creates a new fragment from the data entered in the text area, 
  // adds it to the existing list of fragments, and sets a notification message 
  // based on the success or failure of the HTTP POST request made to the server.
  const handleFragmentCreate = async () => {
    try {
      const data = await postUserFragment(user, fragmentType, text)
      const formats = await getUserFragmentFormats(user, data.fragment.id)

      data.fragment.formats = formats
      data.fragment.fragmentData = text

      setFragments([...fragments, data.fragment])
      setNotificationText("Fragment saved")
      setIsError(false)
    } catch (error) {
      setIsError(true)
      setNotificationText(error.message)
    }
  }

  const handleModalWindow = (fragment) => {
    setModalFragment(fragment)
    setShowModalWindow(true)
  }


  // The "handleFileSelect" function handles file selection by the user, 
  // sends it to the server, and adds it to the existing list of fragments.
  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    const fileBlob = URL.createObjectURL(file)
    let fragmentContentType = mime.lookup(file.name)

    try {
      setIsFragmentSidebarLoad(false)

      const buffer = await getDataFromFile(file, fileBlob, fragmentContentType)
      const data = await postUserFragment(user, fragmentContentType, buffer)
      const formats = await getUserFragmentFormats(user, data.fragment.id)

      data.fragment.fragmentData = buffer
      data.fragment.formats = formats

      setFragments([...fragments, data.fragment])
      setNotificationText("Fragment saved")
      setIsError(false)

      setIsFragmentSidebarLoad(true)

    } catch (error) {
      setIsError(true)
      setNotificationText(error.message)
    }
  }


  // The "symbolsToImage" function converts a given string of symbols to a data URL, 
  // which can be used to display the content of an image in the browser. 
  // It takes two parameters: "symbols" which is the string representation of the image, 
  // and "type" which is the MIME type of the image.
  const symbolsToImage = (symbols, type) => {
    const blob = new Blob([symbols], { type: type })
    const url = URL.createObjectURL(blob)
    return url
  }




  /*
    Check user object 
    every time page rerenders
  */
  useEffect(() => {
    /*
        Checks whether the user is logged in
        if so, gets user data and puts into user state
      */
    const init = async () => {
      try {
        const userData = await getUser()

        // Do an authenticated request to the fragments API server and log the result
        setIsLoadingMain(true)
        const data = await getUserFragments(userData)

        if (Object.keys(data).length !== 0)
          setFragments(data)

        setIsLoadingMain(false)


        if (!userData) {
          /*
            If user not logged, then disable
            logout button, and set active for login button
          */
          setLoginButtonStatus(false)
          setLogoutButtonStatus(true)
        } else {
          /*
           After user logged we set button status and 
           set user object to userData
          */
          setLoginButtonStatus(true)
          setLogoutButtonStatus(false)

          setUser(userData)
        }



      } catch (error) { }
    }

    init()
  }, [])





  /*
    Checks if object user has data
   */
  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0
  }


  return (
    <div className="flex items-center justify-center h-screen">
      {
        isLoadingMain &&
        (

          <div role="status">
            <svg aria-hidden="true" className="w-[50px] h-[50px] mr-2 animate-spin text-zinc-500 fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          </div>

        )
      }
      {!isLoadingMain &&
        <div className="grid grid-row-2">
          <div>
            <Title text={"Fragments UI"} />
            <Title text={!isEmpty(user) ? user.username : ""} />
          </div>
          <div className="grid grid-cols-2 w-[250px] gap-5 content-center">
            <Button disabled={loginButtonStatus} onClick={handleLoginButtonClick} text={"Login"} />
            <Button disabled={logoutButtonStatus} onClick={handleLogoutButtonClick} text={"Logout"} />
          </div>
          {!isEmpty(user) ?
            <div className="mt-10">
              {notificationText.length > 0 ?
                isError ?
                  <div className="w-[250px] content-center mt-5">
                    <Notification text={notificationText}
                      title={"Warning"}
                      bgColor={"bg-red-100"}
                      borderColor={"border-red-400"}
                      textColor={"text-red-700"}
                    />
                  </div>
                  : <div className="w-[250px] content-center mt-5">
                    <Notification text={notificationText}
                      title={"Success"}
                    />
                  </div>
                : <></>
              }
              {showModalWindow ? <div><ModalWindow modalFragment={modalFragment} user={user} /></div> : <></>}
              <div>
                <div className="relative inline-block w-100 mr-2 align-middle select-none transition duration-200 ease-in mt-5">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" checked={isFile}
                      onChange={() => setIsFile(!isFile)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                     rounded-full peer dark:bg-black peer-checked:after:translate-x-full 
                    peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                    peer-checked:bg-teal-900"></div>
                    <span className="ml-3 text-sm font-medium text-black">Add File</span>
                  </label>
                </div>
                {!isFile ?
                  <div>
                    <div className="w-[250px] content-center mt-5">
                      <textarea
                        onChange={(event) => setText(event.target.value)}
                        value={text}
                        placeholder={"Fragment text"}
                        className="hover:bg-zinc-100 col-span-2 w-full p-2.5 text-black bg-white border border-zinc-500 shadow-sm outline-none appearance-none rounded-md"
                      >
                      </textarea>
                    </div>
                    <div className="w-[250px] content-center mt-5">
                      <Dropdown />
                    </div>
                    <div className="w-[250px] content-center mt-5">
                      <Button className={"col-span-2"}
                        disabled={logoutButtonStatus}
                        onClick={handleFragmentCreate} text={"Create fragment"} />
                    </div>
                  </div>
                  :
                  <div className="flex items-center justify-center w-[250px] mt-2">
                    <label className="flex flex-col items-center justify-center 
                    w-full h-64 border-2 border-black border-dashed rounded-lg cursor-pointer 
                    bg-white hover:bg-gray-100 ">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-black"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-black ">Upload fragment (5 mb)</p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" onChange={handleFileSelect} />
                    </label>
                  </div>
                }

              </div>
              <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-[450px] h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-teal-900">
                  <ul className="space-y-2">
                    {!!fragments && fragments?.map((fragment, index) => {
                      if (fragment.type.includes("image")) {
                        fragment.src = symbolsToImage(fragment.fragmentData, fragment.type)
                      }

                      return (<li key={index}>
                        <div className="max-w-md p-6 border border-teal-900 rounded-lg shadow bg-white text-black">
                          {!fragment.type.includes("image") &&
                            <a href="#">
                              <h5 className="mb-2 text-xl font-bold tracking-tight text-black">
                                {fragment.fragmentData.length > 50 ? fragment.fragmentData.substring(0, 50) + '... ' : fragment.fragmentData}
                              </h5>
                            </a>
                          }

                          {fragment.type.includes("image") &&
                            <a href="#">
                              <Image
                                src={fragment.src}
                                alt="Picture"
                                width={450}
                                height={450}
                              />
                            </a>
                          }


                          <p className="mb-5 mt-5 font-normal text-black">{fragment.type}</p>
                          <button
                            onClick={() => handleModalWindow(fragment)}
                            className="bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                            Modify
                          </button>
                        </div>
                      </li>)
                    })
                    }
                    {
                      !isFragmentSidebarLoad && (
                        <div className="max-w-md p-6 border border-teal-900 rounded-lg shadow bg-white text-black">
                          <a href="#">
                            <div className="animate-pulse w-[350px] h-[250px] bg-grey-200 border border-gray-400 rounded shadow">

                            </div>
                          </a>
                          <button
                            className="w-[85px] h-[40px] mt-5 animate-pulse bg-grey-200 text-black font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                          </button>
                          <div className="grid grid-cols-4 gap-10 mt-5">
                            <a disabled
                              className="animate-pulse bg-grey-200 border border-gray-400 rounded shadowfont-semibold py-2 px-4 rounded 
                                            inline-flex items-center justify-center h-[35px]" >
                            </a>
                            <a disabled
                              className="animate-pulse bg-grey-200 border border-gray-400 rounded shadow font-semibold py-2 px-4 rounded 
                                            inline-flex items-center justify-center h-[35px]" >
                            </a>
                            <a disabled
                              className="animate-pulse bg-grey-200 border border-gray-400 rounded shadow font-semibold py-2 px-4 rounded 
                                            inline-flex items-center justify-center h-[35px]" >
                            </a>
                            <a disabled
                              className="animate-pulse bg-grey-200 border border-gray-400 rounded shadow font-semibold py-2 px-4 rounded 
                                            inline-flex items-center justify-center h-[35px]" >
                            </a>
                          </div>
                        </div>
                      )
                    }
                  </ul>

                </div>
              </aside>
            </div >
            : <></>
          }
        </div >
      }

    </div >
  )
}
