import { updateEmployeeItemStatus } from './src/controllers/employee.controller.js';
import prisma from './src/DB/db.config.js';

async function test() {
    console.log("Finding employee user...");
    const user = await prisma.user.findFirst();
    if (!user) {
        console.log("No employee found.");
        process.exit(1);
    }
    
    // Create a fake task, subtask, and workitems to test cascade
    const projectTeam = await prisma.projectTeam.findFirst();
    if (!projectTeam) {
        console.log("No project team found. Skipping test.");
        process.exit(0);
    }

    const testTask = await prisma.task.create({
        data: {
            title: "Test Task Cascade",
            projectTeamId: projectTeam.id,
            createdById: user.id
        }
    });

    const testSubTask = await prisma.subTask.create({
        data: {
            title: "Test SubTask Cascade",
            taskId: testTask.id,
            assignedToId: user.id,
            assignedById: user.id
        }
    });

    const wi1 = await prisma.workItem.create({
        data: { title: "WI 1", subTaskId: testSubTask.id, status: 'todo' }
    });
    const wi2 = await prisma.workItem.create({
        data: { title: "WI 2", subTaskId: testSubTask.id, status: 'todo' }
    });
    
    console.log("Created test data.");

    // Update WI 1 to done
    const req = { 
        user: { id: user.id, userId: user.id },
        params: { type: 'workitem', itemId: wi1.id },
        body: { status: 'done', actualHours: 2 }
    };
    
    const res = {
        status: (code) => ({
            json: async (data) => {
                console.log(`[STATUS ${code}]`, data);
                
                // Verify DB
                const st = await prisma.subTask.findUnique({ where: { id: testSubTask.id }});
                const t = await prisma.task.findUnique({ where: { id: testTask.id }});
                
                console.log("SubTask Progress:", st.progress, "Status:", st.status);
                console.log("Task Progress:", t.progress, "Status:", t.status);
                
                if (st.progress === 50 && t.progress === 50) {
                    console.log("SUCCESS: Progress calculation cascaded properly.");
                } else {
                    console.log("FAILURE: Calculation incorrect.");
                }
                
                process.exit(0);
            }
        })
    };

    console.log("Triggering cascade...");
    await updateEmployeeItemStatus(req, res);
}

test().catch(e => {
    console.error(e);
    process.exit(1);
});
