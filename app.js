const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const request = require('request')
const apiurl = 'https://randomuser.me/api/'
const userList = {users: {
	going: [],
	notgoing: []
}}
const app = express()

app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, '/public')))





app.use((req,res,next)=>{
	req.Demo = 'middleware test'
	next()
})

app.use('/', (req,res,next) =>{

	request.get({url: apiurl}, (err, resp, body) => {
		let userdata = JSON.parse(body).results[0]
		let uname = userdata.name.first + ' ' + userdata.name.last
		req.User = {
			name: uname,
			phone: userdata.phone,
			email: userdata.email,
			picture: userdata.picture.large
		}
		next()
	})
})
app.post('/mark-invitee', (req,res,next)=>{
	// console.log('logging  body: ', req.body)
	if(req.body.going === 'true'){
		userList.users.going.push(req.body)
	}
	if(req.body.going === 'false'){
		userList.users.notgoing.push(req.body)
	}
	res.redirect('/')
})

app.get('/going', (req,res,next) =>{
	const data = {
		ulist: userList.users.going
	}
	res.render('userlist', data)
})
app.get('/notgoing', (req,res,next) =>{
	const data = {
		ulist: userList.users.notgoing
	}
	res.render('userlist', data)
})

app.get('/', (req,res,next) =>{
	data = req.User
	data.totalgoing = userList.users.going.length
	data.totalnot = userList.users.notgoing.length
	console.log(data)
	res.render('main', data)
})

app.get('/json', (req,res,next) =>{
	res.json(userList)
})




app.listen(8000, ()=>{
	console.log("listening on port 8000")
})
// module.exports = app