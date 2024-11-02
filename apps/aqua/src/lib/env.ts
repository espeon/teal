import dotenv from "dotenv";
import { cleanEnv, host, port, str, testOnly } from "envalid";
import process from "node:process";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("0.0.0.0") }),
  PORT: port({ devDefault: testOnly(3000) }),
  PUBLIC_URL: str({}),
  DB_PATH: str({ devDefault: "file:./db.sqlite" }),
  COOKIE_SECRET: str({ devDefault: "secret_cookie! very secret!" }),
});