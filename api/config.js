// Serves the ArcGIS API key from the ARCGIS_API_KEY environment variable
// (set in Vercel → Project → Settings → Environment Variables) so it is
// not committed to the repository.
//
// Set APP_ON_HOLD=true (same place) to put the application on hold: the
// key is withheld and visitors are sent to on-hold.html. Remove it or set
// it to false, then redeploy, to turn the application back on.
module.exports = (req, res) => {
  const apiKey = process.env.ARCGIS_API_KEY || "";
  const onHold = /^(1|true|yes|on)$/i.test((process.env.APP_ON_HOLD || "").trim());
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (onHold) {
    res.send(
      "var esriConfig = { apiKey: \"\" };\n" +
      "document.documentElement.style.display = 'none';\n" +
      "window.location.replace('/on-hold.html');"
    );
    return;
  }
  res.send(
    "var esriConfig = { apiKey: " + JSON.stringify(apiKey) + " };" +
    (apiKey ? "" : "\nconsole.error('ARCGIS_API_KEY is not set on the server.');")
  );
};
