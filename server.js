const express =require('express');
const app =express();
const PORT = process.env.PORT || 3000
const bodyparser = require('body-parser');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
var admin = require('firebase-admin')
const {v4:uuidv4} = require('uuid')

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://key-period-291020-default-rtdb.firebaseio.com"
});


const csrfmiddleware=csrf({cookie:true});
app.set('view engine','ejs');
app.use(bodyparser.json())
app.use(cookieParser());

// app.all('',(req,res,next)=>{
//   res.cookie('XSRF-TOKEN',req.csrfToken());
//   next();
// })


app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(__dirname+"/home.html")
}) 
app.get('/sign', (req, res) => {
  res.sendFile(__dirname+"/sign.html")
})
app.get('/signup', (req, res) => {
  res.sendFile(__dirname+"/signup.html")
})

var ant;
var ref = admin.database().ref();
ref.on('value',async (snap)=>{
  ant= snap.val();
})
 function user(id){
      return ant[ant.idtokens[id]];
}
app.post('/sessionlogin', function (req, res) {
  const idToken = req.body.idToken.toString();
  const take_email = req.body.email.toString();
  const expiresIn = 5*60*1000 ;
  admin
  .auth().createSessionCookie(idToken,{expiresIn})
  .then(async (sessionCookie)=>{
    const options = {maxAge : expiresIn ,httpOnly : true};
    rand = uuidv4();
    res.cookie('session2',rand,options);
    res.cookie('session',sessionCookie,options);
     move[idToken] = take_email;
      await admin.database().ref('idtokens/'+ rand).set(take_email.split('.')[0]
   )
    res.end(JSON.stringify({status:'success'}));
  }).catch(()=>{ res.status(401).send('UNAUTHORIZED ACCESS');
})
})
app.post('/save', function (req, res) {
  var bare = req.body;
   email2 = bare.email.split('.')[0];
   admin.database().ref(email2).set({
    name : bare.name, 
    city :bare.city,
    mobile:bare.mobile
   })
res.end(JSON.stringify({status:'success'}));
}) 
app.get('/dashboard', function(req,res){
  const sessionCookie = req.cookies.session || '';
  const session = req.cookies.session2 || ''
  // console.log("yes");    
  admin.auth().verifySessionCookie(sessionCookie,true)
  .then( ()=>{
     temp = user(session);
     if(!temp)
     {
       res.send('Something went wrong')
     }
    res.render('dashboard',{object : temp});
  }).catch(()=>{
           res.redirect("/sign");
  })
  
  setTimeout( ()=>{admin.database().ref('idtokens/'+ session).remove()} ,1000*60*5)
})

app.get('/logout',(req,res)=>{
   const session = req.cookies.session2 || ''
   admin.database().ref('idtokens/'+ session).remove()
  res.clearCookie('session');    
  res.clearCookie('session2');
  res.redirect('/sign')
  move ={};
})
app.listen(PORT,()=>{
    console.log(`Listening on port number ${PORT}`)
})
