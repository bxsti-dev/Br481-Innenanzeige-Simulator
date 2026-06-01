export var state = {
    mode: "scroll_loop", // scroll_loop, scroll_stop, static
    text: ""
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

    //TODO: Add /,(,) to font.json
    function add_characters(characters){
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


    function update(){
        // SCROLLING WITH INFINITE LOOP //
        if (state.mode == "scroll_loop"){
            for(var y = 0;y<7;y++){
                data[y].shift();
                data[y].push(data[y][144]);
            }
        }
        
        // SCROLLING WITH STOP IN CENTER //
        if (state.mode == "scroll_stop"){

        }

        // STATIC CENTERED TEXT //
        if (state.mode == "static"){

        }

        draw();
        setTimeout(update, 40);
    }

    setTimeout(update, 40);
});