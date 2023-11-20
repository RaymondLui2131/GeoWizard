import { useEffect, useState, useRef } from "react";
import axios from "axios";
import HomeScreenMapCard from "./HomeScreenMapCard";
//import { getMap } from "../api/map_request_api";
const isLocal = process.env.NODE_ENV === "development";
const host = isLocal ? "localhost" : window.location.hostname;
const port = isLocal ? 4000 : window.location.port;
const endpoint = "/maps/";
const baseURL = isLocal
    ? `http://${host}:${port}`
    : `${window.location.protocol}//${host}:${port}`;
const API_URL = `${baseURL}${endpoint}`;


export default function useMapSearch(query, pageNumber) {

    const[loading, setLoading] = useState(true)
    const[error, setError] = useState(false)
    const[maps, setMaps] = useState([])
    const[hasMore, setHasMore] = useState(false)
    const isInitialMount = useRef(true);


    //reset maps if query changes
    useEffect(() => {
        setMaps([])
    }, [query]),



    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        console.log('Effect running:', { query, pageNumber });
        setLoading(true)
        setError(false)
        let cancel
        axios({
            method: 'GET', 
            url : `${API_URL}getAllMaps`,
            params: {q: query, page: pageNumber},
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            //console.log(res)
            setMaps(prevMaps => {
                return [...new Set([...prevMaps, ...res.data.map(m => <HomeScreenMapCard mapObject={m}> </HomeScreenMapCard>)])] // concatenates more maps, change b.title to the map geojson file. 
            })
            setHasMore(res.data.length > 0) // true if there are more maps, false if not
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel
    }, [query, pageNumber])
    return {loading, error ,maps, hasMore}
}