"use server";

import { enviarCorreo } from "@/lib/email/resend";
import { esquemaPatrocinio } from "@/lib/validaciones/patrocinio";
import { SITIO } from "@/lib/sitio";

export type ResultadoPatrocinio =
  | { ok: true }
  | { ok: false; mensaje: string; errores?: Record<string, string> };

function esc(valor: string): string {
  return valor.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Propuesta de patrocinio.
 *
 * No se guarda en base de datos: el brief solo pide capturar el interés, y son
 * pocos mensajes al año. Se envía por correo a la dirección de la escuela con
 * `replyTo` apuntando a la empresa, para que responder sea un clic.
 */
export async function enviarPropuestaPatrocinio(form: FormData): Promise<ResultadoPatrocinio> {
  const analisis = esquemaPatrocinio.safeParse({
    empresa: String(form.get("empresa") ?? "").trim(),
    contacto: String(form.get("contacto") ?? "").trim(),
    correo: String(form.get("correo") ?? "").trim(),
    nivel: String(form.get("nivel") ?? "").trim(),
    mensaje: String(form.get("mensaje") ?? "").trim(),
  });

  if (!analisis.success) {
    const errores: Record<string, string> = {};
    for (const problema of analisis.error.issues) {
      const campo = String(problema.path[0] ?? "");
      if (campo && !errores[campo]) errores[campo] = problema.message;
    }
    return { ok: false, mensaje: "Revisa los datos del formulario.", errores };
  }

  const d = analisis.data;
  const destino = process.env.CORREO_ADMIN;

  if (!destino) {
    console.error("[patrocinio] CORREO_ADMIN no está configurado; la propuesta no llegó a nadie.");
    return {
      ok: false,
      mensaje: "No pudimos enviar la propuesta. Escríbenos por WhatsApp y la atendemos de una vez.",
    };
  }

  const resultado = await enviarCorreo({
    para: destino,
    responderA: d.correo,
    asunto: `Propuesta de patrocinio · ${d.empresa} (${d.nivel})`,
    texto: [
      `Empresa: ${d.empresa}`,
      `Contacto: ${d.contacto}`,
      `Correo: ${d.correo}`,
      `Nivel de interés: ${d.nivel}`,
      ``,
      d.mensaje,
      ``,
      `Enviado desde ${SITIO.url}/patrocinadores`,
    ].join("\n"),
    html: `
      <h1 style="font-family:sans-serif;font-size:19px;color:#0A1F3C;margin:0 0 14px">Propuesta de patrocinio</h1>
      <p style="font-family:sans-serif;font-size:15px;color:#3F4856;margin:0 0 6px"><strong>Empresa:</strong> ${esc(d.empresa)}</p>
      <p style="font-family:sans-serif;font-size:15px;color:#3F4856;margin:0 0 6px"><strong>Contacto:</strong> ${esc(d.contacto)}</p>
      <p style="font-family:sans-serif;font-size:15px;color:#3F4856;margin:0 0 6px"><strong>Correo:</strong> <a href="mailto:${esc(d.correo)}">${esc(d.correo)}</a></p>
      <p style="font-family:sans-serif;font-size:15px;color:#3F4856;margin:0 0 16px"><strong>Nivel:</strong> ${esc(d.nivel)}</p>
      <p style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#3F4856;white-space:pre-wrap;border-left:3px solid #C8102E;padding-left:14px">${esc(d.mensaje)}</p>`,
  });

  if (!resultado.ok) {
    return {
      ok: false,
      mensaje: "No pudimos enviar la propuesta. Intenta de nuevo o escríbenos por WhatsApp.",
    };
  }

  return { ok: true };
}
