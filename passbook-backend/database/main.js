//Path : 'F:\Users\hp\Projects\Node-Practice\database\db\' 

// Requiring module
import mongoose from 'mongoose';

// Connecting to database
const uri = "mongodb+srv://vivek:199899@cluster0.spzieyj.mongodb.net/dlp?retryWrites=true&w=majority"
mongoose.connect(uri);


// Creating Schemas
const subjectSchema = new mongoose.Schema({
    uri : {
       type: String,
       required : true
    },
    xml : {
             type : String
    },    
 });
 
const userSchema = new mongoose.Schema({
    _id : String,
    emailId: {
        type : String,
        required : true,
        unique: true,
    },
    password : {
        type : String,
        required : true,
        min: 6,
    },
    date : {
        type : Date,
        default : Date.now
    },
    subjects : [subjectSchema],
    verifier : {
        type: String,
        default : ""
    }
});

//collection creation
const User = mongoose.model("User", userSchema);


const createUser = async (newUser)=>{
   try { 
        const user = await User.find({}, {"emailId": 1, "_id": 0});
        for(let index  in user){
            let email = user[index].emailId;
            await User.updateOne({emailId : `${email}`}, {$set :{email : `${email+"1"}`}})
            console.log(await User.find({emailId : `${email +"1"}`}))
        }
        console.log(user);
    }
    catch(err){
        console.log("Error in creating user !!:", err);
    }
}
const newUser = new User({
    _id  : "vivek@gmail.com",
    emailId  : "vivek@gmail.com",
    password : 1234,
    Subjects : [{
       uri :  "/uri.in.gov/HSCER-51771332015",
    }]
});
createUser(newUser);