-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "user_email" TEXT,
    "user_password" TEXT,
    "user_role" TEXT NOT NULL DEFAULT 'user',
    "user_card" TEXT,
    "user_status" INTEGER DEFAULT 0,
    "provider" TEXT NOT NULL DEFAULT 'credentials',

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Account" (
    "acc_id" SERIAL NOT NULL,
    "acc_name" TEXT NOT NULL,
    "acc_client" TEXT NOT NULL,
    "acc_user_id" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("acc_id")
);

-- CreateTable
CREATE TABLE "Model" (
    "model_id" SERIAL NOT NULL,
    "model_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "model_path" TEXT NOT NULL,
    "model_version" INTEGER NOT NULL,
    "model_currency" TEXT NOT NULL,
    "model_timeframe" TEXT NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("model_id")
);

-- CreateTable
CREATE TABLE "Billing" (
    "bill_id" SERIAL NOT NULL,
    "bill_create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bill_expire_date" TIMESTAMP(3) NOT NULL,
    "bill_cost" DOUBLE PRECISION NOT NULL,
    "bill_status" INTEGER NOT NULL DEFAULT 0,
    "bill_log_id" INTEGER NOT NULL,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("bill_id")
);

-- CreateTable
CREATE TABLE "Usage" (
    "usage_id" SERIAL NOT NULL,
    "usage_token" TEXT NOT NULL,
    "usage_currency" TEXT NOT NULL,
    "usage_timeframe" TEXT NOT NULL,
    "usage_collection_date" TIMESTAMP(3) NOT NULL,
    "usage_init_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "usage_status" INTEGER NOT NULL DEFAULT 0,
    "usage_account_id" INTEGER NOT NULL,
    "usage_model_id" INTEGER NOT NULL,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("usage_id")
);

-- CreateTable
CREATE TABLE "TradeLog" (
    "log_id" SERIAL NOT NULL,
    "log_trades" JSONB[],
    "log_start_date" TIMESTAMP(3) NOT NULL,
    "log_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "log_profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "log_status" INTEGER NOT NULL DEFAULT 0,
    "log_usage_id" INTEGER NOT NULL,

    CONSTRAINT "TradeLog_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "Admin_Data" (
    "ad_id" SERIAL NOT NULL,
    "ad_fee" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Admin_Data_pkey" PRIMARY KEY ("ad_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "Billing_bill_log_id_key" ON "Billing"("bill_log_id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_acc_user_id_fkey" FOREIGN KEY ("acc_user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_bill_log_id_fkey" FOREIGN KEY ("bill_log_id") REFERENCES "TradeLog"("log_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_usage_account_id_fkey" FOREIGN KEY ("usage_account_id") REFERENCES "Account"("acc_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_usage_model_id_fkey" FOREIGN KEY ("usage_model_id") REFERENCES "Model"("model_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeLog" ADD CONSTRAINT "TradeLog_log_usage_id_fkey" FOREIGN KEY ("log_usage_id") REFERENCES "Usage"("usage_id") ON DELETE CASCADE ON UPDATE CASCADE;
