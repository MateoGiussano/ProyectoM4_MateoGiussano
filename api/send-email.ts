/**
 * Endpoint: POST /api/send-email
 *
 * Recibe { to, summary } y envía un email con AWS SES.
 * Corre SOLO en el servidor (función de Vercel): las credenciales de AWS
 * nunca llegan al navegador.
 *
 * Variables de entorno necesarias (ninguna lleva prefijo VITE_):
 *   AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SES_FROM_EMAIL
 *
 * Respuestas:
 *   200 -> { ok: true, messageId }
 *   400 -> falta "to" o "summary"
 *   405 -> el método no es POST
 *   500 -> error de configuración o fallo al enviar con SES
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";


const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { to, summary } = req.body ?? {};
  if (!to || !summary) {
    return res.status(400).json({ error: "Missing required fields: to, summary" });
  }

  const from = process.env.SES_FROM_EMAIL;
  if (!from) {
    return res.status(500).json({ error: "Server misconfigured: SES_FROM_EMAIL missing" });
  }

  try {
    const command = new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: "Tu resumen de tareas" },
        Body: { Text: { Data: summary } },
      },
    });

    const result = await ses.send(command);

    return res.status(200).json({ ok: true, messageId: result.MessageId });
  } catch (err: any) {
    console.error("SES send error:", err?.name, err?.message);

    return res.status(500).json({
      ok: false,
      error: err?.name ?? "UnknownError",
      message: err?.message ?? "Failed to send email",
    });
  }
}