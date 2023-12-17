import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import tinycolor from "tinycolor2";
import {
  faChartBar,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import finland from "../../assets/finland.png";
import { MAP_TYPES, STRING_MAPPING } from "../../constants/MapTypes";
import { getMap } from "../../api/map_request_api";
import { MapContext, MapActionType } from "../../api/MapContext";
import { UserContext } from "../../api/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import geobuf_api from "../../api/geobuf_api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import FlowArrow from "../editingMaps/FlowArrow.js";
import NotDraggableImageOverlay from "../editingMaps/ImageNotDraggable.js";
import PointMarkerNotEditable from "../editingMaps/PointMarkerNotEditable.js";

const hlsaToRGBA = (hlsa) => {
  const color = tinycolor(hlsa);
  const rgba = color.toRgb();
  const rgbaString = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  return rgbaString;
};

const ProfileMapCard = React.memo(({ map_data, res }) => {
  const data = geobuf_api.geojson_decompress(res.MapData.original_map);
  const { dispatch } = useContext(MapContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const getDatePosted = () => {
    const date = new Date(map_data?.createdAt);
    const month = date.getMonth() + 1; // Months are zero-indexed
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2); // Getting last two digits of the year

    // Padding the month and day with leading zeros if necessary
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedMonth}/${formattedDay}/${year}`;
  };

  const generatePreview = () => {
    if (!res) {
      return <img src={finland} className="w-full h-full object-cover"></img>;
    }
    var center = [0, 0];
    var padded_NE = [0, 0];
    var padded_SW = [0, 0];
    const mapType = res.mapType;
    const edits = res.MapData.edits;
    const geoJsonLayer = L.geoJSON(data);
    const bounds = geoJsonLayer.getBounds();
    center = bounds.getCenter();
    //Padding for bounds
    const currNe = bounds.getNorthEast();
    const currSw = bounds.getSouthWest();
    currNe.lat = currNe.lat + 5;
    currSw.lat = currSw.lat - 5;
    currNe.lng = currNe.lng + 5;
    currSw.lng = currSw.lng - 5;
    padded_NE = currNe;
    padded_SW = currSw;

    const styleMapping = {};
    edits.editsList.forEach((edit) => {
      switch (MAP_TYPES[mapType]) {
        case MAP_TYPES["HEATMAP"]: {
          //console.log("Adding", edit.featureName)
          styleMapping[edit.featureName] = {
            fillColor: hlsaToRGBA(edit.colorHLSA),
            fillOpacity: 0.7,
          };
          break;
        }
        case MAP_TYPES["CHOROPLETH"]: {
          // console.log("Adding", edit.featureName)
          styleMapping[edit.featureName] = {
            fillColor: edit.colorHEX,
            fillOpacity: 0.7,
          };
          break;
        }
        default:
          break;
      }
    });

    const possibleNames = ["name", "nom", "nombre", "title", "label", "id"];

    const getFeatureStyleView = (feature) => {
      const foundName = possibleNames.find(
        (propertyName) => propertyName in feature.properties
      );
      if (feature) {
        return styleMapping[feature.key] || { fillColor: "#ffffff" };
      }
      return {};
    };

    return (
      <>
        <MapContainer
          center={center}
          zoom={6}
          className="w-full h-full object-cover"
          scrollWheelZoom={true}
          maxBounds={[padded_NE, padded_SW]}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {Object.keys(res).length ? (
            <>
              <GeoJSON
                data={data.features}
                pointToLayer={(feature, latlng) => {
                  if (feature.properties && feature.properties.iconUrl) {
                    const icon = L.icon({
                      iconUrl: feature.properties.iconUrl,
                      iconSize: [32, 32],
                    });
                    const marker = L.marker(latlng, { icon });
                    return marker;
                  }
                  return L.circleMarker(latlng);
                }}
                onEachFeature={(feature, layer) => {
                  if (feature.geometry.type === "Point") {
                    return;
                  }
                  if (
                    MAP_TYPES[mapType] === MAP_TYPES["CHOROPLETH"] ||
                    MAP_TYPES[mapType] === MAP_TYPES["HEATMAP"]
                  ) {
                    const featureStyle = getFeatureStyleView(feature);
                    layer.setStyle(featureStyle);
                  }
                }}
              />
              {MAP_TYPES[mapType] === MAP_TYPES["SYMBOL"]
                ? edits.editsList.map((edit) => (
                    <NotDraggableImageOverlay
                      key={edit.id}
                      id={edit.id}
                      image={edit.symbol}
                      initialBounds={edit.bounds}
                      color={edit.colorHLSA}
                    />
                  ))
                : null}
              {MAP_TYPES[mapType] === MAP_TYPES["POINT"]
                ? edits.editsList.map((edit) => (
                    <PointMarkerNotEditable
                      key={edit.id}
                      id={edit.id}
                      edit={edit}
                    />
                  ))
                : null}
              {MAP_TYPES[mapType] === MAP_TYPES["FLOW"]
                ? edits.editsList.map((edit) => (
                    <FlowArrow
                      key={edit.id}
                      id={edit.id}
                      latlngs={edit.latlngs}
                      colorRgba={edit.colorRgba}
                    />
                  ))
                : null}
            </>
          ) : null}
        </MapContainer>
      </>
    );
  };

  const handleViewMap = () => {
    if (res) {
      if (user?._id === id) {
        // if visiting own profile page; allow user to directly update it
        dispatch({
          type: MapActionType.UPDATE,
          payload: {
            map: data,
            mapObj: {
              title: res.title,
              description: res.description,
              MapData: res.MapData,
              isPublic: res.isPublic,
            },
            idToUpdate: map_data?._id,
          },
        });
        navigate("/editingMap");
      } else {
        // if viewing someone else's map
        res.MapData.original_map = data;
        dispatch({ type: MapActionType.VIEW, payload: res });
        navigate("/mapView");
      }
    }
  };

  return (
    <li
      className="w-full flex justify-between bg-white shadow-sleek hover:bg-opacity-90 hover:cursor-pointer"
      id={map_data?._id}
      onClick={handleViewMap}
    >
      <div className="w-1/3">{res && generatePreview()}</div>
      <div className="flex flex-col justify-evenly text-center items-center">
        <div className="flex items-center">
          <p className="font-PyeongChangPeace-Bold text-lg">
            {map_data?.title}
          </p>
          {!map_data?.isPublic && (
            <span className="text-sm font-NanumSquareNeoOTF-Lt ml-2 px-1 bg-gray-100">
              Private
            </span>
          )}
        </div>
        <p className="font-PyeongChangPeace-Light">{`Published: ${
          map_data && getDatePosted()
        }`}</p>
        <p className="w-fit font-PyeongChangPeace-Light px-8 rounded-3xl bg-primary-GeoOrange">
          {STRING_MAPPING[MAP_TYPES[map_data?.mapType]]}
        </p>
        <div className="flex justify-center items-center font-PyeongChangPeace-Light gap-1">
          <FontAwesomeIcon icon={faChartBar} />
          {`${map_data?.comments.length} Comment${
            map_data?.comments.length ? "s" : ""
          }`}
        </div>
      </div>
      <div className="flex justify-center items-center font-PyeongChangPeace-Light mr-4 text-lg gap-2">
        <FontAwesomeIcon icon={faThumbsUp} />
        <p>{map_data?.likes}</p>
        {/* <FontAwesomeIcon icon={faThumbsDown} /> */}
      </div>
    </li>
  );
});

export default ProfileMapCard;
