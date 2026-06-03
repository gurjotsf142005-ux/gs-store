# 🛒 GS Store - MERN Stack E-Commerce Platform

Welcome to **GS Store**! This is a full-stack web app built from the ground up to provide a fast, frictionless shopping experience—from browsing items to entering detailed delivery addresses.


## 🔥 Key Features

* **Granular Checkout Form:** Allows users to input detailed shipping fields (`House No`, `Street No`, `City`, `State`) saved directly to the database.
* **Smart Session Cleanup:** Automatically wipes the active cart array upon logout so user data never bleeds into guest sessions.


## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose ODM






## 🔌 Core API Routes

* `GET  /api/products` - Pulls down the entire live store inventory.
* `POST /api/order`    - Submits finalized checkouts with the complete shipping object.