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



document.body.addEventListener('click', (evt) => {
    console.log(evt.target);
    if (evt.target.className === 'deleteUser') {
        var conf = confirm("Are you sure you want to delete this user?");
        if(conf){
            rowToDelete = evt.target.parentNode.parentNode;
        deleteUser(rowToDelete, evt.target.parentNode.id);
        }

        
    }
});



}());