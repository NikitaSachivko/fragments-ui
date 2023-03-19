import Button from "../components/Button"
import Title from "../components/Title"
import { Auth, getUser } from '../services/auth'
import { use, useEffect, useState } from "react"
import { getUserFragments } from '../services/api/get-user-fragments'
import Dropdown from '../components/Dropdown'
import { postUserFragment } from '../services/api/post-user-fragment'
import Notification from '../components/Notification'
import { fragmentTypeAtom } from '../../global-state'
import { useAtom } from 'jotai'
import Card from '../components/Card'

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


  const [text, setText] = useState("")
  const [notificationText, setNotificationText] = useState("")
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fragments, setFragments] = useState([])

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

  const handleFragmentCreate = async () => {
    try {
      await postUserFragment(user, fragmentType, text)
      setNotificationText("Fragment saved")
      setIsError(false)
      getUserFragments(user).then(data => {
        setFragments(data.fragments)
      })
    } catch (error) {
      setIsError(true)
      setNotificationText(error.message)
    }
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
        setIsLoading(true)
        getUserFragments(userData).then(data => {
          setFragments(data.fragments)
        })
        setIsLoading(false)

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
        isLoading &&
        (

          <div role="status">
            <svg aria-hidden="true" className="w-[50px] h-[50px] mr-2 animate-spin text-zinc-500 fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          </div>

        )
      }
      {!isLoading &&
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
              <div>
                <div className="w-[250px] content-center mt-5">
                  <input
                    onChange={(event) => setText(event.target.value)}
                    value={text}
                    placeholder={"Fragment text"}
                    className="hover:bg-zinc-100 col-span-2 w-full p-2.5 text-black bg-white border border-zinc-500 shadow-sm outline-none appearance-none rounded-md"
                  >
                  </input>
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
              <aside id="default-sidebar" class="fixed top-0 left-0 z-40 w-[450px] h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                  <ul class="space-y-2">
                    {fragments?.map((fragment, index) => {
                      return (<li key={index}>
                        <div class="max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                          <a href="#">
                            <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{fragment.id}</h5>
                          </a>
                          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{fragment.type}</p>
                        </div>
                      </li>)
                    })
                    }
                  </ul>
                </div>
              </aside>
            </div >
            : <></>
          }
        </div>
      }

    </div>
  )
}
