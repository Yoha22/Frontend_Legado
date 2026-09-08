import { ImageResponse } from "next/og";
import { SITIO } from "@/lib/sitio";

export const alt = `${SITIO.nombre} · ${SITIO.ciudad}, ${SITIO.departamento}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Imagen para compartir en WhatsApp, Facebook e Instagram — que es por donde
 * van a llegar la mayoría de las familias.
 *
 * Se genera con las fuentes del sistema en vez de descargar Oswald: bajar la
 * tipografía en cada render añade latencia y un punto de fallo por una imagen
 * que casi nadie mira de cerca.
 */
export default function ImagenOpenGraph() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A1F3C",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 14,
              background: "#C8102E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            LD
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#fff", fontSize: 30, fontWeight: 600, letterSpacing: 3 }}>LEGADO</span>
            <span style={{ color: "#8FA3BE", fontSize: 17, letterSpacing: 6 }}>DIOVER ÁVILA</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#fff", fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            Formando peloteros,
          </span>
          <span style={{ color: "#C8102E", fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            formando personas
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 60, height: 5, background: "#C8102E" }} />
          <span style={{ color: "#C3D0E0", fontSize: 26 }}>
            Béisbol infantil y juvenil · {SITIO.ciudad}, {SITIO.departamento} · 5 a 17 años
          </span>
        </div>
      </div>
    ),
    size,
  );
}
