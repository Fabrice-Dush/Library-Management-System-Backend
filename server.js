import app from "./app.js";
import mongoose from "mongoose";

mongoose
  .connect(process.env.DATABASE)
  .then((conn) => console.log(`🎉 Database Connected Successfully!`))
  .catch((err) => console.error(`⛔ Error connecting to database\n ${err}`));

app.listen(process.env.PORT, () =>
  console.log(`App started listening on port ${process.env.PORT}`)
);
