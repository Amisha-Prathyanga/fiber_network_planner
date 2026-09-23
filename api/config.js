// Serves the ArcGIS API key from the ARCGIS_API_KEY environment variable
// (set in Vercel → Project → Settings → Environment Variables) so it is
// not committed to the repository.
module.exports = (req, res) => {
  const apiKey = process.env.ARCGIS_API_KEY || "";
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.send(
    "var esriConfig = { apiKey: " + JSON.stringify(apiKey) + " };" +
    (apiKey ? "" : "\nconsole.error('ARCGIS_API_KEY is not set on the server.');")
  );
};
