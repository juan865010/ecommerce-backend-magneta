import App from "./app";
const server: App = new App();
server.getAppServer().listen(server.getPort(), () => {
    console.log(` App is running at http://localhost:${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});