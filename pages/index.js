import React from "react";
import Navbar from "../components/Navbar";
import List from "../components/List";
import Input from "../components/Input";
import io from "socket.io-client";
import Head from "next/head";

//establishing one-time connection for client
const socket = io();

export default function App(props) {
  return (
    <div>
      <Head>
        <title>Grocery List</title>
        <link
          rel="stylesheet"
          href="https://bootswatch.com/4/sketchy/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
          integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
          crossOrigin="anonymous"
        ></link>
      </Head>
      <main>
        <Navbar user={props.user} />
        <h1>Our Grocery List</h1>
        <p align="center" className="icons">
          <img src="/static/bananas.svg" />
          <img src="/static/cheese.svg" />
          <img src="/static/pea.svg" />
          <img src="/static/bacon.svg" />
          <img src="/static/toast.svg" />
          <img src="/static/apple.svg" />
          <img src="/static/cookie.svg" />
          <img src="/static/corn.svg" />
        </p>
        <List items={props.items} socket={socket} />
        <Input socket={socket} />
        <style jsx global>
          {`
            h1 {
              color: dodgerBlue;
              text-align: center;
              font-size: 55px;
            }

            .icons {
              padding-top: 10px;
              padding-bottom: 10px;
            }

            .icons img {
              padding: 5px;
              max-width: 50px;
            }
          `}
        </style>
      </main>
    </div>
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
