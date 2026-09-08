import "server-only";

import { Resend } from "resend";

/**
 * Envío de correo transaccional.
 *
 * `enviarCorreo` NUNCA lanza. Una caída de Resend, una clave vencida o un
 * dominio sin verificar no pueden hacer que se pierda una solicitud que ya
 * quedó guardada en la base de datos: se registra el fallo y la vida sigue.
 * Quien llama decide si le importa el resultado.
 */

type Mensaje = {
  para: string | string[];
  asunto: string;
  html: string;
  texto: string;
  responderA?: string;
};

export async function enviarCorreo(mensaje: Mensaje): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const remitente = process.env.CORREO_REMITENTE;

  if (!apiKey || !remitente) {
    const error = "Faltan RESEND_API_KEY o CORREO_REMITENTE; no se envió el correo.";
    console.warn(`[resend] ${error}`);
    return { ok: false, error };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: remitente,
      to: mensaje.para,
      subject: mensaje.asunto,
      html: mensaje.html,
      text: mensaje.texto,
      ...(mensaje.responderA ? { replyTo: mensaje.responderA } : {}),
    });

    if (error) {
      console.error(`[resend] No se pudo enviar "${mensaje.asunto}":`, error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : "Error desconocido";
    console.error(`[resend] Excepción enviando "${mensaje.asunto}":`, error);
    return { ok: false, error };
  }
}
