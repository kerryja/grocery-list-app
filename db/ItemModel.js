const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  checked: Boolean,
  creator: String,
  collaborators: [String]
});

module.exports = mongoose.model("Item", itemSchema);
