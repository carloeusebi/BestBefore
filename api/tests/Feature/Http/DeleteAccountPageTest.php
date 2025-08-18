<?php

declare(strict_types=1);

it('mostra la pagina di eliminazione account', function (): void {
    $response = $this->get('/elimina-account');

    $response->assertSuccessful();
    $response->assertSeeText('Richiesta di eliminazione');
    $response->assertSeeText('account e dei dati');
    $response->assertSeeText('Come richiedere');
    $response->assertSeeText('eliminazione');
    $response->assertSeeText('Cosa verrà eliminato');
    $response->assertSeeText('Cosa potrebbe essere conservato');
});
