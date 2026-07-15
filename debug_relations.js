import prisma from "./backend/src/DB/db.config.js";

async function run() {
    try {
        console.log("=== START DEBUG ===");

        // Find the Engineering Team and its leader
        const engTeam = await prisma.team.findFirst({ where: { name: { contains: "Engineering" } } });
        if (!engTeam) {
            console.log("Engineering Team not found!");
            return;
        }
        
        const userId = engTeam.leaderId;
        console.log("USER:", userId);

        const teams = await prisma.team.findMany({
            where: {
                leaderId: userId,
                is_deleted: false
            }
        });
        
        const teamIds = teams.map(t => t.id);

        const teamProjects = await prisma.projectTeam.findMany({
            where: {
                teamId: { in: teamIds }
            },
            include: {
                projectDepartment: {
                    include: {
                        project: true
                    }
                },
                tasks: true,
                team: true
            }
        });

        console.dir(teamProjects, { depth: null });
        
        for (const team of teams) {
            console.log(`\n-------------------------------------------------`);
            console.log(`Team: ${team.name} (ID: ${team.id})`);
            
            const myPts = teamProjects.filter(pt => pt.teamId === team.id);
            console.log(`ProjectTeams: ${myPts.length}`);
            
            let myTasks = 0;
            myPts.forEach(pt => myTasks += pt.tasks.length);
            console.log(`Tasks: ${myTasks}`);

            if (myPts.length === 0) {
                console.log(`BREAK FOUND AT: ProjectTeam`);
            } else {
                for (const pt of myPts) {
                    if (!pt.projectDepartment) {
                        console.log(`BREAK FOUND AT: ProjectDepartment`);
                    } else if (!pt.projectDepartment.project) {
                        console.log(`BREAK FOUND AT: Project`);
                    } else {
                        console.log(`Valid Project: ${pt.projectDepartment.project.name}`);
                    }
                }
            }
        }

    } catch (e) {
        console.error(e);
    }
}

run();
