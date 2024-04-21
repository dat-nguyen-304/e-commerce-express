const app = require("./src/app");

const server = app.listen(3000, () => {
    console.log("Start successfully at 3000");
})

// process.on("SIGINT", () => {
//     server.close(() => { console.log("Exit server express") });
// })