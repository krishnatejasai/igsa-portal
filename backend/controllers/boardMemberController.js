const Model = require("../models/BoardMember");
const { boardInput } = require("../utils/contentValidation");
const fail = (res, error) => res.status(error.name === "CastError" || error.name === "ValidationError" ? 400 : 500).json({ message: "Unable to process this request. Please try again." });
const createBoardMember = async (req, res) => {
  let input;
  try { input = boardInput(req.body); } catch (error) { return res.status(400).json({ message: error.message }); }
  try { res.status(201).json(await Model.create(input)); } catch (error) { fail(res, error); }
};
const getBoardMembers = async (req, res) => {
  try { res.json(await Model.find().sort({ createdAt: 1 })); } catch (error) { fail(res, error); }
};
const getById = async (req, res) => {
  try { const item = await Model.findById(req.params.id); if (!item) return res.status(404).json({ message: "Not found" }); res.json(item); } catch (error) { fail(res, error); }
};
const updateBoardMember = async (req, res) => {
  let input;
  try { input = boardInput(req.body); } catch (error) { return res.status(400).json({ message: error.message }); }
  try { const item = await Model.findByIdAndUpdate(req.params.id, input, { new: true, runValidators: true }); if (!item) return res.status(404).json({ message: "Not found" }); res.json(item); } catch (error) { fail(res, error); }
};
const deleteBoardMember = async (req, res) => {
  try { const item = await Model.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ message: "Not found" }); res.json({ message: "Deleted successfully" }); } catch (error) { fail(res, error); }
};
module.exports = { createBoardMember, getBoardMembers, getById, updateBoardMember, deleteBoardMember };
