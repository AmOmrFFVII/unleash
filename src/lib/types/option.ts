import EventEmitter from 'events';
import { LogLevel, LogProvider } from '../logger';
import { ILegacyApiTokenCreate } from './models/api-token';
import { IExperimentalOptions } from '../experimental';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export type EventHook = (eventName: string, data: object) => void;

export interface ISSLOption {
    rejectUnauthorized: boolean;
    ca?: string;
    key?: string;
    cert?: string;
}

export interface IDBOption {
    user: string;
    password: string;
    host: string;
    port: number;
    database: string;
    ssl?: ISSLOption | boolean;
    driver: 'postgres';
    version?: string;
    acquireConnectionTimeout?: number;
    pool?: {
        min?: number;
        max?: number;
        idleTimeoutMillis?: number;
        propagateCreateError?: boolean;
    };
    schema: string;
    disableMigration: boolean;
    applicationName?: string;
}

export interface ISessionOption {
    ttlHours: number;
    db: boolean;
    clearSiteDataOnLogout: boolean;
    cookieName: string;
}

export interface IVersionOption {
    url?: string;
    enable?: boolean;
}
export enum IAuthType {
    OPEN_SOURCE = 'open-source',
    DEMO = 'demo',
    ENTERPRISE = 'enterprise',
    HOSTED = 'hosted',
    CUSTOM = 'custom',
    NONE = 'none',
}

export interface IAuthOption {
    enableApiToken: boolean;
    type: IAuthType;
    customAuthHandler?: Function;
    createAdminUser: boolean;
    initApiTokens: ILegacyApiTokenCreate[];
}

export interface IImportOption {
    file: string;
    keepExisting: boolean;
    dropBeforeImport: boolean;
}

export interface IServerOption {
    port?: number;
    host?: string;
    pipe?: string;
    keepAliveTimeout: number;
    headersTimeout: number;
    baseUriPath: string;
    cdnPrefix?: string;
    unleashUrl: string;
    serverMetrics: boolean;
    enableRequestLogger: boolean;
    gracefulShutdownEnable: boolean;
    gracefulShutdownTimeout: number;
    secret: string;
}

export interface IUnleashOptions {
    databaseUrl?: string;
    databaseUrlFile?: string;
    db?: Partial<IDBOption>;
    session?: Partial<ISessionOption>;
    getLogger?: LogProvider;
    logLevel?: LogLevel;
    server?: Partial<IServerOption>;
    versionCheck?: Partial<IVersionOption>;
    authentication?: Partial<IAuthOption>;
    ui?: object;
    import?: Partial<IImportOption>;
    experimental?: IExperimentalOptions;
    email?: Partial<IEmailOption>;
    secureHeaders?: boolean;
    additionalCspAllowedDomains?: ICspDomainOptions;
    enableOAS?: boolean;
    preHook?: Function;
    preRouterHook?: Function;
    eventHook?: EventHook;
    enterpriseVersion?: string;
    disableLegacyFeaturesApi?: boolean;
    inlineSegmentConstraints?: boolean;
}

export interface IEmailOption {
    host?: string;
    secure: boolean;
    port: number;
    sender: string;
    smtpuser?: string;
    smtppass?: string;
    transportOptions?: SMTPTransport.Options;
}

export interface IListeningPipe {
    path: string;
}

export interface IListeningHost {
    host?: string;
    port: number;
}

export interface IUIConfig {
    slogan?: string;
    name?: string;
    flags?: { [key: string]: boolean };
    links?: [
        {
            value: string;
            icon?: string;
            href: string;
            title: string;
        },
    ];
}
export interface ICspDomainOptions {
    defaultSrc?: string[];
    fontSrc?: string[];
    styleSrc?: string[];
    scriptSrc?: string[];
    imgSrc?: string[];
}

export interface ICspDomainConfig {
    defaultSrc: string[];
    fontSrc: string[];
    styleSrc: string[];
    scriptSrc: string[];
    imgSrc: string[];
}

export interface IUnleashConfig {
    db: IDBOption;
    session: ISessionOption;
    getLogger: LogProvider;
    server: IServerOption;
    listen: IListeningHost | IListeningPipe;
    versionCheck: IVersionOption;
    authentication: IAuthOption;
    ui: IUIConfig;
    import: IImportOption;
    experimental?: IExperimentalOptions;
    email: IEmailOption;
    secureHeaders: boolean;
    additionalCspAllowedDomains: ICspDomainConfig;
    enableOAS: boolean;
    preHook?: Function;
    preRouterHook?: Function;
    eventHook?: EventHook;
    enterpriseVersion?: string;
    eventBus: EventEmitter;
    disableLegacyFeaturesApi?: boolean;
    environmentEnableOverrides?: string[];
    inlineSegmentConstraints: boolean;
    segmentValuesLimit: number;
    strategySegmentsLimit: number;
}
