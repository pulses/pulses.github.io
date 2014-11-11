
    function handleUpdateGeoHotspot(data, dom_id, geo) {
        // valueTime will be zero if no data comes back
        var valueTime = data.value.valueTime;
        if(valueTime === 0){
          $('#myModal').foundation('reveal', 'open');
        }
        else {
          $('#myModal').foundation('reveal', 'close');
        }

        // $$$$$$$$$$$$ GEO $$$$$$$$$$$$
        if(geo === 'US'){
            redrawGeoUS(data, dom_id);
        }else if(geo === 'BRAZIL'){
            redrawGeoBrazil(data, dom_id);
        }else if(geo === 'WORLD'){
            redrawGeoWorld(data, dom_id);
        }else if(geo === 'ASIA'){
            redrawGeoAsia(data, dom_id);
        }else if(geo === 'EUROPE'){
            redrawGeoEuro(data, dom_id);
        }else if(geo === 'SOUTHAMERICA'){
            redrawGeoSouthAmerica(data, dom_id);
        }
        //geoObject.redrawGeo(data, dom_id);
//        redrawGeo(data, dom_id);
        var sorted = _(data.value.value.PerCapitaTopGeos.geos).sortBy("name");

        var keys = _.range(1, 9)

        var values = _.pluck(sorted, "delta")

        var newCHstatedata = _.object(keys, values);
}// end of handleUpdate(data) function

