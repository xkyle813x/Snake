(function() {
	
function validateUser( user, password, callback ) {
	let req = new XMLHttpRequest();
	req.open('POST', '/auth');
	req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	req.responseType = 'json';
	req.onload = function(evt) { callback( req ); };
	let obj = { user: user, password : password };
	req.send( JSON.stringify( obj ));
	}




const mainArea = document.getElementById('mainSpace');
const leaderboardButton = document.getElementById('leaderboard');
const adminButton = document.getElementById('admin');
const snakeButton = document.getElementById('snakeButton');
const usernameText = document.getElementById('username');
const passwdText = document.getElementById('password');
const loginButton = document.getElementById('login');
const signUpButton = document.getElementById('signUp');




}());