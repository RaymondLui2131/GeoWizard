import { useEffect, useState } from "react";
import axios from "axios";

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
            url : '',
            params: {q: query, page: pageNumber},
            cancelToken: new axios.cancelToken(c => cancel = c)
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