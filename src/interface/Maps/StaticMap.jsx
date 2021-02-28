import React from "react";

const G_MAP_KEY = process.env.REACT_APP_GKEY;

const circle = ( lat, lng, rad, detail = 8 ) => {
    var uri = 'https://maps.googleapis.com/maps/api/staticmap?';
    var staticMapSrc = 'center=' + lat + ',' + lng;
    staticMapSrc += '&size=256x128';
    staticMapSrc += `&key=${G_MAP_KEY}`;
    staticMapSrc += '&scale=2';
    staticMapSrc += '&zoom=16';
    staticMapSrc += '&path=color:orange|weight:1|fillcolor:orange';

    var r = 6371;

    var pi = Math.PI;

    var _lat = (lat * pi) / 180;
    var _lng = (lng * pi) / 180;
    var d = (rad / 1000) / r;

    var i = 0;

    for (i = 0; i <= 360; i += detail) {
        var brng = i * pi / 180;

        var pLat = Math.asin(Math.sin(_lat) * Math.cos(d) + Math.cos(_lat) * Math.sin(d) * Math.cos(brng));
        var pLng = ((_lng + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(_lat), Math.cos(d) - Math.sin(_lat) * Math.sin(pLat))) * 180) / pi;
        pLat = (pLat * 180) / pi;

        staticMapSrc += "|" + pLat + "," + pLng;
    }

    return uri + encodeURI(staticMapSrc);
}

export default function StaticMap({ lat, lng, radius }) {

    return (
        <img src={circle(lat, lng, radius)} alt="Image" width="256" />
    )
}
