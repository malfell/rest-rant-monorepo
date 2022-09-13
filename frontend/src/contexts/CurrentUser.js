import { createContext, useEffect, useState } from "react";


export const CurrentUser = createContext()

function CurrentUserProvider({ children }){

    const [currentUser, setCurrentUser] = useState(null)
    // sends a fetch request
    useEffect(() => {
        const getLoggedInUser = async () => {
            let response = await fetch('http://localhost:5000/authentication/profile')
            let user = await response.json()
            setCurrentUser(user)
        }
        getLoggedInUser()
    }, [])
    // this will make setCurrentUser available in DevTools
    window.setCurrentUser = setCurrentUser

    return (
        <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </CurrentUser.Provider>
    )
}

export default CurrentUserProvider