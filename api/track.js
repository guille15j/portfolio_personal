// Usamos module.exports, el estándar 100% compatible con Vercel Node.js
module.exports = async function (req, res) {
  try {
    console.log("Iniciando envio de datos métricas");

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "0.0.0.0";

    // Aislamos la geolocalización para que no rompa el código si hay Rate Limit
    let comunidad = "Desconocida";
    try {
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      if (geoResponse.ok) {
        const geo = await geoResponse.json();
        comunidad = geo.region || "Desconocida";
      }
    } catch (geoErr) {
      console.warn("Fallo temporal de geolocalización:", geoErr);
    }

    const { anonId, hora } = req.body || {};

    const payload = {
      anonId: anonId || "Sin ID",
      hora: hora || new Date().toISOString(),
      comunidad,
      userAgent: req.headers["user-agent"] || ""
    };

    // Usamos process.env (Sintaxis nativa de Node.js)
    // Asegúrate de que esta variable exista en Vercel > Settings > Environment Variables
    const scriptUrl = process.env.URL_APP; 
    
    if (!scriptUrl) {
      throw new Error("Falta la variable de entorno de Google Sheets en Vercel");
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    console.log("Respuesta de Google Sheets:", response.status);
    
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error crítico en track:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
};