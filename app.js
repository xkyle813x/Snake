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
    db.run(     `SELECT username, highscore,
                FROM users,
                LIMIT 10,
                ORDER BY highscore DESC`, 
                function(err,rows){
                    if(!err){
                        res.type('.html');
                        res.render('leaderboards',{
                            leaderboards:rows
                        });
                    }
                });
}
function generate_admin(res){
    //first have sql statement to grab all users
    //then call res.render on admin.bs, sending the rows back
}

app.get('/', function(req,res){
    generate_snake(res)
});

app.get('/snake',function(req,res){
	generate_snake(res)
});

app.get('/leaderboard',function(req,res){
	generate_leaderboard(res)
});

app.get('/admin',function(req,res){
	generate_admin(res)
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
    db.run('INSERT INTO users(username, sha256_pw, highscore, admin) VALUES(?,?,?,?)',
    [authInfo.user, sha256(authInfo.password), 0, 0], 
    function(err){
        if(!err){
            req.session.auth = true;
            req.session.user = authInfo.user;
            res.send( { ok: true } );
        }
        else{
            req.session.auth = false;
            res.send( { ok: false } );
        }

    });
});

app.post('/auth', jsonParser, function(req, res) {
    const authInfo = req.body;
    db.get('SELECT * FROM users where username = ?',
        [ authInfo.user ],
        function(err, row) {
            if ( !err ) {
                if( row ) {
                    if( sha256(authInfo.password) == row.sha256_pw ) {
                        req.session.auth = true;
                        req.session.user = authInfo.user;
                        res.send( { ok: true } );
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

app.post('/score/update',jsonParser, function(req, res){
	const user = req.body;
    console.log( user);
	db.run('UPDATE users SET highscore=? WHERE id=?', 
	[user.highscore, user.id], function(err) {
		if(!err){
			res.send({id : user.id, status: 'updated'});
		}
		else{
			res.send({id: user.id, error: err});
		}
	});
});




app.listen(port, () => console.log(`Listening on port ${port}!`));