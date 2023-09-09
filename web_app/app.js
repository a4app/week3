const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();

const con = require(__dirname + '/db_connect.js')
const functs = require(__dirname + '/functions.js')
const authenticateUser = functs.authenticateUser;
const checkEmail = functs.checkEmail;

app.set('view engine', 'ejs');
app.use(express.static('static'));

app.use(cookieParser());
app.use(express.json());       
app.use(express.urlencoded({extended: true})); 

app.use(session({
    secret: 'abc123',
    resave: false,
    saveUninitialized: true,
}));

con.connectDB();
const client = con.client;
const db = client.db('MyDatabase');
const collection = db.collection('Collection');

const admin = {
	email: "admin@gmail.com",
	pass: "admin",
}

app.get('/', (req, res) => {
	if(req.cookies['sessionId']) {
		if(req.session.sessionId == req.cookies['sessionId']) {
			const userData = req.session.userData;
			if(userData.email == admin.email)
				return res.redirect('/admin');
			return res.redirect(`/home?name=${userData.name}&email=${userData.email}`);
		}
	}
	res.redirect('/login');
});

app.get('/login', (req, res) => {
	const msg = req.query.msg;
	const color = req.query.color;
	res.render('login',{msg: msg, color: color});
});

app.get('/signup', (req, res) => {
	const msg = req.query.msg;
	res.render('signup',{msg :msg});
});

app.get('/home', (req, res) => {
	if(req.session.sessionId == req.cookies['sessionId']) {
		const name = req.query.name;
		const email = req.query.email;
		res.render('home', {email: email, name: name})
	}
	else
		res.redirect('/login');
	
});

app.post('/signup', async (req, res) => {
	const { name, email, pass } = req.body;
	const check = await checkEmail(email);
	if(!check) {
		try {
			await collection.insertOne({name: name, email: email, pass: pass});
		}
		catch (err) {
			console.error('Error inserting data:', err);
			return res.redirect('/signup');
		}
		res.redirect('/login?msg=signup%20succesfull&color=00FF00');
	}
	else {
		return res.redirect(`/signup?msg=${check}`)
	}
	
});

app.post('/login', async (req, res) => {
	const { email, pass } = req.body;
	if(email == admin.email && pass == admin.pass) {
		req.session.userData = { email: admin.email, name: admin.name };
		const sessionId = admin.email;
		req.session.sessionId = sessionId;
		res.cookie('sessionId', sessionId, { maxAge: 600000 }); //10 mins
		return res.redirect('/admin');
	}
	const status = await authenticateUser(email, pass);
	if(!status) 
		res.redirect('/login?msg=user%20not%20found&color=FF0000')
	else {
		req.session.userData = { email: status.email, name: status.name };
		const sessionId = status.email;
		req.session.sessionId = sessionId;
		res.cookie('sessionId', sessionId, { maxAge: 600000 }); //10 mins
		return res.redirect(`/home?name=${status.name}&email=${status.email}`);
	}
});

app.get('/admin', async (req, res) => {
	if(req.session.sessionId == req.cookies['sessionId']) {
		const users = await collection.find().toArray();
		const msg = req.query.msg;
		return res.render('admin', { users: users, msg: msg });
	}
	else {
		res.redirect('/login');
	}
});

app.get('/delete', async (req, res) => {
	const email = req.query.email;
	const filter = { email: email };
	try {
		await collection.deleteOne(filter);
	}
	catch (err) {
		console.error('Error deletion data:', err);
		return res.send('deletion error');
	}
	res.redirect('/admin');
});

app.post('/add', async (req, res) => {
	const { name, email, pass } = req.body;
	const check = await checkEmail(email);
	if(check) {
		return res.redirect('/admin?msg=email%20already%20exists')
	}
	else {
		try {
			await collection.insertOne({name: name, email: email, pass: pass});
		}
		catch (err) {
			console.error('Error inserting data:', err);
			return res.send('error inserting data');
		}
		return res.redirect('/admin');
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.clearCookie('sessionId');
	res.redirect('/login');
});

app.get('/tadaa', (req, res) => {
	res.send(req.session.sessionId);
});






app.get('/test', async (req, res) => {

	// const db = client.db('MyDatabase');
	// const collection = db.collection('MyCollection');

	// try {
	//     const result = await collection.insertOne({name: 'amal', age: 21});
	//     res.send(result);
	// } catch (err) {
	//     console.error('Error inserting data:', err);
	//     res.status(500).json({ error: 'Failed to insert data' });
	// }

	const db = client.db('MyDatabase');
	const collection = db.collection('MyCollection');

	try {
		const result = await collection.find({}).toArray();
		res.send(`${result[0].age}`);
	} catch (err) {
		console.error('Error inserting data:', err);
		res.status(500).json({ error: 'Failed to insert data' });
	}
});











process.on('SIGINT', () => {
	client.close().then(() => {
		console.log('MongoDB connection closed');
		process.exit(0);
	});
});

app.listen(5500, () => {
	console.log("listening to 5500");
});