import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Form Submission
  app.post("/api/submit-form", async (req, res) => {
    try {
      const { name, company, email, countryCode, phone, businessType, monthlyVolume, interests } = req.body;
      
      const payload = {
        name,
        company,
        email,
        phone: `'${countryCode} ${phone}`, // Added a single quote to force Google Sheets to treat it as text
        businessType,
        monthlyVolume,
        interests // Sending as array to match your Apps Script .join(", ") logic
      };

      console.log("إرسال البيانات إلى الشيت:", payload);

      const sheetWebhookUrl = process.env.SHEET_WEBHOOK_URL;
      
      if (sheetWebhookUrl) {
        await fetch(sheetWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      res.status(200).json({ 
        success: true, 
        message: "تم استلام طلبك بنجاح." 
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      res.status(500).json({ 
        success: false, 
        message: "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى." 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
