import FeatureToggleService from '../../../lib/services/feature-toggle-service';
import { createTestConfig } from '../../config/test-config';
import dbInit from '../helpers/database-init';
import { DEFAULT_ENV } from '../../../lib/util/constants';
import { StrategySchema } from '../../../lib/openapi/spec/strategy-schema';

let stores;
let db;
let service: FeatureToggleService;

beforeAll(async () => {
    const config = createTestConfig();
    db = await dbInit(
        'feature_toggle_service_v2_service_serial',
        config.getLogger,
    );
    stores = db.stores;
    service = new FeatureToggleService(stores, config);
});

afterAll(async () => {
    await db.destroy();
});

test('Should create feature toggle strategy configuration', async () => {
    const projectId = 'default';
    const username = 'feature-toggle';
    const config: Omit<StrategySchema, 'id'> = {
        name: 'default',
        constraints: [],
        parameters: {},
    };

    await service.createFeatureToggle(
        'default',
        {
            name: 'Demo',
        },
        'test',
    );

    const createdConfig = await service.createStrategy(
        config,
        { projectId, featureName: 'Demo', environment: DEFAULT_ENV },
        username,
    );

    expect(createdConfig.name).toEqual('default');
    expect(createdConfig.id).toBeDefined();
});

test('Should be able to update existing strategy configuration', async () => {
    const projectId = 'default';
    const username = 'existing-strategy';
    const featureName = 'update-existing-strategy';
    const config: Omit<StrategySchema, 'id'> = {
        name: 'default',
        constraints: [],
        parameters: {},
    };

    await service.createFeatureToggle(
        projectId,
        {
            name: featureName,
        },
        'test',
    );

    const createdConfig = await service.createStrategy(
        config,
        { projectId, featureName, environment: DEFAULT_ENV },
        username,
    );
    expect(createdConfig.name).toEqual('default');
    const updatedConfig = await service.updateStrategy(
        createdConfig.id,
        { parameters: { b2b: 'true' } },
        { projectId, featureName, environment: DEFAULT_ENV },
        username,
    );
    expect(createdConfig.id).toEqual(updatedConfig.id);
    expect(updatedConfig.parameters).toEqual({ b2b: 'true' });
});

test('Should be able to get strategy by id', async () => {
    const featureName = 'get-strategy-by-id';
    const projectId = 'default';

    const userName = 'strategy';
    const config: Omit<StrategySchema, 'id'> = {
        name: 'default',
        constraints: [],
        parameters: {},
    };
    await service.createFeatureToggle(
        projectId,
        {
            name: featureName,
        },
        userName,
    );

    const createdConfig = await service.createStrategy(
        config,
        { projectId, featureName, environment: DEFAULT_ENV },
        userName,
    );
    const fetchedConfig = await service.getStrategy(createdConfig.id);
    expect(fetchedConfig).toEqual(createdConfig);
});

test('should ignore name in the body when updating feature toggle', async () => {
    const featureName = 'body-name-update';
    const projectId = 'default';

    const userName = 'strategy';
    const secondFeatureName = 'body-name-update2';

    await service.createFeatureToggle(
        projectId,
        {
            name: featureName,
            description: 'First toggle',
        },
        userName,
    );

    await service.createFeatureToggle(
        projectId,
        {
            name: secondFeatureName,
            description: 'Second toggle',
        },
        userName,
    );

    const update = {
        name: secondFeatureName,
        description: "I'm changed",
    };

    await service.updateFeatureToggle(projectId, update, userName, featureName);
    const featureOne = await service.getFeature(featureName);
    const featureTwo = await service.getFeature(secondFeatureName);

    expect(featureOne.description).toBe(`I'm changed`);
    expect(featureTwo.description).toBe('Second toggle');
});
