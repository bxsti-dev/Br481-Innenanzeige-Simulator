window.onload = function(){
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



    function shift_matrix(){
        data[0].shift();
        data[0].push(1);
        
        draw();

        setTimeout(shift_matrix, 500);
    }

    setTimeout(shift_matrix, 500); //use setInterval ??
}