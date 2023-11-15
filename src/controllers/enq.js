const Enq = require('../models/enq')
const asyncHandler = require("express-async-handler");


const addEnquiry = asyncHandler(async(req, res) => {
    try {
        const enq = new Enq(req.body)

        await enq.save()

        res.status(201).json({
            state: true,
            data: enq
        })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(updatedEnquiry);
    } catch (error) {
      throw new Error(error);
    }
  });
  const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
      res.json(deletedEnquiry);
    } catch (error) {
      throw new Error(error);
    }
  });
  const getEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const getEnq = await Enquiry.findById(id);
      res.json(getEnq);
    } catch (error) {
      throw new Error(error);
    }
  });
  const getAllEnquiry = asyncHandler(async (req, res) => {
    try {
      const getAllEnq = await Enquiry.find();
      res.json(getAllEnq);
    } catch (error) {
      throw new Error(error);
    }
})

module.exports = {
    addEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getAllEnquiry,
    getEnquiry
}