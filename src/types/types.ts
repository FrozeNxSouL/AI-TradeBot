import { Prisma } from "@prisma/client"

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

export enum UserStatus {
    Active = 0,
    Suspend = 1,
    Inactive = 2,
    // Unverify = 3,
}

export enum TradeProvider {
    MetaTrader = "MetaTrader",
    Binance = "Binance",
}

export enum Modeltype {
    USDJPY = "USDJPY",
    USDCAD = "USDCAD",
    EURUSD = "EURUSD",
}

export enum Timeframetype {
    M1 = "M1",
    H1 = "H1",
    D1 = "D1",
}

export enum PaymentStatus {
    Done = 0,
    Arrive = 1,
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

export interface TradeHistoryData {
    ticket: number;
    symbol: string;
    type: "Buy" | "Sell";
    lots: number;
    price: number;
    profit: number;
    closeTime: string;
}

export interface TiingoData {
    time: string;
    price: number;
    date: string;
}

export type UsageWithRelations = Prisma.UsageGetPayload<{
    include: {
        usage_model: true;
        usage_log: true;
    };
}> & {
    lastBalance: number;
    lastProfit: number;
    alltimeProfit: number;
};


export type BillsPayload = Prisma.BillingGetPayload<{
    select: {
        bill_id: true,
        bill_create_date: true,
        bill_expire_date: true,
        bill_cost: true,
        bill_status: true,
        bill_log: {
            select: {
                log_profit: true,
                log_balance: true,
                log_start_date: true,
                log_trades: true,
                log_usage: {
                    select: {
                        usage_currency: true,
                        usage_timeframe: true,
                        usage_account: {
                            select: {
                                acc_client: true,
                                acc_name: true,
                            }
                        }
                    }
                }
            }
        }
    }
}>


export type UsageForAdvisor = Prisma.UsageGetPayload<{
    include: {
        usage_model: true,
        usage_log: {
            where: { log_status: LogStatus.Gethering },
            select: {
                log_start_date: true,
            },
        },
    }
}>