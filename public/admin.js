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


const deleteButton = document.getElementsByClassName("deleteUser");

document.body.addEventListener('click', (evt) => {
    if (evt.target.className === 'deleteUser') {
        rowToDelete = evt.target.parentNode.parentNode;
        deleteUser(rowToDelete, evt.target.parentNode.id);
    }
});



}());