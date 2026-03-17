const FurnitureItem = require("../models/FurnitureItem");

// Get all furniture items
exports.getFurnitureItems = async (req, res) => {
  try {
    const { category, style } = req.query;
    let filter = { inStock: true };

    if (category && category !== "All Items") {
      filter.category = category;
    }

    if (style) {
      filter.style = style;
    }

    const items = await FurnitureItem.find(filter).sort({ 
      isFromEditor: -1, 
      createdAt: -1 
    });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Error fetching furniture items:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create furniture item
exports.createFurnitureItem = async (req, res) => {
  try {
    const { name, category, price, description, dimensions, materials, colors, style, image, modelPath, badge, isFromEditor } = req.body;

    const item = await FurnitureItem.create({
      name,
      category,
      price,
      description,
      dimensions,
      materials,
      colors,
      style,
      image,
      modelPath,
      badge,
      isFromEditor: isFromEditor || false,
    });

    res.status(201).json({
      success: true,
      message: "Furniture item created successfully",
      item,
    });
  } catch (error) {
    console.error("Error creating furniture item:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single furniture item
exports.getFurnitureItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await FurnitureItem.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Furniture item not found",
      });
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Error fetching furniture item:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update furniture item
exports.updateFurnitureItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await FurnitureItem.findByIdAndUpdate(itemId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Furniture item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Furniture item updated successfully",
      item,
    });
  } catch (error) {
    console.error("Error updating furniture item:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
