import express from "express";
import { me } from "./controller/me.js";
import { authenticate } from "middleware/authenticate.js";
import { sendBorrowedBook } from "./controller/borrowedBook.js";
import { sendProfileImg } from "./controller/sendProfileImg.js";
import { putProfileImg } from "./controller/putProfileImg.js";
import { deleteProfileImg } from "./controller/deleteProfileImg.js";
import multer from "multer";
import { checkRole } from "middleware/checkRole.js";
import { sendUser } from "./controller/sendUser.js";
import { deleteUser } from "./controller/deleteUser.js";
import { renameUser } from "./controller/renameUser.js";
import { changeRole } from "./controller/changeRole.js";

const userRoute = express.Router();
const upload = multer({ dest: "userprofile/" });

userRoute.get("/me", authenticate, me);
userRoute.get("/borrowedbook", authenticate, sendBorrowedBook);
userRoute.get("/me/profileimg", authenticate, (req, res) =>
  sendProfileImg(req.user?.id as number, req, res)
);
userRoute.put(
  "/me/profileimg",
  authenticate,
  upload.single("a"),
  putProfileImg
);

userRoute.delete("/me/profileimg", authenticate, deleteProfileImg);

userRoute.get("/", authenticate, checkRole("admin"), sendUser);
userRoute.delete("/:id", authenticate, checkRole("admin"), deleteUser);
userRoute.put("/:id/name", authenticate, checkRole("admin"), renameUser);
userRoute.put("/:id/role", authenticate, checkRole("admin"), changeRole);

export { userRoute };
