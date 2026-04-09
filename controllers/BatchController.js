// const Batch = require("../models/Batch");
// const User = require("../models/User");
// // batch create bu teacher and admin
// exports.createBatch = async (req, res) => {
//   try {
//     const existingBatch = await Batch.findOne({
//       batchName: req.body.batchName,
//     });
//     if (existingBatch) {
//       return res.status(400).json({ message: "Batch already exists" });
//     }
//     const batch = new Batch({
//       ...req.body,
//       createdBy: req.user.id,
//       // ye apko zero smj aya
//       // ...req.body ye work kr rhi h spread operator
//       // ise se kya hoga ki jo bhi req.body me data h wo sare ke sare batch me add ho jayenge
//       // or createdBy me humne req.user.id pass kr diya h jiska matlab h ki jisne bhi batch create kiya h uska id kya h
//     });
//     await batch.save();
//     res.status(201).json({
//       message: "Batch Created Successfully",
//       batch,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// // get all batches for admin and teacher
// exports.getAllBatches = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     let query = {};
//     if (req.query.status) query.status = req.query.status;
//     if (req.query.search) {
//       query.$or = [
//         { batchName: { $regex: req.query.search, $options: "i" } },
//         { batchCode: { $regex: req.query.search, $options: "i" } },
//       ];
//     }
//     const batches = await Batch.find(query)
//       .populate("createdBy", "name email")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();
//     const total = await Batch.countDocuments(query);
//     res.json({
//       batches,
//       total,
//       page,
//       pages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // get single batch by id for admin and teacher
// exports.getBatchById = async (req, res) => {
//   try {
//     const batch = await Batch.findById(req.params.id)
//     .populate('teacher','name email')
//     .populate('createdBy')
//     .populate('students','name email phone')
//     if (!batch) {
//       return res.status(404).json({ message: "Batch Not Found" });
//     }
//     res.json({
//       success: true,
//       batch,
//       studentCount: batch.studentCount, // ye cheej kha se a rhi h batch model me student count hoga jo ki batch create hone ke baad 0 hoga or jab bhi koi student usme add hoga to wo increment hota jayega
//       avilabelSeats: batch.avilabelSeats, // ye cheej bhi batch model me hoga jo ki batch create hone ke baad total seats ke barabar hoga or jab bhi koi student usme add hoga to wo decrement hota jayega
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// // udpated batch 
// exports.updateBatch = async(req,res)=>{
// try {
//     const batch  = await Batch.findByIdAndUpdate(req.params.id,
//       req.body,
//       {new:true,runValidators:true}
//     );
//     if(!batch){
//       return  res.status(404).json({success:false, message:"Batch No Found"})
//     }
//     res.json({
//       success:true,
//       message:"Batch Update SuccesFully Add",
//       batch
//     })

// } catch (error) {
    
// }
// }

// // Delete batch 
// exports.deleteBatch = async(req,res)=>{
//   try {
//     const batch = await Batch.findByIdAndDelete(req.params.id)
//     if(!batch){
//       return res.status(404).json({success:false, message:"Batch Not Found"})
      
//     }
//     res.json({
//         success:true,
//         message:"Batch deleted",
      
        
//       })

//   } catch (error) {
//        res.status(500).json({message: error.message})
//   }
// }
// // add single student to batch by teacher and admin
// exports.addStudentToBatch = async (req,res)=>{
//     try {
//         const {batchID, studentID} = req.body
//         const batch = await Batch.findById(batchID)
//         if(!batch){return res.status(404).json({message: "Batch Not Found"})}
//         if(batch.students.includes(studentID)){
//             return res.status(400).json({message: "Student already in batch"})  
//         }
//         if(batch.students.length >=batch.maxStudents){
//             return res.status(400).json({message: "Batch is full"})
//         }
//         batch.students.push(studentID)
//         await batch.save()
//         await User.findByIdAndUpdate(studentID, {batch: batchID})
//         res.json({message: "Student added to batch successfully"})
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// // ye batchID kha se arhi h req.body se arhi h or studentID bhi req.body se arhi h to iska matlab h ki jab bhi teacher ya admin student ko batch me add krna chahega to usko batchID or studentID dono dena hoga
//         // req.body kha se arhi h ye to aapko pata hoga ki jab bhi aap postman me ya frontend me data bhejte ho to wo req.body me store hota h to jab bhi aap student ko batch me add krna chahega to aapko batchID or
//         //  studentID dono dena hoga taki ye function kaam kr ske
//  // yha pr hum batch ko find kr rhe h batchID se jo ki req.body se arhi h to iska matlab h ki jab bhi teacher ya admin student ko batch me add krna chahega to usko batchID dena hoga taki ye function kaam kr ske
//         // hum batchID ko create kha kr rhe ? hum batchId Create nhi krnge kyu ki ye seedha findByiD se a rha find by id jo mongdb id bnti h wo pane pas rkh leta or 
//         // return kr dte ato humne whi batchID maan li h 


// }


// // Bulk add students 
// exports.bulkAddStudentsToBatch = async(req,res)=>{
//     try {
//         const {batchId,studentIds} = req.body
//         const batch  = await Batch.findById(batchId)
//         if(!batch) return res.status(404).json({message: "Batch Not Found"})
//         const results = {added:[],alreadyIn:[],failes:[]}
//     for(const studentId of studentIds){
//         if(batch.students.includes(studentId)){
//             results.alreadyIn.push(studentId)
//             continue
//         }
//         batch.students.push(studentId)
//         results.added.push(studentId)
//         await User.findByIdAndUpdate(studentId,{batch: batchId})
//     }
//     // YE For loop work kya kr rha h bato 
//     // ye for loop StudentIds array me se ek ek studentId ko le rha h or chekck kr rha h ki wo studentId batch.students me h ya nhi h agar
//     //  h to usko alreadyIn array me push kr rha h or continue kr rha h taki wo next studentId pr jaye or agr nhi h to 
//     // usko batch.students me push kr rha h or added array me push kr 
//     // rha h taki ye pata chl ske ki kaun kaun se studentIds 
//     // batch me add hue h or kaun kaun se already batch me the
//     // iske alwa for loop ke alwa ort koi options tha 
//     // 
//     await batch.save()
//     res.json({message: "Students added to batch successfully", results})
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// }
// // Removed Student from batch by teacher and admin
// exports.removeStudentFromBatch = async(req,res)=>{
//     try {
//         const {batchId,studentID} = req.body
//         const batch  = await Batch.findById(batchId)
//         if(!batch) return res.status(404).json({message: "Batch Not Found"})
//             batch.students = batch.students.filter(id=> id.toString() !== studentID)
//         // yha pr humne remove use kyu nhi kya filter kyu use kiya 
//         // yha ;pr humne findByIdAnd Delete  ka use is liye nhi kya h kyu ki wo us student ko he delete kr dega is liye hum use nhi kiya h 
//         // is liye filter kr ke use kr rhe h ok 

//         await batch.save()
//         await User.findByIdAndUpdate(studentID, {batch: null})
//         res.json({message: "Student removed from batch successfully"})
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// }


// // yha pr humne poora crud system dekh liya yha Pr hum create delte bi kr rha or update bi kr rhe h 
// // Isko he bolte h proper crud system 
// // CRUD system mean kya hota h CREATE READ UPDATE AND DELETE 
// // DOCS 
// // https://medium.com/poka-techblog/simplify-your-javascript-use-map-reduce-and-filter-bd02c593cc2d
// // {} curly braces  scope start ho jata h console.log koi kuch bi return krtah hum usko jab use krte h 
// // jab hume terminal ya browesr ke console error dekhna ho ok
// // tab hum console ka use krte h 
// // {} return use krna pdta h mujhe mein kucn na kuch return krta hu 









const Batch = require('../models/Batch');
const User = require('../models/User');

// ====================== BATCH CRUD OPERATIONS ======================

// 1. Create New Batch
exports.createBatch = async (req, res) => {
  try {
    const { batchName, course, courseType, startDate, endDate, description, maxStudents, fees } = req.body;

    // Check if batch with same name already exists
    const existingBatch = await Batch.findOne({ batchName });
    if (existingBatch) {
      return res.status(400).json({
        success: false,
        message: "Is naam ka batch already exist karta hai"
      });
    }

    const newBatch = new Batch({
      batchName,
      course,
      courseType,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      teacher: req.user.id,           // Logged in user (Admin) teacher banega
      description,
      maxStudents: maxStudents || 50,
      fees: fees || { amount: 0 }
    });

    await newBatch.save();

    res.status(201).json({
      success: true,
      message: "Batch successfully created!",
      batch: newBatch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get All Batches (with pagination and search)
exports.getAllBatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.query.status) query.status = req.query.status;
    if (req.query.course) query.course = req.query.course;
    if (req.query.search) {
      query.$or = [
        { batchName: { $regex: req.query.search, $options: 'i' } },
        { batchCode: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const batches = await Batch.find(query)
      .populate('teacher', 'name email')
      .populate('students', 'name email')
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Batch.countDocuments(query);

    res.json({
      success: true,
      batches,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBatches: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Single Batch Details
exports.getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('teacher', 'name email phone')
      .populate('students', 'name email phone');

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    res.json({
      success: true,
      batch,
      studentCount: batch.studentCount,
      availableSeats: batch.availableSeats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Batch (Only Admin)
exports.updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }   // new: true → updated document return karega
    );

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    res.json({
      success: true,
      message: "Batch updated successfully",
      batch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Delete Batch (Only Admin)
exports.deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    res.json({
      success: true,
      message: "Batch deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== STUDENT MANAGEMENT ======================

// 6. Add Single Student to Batch
exports.addStudentToBatch = async (req, res) => {
  try {
    const { batchId, studentId } = req.body;

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

    if (batch.students.includes(studentId)) {
      return res.status(400).json({ success: false, message: "Student already in this batch" });
    }

    if (batch.students.length >= batch.maxStudents) {
      return res.status(400).json({ success: false, message: "Batch is full" });
    }

    batch.students.push(studentId);
    await batch.save();

    // Update student profile mein bhi batch reference
    await User.findByIdAndUpdate(studentId, { batch: batchId });

    res.json({
      success: true,
      message: "Student added to batch successfully",
      batch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Bulk Add Students
exports.bulkAddStudentsToBatch = async (req, res) => {
  try {
    const { batchId, studentIds } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: "studentIds must be a non-empty array" });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

    const results = { added: [], alreadyInBatch: [], notFound: [] };

    for (const studentId of studentIds) {
      const student = await User.findById(studentId);
      if (!student) {
        results.notFound.push(studentId);
        continue;
      }

      if (batch.students.includes(studentId)) {
        results.alreadyInBatch.push(studentId);
        continue;
      }

      batch.students.push(studentId);
      results.added.push(studentId);

      await User.findByIdAndUpdate(studentId, { batch: batchId });
    }

    await batch.save();

    res.json({
      success: true,
      message: `${results.added.length} students added successfully`,
      results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Remove Student from Batch
exports.removeStudentFromBatch = async (req, res) => {
  try {
    const { batchId, studentId } = req.body;

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

    if (!batch.students.includes(studentId)) {
      return res.status(400).json({ success: false, message: "Student is not in this batch" });
    }

    // Remove student from batch array
    batch.students = batch.students.filter(id => id.toString() !== studentId);
    await batch.save();

    // Remove batch reference from User model
    await User.findByIdAndUpdate(studentId, { $unset: { batch: "" } });

    res.json({
      success: true,
      message: "Student removed from batch successfully",
      batch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Get All Students of a Particular Batch
exports.getBatchStudents = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('students', 'name email phone ');   // jitna data chahiye populate kar sakte ho

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    res.json({
      success: true,
      batchName: batch.batchName,
      totalStudents: batch.students.length,
      students: batch.students
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};