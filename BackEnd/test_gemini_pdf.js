import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = process.env.GEMINI_FLASH_URL || "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function run() {
  try {
    const defaultPdfHex = "255044462d312e340a25e2e3cfd30a320... (dummy pdf hex)";
    // Let's make an empty valid pdf base64:
    const base64Pdf = "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLY2UdBkAAQsD7gplbmRzdHJlYW0KZW5kb2JqCgozIDAgb2JqCjIzCmVuZG9iagoKNCAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3ggWzAgMCA1OTUgODQyXS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgMSAwIFI+Pj4+L0NvbnRlbnRzIDIgMCBSL1BhcmVudCA1IDAgUj4+CmVuZG9iagoKMSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKCjUgMCBvYmoKPDwvVHlwZS9QYWdlcy9LaWRzWzQgMCBSXS9Db3VudCAxPj4KZW5kb2JqCgo2IDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyA1IDAgUj4+CmVuZG9iagoKNyAwIG9iago8PC9Qcm9kdWNlcihHUEwgR2hvc3RzY3JpcHQgMTAuMDQuMCkKL0NyZWF0aW9uRGF0ZShEOjIwMjQwMzE3MTMzMTE4Wi0wNCcwMCcpCi9Nb2REYXRlKEQ6MjAyNDAzMTcxMzMxMThaLTA0JzAwJyk+PgplbmRvYmoKCnhyZWYKMCA4CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDI1OCAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAxMTAgMDAwMDAgbiAKMDAwMDAwMDEzMSAwMDAwMCBuIAowMDAwMDAwMzQ2IDAwMDAwIG4gCjAwMDAwMDA0MDMgMDAwMDAgbiAKMDAwMDAwMDQ1MyAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgOC9Sb290IDYgMCBSL0luZm8gNyAwIFIvSUQgWzxBNkU0OUMzNjNENkU5RDQxOEQ1NDNEMEQ1MDFBMDlCRD48QTYlNDlDMzYzRDZFOUQ0MThENTQzRDBENTAxQTA5QkQ+XT4+CnN0YXJ0eHJlZgo1OTUKJSVFT0YK";


    const geminiRes = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              { text: "Analyze this resume." },
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: base64Pdf
                }
              }
            ]
          }
        ],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (e) {
    console.error("error:", e.response?.data || e.message);
  }
}
run();
