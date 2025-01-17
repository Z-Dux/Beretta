import { Beretta } from "./beretta.ts";
import { Logger } from "./structs/utils.ts";

const token = Deno.env.get("TOKEN") || "";

if (!token) {
  Logger.error("Token not found in environment variables");
  Deno.exit(1);
}

const bta = new Beretta(token);
bta.run();