import { getTeamLeadProjects } from "./backend/src/controllers/teamLeadProject.controller.js";
import prisma from "./backend/src/DB/db.config.js";

async function testController() {
    const darshan = await prisma.user.findFirst({ where: { name: "Darshan" }});
    const req = { user: { id: darshan.id, userId: darshan.id } };
    const res = {
        status: (code) => ({
            json: (payload) => {
                console.log(`Status: ${code}`);
                console.dir(payload, { depth: null });
            }
        })
    };
    await getTeamLeadProjects(req, res);
}

testController();
