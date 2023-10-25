import React, { memo, useCallback, useEffect, useState } from "react";
import { MatrixClient } from "matrix-js-sdk";
import RequireAuth from "../Hoc/RequireAuth";
import { BsFillSendFill } from "react-icons/bs";
import { AiOutlineMore } from "react-icons/ai";
import { FaRestroom } from "react-icons/fa";
import $ from "jquery";
import notifify from "../Sound/test.mp3"
// import { Notifications } from 'react-push-notification';

const ChatApp = () => {
  const homeserverUrl = "http://localhost:8008";
  let client = null;

  // State to manage messages
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState("");

  const token = localStorage.getItem("auth_token");

  client = new MatrixClient({ baseUrl: homeserverUrl, accessToken: token });

  const sendMessage = () => {
    const roomId = localStorage.getItem("room_id");
    if (client && newMessage) {
      client.sendTextMessage(roomId, newMessage).then((eventId) => {
        setNewMessage("");
      });
    }
  };

  const joinRoom = (roomId) => {
    client.joinRoom(roomId).then(() => {
      // Start syncing the room
      client.startClient({ initialSyncLimit: 0 });

      // Add an event listener for incoming events
      client.on("Room.timeline", function (event, room) {
        setMessages((prevMessages) => [
          ...prevMessages,
          [
            {
              body: event.event.content.body,
              sender: event.event.sender,
            },
          ],
        ]);
      });
    });
  };

  const createRoom = () => {
    client
      .createRoom({ visibility: "public", invite: ["@jose:server.copper.de"] })
      .then((response) => {
        localStorage.setItem("room_id", response.room_id);
        joinRoom(response.room_id);
      })
      .catch((error) => {
        console.error("Error creating room:", error);
      });
    $(".popup").hide();
  };

  useEffect(() => {
    $(".popup").hide();
  }, []);

  const clickMore = () => {
    $(".popup").fadeToggle();
  };

  var testRoomId = localStorage.getItem("room_id");

  function sendNotice(body) {
    var content = {
      body: body.substring(1),
      msgtype: "m.notice",
    };
    client.sendEvent(testRoomId, "m.room.message", content, "", (err, res) => {
      console.log(err);
    });
  }

  // Here We can get the userId, deviceId
  const getWhoAmI = async () => {
    return await client
      .whoami()
      .then((data) => {
        setUserId(data.user_id);
        client = new MatrixClient({
          baseUrl: homeserverUrl,
          accessToken: token,
          userId: data.user_id,
        });
        return data;
      })
      .catch((err) => {
        console.error("Error getting user information:", err);
      });
  };

  useEffect(() => {
    getWhoAmI();
    const roomId = localStorage.getItem("room_id");
    if (roomId) {
      joinRoom(roomId);
    }
  }, []);

  const ShowMore = useCallback(() => {
    return (
      <div className="popup px-4 py-4 bg-white absolute bottom-14 shadow-lg rounded-lg">
        <h2 className="text-center font-medium">More Options</h2>
        <hr className="mb-4" />
        <div className="my-2 flex flex-col gap-y-1">
          <button
            className="flex justify-center items-center gap-x-2 bg-indigo-200 hover:bg-indigo-300 py-1 transition-all duration-300 px-2 rounded-sm"
            onClick={() => createRoom()}
          >
            <FaRestroom className="w-4 h-4" /> <span>Create Room</span>
          </button>
        </div>
      </div>
    );
  }, []);

  return (
    <div className="w-full h-full relative">
      {/* <Notifications/> */}
      <div className="w-full">
        <h1 className="text-center text-2xl font-semibold pt-5">Matrix Chat</h1>
        <div className="flex flex-col gap-y-1">
          {messages.map((message, index) => {
            return (
              <div key={index} className="w-full">
                <div
                  className={`m-2 flex flex-col w-fit py-2 px-3 rounded-md ${
                    message[0]?.sender === userId
                      ? "bg-green-200 float-right"
                      : "bg-indigo-200"
                  }`}
                >
                  <strong className="text-lg">
                    {message[0]?.sender === userId ? "You" : message[0]?.sender}
                    :
                  </strong>{" "}
                  {message[0]?.body}
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-10 flex justify-center w-full gap-x-2 border-t-2 pt-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="border-2 rounded-sm outline-none indent-3 focus:border-indigo-300 py-2"
          />
          <button
            onClick={() => sendMessage()}
            className="justify-center items-center gap-x-3 py-2 bg-blue-200 hover:bg-blue-300 transition-all duration-300 px-5 rounded-sm flex font-medium"
          >
            <BsFillSendFill className="w-5 h-5 text-blue-500 hover:text-blue-600 transition-all duration-300" />{" "}
            <span>Send</span>
          </button>
          <div className="flex flex-col gap-y-4 justify-center items-center">
            <ShowMore />
            <button onClick={() => clickMore()} className="">
              <AiOutlineMore className="w-full h-7" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequireAuth(memo(ChatApp));
