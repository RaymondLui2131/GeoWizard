import React, { createContext, useReducer, useMemo } from 'react'
import jsTPS from './jsTPS'
export const MapContext = createContext()

export const MapActionType = {
    UPLOAD: "UPLOAD",
    VIEW: "VIEW",
    RESET: "RESET",
    FORK: "FORK"
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
            state.transactions.clearAllTransactions()
            return { ...state, map: null, mapObj: null }
        }

        case "FORK": {
            state.transactions.clearAllTransactions()
            return { ...state, map: payload.map, mapObj: payload.mapObj }
        }

        default:
            return state
    }
}


export const MapContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(mapReducer, {
        map: null,
        mapObj: null,
        transactions: new jsTPS()
    })

    //console.log("Map State: " + state)
    const contextValue = useMemo(() => ({ ...state, dispatch }), [state])
    return (
        <MapContext.Provider value={contextValue}>
            {children}
        </MapContext.Provider>
    )
}