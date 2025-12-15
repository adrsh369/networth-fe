import { createContext, useEffect, useState } from 'react'
import { getUser } from '../database/db'

export const UserContext = createContext(null)

export function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadUser = async () => {
            const data = await getUser()
            setUser(data)
            setLoading(false)
        }
        loadUser()
    }, [])

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    )
}
