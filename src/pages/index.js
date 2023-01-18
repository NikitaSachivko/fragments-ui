import Button from "../components/Button"
import Title from "../components/Title"
// import { Auth, getUser } from '../services/auth'
import { useEffect, useState } from "react"

export default function Home() {
  /*
    Creating initial state for buttons
    will us it in future to activate or deactivate them.

    Default state will be true (disabled), because we need to wait for 
    user status first
  */
  const [loginButtonStatus, setLoginButtonStatus] = useState(true)
  const [logoutButtonStatus, setLogoutButtonStatus] = useState(true)

  /*
    Object that will hold logged user data
  */
  const [user, setUser] = useState({})

  const handleLoginButtonClick = () => {
    // Auth.federatedSignIn()
  }

  const handleLogoutButtonClick = () => {
    // Auth.signOut()
  }

  /*
    Function that will handle async user read,
    it will control status of buttons and set user state
  */
  const getUserData = async () => {
    // const userData = await getUser()

    // if (!userData) {
    //   setLoginButtonStatus(false)
    //   setLogoutButtonStatus(true)
    // }
  }

  useEffect(() => {
    getUserData()

  }, [])

  return (
    <div className="App">
      <Title text={"Fragments UI"} />
      <div className="grid grid-cols-2 w-[250px] gap-5 content-center">
        <Button disabled={loginButtonStatus} onClick={handleLoginButtonClick} text={"Login"} />
        <Button disabled={logoutButtonStatus} onClick={handleLogoutButtonClick} text={"Logout"} />
      </div>
    </div>
  )
}
