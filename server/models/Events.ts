import mongoose, { Schema, Document } from "mongoose";

interface IEvent extends Document {
  studentID?: string;
  tutoringID?: string;
  edited?: boolean;
  student?: string;
  status: string;
  link: string;
  description?: string;
  category: string;
  date: string;
  time: string;
}

const eventsSchema: Schema<IEvent> = new Schema<IEvent>(
  {
    studentID: { type: String, required: false, unique: false },
    tutoringID: { type: String, required: false, unique: false },
    edited: { type: Boolean, required: false, unique: false, default: false },
    student: { type: String, required: false, unique: false },
    status: { type: String, required: true, unique: false, default: "marcado" },
    link: { type: String, required: true, unique: false },
    description: { type: String, required: false, unique: false },
    category: { type: String, required: true, unique: false },
    date: { type: String, required: true, unique: false },
    time: { type: String, required: true, unique: false },
  },
  { timestamps: true }
);

const Events_Model = mongoose.model<IEvent>("Events", eventsSchema);

export { Events_Model };
