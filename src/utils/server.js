import { CronJob } from 'cron';

const createBill = new CronJob('*/1 * * * *', async function () {
    await fetch('/api/server_bill', {
        method: "GET"
    });

    await fetch('/api/server_user', {
        method: "GET"
    });
});
createBill.start();
