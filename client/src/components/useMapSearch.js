import { useEffect, useState } from "react";
import axios from "axios";

const isLocal = process.env.NODE_ENV === "development"; 
const host = isLocal ? "localhost" : window.location.hostname;
const port = isLocal ? 4000 : window.location.port;
const endpoint = "/users/";
const baseURL = isLocal
  ? `http://${host}:${port}`
  : `${window.location.protocol}//${host}:${port}`;
const API_URL = `${baseURL}${endpoint}`;



export default function useMapSearch(query, pageNumber) {

    const[loading, setLoading] = useState(true)
    const[error, setError] = useState(false)
    const[maps, setMaps] = useState([])
    const[hasMore, setHasMore] = useState(false)


    useEffect(() => {
        setMaps([])
    }, [query]),



    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel
        axios({
            method: 'GET', 
            url : API_URL,
            params: {q: query, page: pageNumber},
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setMaps(prevMaps => {
                return [...prevMaps, ...res.data.docs.map(b => b.geoMap)] // concatenates more maps, change b.title to the map geojson file. 
            })
            setHasMore(res.data.maps) // true if there are more maps, false if not
            console.log(res.data)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel
    }, [query, pageNumber])
    return {loading, error ,maps, hasMore}
}