window.onload=function() {
    canv=document.getElementById("gameCanvas");
    ctx=canv.getContext("2d");
    document.addEventListener("keydown",move);
    setInterval(game,1000/12);
}
snake_x=snake_y=10;
gridSize=tiles=20;
pill_x=pill_y=15;
x_velocity=y_velocity=0;
trail=[];
tail = 1;
function game() {
    snake_x+=x_velocity;
    snake_y+=y_velocity;
    if(snake_x<0) {
        snake_x= tiles-1;
    }
    if(snake_x>tiles-1) {
        snake_x= 0;
    }
    if(snake_y<0) {
        snake_y= tiles-1;
    }
    if(snake_y>tiles-1) {
        snake_y= 0;
    }
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);
 
    ctx.fillStyle="white";
    for(var i=0;i<trail.length;i++) {
        ctx.fillRect(trail[i].x*gridSize,trail[i].y*gridSize,gridSize-2,gridSize-2);
        if(trail[i].x==snake_x && trail[i].y==snake_y) {
            tail = 1;
        }
    }
    trail.push({x:snake_x,y:snake_y});
    while(trail.length>tail) {
    trail.shift();
    }
 
    if(pill_x==snake_x && pill_y==snake_y) {
        tail++;
        pill_x=Math.floor(Math.random()*tiles);
        pill_y=Math.floor(Math.random()*tiles);
    }
    ctx.fillStyle="grey";
    ctx.fillRect(pill_x*gridSize,pill_y*gridSize,gridSize-2,gridSize-2);
}
function move(evt) {
    switch(evt.key) {
        case 'ArrowUp':
            x_velocity=0;y_velocity=-1;
            break;
        case 'ArrowLeft':
            x_velocity=-1;y_velocity=0;
            break;
        case 'ArrowDown':
            x_velocity=0;y_velocity=1;
            break;
        case 'ArrowRight':
            x_velocity=1;y_velocity=0;
            break;
    }
}