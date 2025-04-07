import app from "./app";
import { connectToDB } from "./db/db";

const port = process.env.PORT || 3003;

connectToDB()
  .then(() => {
    console.log("mongodb connection established");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to mongodb", error);
    process.exit(1);
  });
