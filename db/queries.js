const mongoose = require("mongoose");
const ItemModel = require("./ItemModel");

module.exports = {
  getAllGroceryItems(id) {
    return ItemModel.find({ creator: id });
  },

  createNewGroceryItem(data) {
    return ItemModel.create(data);
  },

  deleteGroceryItem(itemID) {
    return ItemModel.findByIdAndRemove(itemID).exec();
  },

  clearList() {
    return ItemModel.deleteMany().exec();
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
