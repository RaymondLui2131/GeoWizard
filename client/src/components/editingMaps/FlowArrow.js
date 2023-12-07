import L from 'leaflet';
import 'leaflet-polylinedecorator';
import { Polyline, useMap } from 'react-leaflet';
import { useEffect } from 'react';
const FlowArrow = (props) => {
  const map = useMap();

  const latlngs = props.latlngs
  const id = props.id
  const colorRgba = props.colorRgba
  const setFlowArrow = props.setFlowArrow
  console.log(colorRgba)
  
  const handleClick = (polyObj) =>{
    // console.log(polyObj)
    setFlowArrow(polyObj._latlngs)
  }

  useEffect(() => {
    const polyline = L.polyline(latlngs, {
      color: colorRgba,
      ...props
    }).addTo(map)
    polyline.on('click', function(e) {
      var clickedPolyline = this;
      handleClick(clickedPolyline)
  });
    const arrowHead = L.polylineDecorator(polyline, {
      patterns: [
        {
          offset: '100%', 
          repeat: 0, 
          symbol: L.Symbol.arrowHead({
            pixelSize: 15,
            pathOptions: {
              color: colorRgba,
              fillOpacity: 1,
              weight: 2
            }
          })
        }
      ]
    }).addTo(map)

    return () => {
      arrowHead.remove()
      polyline.remove()
    }
  }, [map, latlngs, colorRgba, props])

  return null; 
};


export default FlowArrow