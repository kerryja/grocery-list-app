import React from "react";

export default function Navbar(props) {
  const getUserSignIn = user => {
    if (user) {
      return (
        <li>
          Signed in with {user.emails[0].value}.{" "}
          <a href="/auth/google/signout">Sign Out</a>
        </li>
      );
    }
    return (
      <li>
        <a href="/auth/google">Sign In with Google</a>
      </li>
    );
  };

  return (
    //fix this
    <div>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        {getUserSignIn(props.user)}
      </ul>
    </div>
  );
}
