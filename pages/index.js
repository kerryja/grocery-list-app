import React from "react";
import Navbar from "./Navbar";
import List from "./List";
import Input from "./Input";
import io from "socket.io-client";

//establishing one-time connection
const socket = io();

export default function App(props) {
  return (
    <main>
      <Navbar user={props.user} />
      <h1>Grocery App</h1>
      <List items={props.items} socket={socket} />
      <Input socket={socket} />
    </main>
  );
}

//fetch old list items from server
App.getInitialProps = async ({ req }) => {
  if (!req.user) return { items: [], user: null };
  //because this is on the client side, you cannot import db directly. so went aroud it by passing queries from server.js to the client via req - since req is the same obj on both sides -vehicle to carry it
  const queries = req.queries;
  //challenge: trying to return all items vs just one
  let dbItems = await queries.getAllGroceryItems();
  return {
    items: dbItems.map(i => {
      return { id: i.id, name: i.name, checked: i.checked };
    }),
    user: req.user
  };
};
