import React from "react";
import List from "./List";
import Input from "./Input";
import io from "socket.io-client";

//establishing one-time connection
const socket = io();

export default function App(props) {
  return (
    <main>
      <h1>Grocery App</h1>
      <List items={props.items} socket={socket} />
      <Input socket={socket} />
    </main>
  );
}

//fetch old list items from server
App.getInitialProps = async ({ req }) => {
  const itemModel = req.itemModel;
  //challenge: trying to return all items vs just one
  let dbItems = await itemModel.find();
  return {
    items: dbItems.map(i => {
      return { id: i.id, name: i.name, checked: i.checked };
    })
  };
};
