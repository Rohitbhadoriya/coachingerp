const Batch = require('../models/Batch')
const User = require('../models/User')
// batch create bu teacher and admin 
exports.createBatch = async(req,res)=>{
  try {
      const existingBatch = await Batch.findOne({batchName:req.body.batchName})
      if(existingBatch){
            return res.status(400).json({message:"Batch already exists"})
      }
      const batch =- new Batch({
        ...req.body,
        createdBy:req.user.id
        // ye apko zero smj aya 
        // ...req.body ye work kr rhi h spread operator 
        // ise se kya hoga ki jo bhi req.body me data h wo sare ke sare batch me add ho jayenge
        // or createdBy me humne req.user.id pass kr diya h jiska matlab h ki jisne bhi batch create kiya h uska id kya h 
      })
      await batch.save()
      res.status(201).json({
        message:"Batch Created Successfully",
        batch
      })
  } catch (error) {
        res.status(500).json({message: error.message})  
    }
}
// get all batches for admin and teacher
exports.getAllBatches = async(req,res)=>{
    try {
        const page = pasrseInt(req.query.page) || 1
        const limit  = parseInt(req.query.limit) || 10
        const skip  = (page - 1) * limit 
        let query = {}
        if(req.query.status) query.status = req.query.status
        if(req.query.search){
            query.$or = [
                {batchName:{$regex:req.query.search, $options:'i'}},
                {batchCode:{$regex:req.query.search, $options:'i'}}
            ]
        }
        const batches = await Batch.find(query)
        .populate('createdBy','name email')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        const total = await Batch.countDocuments(query)
        res.json({
            batches,
            total,
            page,
            pages:Math.ceil(total/limit)
        })
    } catch (error) {
          res.status(500).json({message: error.message})  
    }
}
