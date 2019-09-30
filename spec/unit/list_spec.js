const ItemModel = require("../../db/ItemModel");
const queries = require("../../db/queries");
const mongoose = require("mongoose");

describe("List", () => {
  describe("Testing the functionality of the grocery list", () => {
    beforeAll(async () => {
      await mongoose.connect("mongodb://127.0.0.1/grocery-app-test", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });
    });

    //need to clear test db each time
    beforeEach(async () => {
      await mongoose.connection.dropCollection("items");
      await mongoose.connection.createCollection("items");
    });

    it("it should add an item to the list", async () => {
      let newItem = {
        name: "banana",
        checked: false
      };

      await queries.createNewGroceryItem(newItem);
      let allItems = await queries.getAllGroceryItems();
      expect(allItems.length).toBe(1);
      expect(allItems[0].name).toBe("banana");
      expect(allItems[0].checked).toBe(false);
    });
    it("it should add an item to the list and then remove it", async () => {
      let newItem = {
        name: "apple",
        checked: false
      };

      let addedItem = await queries.createNewGroceryItem(newItem);
      await queries.deleteGroceryItem(addedItem.id);
      let allItems = await queries.getAllGroceryItems();
      expect(allItems.length).toBe(0);
    });

    it("it should add an item to the list and then update the content", async () => {
      let newItem = {
        name: "apple",
        checked: false
      };
      let addedItem = await queries.createNewGroceryItem(newItem);
      addedItem.name = "banana";
      await queries.updateGroceryItem(addedItem);
      let allItems = await queries.getAllGroceryItems();
      //add expect
      expect(allItems.length).toBe(1);
      expect(allItems[0].name).toBe("banana");
    });
    it("it should add an item to the list and then check it off", async () => {
      let newItem = {
        name: "apple",
        checked: false
      };
      let addedItem = await queries.createNewGroceryItem(newItem);
      addedItem.checked = true;
      await queries.checkOffGroceryItem(addedItem);
      let allItems = await queries.getAllGroceryItems();
      expect(allItems.length).toBe(1);
      expect(allItems[0].checked).toBe(true);
    });
  });
});
