# grocery-list-app

This project is a real-time grocery app which allows for you and your family/friends to have the same shared grocery list across all your devices. With this app, you can add new items, update and delete existing ones, and mark/unmark the items as purchased. With this app, users will be able to acquire items at the store quickly, efficiently and hassle-free, without the worry of purchasing duplicate items!

## Technologies Used
I chose to build this app using the MERN stack and I used quite a few new technologies, including Next.js, Socket.io and MongoDB.

Socket.io was the perfect library to use for real-time and bi-directional communication between the web clients and the server and MongoDB works alongside Socket.io seamlessly. There is no wonder that MongoDB is one of the most widely-used databases, as it is so flexible and setup is a breeze. The fact that MongoDB maps to objects in your code makes it so easy to work with.

I used Next.js because it offers server-side rendering, which made it easier to populate the items from the database initially. This app is authenticated with Google OAuth, powered by Passport, which requires users to be signed in to view the grocery list and perform CRUD operations.

## If I had more time I would have added:

-	Group accounts
-	Better styling with framework like Bootstrap
-	Multiple list types
-	Input validation
-	More concise file structure
