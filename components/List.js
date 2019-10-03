import React, { useEffect, useReducer } from "react";
import ContentEditable from "react-contenteditable";

function itemReducer(items, operationData) {
  const [op, arg] = operationData;
  switch (op) {
    case "add":
      return [...items, arg];
    case "delete":
      return items.filter(item => item.id !== arg);
    case "check":
      return items.map(item => (item.id === arg.id ? arg : item));
    case "update":
      return items.map(item => (item.id === arg.id ? arg : item));
  }
}

export default function List(props) {
  const [items, dispatch] = useReducer(itemReducer, props.items);
  const socket = props.socket;

  //refactor code below

  useEffect(() => {
    //receiving from server
    socket.on("item", newItem => dispatch(["add", newItem]));
    return () => socket.off("item");
  }, [items]);

  useEffect(() => {
    //receiving from server
    socket.on("delete", itemID => dispatch(["delete", itemID]));
    return () => socket.off("delete");
  }, [items]);

  useEffect(() => {
    socket.on("checked", checkedItem => dispatch(["check", checkedItem]));
    return () => socket.off("checked");
  }, [items]);

  useEffect(() => {
    socket.on("updated", updatedItem => dispatch(["update", updatedItem]));
    return () => socket.off("updated");
  }, [items]);

  const handleDelete = itemID => {
    const filteredItems = items.filter(item => item.id !== itemID);
    socket.emit("delete", itemID);
    dispatch(["delete", itemID]);
  };

  const handleChecked = checkedItem => {
    checkedItem.checked = !checkedItem.checked;
    dispatch(["check", checkedItem]);
    socket.emit("checked", checkedItem);
  };

  const handleUpdate = (e, updatedItem) => {
    updatedItem.name = e.target.value;
    dispatch(["update", updatedItem]);
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
