import {state, funcs} from "./main.js"

window.addEventListener("load", async function() {
    var line_select = document.getElementById("line");
    var destination_select = document.getElementById("destination");
    var current_station_select = document.getElementById("current_station");
    var previous_station_button = document.getElementById("previous_station_button");
    var next_station_button = document.getElementById("next_station_button");
    var toggle_state_button = document.getElementById("toggle_state_button");
    var left_checkbox = document.getElementById("left_checkbox");
    var right_checkbox = document.getElementById("right_checkbox");

    line_select.addEventListener("change", line_changed);
    destination_select.addEventListener("change", selection_changed);
    current_station_select.addEventListener("change", selection_changed);
    previous_station_button.addEventListener("click", previous_station);
    next_station_button.addEventListener("click", next_station);
    toggle_state_button.addEventListener("click", toggle_state);
    left_checkbox.addEventListener("change", exit_change);
    right_checkbox.addEventListener("change", exit_change);


    // load station data
    let stations = {};
    async function load_json(){
        const font_res = await fetch("./static/data/stations.json");
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

        // set start values
        line_select.value = line;
        destination_select.value = stations[line][stations[line].length-1];
        current_station_select.value = stations[line][0];

        selection_changed();
    }


    function selection_changed(){
        try{
            funcs.clear_matrix();
        }catch{console.log("ERROR?");}
        
        // Get next stations + make string
        var next_stations = "";

        state.current_station = current_station_select.value;
        const current_index = stations[line_select.value].indexOf(current_station_select.value);
        const destination_index = stations[line_select.value].indexOf(destination_select.value);
        var direction = 0;

        if(Math.abs(destination_index - current_index) == 1){
            next_stations += "Nächste Station : ";
        }else if(Math.abs(destination_index - current_index) > 1){
            next_stations += "Nächste Stationen ";
        }else{}

        if(destination_index > current_index){
            direction = 1;
        }
        if(destination_index < current_index){
            direction = -1;
        }

        for(var i = 1;i<4;i++){
            if(stations[line_select.value][current_index+(direction*i)] != undefined){
                if(!((direction==1 && current_index+(direction*i) > destination_index) || (direction==-1 && current_index+(direction*i) < destination_index))){
                    next_stations += stations[line_select.value][current_index+(direction*i)];

                    if(i != 3 && stations[line_select.value][current_index+(direction*i)+direction] != undefined && !((direction==1 && current_index+(direction*i+direction) > destination_index) || (direction==-1 && current_index+(direction*i+direction) < destination_index))){
                        next_stations += ", ";
                    }
                }
            }
        }

        // Update disable button state
        if(current_index == 0){
            previous_station_button.disabled = true;
        }else{
            previous_station_button.disabled = false;
        }
        if(current_index+1 == stations[line_select.value].length){
            next_station_button.disabled = true;
        }else{
            next_station_button.disabled = false;
        }

        // Restart matrix while 'scroll_stop' when state changes
        if(state.mode == "scroll_stop"){
            funcs.clear_matrix();
            funcs.add_characters("Nächste Station:");
            state.text = get_current_station_string();
            state.scroll_counter = 0;
            state.mode = "scroll_stop";
        }

        // Also update current station text while in "static"
        if(state.mode == "static"){
            state.text = get_current_station_string();
        }

        // Set text on "scroll_loop"
        if(state.mode == "scroll_loop"){
            if(direction != 0){
                state.text = "S " + line_select.value.replace("S","") +
                            " nach " + destination_select.value +
                            " ".repeat(7) + //6?
                            next_stations +
                            " ".repeat(3);

                console.log(state.text);
                funcs.add_characters(state.text);
            }
        }

    }

    
    function exit_change(){
        state.exit_left = left_checkbox.checked;
        state.exit_right = right_checkbox.checked;
    }
    exit_change();


    function previous_station(){
        const current_index = stations[line_select.value].indexOf(current_station_select.value);
        current_station_select.value = stations[line_select.value][current_index-1];
        selection_changed();
    }
    function next_station(){
        const current_index = stations[line_select.value].indexOf(current_station_select.value);
        current_station_select.value = stations[line_select.value][current_index+1];
        selection_changed();
    }


    function get_current_station_string(){
        if(current_station_select.value == destination_select.value){ // Endstation
            if(funcs.get_character_length(current_station_select.value + " Endstation") <= 145-10){
                return current_station_select.value + " Endstation";
            }else{
                if(funcs.get_character_length(current_station_select.value + " Endst.") <= 145-10){
                    return current_station_select.value + " Endst.";
                }else{
                    return current_station_select.value;
                }   
            }

        }else{ // Keine Endstation
            return current_station_select.value;
        }
    }


    function toggle_state(){
        if(toggle_state_button.innerHTML == '"Nächste Station" zeigen'){
            toggle_state_button.innerHTML = 'Lauftext duchlaufen starten';

            state.text = get_current_station_string();
            funcs.clear_matrix();
            funcs.add_characters("Nächste Station:");
            state.scroll_counter = 0;
            state.mode = "scroll_stop";
        }else{
            toggle_state_button.innerHTML = '"Nächste Station" zeigen';

            funcs.clear_matrix();
            state.mode = "scroll_loop";
            selection_changed();
        }
    }

    // start values
    change_line("S1"); // random?
});