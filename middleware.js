
import { updateSession } from "./lib/session";

export async function middleware(request) {
  return await updateSession(request);
}
