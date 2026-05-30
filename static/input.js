import {state, funcs} from "./main.js"

window.addEventListener("load", async function() {
    var line_select = document.getElementById("line");
    var destination_select = document.getElementById("destination");
    var current_station_select = document.getElementById("current_station");

    line_select.addEventListener("change", line_changed);
    destination_select.addEventListener("change", selection_changed);
    current_station_select.addEventListener("change", selection_changed);

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

        // fill select elements with stations
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

        // set random start values
        line_select.value = line;
        // console.log(Object.keys(stations));
        // console.log(stations["S1"]);
        // console.log(stations[line].length);
        //destination_select.value = Object.keys(stations)[-1]; //random first || last ???
        //current_station_select.value = "";                    //random               ???
        //TODO: correct (random) start destination (first or last) + correct (random) start current_station

        selection_changed();
    }


    function selection_changed(){
        try{
            funcs.clear_matrix();
        }catch{console.log("ERROR?");}
        
        // Get next stations
        //TODO: Get next Stations based on destination!!!! (back,forward,early end in the middle) !!!!!!!!!!!!!!!!!
        var next_stations = "";

        if(stations[line_select.value].indexOf(current_station_select.value)+1 == stations[line_select.value].length-1){
            next_stations += "Nächste Station: ";
        }else if(stations[line_select.value].indexOf(current_station_select.value)+1 < stations[line_select.value].length-1){
            next_stations += "Nächste Stationen: ";
        }else{}

        const current_index = stations[line_select.value].indexOf(current_station_select.value);

        for(var i = 1;i<4;i++){
            if(stations[line_select.value][current_index+i] != undefined){
                next_stations += stations[line_select.value][current_index+i];

                if(i != 3 && stations[line_select.value][current_index+i+1] != undefined){
                    next_stations += ", ";
                }
            }
        }

        // Set state
        state.mode = "scroll_loop";
        state.text = "S " + line_select.value.replace("S","") +
                    " nach " + destination_select.value +
                    " ".repeat(19) +
                    next_stations +
                    " ".repeat(3); //TODO: Verify spaces?
        console.log(state.text);

        funcs.add_characters(state.text);
    }


    // start values
    change_line("S1") // random?
});