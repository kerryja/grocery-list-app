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
  );
}
