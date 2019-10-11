import React from "react";

export default function Navbar(props) {
  const getUserSignIn = user => {
    if (user) {
      return (
        <nav>
          <li>
            Hello, <span>{user.name.givenName}!</span>{" "}
            <p>
              <a href="/auth/google/signout">Sign Out</a>
            </p>
          </li>
        </nav>
      );
    }
    return (
      <nav>
        <li>
          <a href="/auth/google">Sign in with Google</a>
        </li>
      </nav>
    );
  };

  return (
    <nav>
      <div>
        <ul>{getUserSignIn(props.user)}</ul>
      </div>
      <style jsx>
        {`
          font-weight: normal;
          }

       
        `}
      </style>
    </nav>
  );
}
