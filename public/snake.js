(function() {

function getSnakeGame(){
    let req = new XMLHttpRequest();
    req.open('GET',`/snakeGame`);
    req.responseType = 'json';
    req.onload = function(evt){
        if ( req.status == 200 ) { // check for ok response
            callback( req.response );
        }
        else {
            console.log('err', req );
        }
    };
    req.send()
}


const mainArea = document.getElementById('mainSpace');
const snakeButton = document.getElementById('snakeButton');


snakeButton.addEventListener('click', (evt) => {
    mainArea.innerHTML = '';
    getSnakeGame();
});


}());