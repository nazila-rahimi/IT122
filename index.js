import express from "express";
import cors from "cors";
import db from "./data.js"; // Connects to MongoDB
import AppleProduct from "./models/appleproducts.js"; // Product schema

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS for rendering HTML pages
app.set("view engine", "ejs");
app.set("views", "./templates");

// Middleware to handle requests
app.use(cors());
app.use(express.json()); // Allows server to read JSON data
app.use(express.static("public"));



// Get all items
app.get("/api/items", async (req, res) => {
    try {
        const products = await AppleProduct.find();
        if (!products.length) {
            return res.status(404).json({ error: "No products found" });
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving data" });
    }
});

// Get a single item by ID
app.get("/api/items/:id", async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await AppleProduct.findOne({ id: productId });

        if (!product) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving item" });
    }
});

// Add a new item or update an existing one
app.post("/api/items", async (req, res) => {
    try {
        const { id, name, price, year } = req.body;

        if (!id || !name || !price) {
            return res.status(400).json({ error: "ID, name, and price are required." });
        }

        let existingProduct = await AppleProduct.findOne({ id });

        if (existingProduct) {
            await AppleProduct.updateOne({ id }, { name, price, year });
            res.json({ id, name, price, year });
        } else {
            const newItem = new AppleProduct({ id, name, price, year });
            await newItem.save();
            res.status(201).json(newItem);
        }
    } catch (error) {
        res.status(500).json({ error: "Error saving item" });
    }
});

// Delete an item by ID
app.delete("/api/items/:id", async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const result = await AppleProduct.deleteOne({ id: productId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting item" });
    }
});



// Home Page - Shows all products
app.get("/", async (req, res) => {
    try {
        const products = await AppleProduct.find();
        res.render("home", { items: products });
    } catch (err) {
        res.status(500).send("Error fetching products");
    }
});

// Detail Page - Shows a single product
app.get("/detail", async (req, res) => {
    try {
        const productId = parseInt(req.query.id);
        const product = await AppleProduct.findOne({ id: productId });

        if (product) {
            res.render("detail", { item: product });
        } else {
            res.status(404).send("Product not found");
        }
    } catch (err) {
        res.status(500).send("Error fetching product");
    }
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
}).on("error", (err) => {
    console.error("Server error:", err);
});

