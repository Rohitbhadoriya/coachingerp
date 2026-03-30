const mongoose = require('mongoose')

const bcrypt = require("bcryptjs")


const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,

    },
    role:{
        type:String,
        enum:['admin','teacher','student'],
        default:'student'
    },
    phone:{
        type:String,

    },
    batch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Batch'
    }



},{timestamps:true})


// hashpassword
// ye apko zero % smj aya 

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;                   
    }

    this.password = await bcrypt.hash(this.password, 10);
});




module.exports = mongoose.model('user',userSchema)