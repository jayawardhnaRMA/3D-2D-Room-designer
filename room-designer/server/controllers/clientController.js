const Client = require("../models/Client");

// Get all clients for a designer
exports.getClients = async (req, res) => {
  try {
    const { userId } = req.params;
    const clients = await Client.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    console.error("Error fetching clients:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new client
exports.createClient = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, address, city, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const client = await Client.create({
      userId,
      name,
      email,
      phone,
      address,
      city,
      notes,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    console.error("Error creating client:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single client
exports.getClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findById(clientId).populate("projects");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    console.error("Error fetching client:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { name, email, phone, address, city, status, notes } = req.body;

    const client = await Client.findByIdAndUpdate(
      clientId,
      { name, email, phone, address, city, status, notes },
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    console.error("Error updating client:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findByIdAndDelete(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
