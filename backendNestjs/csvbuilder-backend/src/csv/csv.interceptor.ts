import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import * as fs from "fs";
import { extname } from "path";

// ✅ Απόλυτη διαδρομή στον φάκελο uploads
const uploadPath = path.resolve(process.cwd(), 'uploads');

// ✅ Αν δεν υπάρχει, φτιάξτον
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
export const csvFileInterceptor = FileInterceptor('file', {
  storage: diskStorage({
    destination: uploadPath,
    filename: (req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase(); // π.χ. .csv
      const finalName = 'templatefromcreate.csv'; // ✅ Σταθερό όνομα
      console.log('Saving CSV file as:', finalName);
      cb(null, finalName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes('csv')) {
      return cb(new Error('Only CSV files are allowed'), false);
    }
    cb(null, true);
  },
});