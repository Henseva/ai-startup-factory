function buildLandingPage(startup, assets) {
  const monetization = assets?.monetization || "Plano Free + Plano Pro mensal";
  const features = (startup?.features || []).slice(0, 6);

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${startup.name}</title>
<style>
body{margin:0;font-family:Arial;background:#0b0b10;color:#fff}
header{padding:60px 20px;text-align:center;max-width:1000px;margin:0 auto}
h1{font-size:42px;margin-bottom:20px}
p{font-size:20px;opacity:.85;margin-bottom:30px}
button{background:#ffd54a;color:#000;border:none;padding:15px 25px;border-radius:10px;font-weight:bold;cursor:pointer}
section{padding:40px 20px;max-width:1000px;margin:0 auto}
.card{background:#151522;padding:20px;border-radius:15px;margin-bottom:15px}
footer{padding:30px 20px;text-align:center;opacity:.7}
</style>
</head>
<body>

<header>
<h1>${assets.landing_headline}</h1>
<p>${assets.value_proposition}</p>
<button>Começar Agora</button>
</header>

<section>
<h2>Funcionalidades</h2>
${features.map(f => `<div class="card"><strong>${f}</strong></div>`).join('')}
</section>

<section>
<h2>Modelo de Negócio</h2>
<div class="card">${monetization}</div>
</section>

<footer>
© ${new Date().getFullYear()} ${startup.name}
</footer>

</body>
</html>`;
}

module.exports = { buildLandingPage };