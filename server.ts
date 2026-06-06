import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import fs from "fs";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  doc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

const systemInstruction = "You are Aura, an AI assistant for a home services application called QuickFix. You help users find verified electricians, plumbers, appliance repair technicians, pest control, and cleaning services in their area. Be friendly, concise, and helpful. Guide users to book services using the platform.";

let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function handleAuraChatReply(db: any, userId: string, userText: string) {
  const auraMessagesCol = collection(db, "aura_messages");

  try {
    const conversationQuery = query(
      auraMessagesCol,
      where("userId", "==", userId)
    );
    const historySnap = await getDocs(conversationQuery);
    const rawMessages: any[] = [];
    
    historySnap.forEach((msgDoc) => {
      const mData = msgDoc.data();
      if (mData.role === "user" || mData.role === "model") {
        rawMessages.push({
          role: mData.role === "model" ? "model" : "user",
          text: mData.text,
          createdAt: mData.createdAt
        });
      }
    });

    // Sort in-memory to prevent index constraints
    rawMessages.sort((a_item, b_item) => {
      const t1 = a_item.createdAt?.toMillis?.() || 0;
      const t2 = b_item.createdAt?.toMillis?.() || 0;
      return t1 - t2;
    });

    if (rawMessages.length === 0 || rawMessages[rawMessages.length - 1].text !== userText) {
      rawMessages.push({ role: "user", text: userText });
    }

    const recentMessages = rawMessages.slice(-15);
    const formattedContents = recentMessages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      await addDoc(auraMessagesCol, {
        text: "Hi there! It looks like your Gemini API Key is not configured yet. Please go to the Settings > Secrets panel in AI Studio and add GEMINI_API_KEY to start conversing with me.",
        role: "model",
        userId: userId,
        createdAt: serverTimestamp()
      });
      return;
    }

    const ai = getGeminiClient();
    console.log(`Generating DB direct Aura reply statelessly for: ${userId}`);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction
      }
    });

    const replyText = response.text || "Hello! How can I help you book local premium home services in Nagpur today?";

    await addDoc(auraMessagesCol, {
      text: replyText,
      role: "model",
      userId: userId,
      createdAt: serverTimestamp()
    });

  } catch (gemErr) {
    console.error("Gemini DB Chat Engine Error:", gemErr);
    try {
      await addDoc(auraMessagesCol, {
        text: "I experience a technical difficulty while connecting to database models. Please verify if your GEMINI_API_KEY is configured in Settings > Secrets.",
        role: "model",
        userId: userId,
        createdAt: serverTimestamp()
      });
    } catch (replyErr) {
      console.error("Fallback DB reply save failed:", replyErr);
    }
  }
}

async function startServer() {
  const app = reportExpressSetup();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Firebase client on server-side
  const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
  const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

  // Trigger generation of Aura's chat reply statelessly
  app.post("/api/chat-reply", async (req, res) => {
    try {
      const { userId, text } = req.body;
      if (!userId || !text) {
        return res.status(400).json({ error: "Required fields userId or text missing." });
      }
      
      // Async fire-and-forget reply generation to keep endpoint extremely responsive
      handleAuraChatReply(db, userId, text).catch(err => {
        console.error("Background handleAuraChatReply failed:", err);
      });
      
      return res.json({ success: true });
    } catch (error) {
      console.error("chat-reply endpoint error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Return a deprecated info route for API chat
  app.post("/api/chat", async (req, res) => {
    res.status(410).json({ error: "API Chat Endpoint Deprecated. Aura AI now connects directly to database (Firestore)." });
  });

  function reportExpressSetup() {
    return express();
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
