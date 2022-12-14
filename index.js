const express = require('express');
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server,{
    cors : {
        origin : "*",
        methods : ["GET","POST"]
    }
});
app.use(cors());

const PORT = process.env.PORT || 5000;




io.on('connection',(socket)=>{
    socket.emit("me",socket.id);

    socket.on("disconnect",()=>{
        socket.broadcast.emit("callended");
    });

    socket.on("calluser",({ userToCall , signalData , from ,name})=>{
        io.to(userToCall).emit("calluser", { signal : signalData , from , name });
    });

    socket.on("answercall", (data)=>{
        io.to(data.to).emit("callaccepted", data.signal)
    });
});


app.get('/',(req,res)=>{
    res.send("Server is running for the chat app");
});



server.listen(PORT,()=>{
    console.log(`The server is running in port ${PORT}`);
});