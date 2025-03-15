import mongoose from "mongoose";

const AppleProductSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    year: { type: Number, required: true }
});

// ✅ Ensure correct collection name & export
export default mongoose.models.AppleProduct || mongoose.model("AppleProduct", AppleProductSchema);
