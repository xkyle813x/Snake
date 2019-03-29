function checkHighScore(score, callback){
    let req = new XMLHttpRequest();
    req.open('POST', '/checkscore');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	req.responseType = 'json';
	req.onload = function(evt) { callback( req ); };
	let obj = { score: score };
	req.send( JSON.stringify( obj ));
}



function updateHighScore(score, callback){
    let req = new XMLHttpRequest();
    req.open('POST', '/updatescore');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt) { callback( req ); };
    let obj = { score:score };
	req.send( JSON.stringify( obj ));
}

window.onload=function() {
    canv=document.getElementById("gameCanvas");
    ctx=canv.getContext("2d");
    document.addEventListener("keydown",move);
    setInterval(game,1000/12);
}
const scoreText = document.getElementById("scoreText");
const logMessage = document.getElementById("LogMessage");
var score = 0
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
 
    ctx.fillStyle="purple";
    for(var i=0;i<trail.length;i++) {
        ctx.fillRect(trail[i].x*gridSize,trail[i].y*gridSize,gridSize-2,gridSize-2);
        if((trail[i].x==snake_x && trail[i].y==snake_y) && (trail[i].x != 10 && trail[i].y != 10)) {
            tail = 1;
            if(document.cookie){
                checkHighScore(score,  (req) => {
                    let res = req.response;
                    if(res.ok){
                        console.log('New High Score');
                        updateHighScore(score,  (req) => {
                            let res2 = req.response;
                            if(res2.ok){
                                console.log("High Score Registered");
                                console.log(score);
                                document.cookie = "highscore = "+ score.toString();
                                logMessage.innerHTML = getCookie("username") + '<br /> High Score: ' + getCookie("highscore");
                                score = 0;
                            }
                            else{
                                console.log('High Score Error', res2);
                                score = 0;
                            }
                        });
                    }
                    else{
                        console.log('No New High Score');
                        score = 0;
                    }
                });
            }
            else{
                score = 0
            }
            scoreText.innerHTML = "Score = 0";
        }
    }
    trail.push({x:snake_x,y:snake_y});
    while(trail.length>tail) {
    trail.shift();
    }
 
    if(pill_x==snake_x && pill_y==snake_y) {
        tail++;
        score++;
        console.log(score);
        scoreText.innerHTML = "Score = " +score.toString();
        pill_x=Math.floor(Math.random()*tiles);
        pill_y=Math.floor(Math.random()*tiles);
    }
    ctx.fillStyle="red";
    ctx.fillRect(pill_x*gridSize,pill_y*gridSize,gridSize-2,gridSize-2);
}
function move(evt) {
    switch(evt.key) {
        case 'ArrowUp':
        	evt.preventDefault();
            x_velocity=0;y_velocity=-1;
            break;
        case 'ArrowLeft':
        	evt.preventDefault();
            x_velocity=-1;y_velocity=0;
            break;
        case 'ArrowDown':
        	evt.preventDefault();
            x_velocity=0;y_velocity=1;
            break;
        case 'ArrowRight':
        	evt.preventDefault();
            x_velocity=1;y_velocity=0;
            break;
    }
}