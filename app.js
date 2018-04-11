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





app.use((req,res,next)=>{
	req.Demo = 'middleware test'
	next()
})

app.get('/', (req,res,next) =>{

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

app.use('/going', (req,res,next) =>{
	res.json(userList.users.going)
})
app.use('/notgoing', (req,res,next) =>{
	res.json(userList.users.notgoing)
})

app.use('/', (req,res,next) =>{
	res.render('main', req.User)
})





app.listen(8000, ()=>{
	console.log("listening on port 8000")
})
// module.exports = app