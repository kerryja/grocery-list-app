const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  checked: Boolean
});

module.exports = mongoose.model("Item", itemSchema);
