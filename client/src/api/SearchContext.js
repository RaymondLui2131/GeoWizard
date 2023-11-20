import React, { createContext, useReducer, useMemo } from 'react'

export const SearchContext = createContext()

export const SearchActionType = {
    SEARCH: "SEARCH"
}

export const mapReducer = (state, action) => {
    const { type, payload } = action
    switch (type) {
        case "SEARCH": {
            return { ...state, searchQuery: payload }
        }
        default:
            return state
    }
}


export const SearchContextProvider = ({ children }) => {
    const [state, searchDispatch] = useReducer(mapReducer, {
        searchQuery: ''
    })

    //console.log("query: " + state)
    const contextValue = useMemo(() => ({ ...state, searchDispatch }), [state])
    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    )
}