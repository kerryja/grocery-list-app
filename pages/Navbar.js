import React from "react";

export default function Navbar(props) {
  const getUserSignIn = user => {
    if (user) {
      return (
        <nav>
          <li>
            Signed in with {user.emails[0].value}.{" "}
            <a href="/auth/google/signout">Sign Out</a>
          </li>
        </nav>
      );
    }
    return (
      <nav>
        <li>
          <a href="/auth/google">Sign In with Google</a>
        </li>
      </nav>
    );
  };

  return (
    <nav>
      <div>
        <ul>{getUserSignIn(props.user)}</ul>
      </div>
    </nav>
  );
}
