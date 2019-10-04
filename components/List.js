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
    <div className="">
      <table id="grocery-list-container">
        {items.map(item => (
          <tr key={item.id} className="grid-item">
            <td>
              <input
                type="checkbox"
                name="checkbox"
                checked={item.checked}
                onChange={e => handleChecked(item)}
              />
            </td>
            <div className="content-and-delete-btn">
              <td>
                <ContentEditable
                  className="name"
                  html={item.name}
                  onChange={e => handleUpdate(e, item)}
                />
              </td>

              <td>
                <i
                  className="far fa-trash-alt delete-item"
                  onClick={e => handleDelete(item.id)}
                ></i>
              </td>
            </div>
          </tr>
        ))}
      </table>

      <style jsx global>{`
        input[type="checkbox"]:checked + input.name {
          text-decoration: line-through;
        }

        input[type="checkbox"] {
          display: inline-block;
        }

        [type="checkbox"]:before {
          width: 20px;
          height: 20px;
        }

        input[type="checkbox"]:focus {
          outline: 0;
        }

        input[type="text"] {
          width: 200px;
        }

        .grid-item {
          display: flex;
        }

        td {
          text-align: center;
        }

        #grocery-list-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350, 1fr));
          grid-template-rows: repeat(13, 1fr);
          grid-auto-flow: column;
          justify-content: center;
          column-gap: 30px;
        }

        .name {
          display: inline-block;
          padding-left: 10px;
          padding-right: 10px;
        }

        body {
          font-family: "Verdana", sans-serif;
        }

        a {
          text-decoration: none;
          color: red;
        }

        a:hover {
          color: orange;
          text-decoration: none;
        }

        span {
          color: dodgerBlue;
        }

        ul {
          padding-left: 0;
        }

        li {
          text-align: center;
          list-style-type: none;
        }

        .delete-item {
          color: red;
          cursor: pointer;
          font-size: 18px;
          visibility: hidden;
        }

        .name {
          font-size: 20px;
          font-weight: normal;
        }

        td {
          padding-bottom: 10px;
        }

        tr:hover .delete-item {
          visibility: visible;
        }
      `}</style>
    </div>
  );
}
