<?php

declare(strict_types=1);

use Rector\CodeQuality\Rector\If_\ExplicitBoolCompareRector;
use Rector\CodingStyle\Rector\Catch_\CatchExceptionNameMatchingTypeRector;
use Rector\CodingStyle\Rector\Encapsed\EncapsedStringsToSprintfRector;
use Rector\Config\RectorConfig;
use Rector\DeadCode\Rector\Cast\RecastingRemovalRector;
use Rector\EarlyReturn\Rector\If_\ChangeOrIfContinueToMultiContinueRector;
use Rector\Php74\Rector\Closure\ClosureToArrowFunctionRector;
use Rector\Php83\Rector\ClassMethod\AddOverrideAttributeToOverriddenMethodsRector;
use Rector\Privatization\Rector\ClassMethod\PrivatizeFinalClassMethodRector;
use RectorLaravel\Rector\Class_\AddExtendsAnnotationToModelFactoriesRector;
use RectorLaravel\Rector\ClassMethod\AddGenericReturnTypeToRelationsRector;
use RectorLaravel\Rector\PropertyFetch\ReplaceFakerInstanceWithHelperRector;
use RectorLaravel\Rector\StaticCall\EloquentMagicMethodToQueryBuilderRector;
use RectorLaravel\Set\LaravelSetList;

return RectorConfig::configure()
    ->withPaths([
        __DIR__.'/app',
        __DIR__.'/bootstrap/app.php',
        __DIR__.'/config',
        __DIR__.'/database',
        __DIR__.'/public',
        __DIR__.'/tests',
    ])
    ->withSkip([
        AddOverrideAttributeToOverriddenMethodsRector::class,
        EncapsedStringsToSprintfRector::class,
        EloquentMagicMethodToQueryBuilderRector::class,
        CatchExceptionNameMatchingTypeRector::class,
        ExplicitBoolCompareRector::class,
        ChangeOrIfContinueToMultiContinueRector::class,
        PrivatizeFinalClassMethodRector::class => [
            __DIR__.'/app/Models/*.php',
        ],
        ClosureToArrowFunctionRector::class => [
            __DIR__.'/app/Filament/UserResource.php',
        ],
        RecastingRemovalRector::class => [
            __DIR__.'/tests/Unit/Queries/SuggestedTrainersQueryTest.php',
        ],
    ])
    ->withPreparedSets(
        deadCode: true,
        codeQuality: true,
        codingStyle: true,
        typeDeclarations: true,
        privatization: true,
        earlyReturn: true,
        strictBooleans: true,
    )
    ->withPhpSets(php84: true)
    ->withSets([
        LaravelSetList::LARAVEL_CODE_QUALITY,
        LaravelSetList::LARAVEL_ELOQUENT_MAGIC_METHOD_TO_QUERY_BUILDER,
        LaravelSetList::LARAVEL_IF_HELPERS,
        LaravelSetList::LARAVEL_CONTAINER_STRING_TO_FULLY_QUALIFIED_NAME,
        LaravelSetList::LARAVEL_COLLECTION,
        LaravelSetList::LARAVEL_120,
    ])
    ->withRules([
        AddGenericReturnTypeToRelationsRector::class,
        AddExtendsAnnotationToModelFactoriesRector::class,
        ReplaceFakerInstanceWithHelperRector::class,
    ]);
