import express from 'express';
import { deleteFromCloudinary } from '../utils/deleteCloudinaryFile.js';

const router = express.Router();

router.delete('/image', async (req, res) => {
  const { public_id } = req.body;
    console.log(public_id)
  if (!public_id) {
    return res.status(400).json({ error: 'Missing public_id' });
  }

  try {
    const result = await deleteFromCloudinary(public_id);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: 'Cloudinary deletion failed' });
  }
});

export default router;
