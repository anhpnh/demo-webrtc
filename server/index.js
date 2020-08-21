const io = require("socket.io")(3000);
const arrUserInfo = [];

io.on("connection", socket => {
    console.log("Client connected: " + socket.id);

    //Lang nghe nguoi-dung-dang-ky
    socket.on("nguoi-dung-dang-ky", user => {
        console.log("Nguoi dung dang ky: " + user.ten + " - peerID: " + user.peerID);

        //Kiem tra user ton tai hay chua
        const isExist = arrUserInfo.some(e => e.ten === user.ten);
        if (isExist) {
            return socket.emit("dang-ky-that-bai");
        }
        //Gan cac user dang ky vao arrUserInfo
        arrUserInfo.push(user);
        //Gui danh sach online ve cho client
        socket.emit("danh-sach-online", arrUserInfo);
        socket.broadcast.emit("co-nguoi-dung-moi", user);
    });
});