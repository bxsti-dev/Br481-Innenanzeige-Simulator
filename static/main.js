export var state = {
    mode: "scroll_loop", // scroll_loop, scroll_stop, static
    scroll_speed: 18,    //old slow: 35 - realistic: 18,19
    text: "",
    scroll_counter: 0,
    current_station: "",
    exit_left: false,
    exit_right: false,
    is_enabled: true
}
export var funcs = {};

window.addEventListener("load", async function() {
    const matrix = document.getElementById("matrix");
    const canvas = document.getElementById("canvas");

    var pixel_space = matrix.clientWidth / 145;
    var matrix_height = pixel_space * 7;

    matrix.style = "height: " + matrix_height + "px"; // set matrix height
    canvas.width = matrix.clientWidth;                // set canvas width
    canvas.height = (matrix.clientWidth / 145) * 7;   // set canvas height

    // create empty data 2d array
    var data = [];
    for(var fill_y = 0;fill_y<7;fill_y++){
        data[fill_y] = [];
        for(var fill_x = 0;fill_x<145;fill_x++){
            data[fill_y][fill_x] = 0;
        }
    }

    // load json
    let font = {};
    async function load_json(){
        const font_res = await fetch("./static/data/font.json");
        font = await font_res.json();
    }
    await load_json();


    function draw(){
        if(canvas.getContext){
            const ctx = canvas.getContext("2d");
            const dpr = window.devicePixelRatio || 1;

            pixel_space = matrix.clientWidth / 145;
            matrix_height = pixel_space * 7;

            matrix.style = "height: " + matrix_height + "px";    // update matrix height
            canvas.style.width = matrix.clientWidth + "px";
            canvas.style.height = matrix_height + "px";
            
            canvas.width = Math.round(matrix.clientWidth * dpr); // update canvas width
            canvas.height = Math.round(matrix_height * dpr);     // update canvas height                    

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for(var y = 0;y<7;y++){
                for(var x = 0;x<145;x++){
                    ctx.beginPath();
                    ctx.arc((pixel_space/2) * (2*x+1), (pixel_space/2) * (2*y+1), (pixel_space/2)/1.4, 0, 2 * Math.PI);
                    
                    if(data[y][x] == 1){
                        ctx.fillStyle = "#ffff32";
                    }else{
                        ctx.fillStyle = "#36312b";
                    }

                    ctx.fill();
                }
            }
 
        }
    }
    draw();


    function clear_matrix(){
        data = [[],[],[],[],[],[],[]];
        for(var y = 0;y<7;y++){
            for(var x = 0;x<145;x++){
                data[y][x] = 0;
            }
        }
    }
    funcs.clear_matrix = clear_matrix; // export function -> call from input.js

    
    function add_characters(characters){ //TODO: Add /,(,) to font.json
        for(var i = 0;i<characters.length;i++){
            
            for(var y = 0;y<7;y++){
                for(var x = 0;x<5;x++){
                    data[y].push(font[characters[i]][y][x]);
                }
            }

            add_spaces(1);
        }
    }
    funcs.add_characters = add_characters; // export function -> call from input.js


    function add_spaces(number_of_spaces){
        for(var y = 0;y<7;y++){
            for(var x = 0;x<number_of_spaces;x++){
                data[y].push(0);
            }
        }
    }


    function get_character_length(characters){
        return ((characters.length*5)+(characters.length*1))-1;
    }
    funcs.get_character_length = get_character_length; // export function -> call from input.js


    function set_characters(start_x,characters){
        var cursor = 0;

        for(var i = 0;i<characters.length;i++){

            for(var y = 0;y<7;y++){
                for(var x = 0;x<5;x++){
                    data[y].splice(start_x+cursor,5, ...font[characters[i]][y]);
                }
            }
            cursor+=6;
        }
    }


    function show_arrow(direction){
        for(var y = 0;y<7;y++){                         
            if(direction == "left"){
                data[y].splice(0,5,...font["left"][y]);
                data[y].splice(140,5,...font[" "][y]);
            }
            if(direction == "right"){
                data[y].splice(0,5,...font[" "][y]);
                data[y].splice(140,5,...font["right"][y]);
            }
            if(direction == "both"){
                data[y].splice(0,5,...font["left"][y]);
                data[y].splice(140,5,...font["right"][y]);
            }
            if(direction == "none"){
                data[y].splice(0,5,...font[" "][y]);
                data[y].splice(140,5,...font[" "][y]);
            }
        }
    }


    function update(){
        if(state.is_enabled == true){
            // SCROLLING WITH INFINITE LOOP //
            if (state.mode == "scroll_loop"){
                for(var y = 0;y<7;y++){
                    data[y].shift();
                    data[y].push(data[y][144]);
                }
            }
            
            // SCROLLING WITH STOP IN CENTER //
            if (state.mode == "scroll_stop"){
                state.scroll_counter += 1;

                if(state.scroll_counter < 123){
                    for(var y = 0;y<7;y++){
                        data[y].shift();
                        data[y].push(0);
                    }
                }
                if(state.scroll_counter == parseInt(145-((145/2)-(get_character_length("Nächste Station:")/2)))){
                    setTimeout(function(){
                        clear_matrix();
                        state.mode = "static";
                    }, 1200);
                }
            }

            // STATIC CENTERED TEXT //
            if (state.mode == "static"){
                var center_start = ((145/2)-(get_character_length(state.text)/2))
                set_characters(center_start,state.text);

                if(state.exit_left == true && state.exit_right == true){
                    show_arrow("both");
                }
                if(state.exit_left == true && state.exit_right == false){
                    show_arrow("left");
                }
                if(state.exit_left == false && state.exit_right == true){
                    show_arrow("right");
                }
                if(state.exit_left == false && state.exit_right == false){
                    show_arrow("none");
                }
            }
        }

        draw();
        setTimeout(update, state.scroll_speed);
    }

    setTimeout(update, state.scroll_speed);
});