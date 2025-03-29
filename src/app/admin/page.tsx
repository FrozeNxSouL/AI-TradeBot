

import AccountProfileCard from "@/components/account/accountdata";
import UploadPage from "@/components/admin/model_input";
import TableComponent from "@/components/admin/tableComponent";
import TestingComponent from "@/components/testingComponent";
import { prisma } from "@/lib/prisma_client";
import { serverSession } from "@/lib/serverSession";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Admin() {

    let userData = await prisma.user.findMany()
    let modaldata = await prisma.model.findMany()
    let usagedata = await prisma.usage.findMany()
    let accountdata = await prisma.account.findMany()
    let billingdata = await prisma.billing.findMany()
    let tradelogdata = await prisma.tradeLog.findMany()
    let admindata = await prisma.admin_Data.findMany()

    return (
        <div className="flex flex-col text-black px-10 py-12 items-center w-full space-y-5 gap-3">
            <h2 className="text-xl font-bold">Users Table</h2>
            <TableComponent data={userData} columns={["user_id", "user_email", "user_role", "provider"]} />

            <h2 className="text-xl font-bold mt-5">Accounts Table</h2>
            <TableComponent data={accountdata} columns={["acc_id", "acc_name", "acc_client", "acc_user_id"]} />

            <h2 className="text-xl font-bold mt-5">Models Table</h2>
            <TableComponent data={modaldata} columns={["model_id", "model_date", "model_path", "model_currency", "model_timeframe", "model_version"]} />

            <h2 className="text-xl font-bold mt-5">Usage Table</h2>
            <TableComponent data={usagedata} columns={["usage_id", "usage_currency", "usage_timeframe", "usage_collection_date", "usage_init_balance", "usage_status"]} />

            <h2 className="text-xl font-bold mt-5">Bill Table</h2>
            <TableComponent data={billingdata} columns={["bill_id", "bill_create_date", "bill_expire_date", "bill_cost", "bill_status"]} />

            <h2 className="text-xl font-bold mt-5">Log Table</h2>
            <TableComponent data={tradelogdata} columns={["log_id", "log_start_date", "log_balance", "log_profit", "log_status"]} />

            <h2 className="text-xl font-bold mt-5">Admin Table</h2>
            <TableComponent data={admindata} columns={["ad_id", "ad_fee"]} />

            <h1>Upload</h1>
            <div className="w-full">
                <UploadPage />
            </div>

            <TestingComponent />
        </div>
    )
}