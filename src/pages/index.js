import Button from "../components/Button"
import Title from "../components/Title"
import { Auth, getUser } from '../services/auth'
import { use, useEffect, useState } from "react"
import { getUserFragments } from '../services/api/get-user-fragments'
import Dropdown from '../components/Dropdown'
import { postUserFragment } from '../services/api/post-user-fragment'
import Notification from '../components/Notification'

export default function Home() {
  /*
    Creating initial state for buttons
    will us it in future to activate or deactivate them.

    Default state will be true (disabled), because we need to wait for 
    user status first
  */
  const [loginButtonStatus, setLoginButtonStatus] = useState(false)
  const [logoutButtonStatus, setLogoutButtonStatus] = useState(true)


  const [text, setText] = useState("")
  const [notificationText, setNotificationText] = useState("")
  const [isError, setIsError] = useState(false)

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
      await postUserFragment(user, "text/plain", text)
      setNotificationText("Fragment saved")
      setIsError(false)
    } catch (error) {
      setIsError(true)
      setNotificationText(error.message)
    }
  }


  /*
    Checks whether the user is logged in
    if so, gets user data and puts into user state
  */
  const init = async () => {
    try {
      const userData = await getUser()

      // Do an authenticated request to the fragments API server and log the result
      await getUserFragments(userData)

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

  /*
    Check user object 
    every time page rerenders
  */
  useEffect(() => {
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
      <div className="grid grid-row-2 ">
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
          </div >
          : <></>
        }
      </div>
    </div>
  )
}
