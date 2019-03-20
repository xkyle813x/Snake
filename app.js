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

app.get('/', function(req,res){
    res.type('.html');
    res.render('game');
});

app.get('/snakeGame', function(req,res){
    res.type('.html');
    res.render('game');
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