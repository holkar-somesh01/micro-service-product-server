import multer, { StorageEngine } from "multer";
import path from "path";
import { Request } from "express";

const storage: StorageEngine = multer.diskStorage({
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    },
});

const upload = multer({ storage }).single("hero");

export { upload };
