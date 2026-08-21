export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    
    const scriptUrl = "https://script.google.com/macros/s/AKfycbwPAZF6H0dk5T1T4dry6sBendLibfPUXmHH4sOITwBY41OipnhfaBu-ZvmM5NmBA2cAGg/exec";

    if (!scriptUrl) {
      return res.status(500).json({ ok: false, error: "Variable no configurada" });
    }

    await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body)
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}