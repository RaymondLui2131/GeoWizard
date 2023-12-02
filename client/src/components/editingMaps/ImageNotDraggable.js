import React, { useState,useEffect } from 'react';
import { ImageOverlay} from 'react-leaflet';
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


export const NotDraggableImageOverlay = (props) => {
    const image = mappings[props.image]
    const initialBounds = props.initialBounds
    const color = props.color
    const id = props.id

    const [bounds,] = useState(initialBounds);
    const [imageRend, setImage] = useState(image)

    
    useEffect(() => {
      replaceWhiteWithColor(imageRend,color)
          .then(modifiedDataURL => {
            setImage(modifiedDataURL);
          })
          .catch(error => console.error('Error processing image:', error));
  }, [])


    return (
      <>
        <ImageOverlay url={imageRend} bounds={bounds} 
            interactive={true}
            zIndex={400}
            opacity={0.5}
        />
      </>
    );
  }

export default NotDraggableImageOverlay
