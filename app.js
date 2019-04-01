const cookieSession = require('cookie-session');
const sha256 = require('sha-256-js');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database( __dirname + '/users.db',
    function(err) {
        if ( !err ) {
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT,
                sha256_pw TEXT,
                highscore REAL,
				admin INTEGER
            )`);
            console.log('opened users.db');
        }
    });
	
	
const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// admin_users = [
//     [ 'jeremy', sha256('bearimy'), 0, 1 ],
//     [ 'rats', sha256('rats'), 0, 1 ],
// ];

// for( let row of admin_users ) { 

//     db.run('INSERT INTO users(username,sha256_pw, highscore, admin) VALUES(?,?, ?, ?)', row,
//        (err) => {
//            if ( err ) {
//                console.log( err );
//            } else {
//                console.log('insert', row );
//            }
//        } );
// } 

const app = express();
// the static file middleware
app.use(express.static( __dirname + '/public'));

// the template middleware
// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials',
  defaultLayout: __dirname + '/views/layout/main.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

const port = process.env.PORT || 8000;

app.use(cookieSession({
    keys: ['secret']
}));


    
function generate_snake(res){
     res.type('.html');
     res.render('game');
}

function generate_leaderboard(res){
    let leaderboards = [];
    //first have sql statement to grab first ten high scores from databases
    //then call res.render on leaderboard.hbs, sending the rows back
    db.all(     `SELECT username,highscore
                FROM users
                ORDER BY highscore DESC`, [],
                function(err,rows){
                    console.log(rows);
                    if(!err){
                        res.type('.html');
                        res.render('leaderboards',{
                            users:rows,
                        });
                    }
                });
}

function generate_editUser(res){
    res.type('.html');
    res.render('editUser');
}
function generate_admin(res){
    //first have sql statement to grab all users
    //then call res.render on admin.hbs, sending the rows back
    db.all(     `SELECT id, username
                FROM users
                WHERE admin = 0
                ORDER BY username ASC`, [],
                function(err,rows){
                    console.log(rows);
                    if(!err){
                        res.type('.html');
                        res.render('admin',{
                            users:rows
                        });
                    }
                });
}

function generate_admin_error(res){
    res.type('.html');
    res.render('errorAdmin');
}

function generate_error(res){
    res.type('.html');
    res.render('error');
}

app.get('/', function(req,res){
    generate_snake(res);
});

app.get('/snake',function(req,res){
	generate_snake(res);
});

app.get('/leaderboard',function(req,res){
	generate_leaderboard(res);
});

app.get('/editUser',function(req,res){
    if(req.session.auth){
        generate_editUser(res);
    }
    else{
        generate_error(res);
    }
	
});

app.get('/admin',function(req,res){
    if(req.session.admin){
        console.log(req.session.admin);
        generate_admin(res);
    }
    else{
        generate_admin_error(res);
    }
});


app.post('/checkscore', jsonParser, function(req,res){
    const scoreInfo = req.body;
    console.log( scoreInfo);
    console.log(req.session.user);
    db.get('SELECT highscore FROM users where username = ?',
    [req.session.user],
    function(err,row){
        console.log( row);
        if(!err){
            if(row.highscore < scoreInfo.score){
                res.send( { ok: true } );
            }
            else{
                res.send({ok : false});
            }
        }
        else{
            res.send( { ok: false } );
        }
    });
});

app.post('/updatescore',jsonParser, function(req, res){
	const scoreInfo = req.body;
    console.log( scoreInfo);
	db.run('UPDATE users SET highscore=? WHERE username=?', 
	[scoreInfo.score, req.session.user], function(err) {
		if(!err){
			res.send({ok : true});
		}
		else{
			res.send({ok: false});
		}
	});
});

app.post('/check', jsonParser, function(req,res){
    const authInfo = req.body;
    db.get('SELECT * FROM users where username = ?',
    [authInfo.user],
    function(err,row){
        if(!err){
            if(row){
                res.send( { ok: false } );
            }
            else{
                res.send({ok : true});
            }
        }
        else{
            res.send( { ok: false } );
        }
    });
});

app.post('/newuser', jsonParser, function(req, res) {
    const authInfo = req.body;
    if(authInfo.user != '' && authInfo.password != ''){
    db.run('INSERT INTO users(username, sha256_pw, highscore, admin) VALUES(?,?,?,?)',
    [authInfo.user, sha256(authInfo.password), 0, 0], 
    function(err){
        if(!err){
            req.session.auth = true;
            req.session.admin = false; 
            req.session.user = authInfo.user;
            res.send( { ok: true } );
        }
        else{
            req.session.auth = false;
            req.session.admin = false; 
            res.send( { ok: false } );
        }

    });
    }
    else{
        req.session.auth = false;
        req.session.admin = false; 
        res.send( { ok: false } );
    }
    
});

app.delete('/logOut', jsonParser, function(req, res){
    req.session.auth = false;
    req.session.admin = false; 
    req.session.user = null;
    res.send( { ok: true } );
});

app.post('/auth', jsonParser, function(req, res) {
    const authInfo = req.body;
    db.get('SELECT * FROM users where username = ?',
        [ authInfo.user ],
        function(err, row) {
            if ( !err ) {
                if( row ) {
                    if( (sha256(authInfo.password) == row.sha256_pw) ) {
                        req.session.auth = true;
                        req.session.user = authInfo.user;
                        if(row.admin == 1){
                            req.session.admin = true;
                        }
                        else{
                            req.session.admin = false; 
                        }
                        res.send( { ok: true, score : row.highscore } );
                    }
                    else {
                        req.session.auth = false;
                        res.send( { ok: false } );
                    }
                }
                else {
                    req.session.auth = false;
                    res.send( { ok: false, msg : 'nouser' } );
                }
            }
            else {
                req.session.auth = false;
                res.send( err );
            }
        } );
});

app.delete('/user/:id(\\d+)', function(req,res){
    let id = parseInt(req.params.id);
    db.run(`DELETE FROM users WHERE id = ?`, [id], function(err){
        if(!err){
            res.send({id:id, status:'deleted'});
        }
        else{
            res.send({id:id, error:err});
        }
    });
});

app.post('/user/updatename', jsonParser, function(req, res){
    const user = req.body;
    console.log(user);
    db.run('UPDATE users SET username = ? WHERE username = ?',
    [user.username, req.session.user], function(err){
        if(!err){
            req.session.user = user.username;
            res.send({username : user.username, status: 'updated'});
        }
        else{
            res.send({username : req.session.user, error: err});
        }
    });
});

app.post('/user/updatepassword', jsonParser, function(req, res){
    const password = req.body;
    console.log(password);
    db.run('UPDATE users SET sha256_pw = ? WHERE username = ?',
    [sha256(password.password), req.session.user], function(err){
        if(!err){
            res.send({username : req.session.user, status: 'updated'});
        }
        else{
            console.log(err);
            res.send({username : req.session.user, error: err});
        }
    });
});




app.listen(port, () => console.log(`Listening on port ${port}!`));