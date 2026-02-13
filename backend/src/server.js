require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
