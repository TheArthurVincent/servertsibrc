import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

interface IStudent extends Document {
    username: string;
    password: string;
    email: string;
    name: string;
    lastname: string;
    doc: string;
    phoneNumber: string;
    scoreTimeline: Array<any>;
    tutoringDays: Array<any>;
    totalScore: number;
    monthlyScore: number;
    dateOfBirth: string;
    permissions?: string;
    ankiEmail?: string;
    ankiPassword?: string;
    googleDriveLink?: string;
    address?: string;
    picture?: string;
    language?: string;
    changedPasswordBeforeLogInAgain?: boolean;
}

enum TimelineDataType {
    Date = "date",
    Score = "score",
    Description = "description",
    Type = "type",
}

interface ITimelineItem {
    [TimelineDataType.Date]: Date;
    [TimelineDataType.Score]?: number;
    [TimelineDataType.Description]?: string;
    [TimelineDataType.Type]: string;
}

enum DayOfWeek {
    Sunday = "Sun",
    Monday = "Mon",
    Tuesday = "Tue",
    Wednesday = "Wed",
    Thursday = "Thu",
    Friday = "Fri",
    Saturday = "Sat",
}

interface ITutoringDay {
    day: DayOfWeek;
    time: string;
    link: string;
    id: string;
}

const studentSchema: mongoose.Schema<IStudent> = new mongoose.Schema<IStudent>(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 8 },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Escolha um e-mail válido"],
        },
        name: { type: String, required: true },
        lastname: { type: String, required: true },
        doc: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        scoreTimeline: {
            type: [{ type: Object }],
            default: [],
            required: false,
            validate: {
                validator: function (value: ITimelineItem[]) {
                    return true;
                },
                message: "Formato inválido para scoreTimeline",
            },
        },
        tutoringDays: {
            type: [{ type: Object }],
            default: [],
            required: false,
            validate: {
                validator: function (value: ITutoringDay[]) {
                    return true;
                },
                message: "Formato inválido para tutoringDays",
            },
        },
        totalScore: { type: Number, required: true, default: 0 },
        monthlyScore: { type: Number, required: true, default: 0 },
        dateOfBirth: { type: String, required: true },
        permissions: { type: String, required: false, default: "student" },
        ankiEmail: { type: String, required: false },
        ankiPassword: { type: String, required: false },
        googleDriveLink: {
            type: String,
            required: false,
            default: "https://portal.arthurvincent.com.br/message",
        },
        address: { type: String, required: false },
        picture: {
            type: String,
            required: false,
            default:
                "https://ik.imagekit.io/vjz75qw96/assets/arvin_visuals/profile.jpg?updatedAt=1705408334723",
        },
        language: { type: String, required: false, default: "pt" },
        changedPasswordBeforeLogInAgain: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Student_Model = mongoose.model<IStudent>("Student", studentSchema);

export { Student_Model };
