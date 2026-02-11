const SystemSetting = require('../models/SystemSetting');

// Get a setting by key
exports.getSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const setting = await SystemSetting.findOne({ key });
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        res.json(setting);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update or Create a setting
exports.updateSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        const setting = await SystemSetting.findOneAndUpdate(
            { key },
            { value },
            { new: true, upsert: true } // Create if doesn't exist
        );

        res.json(setting);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
