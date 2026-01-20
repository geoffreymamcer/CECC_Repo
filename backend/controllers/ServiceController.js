import Service from "../models/Service.js";

// Get all services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new service
export const createService = async (req, res) => {
  const { name, price } = req.body;
  try {
    const newService = await Service.create({ name, price });
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
