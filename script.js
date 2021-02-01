// const { signedCookies } = require("cookie-parser");
  var firebaseConfig = {
            apiKey: "AIzaSyCyPotovmuGuQnfM4lZCWRPOGr0RGMo6mo",
            authDomain: "key-period-291020.firebaseapp.com",
            projectId: "key-period-291020",
            storageBucket: "key-period-291020.appspot.com",
            messagingSenderId: "1006587798283",
            appId: "1:1006587798283:web:e8febfda7d3de12e05780e"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        var auth = firebase.auth();
          firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
        function signup() {
            const take_email = document.getElementById('email').value;
            const take_password = document.getElementById('password').value;
            const take_name = document.getElementById('name').value;
            const take_mobile = document.getElementById('mobile').value;
            const take_city = document.getElementById('city').value;
            if(take_mobile !== '' && take_name !== '' && take_city !== '' ){
            auth.createUserWithEmailAndPassword(take_email, take_password).then((p)=>{
                document.getElementById('email').value='';
                document.getElementById('password').value='';
                  alert('You have Signed Up');
                     return  fetch('/save',{
                   method:"POST",
                   headers:{
                       Accept:'application/json',
                       "Content-Type": "application/json",
                    //    "CSRF-Token": signedCookies.get('XSRF-TOKEN')
                   },
                   body:JSON.stringify({ name:take_name ,mobile:take_mobile,city:take_city,email:take_email})
               })
              
            }).then(()=>{
                   window.location.assign('/sign')
            }).catch((e) => {
                alert(e);
            })}
            else{
                alert('All fields are required');
            }
        }    
        function sign(){
            const take_email = document.getElementById('email').value;
            const take_password = document.getElementById('password').value;
            auth.signInWithEmailAndPassword(take_email,take_password).then( (user)=>{
                return  firebase.auth().currentUser.getIdToken().then((idToken)=>{
               return  fetch('/sessionlogin',{
                   method:"POST",
                   headers:{
                       Accept:'application/json',
                       "Content-Type": "application/json",
                    //    "CSRF-Token": signedCookies.get('XSRF-TOKEN')
                   },
                   body:JSON.stringify({idToken,email:take_email})
               })
            })
           }).then(()=>{
               return firebase.auth().signOut();
           }).then(()=>{
               window.location.assign('/dashboard');
           }).catch((e)=>{
               alert(e);
           })
           return false;
        }


    
            