const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batchName:{
        type:String,
        required:[true, "Batch Name is required"],
        trim:true,
        unique:true,
        maxlength:[50, "Batch Name should be less than 50 characters"]
    },
    batchCode:{
        type:String,
        required:[true, "Batch Code is required"],
        trim:true,
        uppercase:true,
        default:function(){
            return 'BATCH' + Date.now() + "-" + Math.random().toString(36).substr(2, 5).toUpperCase();
            // yha pr toString kya kr rha h ye to string mein convert kr rha h or substr kya kr rha h ye to string mein convert krne ke baad uska substring le rha h 2 se start krke 
            // 5 characters tk le rha h or uppercase kya kr rha h ye to uppercase mein convert kr rha h
            // Math.random() yha pr random genrate kr rha h 0 se 1 ke beech 
        }
    },
    course:{
        type:String,
        required:[true, "Course is required"],
        trim:true,
       
    },
    courseType:{
        type:String,
        enum:['Medical','Engineering', 'School', 'Competitive','Other'],
        required:[true, "Course Type is required"]
    },
    startDate:{
        type:Date,
        required:true,

    },
    endDate:{
        type:Date,
    },
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        // [{}] hume esa he kyu likha h kyu ki batch multiple students ko rakh skta h to hume array of object id rakhna hoga jo ki user model ke reference se hoga
    }],
    waitingList:[{
        student:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
        addedAt:{type:Date, default:Date.now}
    }],
    status:{
        type:String,
        enum:['active','upcoming','completed','cancelled'],
        default:'upcoming'
    },
    description:{
        type:String,
        trim:true,
        maxlength:[500, "Description should be less than 500 characters"]
    },
    maxStudents:{
        type:Number,
        default:30,
        min:[5,"Minimum 5 students allowed"],
    },
    fees:{
        ammount:{
            type:Number,
            default:0,
        },
        currency:{
            type:String,
            default:'INR'
        }
    },

},{timestamps:true})

// abi yha or or work kya baccha hua h 
batchSchema.virtual('studentCount').get(function() {
    return this.students.length;
});
batchSchema.virtual('availableSeats').get(function() {
    return this.maxStudents - this.students.length;
});

// What are doing virtuals in mongoose
// virtuals are not stored in database but they are calculated on the fly when we access them 
// yha pr studentCount virtual h jo ki students array ki length return kr rha h or availableSeats virtual h jo ki maxStudents me se students array ki length ko minus kr rha h
// virtual Extra fields hote h jo database mein store nhi hote h lekin runtime pr calculate hote h 

//Auto update status before saving 
batchSchema.pre('save',function(next){
    const currentDate = new Date();
    if(this.status !== 'cancelled'){
        if (currentDate < this.startDate) this.status = 'upcoming';
        else if (currentDate >= this.startDate && currentDate <= this.endDate) this.status = 'active';
        else if (currentDate > this.endDate) this.status = 'completed';
        
    }
})


// yha pr pre save kya kr rha h ye to save hone se pehle status ko update kr rha h based on current date and start date and end date
// agr status cancelled nhi h to hi update krna hoga otherwise cancelled status ko change nhi krna hoga
//         if (currentDate < this.startDate) this.status = 'upcoming'; ye work kr rha h ki agr current date start date se choti h to status upcoming kr do
//         else if (currentDate >= this.startDate && currentDate <= this.endDate) this.status = 'active'; ye work kr rha h ki agr current date start date se badi ya barabar h or end date se choti ya barabar h to status active kr do
//         else if (currentDate > this.endDate) this.status = 'completed'; ye work kr rha h ki agr current date end date se badi h to status completed kr do

module.exports = mongoose.model('Batch', batchSchema)