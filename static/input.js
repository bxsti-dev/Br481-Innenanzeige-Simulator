window.addEventListener("load", async function() {
    var line_select = document.getElementById("line");
    var destination_select = document.getElementById("destination");
    var current_station_select = document.getElementById("current_station");

    line_select.addEventListener("change", line_changed);

    // load station data
    let stations = {};

    async function load_json(){
        const font_res = await fetch("/static/data/stations.json");
        stations = await font_res.json();
    }
    await load_json();


    // fill out line select
    for(var s = 0;s<Object.keys(stations).length;s++){
        var new_option = document.createElement("option");
        new_option.text = Object.keys(stations)[s];
        new_option.value = Object.keys(stations)[s];
        line_select.add(new_option);
    }


    function line_changed(){
        var current_line = line_select.value;
        change_line(current_line);
    }


    function change_line(line){
        // clear old select elements
        var old_select_length = destination_select.options.length;
        if(old_select_length > 0){
            for(var s = 0;s<old_select_length;s++){
                destination_select.remove(0);
                current_station_select.remove(0);
            }
        }

        // fill select elements
        for(var i = 0;i<stations[line].length;i++){
            var new_destination = document.createElement("option");
            var new_current_station = document.createElement("option");
            new_destination.text = stations[line][i];
            new_destination.value = stations[line][i];
            new_current_station.text = stations[line][i];
            new_current_station.value = stations[line][i];

            current_station_select.add(new_current_station);
            destination_select.add(new_destination);
        }

        //TODO: correct (random) start destination (first or last) + correct (random) start current_station
    }


    change_line("S1")

});