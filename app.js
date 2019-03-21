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
	  name: 'session',
	  secret: 'foo'
}));
    
function generate_snake(res){
     res.type('.html');
     res.render('game');
}

app.get('/', function(req,res){
    generate_snake(res)
});

app.get('/snake',function(req,res){
	generate_snake(res)
});

app.post('/auth', jsonParser, function(req, res) {
    const authInfo = req.body;
    db.get('SELECT * FROM users where user = ?',
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


function generateLeaderboardPage(res){
	
}

app.listen(port, () => console.log(`Listening on port ${port}!`));