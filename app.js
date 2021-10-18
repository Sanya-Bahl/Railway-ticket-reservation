const express = require('express')
const bodyParser= require('body-parser')
const port= 3000
const session = require('express-session');   
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const app=express()
const alert=require('alert')
app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine', 'ejs');
app.use(express.static("public"))
const mongoose=require('mongoose');
var nop;
var arr=[]
app.use(session({
    secret:'Our little secret.',
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect('mongodb://localhost:27017/Railwaydb', {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});
//checking moongo connection
const db=mongoose.connection;
db.on('error', console.error.bind(console,"error connecting to db"));
db.once("open",function(){
    console.log("successfullly connected to mongodb");
});
mongoose.set("useCreateIndex", true);
const userSchema= new mongoose.Schema({
    username: String,
    password: String,
    address: String,
    city: String,
    state: String,
    zip: Number,
    name: String
})
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const trainSchema= new mongoose.Schema({
    t_no: Number,
    t_name: String,
    Departure: String,
    Arrival: String,
    Seats: Number,
    date: Date,
    from: String,
    to: String,
    price: Number,
    type: String
})
const passengerSchema= new mongoose.Schema({
    ticket_no: String,
    name: String,
    age: Number,
    gender: String
})
const ticketSchema= new mongoose.Schema({
    no_of_passengers: Number,
    train_no: String,
    train_name: String,
    source: String,
    destination: String,
    date: String,
    amt: Number,
    Phone: Number,
    userid: String,
    status: String,
    passenger: [passengerSchema]
})

const ticketdb=mongoose.model('ticket', ticketSchema);
const passengerdb=mongoose.model('passenger',passengerSchema);
const traindb=mongoose.model('trains', trainSchema);

const i1= new traindb({
    t_no: 1234,
    t_name: "Shatabdi express",
    Departure: "7:00",
    Arrival: "12:00",
    Seats: 3,
    date: new Date("08/21/2021"),
    from: "Delhi",
    to: "Mumbai",
    price: 1200,
    type: "AC"
})
const i2= new traindb({
    t_no: 1254,
    t_name: "Rajdhani express",
    Departure: "17:00", 
    Arrival: "21:00",
    Seats: 3,
    date: new Date("2021-08-24"),
    from: "Patna",
    to: "Mumbai",
    price: 2200,
    type: "AC"
})
const i3= new traindb({
    t_no: 2234,
    t_name: "Fst express",
    Departure: "7:00",
    Arrival: "11:00",
    Seats: 3,
    date: new Date("2021-08-22"),
    from: "Delhi",
    to: "Punjab",
    price: 1260,
    type: "AC"
})
const i4= new traindb({
    t_no: 1236,
    t_name: "Shatabdi express",
    Departure: "7:00",
    Arrival: "12:00",
    Seats: 3,
    date: new Date("2021-08-22"),
    from: "Delhi",
    to: "Mumbai",
    price: 1400,
    type: "AC"
})
const i5= new traindb({
    t_no: 1274,
    t_name: "Jayshakti express",
    Departure: "5:00",
    Arrival: "10:00",
    Seats: 3,
    date: new Date("2021-08-25"),
    from: "Bihar",
    to: "Kanpur",
    price: 5200,
    type: "AC"
})
const i6= new traindb({
    t_no: 1734,
    t_name: "Puri express",
    Departure: "6:00",
    Arrival: "10:00",
    Seats: 3,
    date: new Date("2021-08-23"),
    from: "Meerat",
    to: "Mumbai",
    price: 1500,
    type: "AC"
})
const i7= new traindb({
    t_no: 1294,
    t_name: "jahangir express",
    Departure: "9:00",
    Arrival: "15:00",
    Seats: 3,
    date: new Date("2021-08-24"),
    from: "shimla",
    to: "Mumbai",
    price: 1250,
    type: "AC"
})

const i8= new traindb({
    t_no: 1264,
    t_name: "Humsafar express",
    Departure: "20:00",
    Arrival: "24:00",
    Seats: 3,
    date: new Date("2021-08-24"),
    from: "Patna",
    to: "Mumbai",
    price: 2500,
    type: "AC"
})

//var mytrains=[i1, i2, i3,i4,i5,i6,i7,i8];
//     traindb.insertMany(mytrains, function(err)
//    {
//    if(err)
//     console.log(err)
//     else
//     console.log("Added successfully")
//})
app.get('/',(req,res)=>{
    if(req.isAuthenticated())
    {
      res.render('homepage',{username: req.user.name})
    }
    else
    {
      res.render('home')
    }
})
app.post('/login',(req,res)=>
{
    
  const user = new User({
    username: req.body.username,
    password: req.body.password
})

req.login(user, function(err)
{
  
    if(err)
    console.log(err)
    else
    {
        passport.authenticate('local')(req,res,function(err) 
        {
           alert('logged in successfuly!')
           res.render('homepage',{username: req.user.name});
           
        })
    }
})
});

app.post('/search-trains', (req,res)=>
{
    nop=req.body.nop;
    traindb.find({from:req.body.from, to:req.body.to, date:req.body.date},function(err,founditems)
    {
        if(err)
        console.log(err);
        else
        {
            res.render('showtrains',{source:req.body.from, destination:req.body.to, newis:founditems,username: req.user.name})
        }
    })
})


app.get('/login',(req,res)=>
{
    res.render('login')
})

app.get('/register',(req,res)=>
{
    res.render('register');
})
var p1;
var flag;
app.get('/ticket-booking',(req,res)=>
{
    if(req.isAuthenticated())
    {
      res.render('main',{username: req.user.name})
    }
    else
    {
      res.redirect('/login')
    }
    
})
app.post('/details',(req,res)=>
{
   
    traindb.findOne({t_no: req.body.submit}, function(err,data)
    {
        if(err)
        console.log(err);
        else if(data.Seats<=0)
        alert("Seats not available")
        else
        {
            const amt=data.price*parseInt(nop);
            var t1= new ticketdb({
                  no_of_passengers: nop,
                  source: data.from,
                  destination: data.to,
                  date: data.date,
                  userid: req.user._id,
                  amt:amt,
                  train_no: data.t_no,
                  train_name: data.t_name
            })
                   t1.save();
                   res.render("booking",{data1:data,ticketid: t1._id, nop: t1.no_of_passengers,username:req.user.name});
                   pi=t1._id
                   flag=0;
        }
    })
})
app.get('/addDetails',(req,res)=>
{
 
    
           res.render("passengers",{newis:ans,username: req.user.name});

})
 var ans=[]
app.post('/addDetails',(req,res)=>
{
    const name=req.body.name;
    const gender=req.body.gender;
    const age=req.body.age;
    console.log(name)
    ticketdb.findOne({_id:pi}, function(err,data)
       {
           if(err)
           console.log(err)
           else
           {
            const i1= new passengerdb({
                ticket_no: data._id,
                name: name,
                age: age,
                gender:gender
            })
            if(flag<nop){
            i1.save()
            ans.push(i1);
            data.passenger.push(i1)
            data.save()
            ++flag;
            }
            else
            {
                alert(`You cannot book more than ${nop} tickets`);
            }
            res.redirect('/addDetails')
           }
       })
  
})
app.post('/payment',(req,res)=>
{
    pnr=req.body.pnr
    ticketdb.findOneAndUpdate({_id: pi}, {$set:{Phone:pnr}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    
        console.log(doc);
        res.render('payment',{amt:doc.amt,username: req.user.name})
    });
    
})
app.post('/delete',(req,res)=>
{
    id=req.body.checkbox
    ans = ans.filter(function( obj ) {
        console.log(obj._id)
        return obj._id != id;
    });
   console.log(ans);
    ticketdb.findOneAndUpdate({_id:pi, "passenger._id": id },
    { $pull: {passenger: {_id:id}}}, (err) => {
        if (err) {
            return res.status(404).json({ message: 'Error' });
        }
        
          return res.redirect('/addDetails')
        ,{new: true, useFindAndModify: false};
    }
);
    // res.redirect('/addDetails')
})

app.post('/register',(req,res)=>
{
    console.log(req.body.username);
    User.register({username: req.body.username,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        name:req.body.name},req.body.password,(err,user)=>
  {
    if(err)
    {
      console.log(err);
      res.redirect('/register');
    }
    else
       {
            
           passport.authenticate('local')(req,res,function(err){ // this uthenticates the user using local strategy which means authenticationg using username and pwd
             if(err)
             console.log(err)
             else 
               alert('Registered Successfully!')
               res.render('homepage',{username: req.body.name});
           });
       }
  })
})
app.get('/pnr',(req,res)=>
{
    if(req.isAuthenticated())
    res.render('pnr',{username:req.user.name})
    else
    res.redirect('/login')
})
app.post('/pnr',(req,res)=>
{
  
    ticketdb.findOne({Phone:req.body.pnr},(err,data)=>
    {
        if(err)
        console.log(err)
        else
        res.render('pnrstatus_details',{data:data, username:req.user.name});
    })
})
app.post('/cancel',(req,res)=>
{
    ticketdb.findOneAndUpdate({_id:req.body.submit},{$set:{status:"Cancelled"}}, {new: true},(err,data)=>
    {
       
        if(err)
        console.log(err)
        else
        {
         alert('Ticket cancelled successfully!')
         console.log(data.train_no);
         traindb.findOneAndUpdate({t_no:data.train_no},{$inc:{Seats: +data.no_of_passengers}},{new:true},(err,data1)=>
         {
             if(err)
             console.log(err)
             else
             console.log('updated')
             console.log(data1);
         })
         res.redirect('/pnr');
        }
       
    })
})
app.get('/my-tickets',(req,res)=>
{
    if(req.isAuthenticated())
    {   console.log('hi');
        ticketdb.find({userid:req.user._id, status:'Booked'},(err,data)=>
        {
            if(err)
            console.log(err)
            else
            {   
                res.render('mytickets',{data:data,username:req.user.name})
            }
        })
    }
})
app.post('/success',(req,res)=>
{
  const mop=req.body.mop
  console.log(mop)
  ticketdb.findOneAndUpdate({_id:pi}, {$set:{status:"Booked"}}, {new: true}, (err, doc) => {
    if (err) {
        console.log("Something wrong when updating data!");
    }

    console.log('booked!');
    
    traindb.findOneAndUpdate({t_no:doc.train_no},{$inc:{Seats:- nop}},{new:true},(err,doc)=>{
        if(err)
        console.log(err)
        else
        console.log('done')
    })
});
  alert('Your ticket has been booked successfully!')
  res.redirect('/');  
})
app.listen(3000,()=>
{
  console.log(' listening at http://localhost:3000/')
})