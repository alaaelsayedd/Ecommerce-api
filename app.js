const express = require("express");
var server = express();
const mongoesDb = require("mongoose");
const cors = require("cors");
server.use(cors());
/**Connection To Database */
mongoesDb
  .connect(
    "mongodb+srv://alaa:Alaa@cluster0.may0w.mongodb.net/Ecommerce-api?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("database is connected");
  })
  .catch(() => {
    console.log("failed  to connection  database ");
  });
const productRoutes = require("./routes/productRoute");
/**Create an Applictaion  */

/**Create Middleware */
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use("/allProducts", productRoutes);

server.listen(3004, () => {
  console.log("server connected");
});
