// import cron from "node-cron";
// import createBillsForTradeLogs from "./billingTask"; // Import the function

// // Schedule the function to run daily at midnight
// cron.schedule("0 0 * * *", () => {
//     console.log("Running scheduled billing check...");
//     createBillsForTradeLogs();
// });

import { CronJob } from 'cron';
import { createBillsForTradeLogs } from './function';

const createBill = new CronJob('*/1 * * * *', async function () {
    await createBillsForTradeLogs()
});
createBill.start();
