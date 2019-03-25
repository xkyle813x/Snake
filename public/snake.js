(function() {

    
	
function validateUser( user, password, callback ) {
	let req = new XMLHttpRequest();
	req.open('POST', '/auth');
	req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	req.responseType = 'json';
	req.onload = function(evt) { callback( req ); };
	let obj = { user: user, password : password };
	req.send( JSON.stringify( obj ));
};
    
function checkUser(user, callback){
    let req = new XMLHttpRequest();
    req.open('POST', '/check');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	req.responseType = 'json';
	req.onload = function(evt) { callback( req ); };
	let obj = { user: user };
	req.send( JSON.stringify( obj ));
}

function newUser(user, password, callback){
    let req = new XMLHttpRequest();
    req.open('POST', '/newuser');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt) { callback( req ); };
    let obj = { user: user , password : password };
	req.send( JSON.stringify( obj ));
}




const mainArea = document.getElementById('mainSpace');
const loginMessage = document.getElementById('LogMessage');
const logBar = document.getElementById('loginbar');
if(document.getElementById('login') != null){
    const loginButton = document.getElementById('login');
    const signUpButton = document.getElementById('signUp');
    const userName = document.getElementById('username');
    const passwd = document.getElementById('password');

    loginButton.addEventListener('click', (evt) => {
        validateUser(userName.value, passwd.value, (req) => {
            let res = req.response;
            if(res.ok){
                console.log('Log In Success');
                document.cookie = "username = " + userName.value;
                console.log(res.score);
                document.cookie = "highscore = "+ res.score;
                logBar.innerHTML = '<p id = "LogMessage">' + getCookie("username") + '<br /> High Score: ' + getCookie("highscore") + ' </p>';
            }
            else{
                console.log('Log In Invalid');
                loginMessage.innerHTML = "Invalid Username or Password, Please Try Again or Make a New Account";
    
            }
        });
    });
    
    signUpButton.addEventListener('click', (evt) => {
       checkUser(userName.value, (req) => {
        let res = req.response;
           if(res.ok){
                console.log('UserName Free');
                newUser(userName.value, passwd.value,  (req) => {
                    let res2 = req.response;
                    if(res2.ok){
                        console.log("SignUp success");
                        document.cookie = "username = " + userName.value;
                        document.cookie = "highscore = 0";
                        logBar.innerHTML = '<p id = "LogMessage">' + getCookie("username") + '<br /> High Score: ' + getCookie("highscore") + ' </p>';
                    }
                    else{
                        console.log('Sign up error', res2);
                        loginMessage.innerHTML =" Unspecified Error, try again";
                    }
                });
            }
            else{
                console.log('Sign up Username taken');
                loginMessage.innerHTML = "Username is Already Taken, Please Try a Different Name";
            }
        });
    });
}





}());