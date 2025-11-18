

import express from "express";
import "dotenv/config";
import cors from "cors"
import multer from "multer";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,` ${uniqueSuffix}-${file.originalname}` );
  }
})

const upload = multer({storage: storage});

const app = express();
app.use(cors());

const PORT = process.env.PORT


app.get("/",(req,res)=>{
    return res.status(200).json({status: "All good"});
})

app.post("/upload/pdf", upload.single("pdf"), (req, res) => {
    return res.status(200).json({message: "uploaded"});
}) 


app.listen(PORT, ()=>{
    console.log(`server running at PORT : ${PORT}`);
})

