export interface SignInData {
    email: string
    password: string
}

export interface SignUpData {
    email: string
    password: string
    card: string
}

export interface signUpType {
    email?: string,
    password?: string,
    repass?: string,
}

export interface signInType {
    email?: string,
    password?: string
}

export enum RoleAvailable {
    User = 'user',
    Admin = 'admin',
}

// export enum TimeframeAvailable  {
//     M1 = 0,
//     H1 = 1,
//     D1 = 2,
// }

export enum UserStatus {
    Active = 0,
    Suspend = 1,
    Inactive = 2,
    Unverify = 3,
}

export enum TradeProvider {
    MetaTrader = 0,
    Binance = 1,
    // Inactive = 2,
    // Unverify = 3,
}

export enum Modeltype {
    USDJPY = 0,
    USDCAD = 1,
    EURUSD = 2,
}

export enum PaymentStatus {
    Active = 0,
    Inactive = 1,
    Delay = 2,
}

export enum UsageStatus {
    Active = 0,
    Inactive = 1,
}

export enum LogStatus {
    Gethering = 0,
    Finalize = 1,
}

interface TradeHistoryData {
    Ticket: string;
    Symbol: string;
    Type: string;
    Lot: number;
    Price: number;
    Profit: number;
    CloseTime: Date;
}