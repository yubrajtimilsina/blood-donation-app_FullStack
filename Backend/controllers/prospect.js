const Prospect = require("../models/Prospect");

// Create a new prospect
const createProspect = async (req, res) => {
  try {
    const newProspect = Prospect(req.body);
    const prospect = await newProspect.save();
    res.status(201).json(prospect);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all prospects
const getAllProspects = async (req, res) => {
  try {
    const prospects = await Prospect.find().sort({ createdAt: -1 });
    res.status(200).json(prospects);
  } catch (error) {
    res.status(500).json(error);
  } 
};
//Update a prospect
const updateProspect = async (req, res) => {
  try {
    const updatedProspect = await Prospect.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProspect);
  } catch (error) {
    res.status(500).json(error);
  }
};
//get One prospect
const getOneProspect = async (req, res) => {
  try {
    const prospect = await Prospect.findById(req.params.id);
    res.status(200).json(prospect);
  } catch (error) {
    res.status(500).json(error);
  }
};
//delete a prospect
const deleteProspect = async (req, res) => {
  try {
    await Prospect.findByIdAndDelete(req.params.id);
    res.status(204).json("Prospect deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createProspect,
  getAllProspects,
  updateProspect,
  getOneProspect,
  deleteProspect
};  

