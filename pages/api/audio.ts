import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { whisperRecognize } from '@/utils/server/whisper';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  preservePath: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

// Middleware to handle file uploads
const uploadMiddleware = (req: any, res: any, next: () => void) => {
  upload.single('audio')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error processing file upload' });
    }

    // Call the next handler if there's no error
    next();
  });
};

const audioHandler = async (req: any, res: any) => {
  if (req.method === 'POST') {
    try {
      // Process the audio file
      const audioFile = req.file;
      const questionText = await whisperRecognize(
        audioFile,
        req.body.key as string,
      );
      return res.status(200).json({ message: questionText });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error processing file upload' });
    }
  } else {
    // Unsupported method
    return res.status(405).json({ error: 'Method not allowed' });
  }
};

const handler = (req: NextApiRequest, res: NextApiResponse) =>
  uploadMiddleware(req, res, () => audioHandler(req, res));

// Apply the upload middleware and export the audio handler
export default handler;
