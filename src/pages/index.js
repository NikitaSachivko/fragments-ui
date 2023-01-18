import Button from "../components/Button"
import Title from "../components/Title"
import { Auth, getUser } from '../services/auth'
import { useEffect, useState } from "react"


export default function Home() {
  /*
    Creating initial state for buttons
    will us it in future to activate or deactivate them.

    Default state will be true (disabled), because we need to wait for 
    user status first
  */
  const [loginButtonStatus, setLoginButtonStatus] = useState(false)
  const [logoutButtonStatus, setLogoutButtonStatus] = useState(true)

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

  /*
    Checks whether the user is logged in
    if so, gets user data and puts into user state
  */
  const init = async () => {
    try {
      const userData = await getUser()
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
    } catch (error) {
      console.log("Cannot read user data", error)
    }
  }

  /*
    Check user object 
    every time page rerenders
  */
  useEffect(() => {
    init()
  }, [])


  return (
    <div className="App">
      <Title text={"Fragments UI"} />
      <Title text={!!user ? user.username : ""} />
      <div className="grid grid-cols-2 w-[250px] gap-5 content-center">
        <Button disabled={loginButtonStatus} onClick={handleLoginButtonClick} text={"Login"} />
        <Button disabled={logoutButtonStatus} onClick={handleLogoutButtonClick} text={"Logout"} />
      </div>
    </div>
  )
}
