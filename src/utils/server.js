const { CronJob } = require('cron');

const createBill = new CronJob('*/2 * * * *', async function () {
    await fetch('http://localhost:3000/api/server_bill', {
        method: "GET"
    });

    await fetch('http://localhost:3000/api/server_user', {
        method: "GET"
    });
    console.log("Scheduler Online")
});
createBill.start();
