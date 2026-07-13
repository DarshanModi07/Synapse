const axios = require('axios');
const login = async () => {
    try {
        const res = await axios.post('http://localhost:8080/api/auth/login', {
            email: 'manager1@example.com',
            password: 'password123'
        });
        const token = res.data.data.accessToken;
        
        // Also test owner
        const resOwner = await axios.post('http://localhost:8080/api/auth/login', {
            email: 'admin@example.com',
            password: 'password123'
        });
        const tokenOwner = resOwner.data.data.accessToken;

        console.log("=== MANAGER ===");
        const dash = await axios.get('http://localhost:8080/api/manager/projects/1/dashboard', {
            headers: { Authorization: 'Bearer ' + token }
        });
        console.log(JSON.stringify(dash.data, null, 2));

        console.log("=== OWNER ===");
        const dashOwner = await axios.get('http://localhost:8080/api/project/1/dashboard', {
            headers: { Authorization: 'Bearer ' + tokenOwner }
        });
        console.log(JSON.stringify(dashOwner.data, null, 2));
    } catch(e) {
        console.log(e.response?.data || e.message);
    }
}
login();
