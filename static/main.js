window.addEventListener("load", async function() {
    const matrix = document.getElementById("matrix");
    const canvas = document.getElementById("canvas");

    var pixel_space = matrix.clientWidth / 145;
    var matrix_height = pixel_space * 7;

    matrix.style = "height: " + matrix_height + "px"; // set matrix height

    canvas.width = matrix.clientWidth;                // set canvas width
    canvas.height = (matrix.clientWidth / 145) * 7;   // set canvas height

    // create empty data 2d array
    data = [];
    for(var fill_y = 0;fill_y<7;fill_y++){
        data[fill_y] = [];
        for(var fill_x = 0;fill_x<145;fill_x++){
            data[fill_y][fill_x] = 0;
        }
    }

    // load json
    let font = {};

    async function load_json(){
        const font_res = await fetch("/static/data/font.json");
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


    function add_spaces(number_of_space){
        for(var y = 0;y<7;y++){
            for(var x = 0;x<number_of_space;x++){
                data[y].push(0);
            }
        }
    }


    add_characters("S2 nach Lichtenrade");
    // add_spaces(2);


    function shift_matrix(){
        for(var y = 0;y<7;y++){
            data[y].shift();
            if(data[0].length <= 145){ // no overflow
                data[y].push(0); 
            }
        }
        
        draw();
        setTimeout(shift_matrix, 40);
    }

    setTimeout(shift_matrix, 40); //use setInterval ??
});