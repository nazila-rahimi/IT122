import mongoose from "mongoose";
import { MONGO_URI } from "./config.js"; // Ensure config.js exists

//  Connect to MongoDB
mongoose.connect(MONGO_URI, {
    dbName: "sccproject",
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Handle connection errors
mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
});

export default mongoose.connection;
