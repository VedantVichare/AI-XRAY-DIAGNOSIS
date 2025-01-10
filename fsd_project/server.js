const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/Doctor", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://vedantvichare2480:nlWKHbWVrWOr0LSY@cluster1.vflvx.mongodb.net/Doctor", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define the Info Schema
const infoSchema = new mongoose.Schema({
    name: String,
    age: Number,
    mobile_no: String,
    surname: String,
    prediction: String,
    pneumonia_percentage: Number,
    normal_percentage: Number,
    date: { type: Date, default: Date.now },
    saliency_map_url: String,
    image_url: String,
});

// Dynamic collection name based on email
const getCollectionName = (email) => email;

// POST: Add a new record to the user's collection
app.post("/add/:email", async (req, res) => {
    const { email } = req.params;
    const collectionName = getCollectionName(email);
    const Info = mongoose.model(collectionName, infoSchema, collectionName); // Define model dynamically

    try {
        const newInfo = new Info(req.body); // Assuming the body contains the required fields
        await newInfo.save();
        res.status(201).json(newInfo);
    } catch (error) {
        console.error("Error saving new record:", error);
        res.status(500).send("Error adding the record.");
    }
});

// GET: Retrieve all records for the user's collection
app.get("/infos/:email", async (req, res) => {
    const { email } = req.params;
    const collectionName = getCollectionName(email);
    const Info = mongoose.model(collectionName, infoSchema, collectionName); // Define model dynamically

    try {
        const infos = await Info.find().sort({ date: -1 }); // Fetch all records sorted by date
        res.json(infos);
    } catch (error) {
        console.error("Error fetching infos:", error);
        res.status(500).send("An error occurred while fetching data.");
    }
});

// PUT: Update a record by ID
app.put("/update/:email/:id", async (req, res) => {
    const { email, id } = req.params;
    const collectionName = getCollectionName(email);
    const Info = mongoose.model(collectionName, infoSchema, collectionName); // Define model dynamically

    try {
        const updatedInfo = await Info.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedInfo) {
            return res.status(404).send({ message: 'Record not found' });
        }
        res.json(updatedInfo);
    } catch (error) {
        console.error("Error updating record:", error);
        res.status(500).send("Error updating the record.");
    }
});

// DELETE: Remove a record by ID
app.delete("/delete/:email/:id", async (req, res) => {
    const { email, id } = req.params;
    const collectionName = getCollectionName(email);
    const Info = mongoose.model(collectionName, infoSchema, collectionName); // Define model dynamically

    try {
        const deletedInfo = await Info.findByIdAndDelete(id);
        if (!deletedInfo) {
            return res.status(404).send({ message: 'Record not found' });
        }
        res.send({ message: 'Record deleted' });
    } catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).send("Error deleting the record.");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
