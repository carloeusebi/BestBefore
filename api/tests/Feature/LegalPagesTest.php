<?php

declare(strict_types=1);

it('mostra i termini di servizio', function (): void {
    $response = $this->get('/termini');

    $response->assertSuccessful();
    $response->assertSeeText('Termini di Servizio');
    $response->assertSeeText('Descrizione del servizio');
});

it('mostra la privacy policy', function (): void {
    $response = $this->get('/privacy');

    $response->assertSuccessful();
    $response->assertSeeText('Informativa sulla Privacy');
    $response->assertSeeText('Dati che raccogliamo');
});
