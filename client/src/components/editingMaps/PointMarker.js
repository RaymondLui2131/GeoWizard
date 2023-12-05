import { p1, p2, p3, p4, p5, p6, p7, p8, p9, redX} from '../../assets/EditMapAssets/pointerImages/index.js'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { MapContainer, ImageOverlay, Marker, useMapEvents, useMap } from 'react-leaflet';
const mappings = {
    "p1": p1,
    'p2': p2,
    'p3': p3,
    'p4': p4,
    'p5': p5,
    'p6': p6,
    'p7': p7,
    'p8': p8,
    'p9': p9
}
  
export const PointMarker = (props) => {
    const id = props.id
    const edit = props.edit
    const editsList = props.editsList
    const setEditsList = props.setEditsList
    console.log(edit)
    const deleteCoords = [(edit.bounds[1][0] + edit.bounds[0][0])/2,(edit.bounds[1][1] + edit.bounds[0][1])/2]
    //const deleteButton = [edit.bounds[1][0], edit.bounds[1][1]]
    //const test = [edit.bounds[0][0], edit.bounds[0][1]]
    
    //console.log(edit.point)
    const image = mappings[edit.point]

    
    const customIcon = L.divIcon({
        html: `<div style="text-align: center; font-size: 1rem;">
                    <img src="${image}" style="width:2rem; height:2rem;" alt="marker"/>
                    <span style="font-weight: bold; font-size: 0.6rem; white-space: nowrap;">${edit.description}</span>
               </div>`,
        className: 'custom-icon', // You can use a custom class for additional styling
        iconSize: [25, 25], // Set this to the scaled size of your image
        iconAnchor: [12, 12] // The anchor should be at the bottom-center of the scaled image
    })


    const deleteIcon = L.divIcon({
        html: `<img src="${redX}" style="width:1rem; height:1rem;" alt="delete"/>`,
        className: 'custom-icon', // Use a custom class for additional styling if needed
        iconSize: [12, 12], // Set this to the desired size of your delete icon
        iconAnchor: [24, 16] // Adjust the anchor as needed
    })

    const deleteMarker = () => {
        console.log(`Delete Marker with id: ${id}`)
        setEditsList(editsList.filter((item) => item.id !== id))
    }


    return ( 
        <>
        {edit.address == "" ?<Marker
            position={deleteCoords}
            icon={deleteIcon}
            eventHandlers={{
                click: deleteMarker,
              }}
        /> 
        :
        <Marker
            position={[edit.lat + .00005, edit.long- .00005]}
            icon={deleteIcon}
            eventHandlers={{
                click: deleteMarker,
              }}
        /> 
        }     

        <Marker
            position={[edit.lat, edit.long]}
            icon={customIcon}
        /> 
        </>
        
    )
    
}

export default PointMarker