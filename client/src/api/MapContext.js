import React, { createContext, useReducer, useMemo } from 'react'
import jsTPS from './jsTPS'
export const MapContext = createContext()

export const MapActionType = {
    UPLOAD: "UPLOAD",
    VIEW: "VIEW",
    RESET: "RESET",
    FORK: "FORK",
    UPDATE: "UPDATE"
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
            return { ...state, map: null, mapObj: null, createOrSave: 'create', idToUpdate: '' }
        }

        case "FORK": {
            state.transactions.clearAllTransactions()
            return { ...state, map: payload.map, mapObj: payload.mapObj, createOrSave: 'create' }
        }

        case "UPDATE": { // called if from profile
            state.transactions.clearAllTransactions()
            return { ...state, map: payload.map, mapObj: payload.mapObj, createOrSave: 'save', idToUpdate: payload.idToUpdate }
        }

        default:
            return state
    }
}


export const MapContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(mapReducer, {
        map: null,
        mapObj: null,
        createOrSave: 'create',
        idToUpdate: '',
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