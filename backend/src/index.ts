import "./startup.js";
import { ENV } from "./config/env.js";
import { app } from "./app.js";

app.listen(ENV().PORT, () =>
  console.log(`App listening on port ${ENV().PORT}`)
);
