import prisma from "./backend/src/DB/db.config.js";

async function run() {
    // Find the Engineering Team
    const engTeam = await prisma.team.findFirst({ where: { name: { contains: "Engineering" } }});
    if (!engTeam) {
        console.log("Engineering Team not found!");
        return;
    }
    console.log("Engineering Team ID:", engTeam.id, "Leader ID:", engTeam.leaderId);

    const leaderId = engTeam.leaderId;

    const teams = await prisma.team.findMany({
        where: { leaderId: leaderId, is_deleted: false },
        select: { id: true, name: true }
    });
    console.log("\nTeams found for leader:", teams);

    const teamIds = teams.map(t => t.id);

    const projectTeams = await prisma.projectTeam.findMany({
        where: { teamId: { in: teamIds } },
        include: {
            projectDepartment: {
                include: { project: true }
            },
            tasks: true
        }
    });

    console.log("\nProject Teams Found:", projectTeams.length);

    projectTeams.forEach(pt => {
        console.log(`\nProject Team ID: ${pt.id}`);
        console.log(`Associated Team ID: ${pt.teamId}`);
        console.log(`Has ProjectDepartment? ${!!pt.projectDepartment}`);
        console.log(`Has Project? ${!!pt.projectDepartment?.project}`);
        console.log(`Project Name: ${pt.projectDepartment?.project?.name}`);
        console.log(`Tasks Count: ${pt.tasks.length}`);
    });
    
    // Now fallback: Let's see all tasks in the DB associated to these teamIds via projectTeam
    const allTasks = await prisma.task.findMany({
        where: { 
            projectTeam: { teamId: { in: teamIds } }
        }
    });
    console.log("\nTotal Tasks in DB for these teams (via projectTeam):", allTasks.length);
    
    // What if the tasks are linked directly somehow?
    // Wait, Task model ONLY has projectTeamId.
    const allTasksForProjectTeams = await prisma.task.findMany({
        where: {
            projectTeamId: { in: projectTeams.map(pt => pt.id) }
        }
    });
    console.log("Tasks linked to the fetched ProjectTeams:", allTasksForProjectTeams.length);
}
run();
