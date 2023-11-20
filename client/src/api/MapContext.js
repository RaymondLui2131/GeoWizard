import React, { createContext, useReducer, useMemo } from 'react'

export const MapContext = createContext()

export const MapActionType = {
    UPLOAD: "UPLOAD",
    VIEW: "VIEW",
    RESET: "RESET"
}

export const mapReducer = (state, action) => {
    const { type, payload } = action
    switch (type) {
        case "UPLOAD": {
            return { ...state, map: payload }
        }
        case "VIEW": {
            return { ...state, map: payload }
        }

        case "RESET": {
            return { ...state, map: null }
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
    const contextValue = useMemo(() => ({ ...state, dispatch }), [state])
    return (
        <MapContext.Provider value={contextValue}>
            {children}
        </MapContext.Provider>
    )
}