const mongoose = require("mongoose");
const ItemModel = require("./ItemModel");

module.exports = {
  getAllGroceryItems() {
    return ItemModel.find();
  },

  createNewGroceryItem(data) {
    return ItemModel.create(data);
  },

  deleteGroceryItem(itemID) {
    return ItemModel.findByIdAndRemove(itemID).exec();
  },

  checkOffGroceryItem(checkedItem) {
    return ItemModel.findByIdAndUpdate(checkedItem.id, {
      checked: checkedItem.checked
    }).exec();
  },

  updateGroceryItem(updatedItem) {
    return ItemModel.findByIdAndUpdate(updatedItem.id, {
      name: updatedItem.name
    }).exec();
  }
};
