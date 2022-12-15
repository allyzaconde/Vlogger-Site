import React from 'react';
import { useSetState } from 'react-use';
import { createContext } from "react";

const initialState = {
    userId: '',
    token: '',
    username: '',
    isLoading: false,
    isLoggedIn: false,
    isLoggedOut: false,
}

export const AuthContext = createContext(initialState)

export const AuthProvider = ({ children }) => {
    const [state, setState] = useSetState(initialState);
    
    const setUserId = (userId) => setState({userId})
    const setToken = (token) => setState({token})
    const setUsername = (username) => setState({username})
    const setLoading = (isLoading) => setState({isLoading})
    const setLoggedIn = (isLoggedIn) => setState({isLoggedIn})
    const setLoggedOut = (isLoggedOut) => setState({isLoggedOut})

    function login(userId, token, username) {
        if(userId !== "" || token !== "" || username !== ""){
            setUserId(userId)
            setToken(token)
            setUsername(username)
            setLoggedIn(true)
            setLoggedOut(false)
            loading()
        }
    }
    
    function logout(){
        setUserId("")
        setToken("")
        setUsername("")
        setLoggedIn(false)
        setLoggedOut(true)
        loading()
    }

    function loading(){
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }
    

    return(
        <AuthContext.Provider 
            value = {{
                state,
                login,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );

};