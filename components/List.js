import React, { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";

export default function List(props) {
  const [items, setItems] = useState(props.items || []);
  const socket = props.socket;

  //refactor code below

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
    setItems(
      items.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
    socket.emit("updated", updatedItem);
  };

  return (
    <div className="container" id="grocery-list-container">
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <input
              type="checkbox"
              name="checkbox"
              checked={item.checked}
              onChange={e => handleChecked(item)}
            />
            <ContentEditable
              className="name"
              html={item.name}
              onChange={e => handleUpdate(e, item)}
            />
            <button onClick={e => handleDelete(item.id)}>x</button>
          </li>
        ))}
      </ul>
      <style jsx global>{`
        input[type="checkbox"]:checked + div.name {
          text-decoration: line-through;
        }

        input[type="checkbox"] {
          display: inline-block;
        }

        .name {
          display: inline-block;
          padding-left: 10px;
          padding-right: 10px;
        }

        #grocery-list-container {
          width: fit-content;
          margin: auto;
        }

        body {
          font-family: "Verdana", sans-serif;
        }

        a {
          text-decoration: none;
        }

        a:hover {
          color: orange;
        }
        h1 {
          color: green;
          text-align: center;
        }

        ul {
          padding-left: 0;
        }

        li {
          text-align: center;
          list-style-type: none;
        }

        #grocery-list-container li {
          text-align: left;
        }
      `}</style>
    </div>
  );
}
