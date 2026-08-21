export default async function handler(req, res) {
  try {
    console.log("Iniciando envio de datos métricas");

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "0.0.0.0";

    let comunidad = "Desconocida";

    try {
        const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        if (geoResponse.ok) {
            const geo = await geoResponse.json();
            comunidad = geo.region || "Desconocida";
        }
    } catch (geoErr) {
        console.warn("Fallo de geolocalización (posible rate limit):", geoErr);
    }

    const { anonId, hora } = req.body;

    const payload = {
      anonId,
      hora,
      comunidad,
      userAgent: req.headers["user-agent"] || ""
    };

    const response = await fetch(process.env.URL_APP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    console.log("Respuesta: ", response.status);
    
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error en track:", error);
    res.status(500).json({ ok: false, error: error.toString() });
  }
}
