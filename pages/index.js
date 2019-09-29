import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import ContentEditable from "react-contenteditable";
// import "bootstrap/dist/css/bootstrap.css";
import { Button } from "reactstrap";

//establishing one-time connection
const socket = io();

export default function Home(props) {
  const [value, setValue] = useState("");
  const [items, setItems] = useState(props.items);

  /*useEffect(() => {
    //receiving from server
    socket.on("item", newItem => {
      console.log("new item added");
      console.log(newItem);
      setItems([...items, newItem]);
    });
    socket.on("delete", itemID => {
      const filteredItems = items.filter(item => item.id !== itemID);
      setItems(filteredItems);
    });
  }, [items]);*/
  useEffect(() => {
    //receiving from server
    socket.on("item", newItem => {
      console.log("new item added");
      console.log(newItem);
      setItems([...items, newItem]);
    });
    return () => socket.off("item");
  }, [items]);

  useEffect(() => {
    //receiving from server
    socket.on("delete", itemID => {
      const filteredItems = items.filter(item => item.id !== itemID);
      setItems(filteredItems);
    });
    return () => socket.off("delete");
  }, [items]);

  useEffect(() => {
    socket.on("checked", checkedItem => {
      setItems(
        items.map(item => (item.id === checkedItem.id ? checkedItem : item))
      );
    });
    return () => socket.off("checked");
  }, [items]);

  useEffect(() => {
    socket.on("updated", updatedItem => {
      setItems(
        items.map(item => (item.id === updatedItem.id ? updatedItem : item))
      );
    });
    return () => socket.off("updated");
  }, [items]);

  const handleSubmit = e => {
    e.preventDefault();
    const newItem = { name: value, checked: false, id: Date.now() };
    console.log(newItem);
    socket.emit("item", newItem);
    setItems([...items, newItem]);
    setValue("");
  };

  const handleDelete = itemID => {
    const filteredItems = items.filter(item => item.id !== itemID);
    socket.emit("delete", itemID);
    setItems(filteredItems);
  };

  const handleChecked = checkedItem => {
    checkedItem.checked = !checkedItem.checked;
    setItems(
      items.map(item => (item.id === checkedItem.id ? checkedItem : item))
    );
    socket.emit("checked", checkedItem);
  };

  const handleUpdate = (e, updatedItem) => {
    updatedItem.name = e.target.value;
    console.log(updatedItem);
    setItems(
      items.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
    socket.emit("updated", updatedItem);
  };

  return (
    <main>
      <div className="container">
        <Button className="primary">Add </Button>
        <h1>Grocery App</h1>

        <ul>
          {items.map((item, index) => (
            <li key={item.id}>
              <input
                type="checkbox"
                name="checkbox"
                checked={item.checked}
                onChange={e => handleChecked(item)}
              />
              <ContentEditable
                html={item.name}
                onChange={e => handleUpdate(e, item)}
              />
              <button onClick={e => handleDelete(item.id)}>x</button>
            </li>
          ))}
        </ul>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="text"
              value={value}
              onChange={e => setValue(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        </div>
      </div>
      <style jsx>{`
         {
          input[type="checkbox"]:checked + label {
            text-decoration: line-through;
          }
        }
        li {
          color: blue;
          text-align: center;
          list-style-type: none;
        }
      `}</style>
    </main>
  );
}

//fetch old list items from server
Home.getInitialProps = async ({ req }) => {
  //const response = await fetch("http://localhost:3000/items");
  //const items = await response.json();
  //return { items };
  return { items: global.gItems };
};
