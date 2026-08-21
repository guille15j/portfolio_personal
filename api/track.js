export default async function handler(req, res) {
  try {
    // IP real del visitante
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "0.0.0.0";

    const geo = await fetch(`https://ipapi.co/${ip}/json/`).then(r => r.json());
    const comunidad = geo.region || "Desconocida";

    const { anonId, hora } = req.body;

    // Payload para Google Sheets
    const payload = {
      anonId,
      hora,
      comunidad,
      userAgent: req.headers["user-agent"] || ""
    };

    await fetch(import.meta.env.VITE_URL_APP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error en track:", error);
    res.status(500).json({ ok: false, error: error.toString() });
  }
}
