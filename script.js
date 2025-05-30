function searchCountry() {
  const countryName = document.getElementById("countryInput").value.trim();

  if (!countryName) {
    alert("Tolong masukkan nama negara dulu ya!");
    return;
  }

  const endpointUrl = 'https://query.wikidata.org/sparql';
  const sparqlQuery = `
    SELECT ?countryLabel ?capitalLabel ?currencyLabel ?flag ?population WHERE {
      ?country wdt:P31 wd:Q6256;
               rdfs:label "${countryName}"@en;
               wdt:P36 ?capital;
               wdt:P38 ?currency;
               wdt:P41 ?flag;
               wdt:P1082 ?population.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    } LIMIT 1
  `;

  const fullUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery);
  const headers = { 'Accept': 'application/sparql-results+json' };

  fetch(fullUrl, { headers })
    .then(response => response.json())
    .then(data => {
      const results = data.results.bindings;
      const resultDiv = document.getElementById("result");

      if (results.length > 0) {
        const res = results[0];
        resultDiv.innerHTML = `
          <div class="country-card">
            <img src="${res.flag.value}" alt="Flag of ${res.countryLabel.value}">
            <h2>🌍 ${res.countryLabel.value}</h2>
            <p>🏙️ <strong>Ibukota:</strong> ${res.capitalLabel.value}</p>
            <p>💰 <strong>Mata Uang:</strong> ${res.currencyLabel.value}</p>
            <p>👥 <strong>Populasi:</strong> ${parseInt(res.population.value).toLocaleString()} jiwa</p>
            <p>🔗 <a href="https://en.wikipedia.org/wiki/${res.countryLabel.value}" target="_blank">Baca di Wikipedia</a></p>
          </div>
        `;
      } else {
        resultDiv.innerHTML = "<p style='color: red;'>Negara tidak ditemukan 😥</p>";
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("result").innerHTML = "Terjadi kesalahan saat mengambil data.";
    });
}
