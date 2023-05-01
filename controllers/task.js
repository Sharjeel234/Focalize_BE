import tasks from "../models/task"
import mongoose from "mongoose"
import {
    getNotification,
    inAppNotification,
    smsNotification
} from "../novu/novu"

// Retrive All Task From DB 

export const getTasks = async (req, res) => {

    try {
        const allTasks = tasks.find();

        res.status(200).json(allTasks);

    } catch (error) {
        res.status(409).json({ message: error })
    }
}

// Create New Task 

export const createTask = async (req, res) => {

    const { title, description, date, message } = req.body;

    const newTask = new tasks({
        title,
        description,
        date,
        creator: req.userId,
        createdAt: new Date().toISOString(),
        checked: false
    })

    try {
        await newTask.save();

        await inAppNotification(title, description, req.userId, message);

        res.status(201).json(newTask)

    } catch (error) {
        res.status(409).json({ message: error })
    }
}

// Delete Task 

export const deleteTask = async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No Task Is Available With ID: ${id}`);
    }

    await tasks.findByIdAndRemove(id);

    res.json({ message: "Task Deleted Successfully" });
}

// Update Task 

export const updateTask = async (req, res) => {

    const { id: _id } = req.params;

    const task = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send(`No Task Is Available With ID: ${id}`);
    }

    const updatedTask = await tasks.findByIdAndUpdate(
        _id,
        { ...task, _id },
        { new: true }
    );

    res.json(updatedTask);
}

// Check Status of Task

export const toggleTaskDone = async (req, res) => {

    try {
        const taskRef = await tasks.findById(req.params.id);

        const task = await tasks.findOneAndUpdate(
            { _id: req.params.id },
            { done: !taskRef.done }
        );

        await task.save();

        return res.status(200).json(task)

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

// Send Notification To Phone 

export const sendSmsNotificarion = async (req, res) => {

    try {
        
        const { title, description, date, phone, taskid } = req.body;

        await smsNotification(title, description, date, phone, taskid);

        res.status(200).json({ message: "SMS sent Successfully" });


    } catch (error) {
        console.log("SendSMSNotification error", error);
        res.status(500).json({ message: "Failed To Send SMS" });
    }
}

// Send Notification TO Email

export const sendEmailNotification = async (req, res) => {

    try {
        
        const { name, title, description, email, taskId } = req.body;

        await getNotification(name, title, description, email, taskId);

        res.status(200).json({ message: "Email sent Successfully" });
    } catch (error) {
        console.log("sendEmailNotification error", error);
        res.status(500).json({ message: "Failed to Send Email" });
    }
}

// Delete Notification

export const deleteInAppNotification = async (req, res) => {

    try {
        
        const { title, description, userId, message } = req.body;

        await inAppNotification(title, description, userId, message);

        res.status(200).json({ message: "Task Deleted Successfully"});
    } catch (error) {
        console.log("deleteInAppNotification error", error);
        res.status(500).json({ message: "Task Deleted Failed" });
    }
}