(function() {

function deleteUser(element, userID){
    let req = new XMLHttpRequest();
    req.open('DELETE', `/user/${userID}`);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt) {
        if ( req.status == 200 ) { // check for ok response
            const resp = req.response;
            console.log( resp );
            element.remove();
        }
        else {
            console.log('err', req );
        }
    };
    req.send();
}


const deleteButton = document.getElementById('deleteUser');
signUpButton.addEventListener('click', (evt) => {
    rowToDelete = document.getElementById(deleteButton.parentNode.id);
    deleteUser(rowToDelete, deleteButton.parentNode.id);
});

}());