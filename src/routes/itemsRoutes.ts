import { Router, type Request, type Response } from "express";
// import Zod validators
import {
  zUserId,
  zItemId,
  zItemPostBody,
  zItemPutBody,
  zItemDeleteBody
} from "../libs/zodValidators.js";
// import types
import type { Item } from "../libs/types.ts";
// import database
import { items } from "../db/db.ts";
//import uuid
import { v4 as uuidv4 } from 'uuid';

import dotenv from "dotenv";
dotenv.config();
import type { User, CustomRequest } from "../libs/types.js";

// import authentication middleware
import { authenticateToken } from "../middlewares/authenMiddleware.ts";

// import database
import { users } from "../db/db.ts";

const router = Router();

// GET /api/v704/items/:userId 
router.get(
  "/:userId",
  authenticateToken,
  (req: CustomRequest, res: Response) => {

    try {
      const userIdResult = zUserId.safeParse(req.params.userId);

      if (!userIdResult.success) {
        return res.status(400).json({
          success: false,
          message: userIdResult.error.issues[0].message,
        });
      }

      const userId = userIdResult.data;

      if (req.user?.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access",
        });
      }

      const userItems = items.filter(
        (item: Item) => item.userId === userId
      );

      if (userItems.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Items for user ID ${userId} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: userItems,
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something is wrong, please try again",
      });
    }
  }
);

// POST /api/v704/items/:userId, body = {new item data}
// add a new Item for userId
router.post(
  "/:userId",
  authenticateToken,
  (req: CustomRequest, res: Response) => {

    try {

      const userIdResult = zUserId.safeParse(req.params.userId);

      if (!userIdResult.success) {
        return res.status(400).json({
          success: false,
          message: userIdResult.error.issues[0].message,
        });
      }

      const userId = userIdResult.data;

      if (req.user?.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access",
        });
      }

      const itemId = uuidv4();
      const result = zItemPostBody.safeParse({

        userId: userId,
        itemId: itemId,

        product_name: req.body.product_name,
        unit_price: req.body.unit_price,
        quantity: req.body.quantity,
        category: req.body.category,
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error.issues[0].message,
        });
      }

      const newItem: Item = result.data;

      items.push(newItem);

      return res.status(201).json({
        success: true,
        message: "New Item has been added successfully",
        data: newItem,
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message: "Something is wrong, please try again",
      });
    }
  }
);

// Delete /api/vXXX/items/:userId


export default router;