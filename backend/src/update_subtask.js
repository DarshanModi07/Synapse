const fs = require('fs');
const file = '/home/darshan/Synapse/backend/src/controllers/subtask.controller.js';
let content = fs.readFileSync(file, 'utf-8');
const target = '        if(checkUser.sys_role === " employee\){\n
