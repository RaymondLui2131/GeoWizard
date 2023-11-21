// GeoBuf Compression API
import geobuf from 'geobuf'
import Pbf from 'pbf'
const { Buffer } = require('buffer');

export const geojson_compress = (data) =>{
    const encoded = Buffer.from(geobuf.encode(data, new Pbf()));
    //let sizeInBytes = Buffer.from(encoded).length;
    //console.log(`Size of encoded data: ${sizeInBytes} bytes`);
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