(function() {
function checkUser(user, callback){
    let req = new XMLHttpRequest();
    req.open('POST', '/check');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt) { callback( req ); };
    let obj = { user: user };
    req.send( JSON.stringify( obj ));
}

function updatePassword(password){
    let req = new XMLHttpRequest();
    req.open('POST', `/user/updatepassword`);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt) {
        if ( req.status == 200 ) { // check for ok response
            const resp = req.response;
            console.log( resp );
        }
        else {
            console.log('err', req );
        }
    };
    let obj = { password : password };
    req.send(JSON.stringify(obj));

}
    

function updateUsername(username){
    let req = new XMLHttpRequest();
    req.open('POST', `/user/updatename`);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt) {
        if ( req.status == 200 ) { // check for ok response
            const resp = req.response;
            console.log( resp );
        }
        else {
            console.log('err', req );
        }
    };
    let obj = { username: username };
    req.send(JSON.stringify(obj));
}

const updateUserButton = document.getElementById('updateUsername');
const updatePasswordButton = document.getElementById('updatePassword');
const newName = document.getElementById('newUsername');
const newPass = document.getElementById('newPassword');
const errMessage = document.getElementById('ErrMsg');

updateUserButton.addEventListener('click', (evt) => {
    errMessage.innerHTML = '';
    if(newName.value != ''){
        checkUser(newName.value, (req) => {
            let res = req.response;
               if(res.ok){
                    console.log('UserName Free');
                    updateUsername(newName.value);
                    document.cookie = "username = " + newName.value;
                    location.reload();
                }
                else{
                    errMessage.innerHTML ="Username taken, try again";
                }
        });
    }
    else{
        errMessage.innerHTML ="Enter a valid name";
    }
});

updatePasswordButton.addEventListener('click', (evt) => {
    errMessage.innerHTML = '';
    if(newPass.value != ''){
        updatePassword(newPass.value);
        newPass.value = '';
    }
    else{
        errMessage.innerHTML ="Please Enter a password";
    }
})
}());