import Inquiry from '../model/Inquiry.js';

export const submitInquiry = async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json({ success: true, message: 'Inquiry received' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};