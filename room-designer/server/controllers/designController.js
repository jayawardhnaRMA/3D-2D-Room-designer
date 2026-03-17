const Design = require("../models/Design");

// Get all designs for user
exports.getUserDesigns = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get designs where user is either the creator OR the assigned client
    const designs = await Design.find({
      $or: [
        { userId }, // User is the creator
        { clientId: userId }, // User is the assigned client
      ],
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: designs.length,
      designs,
    });
  } catch (error) {
    console.error("Error fetching designs:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.toString() : undefined,
    });
  }
};

// Get single design
exports.getDesign = async (req, res) => {
  try {
    const { designId } = req.params;
    const design = await Design.findById(designId);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    res.status(200).json({
      success: true,
      design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new design
exports.createDesign = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      projectName,
      roomType,
      dimensions,
      shape,
      colors,
      lighting,
      items,
      status,
      clientId,
      clientName,
    } = req.body;

    console.log("Creating design with data:", {
      userId,
      projectName,
      roomType,
      dimensions,
      shape,
      colors,
      lighting,
      items,
      status,
      clientId,
      clientName,
    });

    const design = await Design.create({
      userId,
      clientId: clientId || null,
      clientName: clientName || null,
      projectName: projectName || "Untitled Design",
      roomType,
      dimensions,
      shape,
      colors,
      lighting,
      items: items || [],
      status: status || "draft",
    });

    res.status(201).json({
      success: true,
      design,
    });
  } catch (error) {
    console.error("Design creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`) : [],
    });
  }
};

// Update design
exports.updateDesign = async (req, res) => {
  try {
    const { designId } = req.params;
    const {
      projectName,
      roomType,
      dimensions,
      shape,
      colors,
      lighting,
      items,
      status,
      clientId,
      clientName,
    } = req.body;

    let design = await Design.findById(designId);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    // Update fields
    if (projectName) design.projectName = projectName;
    if (roomType) design.roomType = roomType;
    if (dimensions) design.dimensions = dimensions;
    if (shape) design.shape = shape;
    if (colors) design.colors = colors;
    if (lighting) design.lighting = lighting;
    if (items !== undefined) design.items = items;
    if (status) design.status = status;
    if (clientId) design.clientId = clientId;
    if (clientName) design.clientName = clientName;

    design = await design.save();

    res.status(200).json({
      success: true,
      design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete design
exports.deleteDesign = async (req, res) => {
  try {
    const { designId } = req.params;

    const design = await Design.findByIdAndDelete(designId);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Design deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
