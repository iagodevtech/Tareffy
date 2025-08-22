import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb: any) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Upload file for task
router.post('/task/:taskId', authenticateToken, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { taskId } = req.params;
    
    // Check if task exists and user has access
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          OR: [
            { ownerId: req.user.id },
            {
              members: {
                some: {
                  userId: req.user.id,
                },
              },
            },
          ],
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    const attachment = await prisma.attachment.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        taskId: taskId,
      },
    });

    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get attachments for task
router.get('/task/:taskId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    
    const attachments = await prisma.attachment.findMany({
      where: {
        taskId: taskId,
        task: {
          project: {
            OR: [
              { ownerId: req.user.id },
              {
                members: {
                  some: {
                    userId: req.user.id,
                  },
                },
              },
            ],
          },
        },
      },
    });

    res.json(attachments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
});

// Download file
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const attachment = await prisma.attachment.findFirst({
      where: {
        id: id,
        task: {
          project: {
            OR: [
              { ownerId: req.user.id },
              {
                members: {
                  some: {
                    userId: req.user.id,
                  },
                },
              },
            ],
          },
        },
      },
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    if (!fs.existsSync(attachment.path)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.download(attachment.path, attachment.originalName);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Delete attachment
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const attachment = await prisma.attachment.findFirst({
      where: {
        id: id,
        task: {
          project: {
            OR: [
              { ownerId: req.user.id },
              {
                members: {
                  some: {
                    userId: req.user.id,
                    role: { in: ['OWNER', 'MANAGER'] },
                  },
                },
              },
            ],
          },
        },
      },
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found or access denied' });
    }

    // Delete file from disk
    if (fs.existsSync(attachment.path)) {
      fs.unlinkSync(attachment.path);
    }

    // Delete from database
    await prisma.attachment.delete({
      where: { id: id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
});

export default router;
