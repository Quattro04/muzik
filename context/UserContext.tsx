import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface UserCtx {
    user: string | undefined;
    setUser: (u: string) => void;
};

const UserContext = createContext<UserCtx>(
    {
        user: undefined,
        setUser: () => {}
    }
);

export function UserContextProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<string | undefined>(undefined);

    useEffect(() => {
        const userFromLS = localStorage.getItem('user');
        if (userFromLS) {
            setUser(userFromLS)
        }
    }, [])

    return (
        <UserContext.Provider
            value={{
                user,
                setUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("Context must be used within a Provider");
    }
    return context;
}