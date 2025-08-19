<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Termini di Servizio – {{ config('app.name') }}</title>
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
        opacity: .8;
      }

      .card {
        border: 1px solid rgba(0, 0, 0, .1);
        border-radius: 10px;
        padding: 1rem;
      }

      a {
        color: #2563eb;
      }
    </style>
</head>
<body>
<div class="container">
    <h1>Termini di Servizio</h1>
    <p class="muted">Valido per l'app {{ config('app.name') }}.</p>

    <h2>1. Descrizione del servizio</h2>
    <p>{{ config('app.name') }} ti aiuta a gestire le <strong>scadenze dei prodotti</strong> (alimenti e altri
        articoli), con
        promemoria via <strong>notifiche push</strong> e/o <strong>email</strong>. Puoi aggiungere prodotti manualmente,
        cercarli nel catalogo,
        e in alcuni casi collegarli tramite <strong>codice a barre</strong>.</p>

    <h2>2. Account e accesso</h2>
    <ul>
        <li>L'accesso può avvenire tramite provider esterni (es. Google). Garantisci l'accuratezza dei dati del tuo
            profilo.
        </li>
        <li>Se noti accessi sospetti, contattaci subito: <a href="mailto:info@carloeusebideveloper.com">info@carloeusebideveloper.com</a>.
        </li>
    </ul>

    <h2>3. Uso consentito</h2>
    <ul>
        <li>Usa l'app in modo lecito, a fini personali e non commerciali, senza violare diritti di terzi.</li>
        <li>È vietato tentare accessi non autorizzati, interferire con il servizio o abusarne (ad es. scraping
            massivo).
        </li>
    </ul>

    <h2>4. Contenuti dell'utente</h2>
    <ul>
        <li>I dati che inserisci (es. prodotti, note, scadenze) restano di tua proprietà; ci concedi una licenza
            limitata a
            utilizzarli per erogare il servizio.
        </li>
        <li>Se segnali contenuti illeciti, ci riserviamo di rimuoverli e/o di sospendere l'account, secondo legge.</li>
    </ul>

    <h2>5. Notifiche</h2>
    <ul>
        <li>Puoi scegliere se ricevere notifiche push e/o email dalle impostazioni del profilo.</li>
        <li>La consegna delle notifiche può dipendere da fattori esterni (connettività, impostazioni del dispositivo,
            provider).
        </li>
    </ul>

    <h2>6. Disponibilità e modifiche</h2>
    <ul>
        <li>Il servizio è fornito "così com'è". Potremmo aggiornare, sospendere o interrompere funzionalità senza
            preavviso,
            ove ragionevole.
        </li>
    </ul>

    <h2>7. Limitazione di responsabilità</h2>
    <p>Nella misura massima consentita dalla legge, non saremo responsabili per danni indiretti, incidentali, o
        consequenziali
        derivanti dall'uso o dall'impossibilità di usare {{ config('app.name') }}. Rimani sempre responsabile per
        verificare
        etichette e scadenze effettive sui prodotti.</p>

    <h2>8. Chiusura dell'account</h2>
    <ul>
        <li>Puoi richiedere l'eliminazione del tuo account dall'app (Profilo → "Elimina account") o seguendo le
            istruzioni su
            <a href="{{ url('/elimina-account') }}">{{ url('/elimina-account') }}</a>.
        </li>
        <li>Potremmo sospendere o chiudere account che violino questi termini o la legge.</li>
    </ul>

    <h2>9. Legge applicabile</h2>
    <p>Questi termini sono regolati dalla legge italiana, salvo diversa disposizione inderogabile della legge del tuo
        paese.</p>

    <h2>10. Contatti</h2>
    <p>Per domande sui termini: <a href="mailto:info@carloeusebideveloper.com">info@carloeusebideveloper.com</a>.
    </p>

    <p class="muted">Ultimo aggiornamento: 19/08/2025</p>
</div>
</body>
</html>