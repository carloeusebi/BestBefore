<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Richiesta di Eliminazione Account – {{ config('app.name') }}</title>
    <style>
      :root {
        color-scheme: light dark;
      }

      body {
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, "Apple Color Emoji", "Segoe UI Emoji";
        line-height: 1.6;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 860px;
        margin: 0 auto;
        padding: 2rem 1rem 4rem;
      }

      h1, h2, h3 {
        line-height: 1.25;
      }

      h1 {
        font-size: 1.75rem;
        margin-bottom: 0.75rem;
      }

      h2 {
        font-size: 1.25rem;
        margin-top: 2rem;
        margin-bottom: 0.5rem;
      }

      p, li {
        font-size: 1rem;
      }

      .muted {
        opacity: 0.8;
      }

      .card {
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        padding: 1rem;
      }

      .steps ol {
        padding-left: 1.25rem;
      }

      a {
        color: #2563eb;
      }

      .kbd {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 0.95em;
      }
    </style>
</head>
<body>
<div class="container">
    <h1>Richiesta di eliminazione dell'account e dei dati</h1>
    <p class="muted">Per l'app {{ config('app.name') }} (come indicato nella nostra scheda sullo store)</p>

    <p>
        Puoi richiedere in qualsiasi momento l'eliminazione del tuo account e dei dati personali associati utilizzando
        le opzioni qui sotto.
        Confermeremo la tua richiesta ed elimineremo i dati idonei senza indebiti ritardi.
    </p>

    <h2>Come richiedere l'eliminazione</h2>
    <div class="card steps">
        <ol>
            <li>
                Nell'app: apri l'app, vai su <span class="kbd">Profilo</span> e premi il pulsante
                <strong>«Elimina account»</strong>. Segui le istruzioni a schermo.
            </li>
            <li>
                Oppure via email: invia un'email al nostro supporto a
                <a href="mailto:info@.carloeusebideveloper.com?subject=Elimina%20il%20mio%20account%20{{ urlencode(config('app.name')) }}">info@.carloeusebideveloper.com</a>
                dall'indirizzo email associato al tuo account.
            </li>
            <li>
                Includi: "Elimina il mio account {{ config('app.name') }}" nell'oggetto e l'email del tuo account nel
                messaggio. Se hai creato l'account con un accesso social, indica il provider (es. Google, Apple).
            </li>
        </ol>
    </div>

    <h2>Cosa verrà eliminato</h2>
    <ul>
        <li>Informazioni del profilo account (nome, email, avatar, preferenze).</li>
        <li>Credenziali di autenticazione e token di accesso.</li>
        <li>Token del dispositivo e delle notifiche push.</li>
        <li>Contenuti generati dall'utente associati esclusivamente al tuo account.</li>
        <li>Personalizzazioni e dati di utilizzo dell'app collegati alla tua identità.</li>
    </ul>

    <h2>Cosa potrebbe essere conservato</h2>
    <ul>
        <li>Informazioni che dobbiamo conservare per obblighi legali, normativi, fiscali, di prevenzione frodi o di
            sicurezza.
        </li>
        <li>Registri transazionali e log di audit quando la legge ne richiede la conservazione.</li>
        <li>Backup di server e applicazioni che possono contenere i tuoi dati fino a 30 giorni, dopodiché vengono
            eliminati a rotazione.
        </li>
        <li>Dati aggregati o anonimizzati che non ti identificano.</li>
    </ul>

    <h2>Tempi di elaborazione</h2>
    <p>Miriamo a completare l'eliminazione dell'account entro 30 giorni dalla verifica della tua richiesta. I backup
        vengono sovrascritti nel loro ciclo regolare (fino a ulteriori 30 giorni).</p>

    <h2>Ripristino dopo l'eliminazione</h2>
    <p>Una volta eliminato, l'account non può essere recuperato. Per usare di nuovo {{ config('app.name') }} dovrai
        creare un nuovo account.</p>

    <h2>Domande</h2>
    <p>Contatta il supporto a <a href="mailto:info@.carloeusebideveloper.com">info@.carloeusebideveloper.com</a>.
    </p>

    <p class="muted">Ultimo aggiornamento: {{ \Carbon\Carbon::now()->toDateString() }}</p>
</div>
</body>
</html>
