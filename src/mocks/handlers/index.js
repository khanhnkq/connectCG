import { authHandlers } from "./authHandlers";
import { postHandlers } from "./postHandlers";
import { groupHandlers } from "./groupHandlers";
import { userHandlers } from "./userHandlers";
import { friendHandlers } from "./friendHandlers";
import { chatHandlers } from "./chatHandlers";
import { adminHandlers } from "./adminHandlers";

export const allMockHandlers = [
  ...authHandlers,
  ...postHandlers,
  ...groupHandlers,
  ...userHandlers,
  ...friendHandlers,
  ...chatHandlers,
  ...adminHandlers,
];

export default allMockHandlers;
