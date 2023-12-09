import React, { useState, useCallback, useEffect, useContext } from 'react';
import { MapContainer, ImageOverlay, Marker, useMapEvents, useMap } from 'react-leaflet';
import { drag, resize } from '../../assets/EditMapAssets/symbolImages/index.js'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { circle, triangle, square, star, hexagon, pentagon, redXSymb } from '../../assets/EditMapAssets/symbolImages/index.js'
import tinycolor from 'tinycolor2';
import 'leaflet-geometryutil';
import Transaction from '../../transactions/Transaction.js';
import { MapContext } from '../../api/MapContext.js';
const mappings = {
  'circle': circle,
  'triangle': triangle,
  'square': square,
  'star': star,
  'hexagon': hexagon,
  'pentagon': pentagon
}

function replaceWhiteWithColor(imageUrl, color) {
  return new Promise((resolve, reject) => {
    const colorObj = tinycolor(color)
    // console.log('regular color', color)
    const rgb = colorObj.toRgb()
    // console.log('rgb form', rgb)

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

const draggableIcon = new L.Icon({
  iconUrl: drag,
  iconSize: [25, 25], // Size of the icon
  iconAnchor: [12, 12], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -12] // Point from which the popup should open relative to the iconAnchor
})
const removeIcon = new L.Icon({
  iconUrl: redXSymb,
  iconSize: [25, 25], // Size of the icon
  iconAnchor: [12, 12], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -12] // Point from which the popup should open relative to the iconAnchor
});

const cornerIcon = new L.Icon({
  iconUrl: resize,
  iconSize: [25, 25], // Size of the icon
  iconAnchor: [12, 12], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -12] // Point from which the popup should open relative to the iconAnchor
});
export const DraggableImageOverlay = (props) => {
  const { transactions } = useContext(MapContext)

  const image = mappings[props.image]
  const initialBounds = props.initialBounds
  const color = props.color
  const editsList = props.editsList
  const setEditsList = props.setEditsList
  const id = props.id
  const arrayBounds = props.mapBounds

  const mapBounds = L.latLngBounds(arrayBounds[0], arrayBounds[1]);
  const boundsPolygon = [
    arrayBounds[1], // Southwest
    L.latLng(arrayBounds[1].lat, arrayBounds[0].lng), // Northwest
    arrayBounds[0], // Northeast
    L.latLng(arrayBounds[0].lat, arrayBounds[1].lng), // Southeast
    arrayBounds[1] // Close the loop
  ]

  // console.log("MAX", mapBounds)
  // console.log(arrayBounds)
  const map = useMap()
  const [bounds, setBounds] = useState(initialBounds);

  const [markerPosition, setMarkerPosition] = useState(getCenter(initialBounds));
  const [isClicked, setClicked] = useState(false)
  const [imageRend, setImage] = useState(image)
  const [northWest, setNorthWest] = useState(L.latLng(bounds[1][0], bounds[0][1]))
  // console.log(northWest)
  useEffect(() => {
    replaceWhiteWithColor(imageRend, color)
      .then(modifiedDataURL => {
        setImage(modifiedDataURL);
      })
      .catch(error => console.error('Error processing image:', error));
  }, [])

  useEffect(() => {
    console.log("hi")
    setBounds(initialBounds)
    setMarkerPosition(getCenter(initialBounds))
    setNorthWest(L.latLng(initialBounds[1][0], initialBounds[0][1]))
  }, [initialBounds])



  // console.log("currBounds", bounds)
  function getCenter(bounds) {
    // Simple function to calculate the center of the bounds
    return [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
  }

  const addUpdateBounds = (options) => {
    const { foundMapping, newBounds, editsList } = options;
    foundMapping.bounds = newBounds
    setEditsList([...editsList])
    setBounds(newBounds);
    setMarkerPosition(getCenter(newBounds))
    setNorthWest(L.latLng(newBounds[1][0], newBounds[0][1]))
    console.log("ADD BOUNDS: " + bounds)
  }

  const removeUpdateBounds = (options) => {
    const { foundMapping, oldBounds, editsList } = options;
    foundMapping.bounds = oldBounds
    setEditsList([...editsList])
    setBounds(oldBounds);
    setMarkerPosition(getCenter(oldBounds))
    setNorthWest(L.latLng(oldBounds[1][0], oldBounds[0][1]))
    console.log("REVERT BOUNDS: " + bounds)
  }


  const updateBounds = () => {
    const foundMapping = editsList.find((edit) => edit.id === id)
    if (foundMapping) {
      const oldBounds = [...foundMapping.bounds]
      const newBounds = [...bounds]
      const options = { foundMapping, oldBounds, newBounds, editsList }
      const transaction = new Transaction(options, addUpdateBounds, removeUpdateBounds)
      transactions.addTransaction(transaction)
    }
  }


  const updateImagePosition = useCallback((newPosition) => {
    // Logic to calculate new bounds based on the new marker position
    // This needs to be adjusted based on how you want the image to move
    if (!mapBounds.contains(L.latLng(newPosition.lat, newPosition.lng))) { //past mappcontainer bounds
      const closestPoint = L.GeometryUtil.closest(map, boundsPolygon, newPosition);
      newPosition.lat = closestPoint.lat
      newPosition.lng = closestPoint.lng
    }
    console.log("updating", newPosition)
    console.log("old", markerPosition)

    const latDiff = newPosition.lat - markerPosition[0];
    const lngDiff = newPosition.lng - markerPosition[1];

    const newBounds = [
      [bounds[0][0] + latDiff, bounds[0][1] + lngDiff],
      [bounds[1][0] + latDiff, bounds[1][1] + lngDiff]
    ];


    setBounds(newBounds)
    setNorthWest(L.latLng(newBounds[1][0], newBounds[0][1]))
    setMarkerPosition([newPosition.lat, newPosition.lng])


  }, [bounds, markerPosition]);


  const handleOverlayClick = () => {
    setClicked(true); // Show the marker when the overlay is clicked
    // setMarkerPosition(getCenter(bounds)); // Update marker position to the center of the bounds
  };
  const handleCornerDrag = useCallback((cornerIndex, newLatLng) => {
    const newBounds = [...bounds]
    const center = getCenter(newBounds)
    // console.log("center", center)
    // console.log("newLat", newLatLng)
    newBounds[cornerIndex] = [newLatLng.lat, newLatLng.lng];

    if (cornerIndex === 0) {
      if (newLatLng.lat < center[0] - .01)
        newBounds[cornerIndex][0] = newLatLng.lat
      else
        newBounds[cornerIndex][0] = center[0] - .01
      if (newLatLng.lng > center[1] - .01)
        newBounds[cornerIndex][1] = center[1] - .01
      else
        newBounds[cornerIndex][1] = newLatLng.lng
    } else if (cornerIndex === 1) { // NE corner
      // Prevent dragging past the center
      if (newLatLng.lat > center[0] + .01)
        newBounds[cornerIndex][0] = newLatLng.lat
      else
        newBounds[cornerIndex][0] = center[0] + .01
      if (newLatLng.lng < center[1] + .01)
        newBounds[cornerIndex][1] = center[1] + .01
      else
        newBounds[cornerIndex][1] = newLatLng.lng

    }

    setMarkerPosition(getCenter(newBounds))
    setBounds(newBounds)
    setNorthWest(L.latLng(newBounds[1][0], newBounds[0][1]))
  }, [bounds, setBounds]);

  useMapEvents({
    click: (e) => {
      if (!L.latLngBounds(bounds).contains(e.latlng)) {
        setClicked(false); // Hide the marker if click is outside the overlay bounds
      }
    }
  })

  const addSymbol = (options) => {
    const { id, editsList } = options
    let copyEdits = [...editsList]
    setEditsList(copyEdits)
  }

  const removeSymbol = (options) => {
    const { id, editsList } = options
    let copyEdits = [...editsList]
    copyEdits = copyEdits.filter(edit => edit.id !== id)//removing edit entry for new one
    // console.log("current edits List",copyEdits)
    setEditsList(copyEdits)
  }

  const handleRemove = () => {
    const options = { id, editsList }
    const transaction = new Transaction(options, removeSymbol, addSymbol)
    transactions.addTransaction(transaction)
  }

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
              dragend: () => {
                updateBounds()
              }
            }}
          />
          <Marker
            position={markerPosition}
            draggable={true}
            icon={draggableIcon}
            eventHandlers={{
              drag: (event) => {
                updateImagePosition(event.target.getLatLng())
              },
              dragend: () => {
                updateBounds()
              }
            }}
          />
          <Marker
            position={northWest}
            draggable={false}
            icon={removeIcon}
            eventHandlers={{
              click: () => handleRemove()
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
                dragend: () => {
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
