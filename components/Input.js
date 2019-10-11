import React, { useState, useEffect } from "react";

export default function Input(props) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    const newItem = { name: value, checked: false };
    props.socket.emit("item", newItem);
    setValue("");
  };

  return (
    <div>
      <form
        style={props.user ? {} : { display: "none" }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="text"
          name="text"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <button type="submit" className="btn">
          +
        </button>
      </form>
      <style jsx>
        {`
          form {
            text-align: center;
          }

          .btn {
            background-color: #6cf5c5;
          }

          .btn:hover {
            background-color: #ffd553;
          }

          .btn-sm {
            background-color: #ff6376;
          }

          .btn-sm:hover {
            background-color: #ffd553;
          }

          .btn-sm:focus,
          .btn:active:focus,
          .btn.active:focus,
          .btn.focus,
          .btn:active.focus,
          .btn.active.focus {
            outline: none;
          }

          .btn-sm: focus {
            outline: none;
          }
        `}
      </style>
    </div>
  );
}
