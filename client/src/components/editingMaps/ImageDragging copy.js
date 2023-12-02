import React, { useState, useCallback,useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, useMapEvents, useMap } from 'react-leaflet';
import {drag, resize} from '../../assets/EditMapAssets/symbolImages/index.js'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { circle, triangle, square, star, hexagon, pentagon } from '../../assets/EditMapAssets/symbolImages/index.js'
import tinycolor from 'tinycolor2';

const mappings = {
  'circle': circle,
  'triangle': triangle,
  'square': square,
  'star': star,
  'hexagon': hexagon,
  'pentagon': pentagon
}

function replaceWhiteWithColor(imageUrl,color) {
  return new Promise((resolve, reject) => {
      const colorObj = tinycolor(color)
      console.log('regular color' ,color)
      const rgb = colorObj.toRgb()
      console.log('rgb form',rgb)

      const image = new Image()
      image.crossOrigin = 'Anonymous'
      image.onload = () => {
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.width = image.width
          canvas.height = image.height
          context.drawImage(image, 0, 0)
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          for (let i = 0; i < data.length; i += 4) {
              if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) { // if white
                  data[i] = rgb.r    // red
                  data[i + 1] = rgb.g    // green
                  data[i + 2] = rgb.b    // blue
              }
          }

          context.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL());
      };

      image.onerror = (error) => {
          reject(error);
      };

      image.src = imageUrl;
  });
}



export const DraggableImageOverlay = (props) => {
    const image = mappings[props.image]
    const initialBounds = props.initialBounds
    const color = props.color
    const id = props.id

    const map = useMap()
    const [bounds, setBounds] = useState(initialBounds);
    const [markerPosition, setMarkerPosition] = useState(getCenter(initialBounds));
    const [isClicked, setClicked] = useState(false)
    const [imageRend, setImage] = useState(image)

    

    useEffect(() => {
      replaceWhiteWithColor(imageRend,color)
          .then(modifiedDataURL => {
            setImage(modifiedDataURL);
          })
          .catch(error => console.error('Error processing image:', error));
  }, [])



    console.log("currBounds", bounds)
    function getCenter(bounds) {
      // Simple function to calculate the center of the bounds
      return [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
    }
    
    const updateBounds = () =>
    {
      const copyEdits = [...editsList]
      const foundMapping = copyEdits.find((edit) => edit.id === id) 
      if(foundMapping)
      {
        foundMapping.bounds = bounds
      }
      console.log('new edits list',copyEdits)
      // console.log()
      setEditsList(copyEdits)

    }
    const updateImagePosition = useCallback((newPosition) => {
      // Logic to calculate new bounds based on the new marker position
      // This needs to be adjusted based on how you want the image to move
      console.log("updating", newPosition)
      console.log("old", markerPosition)

      const latDiff = newPosition.lat - markerPosition[0];
      const lngDiff = newPosition.lng - markerPosition[1];
  
      const newBounds = [
        [bounds[0][0] + latDiff, bounds[0][1] + lngDiff],
        [bounds[1][0] + latDiff, bounds[1][1] + lngDiff]
      ];
  
      
      setBounds(newBounds);
      setMarkerPosition([newPosition.lat, newPosition.lng]);

      
    }, [bounds, markerPosition]);
  

    const handleOverlayClick = () => {
        setClicked(true); // Show the marker when the overlay is clicked
        // setMarkerPosition(getCenter(bounds)); // Update marker position to the center of the bounds
      };
    const handleCornerDrag = useCallback((cornerIndex, newLatLng) => {
        const newBounds = [...bounds]
        const center = getCenter(newBounds)
        console.log("center",center)
        console.log("newLat",newLatLng)
        newBounds[cornerIndex] = [newLatLng.lat, newLatLng.lng];
        
        if (cornerIndex === 0) { 
          if (newLatLng.lat < center[0] - .01)
              newBounds[cornerIndex][0] = newLatLng.lat
            else
              newBounds[cornerIndex][0] = center[0] - .01
            if(newLatLng.lng > center[1] - .01)
                newBounds[cornerIndex][1] = center[1] - .01
            else
                newBounds[cornerIndex][1] = newLatLng.lng 
        } else if (cornerIndex === 1) { // NE corner
            // Prevent dragging past the center
            if (newLatLng.lat > center[0] + .01)
              newBounds[cornerIndex][0] = newLatLng.lat
            else
              newBounds[cornerIndex][0] = center[0] + .01
            if(newLatLng.lng < center[1] + .01)
                newBounds[cornerIndex][1] = center[1] + .01
            else
                newBounds[cornerIndex][1] = newLatLng.lng 

        }
       
        setMarkerPosition(getCenter(newBounds))
        setBounds(newBounds)
    }, [bounds, setBounds]);
    useMapEvents({
    click: (e) => {
        if (!L.latLngBounds(bounds).contains(e.latlng)) {
        setClicked(false); // Hide the marker if click is outside the overlay bounds
        }
    }
    });
    return (
      <>
        <ImageOverlay url={imageRend} bounds={bounds} 
            interactive={true}
            zIndex={400}
            opacity={0.5}
            eventHandlers={{
                click: handleOverlayClick,
              }}
        />
        {isClicked ?
    <>
        <Marker 
            position={markerPosition}
            draggable={true}
            icon={draggableIcon}
            eventHandlers={{
                drag: (event) => {
                    updateImagePosition(event.target.getLatLng())
                },
                dragend: () =>{
                    updateBounds()
                }
            }}
        />
        {bounds.map((cornerLatLng, index) => (
            <Marker
                key={index}
                position={cornerLatLng}
                draggable={true}
                icon={cornerIcon}
                eventHandlers={{
                    drag: (event) => handleCornerDrag(index, event.target.getLatLng()),
                    dragend: () =>{
                      updateBounds()
                  }
                }}
            />
        ))}
    </>
    : null
}
      </>
    );
  }

export default DraggableImageOverlay
