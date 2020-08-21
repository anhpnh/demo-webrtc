const socket = io("/");

$("#div-chat").hide();

//Lang nghe su kien danh-sach-online
socket.on("danh-sach-online", arrUserInfo => {
    $("#div-chat").show();
    $("#div-dangky").hide();
    $("#remoteStream").hide();
    //console.log(arrUserInfo);
    arrUserInfo.forEach(user => {
        const { peerID, ten } = user;
        $("#ulUser").append(`<li style="color: green;" id="${peerID}">${ten}</li>`);
    });

    //Lang nghe su kien co nguoi dung moi
    socket.on("co-nguoi-dung-moi", user => {
        //console.log(user);
        const { peerID, ten } = user;
        $("#ulUser").append(`<li style="color: green;" id="${peerID}">${ten}</li>`)
    });

    //Lang nghe su kien ai-do-ngat-ket-noi
    socket.on("ai-do-ngat-ket-noi", peerID => {
        $(`#${peerID}`).remove();
    });

});

//Lang nghe su kien dang-ky-that-bai
socket.on("dang-ky-that-bai", () => {
    alert("Username đã tồn tại, vui lòng chọn username khác!!!");
});

function openStream() {
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream()
//     .then(stream => playStream("localStream", stream));

// const peer = new Peer({
//     key: "peerjs",
//     host: "9000-db336d0d-ebf9-4d00-bdf6-60648bd95e43.ws-us02.gitpod.io",
//     secure: true,
//     port: 443
// });
const peer = new Peer();
peer.on('open', id => {
    //$("#my-peer").append(id);
    //Sign up username
    $("#btnSignUp").click(() => {
        const username = $("#txtUsername").val();
        socket.emit("nguoi-dung-dang-ky", { peerID: id, ten: username });
    });
});


//Answer
peer.on("call", call => {
    $("#remoteStream").show();
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream("localStream", stream);
            call.on("stream", remoteStream => playStream("remoteStream", remoteStream));
        });
});

//Click user online to call
$("#ulUser").on("click", "li", function() {
    const id = $(this).attr("id");
    $("#remoteStream").show();
    openStream()
        .then(stream => {
            playStream("localStream", stream);
            const call = peer.call(id, stream);
            call.on("stream", remoteStream => playStream("remoteStream", remoteStream));
        });
});