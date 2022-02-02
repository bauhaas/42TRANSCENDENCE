import pool from './db/dbconnect';
const express = require("express");
const request = require('request');
const app = express();

const PORT = process.env.PORT || '80';

var user = {
	"login42": "", 
	"avatar": "",
	"status": "",
	"wins": 0,
	"losses": 0,
	"ladder_level": 0,
	"achievements": ""
};

// si on veut check la connection à la db
// pool.connect(function (err, client, done) {
// 	if (err) throw new Error(err);
// 	console.log('DB Connected');
// });

async function signin(info42, res) {
	try {
		const client = await pool.connect();

		const sql = `INSERT INTO users (login42, avatar, status, wins, losses, ladder_level, achievements) VALUES ('${info42['login']}', '${info42['image_url']}', 0, 0, 0, 0 , '');`;
		const { rows } = await client.query(sql);
		const users = rows;
		client.release();
		user['login42'] = info42['login'];
		user['avatar'] = info42['image_url'];
		//res.send("Bienvenue, " + info42['login']);
		res.render("user", { login42: user['login42'], avatar: user['avatar']});

	} catch (error) {
		res.status(400).send(error); // problème d'inscription...
	}
}

async function checkIfRegister(info42, res) { // On cherche si l'utilisateur existe
	try {
		const client = await pool.connect();
		const sql = `SELECT * FROM users as u WHERE u.login42 == '${info42['login']}';`;
		const { rows } = await client.query(sql);
		const users = rows;
		client.release();

		// res.send(users); // il existe, on affiche ses infos
		res.render("user", { login42: user['login42'], avatar: user['avatar']});

	} catch (error) {
		//res.status(400).send(error); // L'utilisateur n'existe pas
		signin(info42, res); // Go l'inscrire
	}
}

function me(token, res) { // on demande les infos du students
	var options = {
		'method': 'GET',
		'url': 'https://api.intra.42.fr/v2/me',
		'headers': {
			'Authorization': 'Bearer ' + token
		},
		json: true
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		checkIfRegister(response.body, res); // on vérifie si il a un compte
	});
}

function auth(code, state, res) { // on demande le access_token
	var options = {
		'method': 'POST',
		'url': 'https://api.intra.42.fr/oauth/token',
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		form: {
			'grant_type': 'authorization_code',
			'client_id': 'f60dc2f1d07980f192aaa1f0205dad411ee73dd20086150ffb9f62d7f7e0c901',
			'client_secret': 'ea3c557c987c33a5f364461fa7ed4fae295142efff2906168d71c05b99f47ccd',
			'code': code,
			'state': state,
			'redirect_uri': 'http://localhost/auth',
		},
		json: true
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		console.log(response.body);
		me(response.body['access_token'], res); // on demande les infos du student
	});
}

function makeid(length) { // pour générer le state code de sécurité
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

app.set("view engine", "ejs");

app.get("/", (req, res) => {
	//res.send("Hello, ft_transcendence !");
	res.render("index");
});

app.get("/user", (req, res) => {
	res.render("user", { login42: user['login42'], avatar: user['avatar']});
});

app.get("/game", (req, res) => {
	res.render("game");
});

app.get("/login", (req, res) => {
	var randomverylongstring = makeid(15);
	res.writeHead(301, {
		Location: `https://api.intra.42.fr/oauth/authorize?client_id=f60dc2f1d07980f192aaa1f0205dad411ee73dd20086150ffb9f62d7f7e0c901&redirect_uri=http%3A%2F%2Flocalhost%2Fauth&response_type=code&state=${randomverylongstring}`
	}).end();
});

app.get("/auth", (req, res) => {
	var url = req.url;
	var code = url.substring(url.indexOf("=") + 1, url.lastIndexOf("&"));
	var state = url.substring(url.indexOf("state=") + 6, url.length - 1);
	if (code && state)
		auth(code, state, res);
	else
		res.send("ERROR WITH 42 API");
});

app.get("/callback", (req, res) => {
	res.send("YESSSS !");
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});