import React, { createContext, useReducer } from 'react'

export const MapContext = createContext()

export const MapActionType = {
    UPLOAD: "UPLOAD"
}

export const mapReducer = (state, action) => {
    const { type, payload } = action
    switch (type) {
        case "UPLOAD": {
            return { ...state, map: payload }
        }

        default:
            return state
    }
}


export const MapContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(mapReducer, {
        map: null
    })

    console.log("Map State: " + state)

    return (
        <MapContext.Provider value={{ ...state, dispatch }}>
            {children}
        </MapContext.Provider>
    )
}