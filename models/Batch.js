


const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batchName: {
        type: String,
        required: [true, "Batch Name is required"],
        trim: true,
        unique: true,
        maxlength: [50, "Batch Name should be less than 50 characters"]
    },
    batchCode: {
        type: String,
        required: [true, "Batch Code is required"],
        trim: true,
        uppercase: true,
        default: function () {
            return 'BATCH' + Date.now() + "-" + Math.random().toString(36).substr(2, 5).toUpperCase();
        }
    },
    course: {
        type: String,
        required: [true, "Course is required"],
        trim: true,
    },
    courseType: {
        type: String,
        enum: ['Medical', 'Engineering', 'School', 'Competitive', 'Other'],
        required: [true, "Course Type is required"]
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",          // ← Yeh theek hai
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    waitingList: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        addedAt: { type: Date, default: Date.now }
    }],
    status: {
        type: String,
        enum: ['active', 'upcoming', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, "Description should be less than 500 characters"]
    },
    maxStudents: {
        type: Number,
        default: 30,
        min: [5, "Minimum 5 students allowed"],
    },
    fees: {
        amount: {           // ← yahan spelling galat thi → ammount → amount
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: 'INR'
        }
    },
}, { timestamps: true });

// Virtuals
batchSchema.virtual('studentCount').get(function () {
    return this.students.length;
});

batchSchema.virtual('availableSeats').get(function () {
    return this.maxStudents - this.students.length;
});

// Pre-save middleware
batchSchema.pre('save', function (next) {
    const currentDate = new Date();
    if (this.status !== 'cancelled') {
        if (currentDate < this.startDate) this.status = 'upcoming';
        else if (currentDate >= this.startDate && currentDate <= this.endDate) this.status = 'active';
        else if (currentDate > this.endDate) this.status = 'completed';
    }
    next();
});

module.exports = mongoose.model('Batch', batchSchema);