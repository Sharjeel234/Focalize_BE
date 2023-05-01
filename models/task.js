import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        date: { type: Date, required: true },
        creator: { type: String, required: true },
        createAt: { type: Date, default: new Date() },
        done: { type: Boolean, default: false }
    },
    { 
        collection: "task" 
    }
);

export default mongoose.model("Tasks", taskSchema);