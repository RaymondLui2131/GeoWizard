// GeoBuf Compression API
import geobuf from 'geobuf'
import Pbf from 'pbf'
const { Buffer } = require('buffer');
const gp = require("geojson-precision")
export const geojson_compress = (data) =>{
    const trimmed_data = gp.parse(data, 3)
    const encoded = Buffer.from(geobuf.encode(trimmed_data, new Pbf()));
    console.log(encoded.byteLength / 1e6)
    return encoded
}

export const geojson_decompress = (data) =>{
    const buffer = Buffer.from(data.data);
    const decoded = geobuf.decode(new Pbf(buffer));
    // console.log(decoded)
    return decoded
}


const geobuf_api = {
    geojson_compress,
    geojson_decompress
}

export default geobuf_api

// Given a Pbf object with Geobuf data, return a GeoJSON object. 
// When loading Geobuf data over XMLHttpRequest, you need to set responseType to arraybuffer.