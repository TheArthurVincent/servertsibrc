import mongoose, { Document, Model, Schema } from "mongoose";

interface BlogPost extends Document {
  title: string;
  videoUrl?: string;
  img?: string;
  text: string;
}

const blogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: false },
    img: { type: String, required: false },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Blog_ModelTS: Model<BlogPost> = mongoose.model<BlogPost>(
  "BlogPosts",
  blogSchema
);


export { Blog_ModelTS };
