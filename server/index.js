

// // import express from "express";
// // import "dotenv/config";
// // import cors from "cors"
// // import multer from "multer";
// // import { Queue } from "bullmq";
// // import { QdrantVectorStore } from "@langchain/qdrant";

// // const queue = new Queue("file-upload-queue", {
// //     connection: {
// //         host: "localhost",
// //         port: 6379,
// //     }
// // });

// // const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
// //   url: "http://localhost:6333",
// //   collectionName: "pdf-docs"
// // })

// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     cb(null, 'uploads/')
// //   },
// //   filename: function (req, file, cb) {
// //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
// //     cb(null,`${uniqueSuffix}-${file.originalname}` );
// //   }
// // })

// // const upload = multer({storage: storage});

// // const app = express();
// // app.use(cors());

// // const PORT = process.env.PORT


// // app.get("/",(req,res)=>{
// //     return res.status(200).json({status: "All good"});
// // })

// // app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
// //     await queue.add("file-ready", JSON.stringify({
// //         filename: req.file.originalname,
// //         source: req.file.destination,
// //         path: req.file.path
// //     }))
// //     return res.status(200).json({message: "uploaded"});
// // }) 

// // app.get("/chat",async (req, res)=>{
// //   const userQuery = "what is this?";
// //   const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
// //     url: "http://localhost:6333",
// //     collectionName: "pdf-docs"
// //   })
// //   const ret = vectorStore.asRetriever({
// //     k: 2,
// //   })
// //   const result = await ret.invoke(userQuery);

// // })


// // app.listen(PORT, ()=>{
// //     console.log(`server running at PORT : ${PORT}`);
// // })







// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import multer from "multer";
// import { Queue } from "bullmq";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { GoogleGenAI } from "@google/genai";

// const app = express();
// app.use(cors());

// const client = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY
// })

// // -----------------------------
// // 1. Redis Queue (BullMQ)
// // -----------------------------
// const queue = new Queue("file-upload-queue", {
//   connection: {
//     host: "localhost",
//     port: 6379,
//   },
// });

// // -----------------------------
// // 2. Embeddings (REQUIRED)
// // -----------------------------
// const embeddings = new GoogleGenerativeAIEmbeddings({
//   apiKey: process.env.GOOGLE_API_KEY,
//   model: "text-embedding-004",
// });

// // -----------------------------
// // 3. Multer Upload Config
// // -----------------------------
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix =
//       Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });

// // -----------------------------
// // 4. Routes
// // -----------------------------
// app.get("/", (req, res) => {
//   return res.status(200).json({ status: "All good" });
// });

// // Upload PDF → Add job to queue
// app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
//   await queue.add(
//     "file-ready",
//     JSON.stringify({
//       filename: req.file.originalname,
//       source: req.file.destination,
//       path: req.file.path,
//     })
//   );

//   return res.status(200).json({ message: "uploaded" });
// });

// // Chat / Query Route
// app.get("/chat", async (req, res) => {
//   try {
//     const userQuery = req.query.q || "what is answer for question no 8?";

//     // Fetch vector store
//     const vectorStore = await QdrantVectorStore.fromExistingCollection(
//       embeddings,
//       {
//         url: "http://localhost:6333",
//         collectionName: "pdf-docs",
//       }
//     );

//     const retriever = vectorStore.asRetriever({ k: 3 });

//     const result = await retriever.invoke(userQuery);

//     const SYSTEM_PROMPT = `
//     You are a helpful AI Assistant who answers the user query based on the  
//     available context from PDF file.
//     Context: 
//     ${JSON.stringify(result)}
//     `;

//     const chatResponse = await client.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: 
//     })

//     return res.json({
//       query: userQuery,
//       results: result,
//     });
//   } catch (err) {
//     console.error("Chat Error:", err);
//     return res.status(500).json({ error: err.message });
//   }
// });

// // -----------------------------
// // 5. Start Server
// // -----------------------------
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

















import express from "express";
import "dotenv/config";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());

// Gemini Client
const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Redis Queue
const queue = new Queue("file-upload-queue", {
  connection: { host: "localhost", port: 6379 },
});

// Embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "text-embedding-004",
});

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`)
});

const upload = multer({ storage });

// Routes
app.get("/", (req, res) => res.json({ status: "All good" }));

// Upload PDF → Queue job
app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  await queue.add(
    "file-ready",
    JSON.stringify({
      filename: req.file.originalname,
      source: req.file.destination,
      path: req.file.path,
    })
  );
  res.json({ message: "uploaded" });
});

// Chat / Query Route
app.get("/chat", async (req, res) => {
  try {
    const userQuery = req.query.message || "what is answer to question 8 ?";

    // Load existing vector store
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: "http://localhost:6333",
        collectionName: "pdf-docs",
      }
    );

    const retriever = vectorStore.asRetriever({ k: 3 });
    const retrievedDocs = await retriever.invoke(userQuery);

    const context = retrievedDocs
      .map((d) => d.pageContent)
      .join("\n\n---\n\n");

    const SYSTEM_PROMPT = `
You are a helpful AI assistant. Use ONLY the context given below to answer
the user query. If the answer is not in the context, respond:
"I could not find this answer in the PDF."

Context:
${context}

User Question: ${userQuery}
`;

    const chatResponse = await client.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] }
      ]
    });

    // const aiAnswer = chatResponse.response.text();
    const aiAnswer = chatResponse.candidates?.[0]?.content?.parts?.[0]?.text || "No answer returned";
    console.log("aianswer : ", aiAnswer);

    return res.json({
      query: userQuery,
      answer: aiAnswer,
      context: retrievedDocs,
    });
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
