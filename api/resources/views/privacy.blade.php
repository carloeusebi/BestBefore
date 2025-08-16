<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Informativa sulla Privacy – {{ config('app.name') }}</title>
  <style>
    :root { color-scheme: light dark; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, "Apple Color Emoji", "Segoe UI Emoji"; line-height: 1.6; margin: 0; padding: 0; }
    .container { max-width: 860px; margin: 0 auto; padding: 2rem 1rem 4rem; }
    h1, h2, h3 { line-height: 1.25; }
    h1 { font-size: 1.75rem; margin-bottom: 0.75rem; }
    h2 { font-size: 1.25rem; margin-top: 2rem; margin-bottom: 0.5rem; }
    p, li { font-size: 1rem; }
    .muted { opacity: .8; }
    a { color: #2563eb; }
    .kbd { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: .95em; }
  </style>
</head>
<body>
<div class="container">
  <h1>Informativa sulla Privacy</h1>
  <p class="muted">Questa informativa descrive come trattiamo i tuoi dati personali quando utilizzi {{ config('app.name') }}.</p>

  <h2>1. Titolare del trattamento</h2>
  <p>Titolare: lo sviluppatore di {{ config('app.name') }}. Contatti: <a href="mailto:{{ 'carloeusebi@gmail.com' }}">{{ 'carloeusebi@gmail.com' }}</a>.</p>

  <h2>2. Dati che raccogliamo</h2>
  <ul>
    <li><strong>Dati account</strong>: nome, email, avatar, ID del provider (es. Google) per l'accesso.</li>
    <li><strong>Impostazioni notifiche</strong>: preferenze su email e push (<span class="kbd">notify_by_email</span>, <span class="kbd">notify_by_push</span>).</li>
    <li><strong>Token push</strong>: identificatori del dispositivo per l'invio di notifiche (Expo Push Token).</li>
    <li><strong>Dati di utilizzo</strong>: prodotti, scadenze, note, categoria del prodotto, e altre preferenze salvate.</li>
    <li><strong>Log tecnici</strong>: informazioni minime su richieste al server per sicurezza e manutenzione.</li>
  </ul>

  <h2>3. Finalità del trattamento</h2>
  <ul>
    <li>Fornire e mantenere il servizio (gestione scadenze, ricerca prodotti, notifiche).</li>
    <li>Autenticarti e proteggere il tuo account.</li>
    <li>Comunicazioni operative (es. scadenze imminenti, sicurezza, modifiche ai servizi).</li>
    <li>Prevenzione abusi e adempimenti di legge.</li>
  </ul>

  <h2>4. Basi giuridiche</h2>
  <ul>
    <li><strong>Esecuzione del contratto</strong>: necessario per usare {{ config('app.name') }}.</li>
    <li><strong>Consenso</strong>: per notifiche push/email, ove richiesto; puoi revocarlo nelle impostazioni.</li>
    <li><strong>Obbligo legale</strong> e <strong>legittimo interesse</strong>: sicurezza, prevenzione frodi, gestione log.</li>
  </ul>

  <h2>5. Conservazione</h2>
  <ul>
    <li>Conserviamo i dati finché mantieni l'account o quanto necessario per fornire il servizio.</li>
    <li>Backup applicativi possono trattenere copie fino a 30 giorni, poi vengono sovrascritti.</li>
  </ul>

  <h2>6. Condivisione con terzi</h2>
  <ul>
    <li>Provider tecnici strettamente necessari (es. servizi di invio notifiche push, hosting).</li>
    <li>Non vendiamo i tuoi dati. Condividiamo solo quanto necessario per erogare il servizio o rispettare la legge.</li>
  </ul>

  <h2>7. Trasferimenti extra-UE</h2>
  <p>Alcuni fornitori possono trovarsi fuori dall'UE/SEE. In tal caso, adottiamo garanzie adeguate (es. clausole contrattuali tipo) ove richieste.</p>

  <h2>8. Sicurezza</h2>
  <p>Adottiamo misure organizzative e tecniche ragionevoli per proteggere i dati. Nessuna misura è però assoluta: conserva le tue credenziali con cura.</p>

  <h2>9. I tuoi diritti</h2>
  <ul>
    <li>Accesso, rettifica, cancellazione, limitazione, opposizione, portabilità dei dati (ove applicabile).</li>
    <li>Puoi eliminare l'account dall'app (Profilo → "Elimina account") o seguendo <a href="{{ url('/elimina-account') }}">questa procedura</a>.</li>
    <li>Puoi modificare le preferenze di notifica dal profilo.</li>
  </ul>

  <h2>10. Minori</h2>
  <p>Il servizio non è destinato a minori di 14 anni. Se credi che un minore ci abbia fornito dati, contattaci per la rimozione.</p>

  <h2>11. Modifiche a questa informativa</h2>
  <p>Potremmo aggiornare questa informativa. Pubblicheremo la versione aggiornata su questa pagina con l'indicazione della data.</p>

  <h2>12. Contatti</h2>
  <p>Per richieste sulla privacy: <a href="mailto:{{ 'carloeusebi@gmail.com' }}">{{ 'carloeusebi@gmail.com' }}</a>.</p>

  <p class="muted">Ultimo aggiornamento: {{ \Carbon\Carbon::now()->toDateString() }}</p>
</div>
</body>
</html>