<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Benvenuto – {{ config('app.name') }}</title>
    <style>
      :root {
        color-scheme: light dark;
      }

      body {
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, "Apple Color Emoji", "Segoe UI Emoji";
        line-height: 1.6;
        margin: 0;
      }

      .container {
        max-width: 860px;
        margin: 0 auto;
        padding: 2rem 1rem 4rem;
      }

      h1 {
        font-size: 1.75rem;
        margin: 0 0 .75rem;
      }

      p {
        margin: 0 0 1rem;
      }

      .links {
        margin-top: 1.5rem;
      }

      a {
        color: #2563eb;
      }

      .card {
        border: 1px solid rgba(0, 0, 0, .1);
        border-radius: 10px;
        padding: 1rem;
      }
    </style>
</head>
<body>
<div class="container">
    <h1>Benvenuto in {{ config('app.name') }}</h1>

    <div class="card links">
        <p>Consulta le nostre pagine legali:</p>
        <ul>
            <li><a href="{{ route('terms') }}">Termini di Servizio</a></li>
            <li><a href="{{ route('privacy') }}">Informativa sulla Privacy</a></li>
        </ul>
    </div>
</div>

</body>
</html>
