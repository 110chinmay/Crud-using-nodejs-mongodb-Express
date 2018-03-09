var express = require("express");
var app = express();
var path = require('path');
var engines = require('consolidate');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
var port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node-demo");
var nameSchema = new mongoose.Schema({
    usrName: String,
    usrMobile: String,
    usrAddress: String,
    usrPassword: String,
    selData: String,
    radioValue: String
});
var db = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/home.html");
});


app.get("/update.html/:id", (req, res) => {   
            res.sendFile(__dirname + '/update.html');
        });

app.get("/index.html", (req, res) => {   
            res.sendFile(__dirname + '/index.html');
        });

app.get("/update.html/data/:id", (req, res) => {
    var id = req.params.id;
    db.find({"_id":id},function(err,data){
        if(err){  
                res.send(err);  
            }

        else{             
                res.send(data);  
            } 
    });
});

app.post("/updateData/data/:id", (req, res) => {
    var id = req.params.id;
    var usrName = req.body.usrName;
    var usrMobile = req.body.usrMobile;
    var usrAddress = req.body.usrAddress;
    var selData = req.body.selData;
    var radioValue = req.body.radioValue;

    db.findByIdAndUpdate(id, { usrName: usrName,usrMobile: usrMobile, usrAddress: usrAddress, selData: selData, radioValue: radioValue }, function(err){
        if(err){
            res.send(err);
            return;
        }
        res.send({data:"Record has been Updated..!!"});
    });
});

app.post("/addname", (req, res) => {
    var myData = new db(req.body);
    myData.save(function(err,data){  
            if(err){  
                res.send(err);                
            }  
            else{        
                 res.send({data:"Record has been Inserted..!!"});  
            }  
        });  
});



app.get("/getData", (req, res) => {
    db.find({},function(err,data){
        if(err){  
                res.send(err);  
            }  
        else{             
            res.send(data);  
            } 
    });
            
});

app.get("/getUpdateUsr", (req, res) => {
    db.findOne({ _id: req.body.id},function(err,data){
        if(err){  
                res.send(err);  
            }  
        else{             
            res.send(data);  
            } 
    });
            
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});

