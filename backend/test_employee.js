import { getEmployeeDashboard, getEmployeeTasks, getEmployeeAnalytics } from './src/controllers/employee.controller.js';
import prisma from './src/DB/db.config.js';

async function test() {
    console.log("Finding employee user...");
    const user = await prisma.user.findFirst();
    const userId = user ? user.id : 'fake-id';
    
    const req = { user: { id: userId, userId } };
    
    const res = {
        status: (code) => ({
            json: (data) => {
                console.log(`[STATUS ${code}] Success:`, !!data.success);
            }
        })
    };

    console.log("--- DASHBOARD ---");
    await getEmployeeDashboard(req, res);
    
    console.log("--- TASKS ---");
    await getEmployeeTasks(req, res);
    
    console.log("--- ANALYTICS ---");
    await getEmployeeAnalytics(req, res);
    
    process.exit(0);
}

test().catch(e => {
    console.error(e);
    process.exit(1);
});
