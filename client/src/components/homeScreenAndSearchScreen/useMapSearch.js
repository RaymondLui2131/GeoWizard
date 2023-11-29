import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import HomeScreenMapCard from './HomeScreenMapCard'
const isLocal = process.env.NODE_ENV === 'development'
const host = isLocal ? 'localhost' : window.location.hostname
const port = isLocal ? 4000 : window.location.port
const endpoint = '/maps/'
const baseURL = isLocal
  ? `http://${host}:${port}`
  : `${window.location.protocol}//${host}:${port}`
const API_URL = `${baseURL}${endpoint}`
import geobuf_api from '../../api/geobuf_api'

export default function useMapSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true) //indicates if the data is being loaded.
  const [error, setError] = useState(false) //indicates if there's an error in data fetching.
  const [maps, setMaps] = useState([]) //holds the fetched map data.
  const [hasMore, setHasMore] = useState(false) // indicates if there are more maps to load beyond the current page.
  const isInitialMount = useRef(true)

  //reset maps if query changes
  useEffect(() => {
    setMaps([])
  }, [query]),
  
  useEffect(() => {
    console.log('Effect running:', { query, pageNumber })
    setLoading(true)
    setError(false)
    let cancel
    axios({ //api call
      method: 'GET',
      url: `${API_URL}queryMaps`,
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setMaps((prevMaps) => {
          return [
            ...new Set([
              ...prevMaps,
              ...res.data.map((m) => {
                // Check if mapObject has MapData and original_map before decompression
                if (m.MapData && m.MapData.original_map) {
                  m.MapData.original_map = geobuf_api.geojson_decompress(
                    m.MapData.original_map,
                  )
                }
                return <HomeScreenMapCard key={m._id} mapObject={m} />
              }),
            ]),
          ]
        })
        setHasMore(res.data.length > 0) // true if there are more maps
        setLoading(false)
      })
      .catch((e) => {
        if (axios.isCancel(e)) return
        setError(true)
      })
    return () => cancel
  }, [query, pageNumber])
  return { loading, error, maps, hasMore }
}
