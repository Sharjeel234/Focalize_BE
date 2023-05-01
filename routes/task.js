import express from "express";

import {
    createTask,
    deleteTask,
    updateTask,
    getTasks,
    sendEmailNotification,
    sendSmsNotification,
    deleteInAppNotification,
    toggleTaskDone
} from '../controllers/task';

import auth from '../utils/auth';

const router = express.Router();

router.get("/", auth, getTasks);
router.post("/", auth, createTask);
router.patch("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.get("/:id", auth, toggleTaskDone);

router.post("/send-sms", sendSmsNotification);
router.post("/send-email", sendEmailNotification);
router.post("/delete", deleteInAppNotification);

export default router;