import React, { useState } from "react";

interface CollaborationControlProps {
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
}

export function CollaborationControl({
  onCreateRoom,
  onJoinRoom,
}: CollaborationControlProps) {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [roomId, setRoomId] = useState("");

  return (
    <div className="flex items-center gap-2">
      {!mode === "join" ? (
        <div className="flex items-center gap-2">
          <button
            className={
              /* tw */ `
                rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium
                text-white transition-colors hover:bg-blue-700
              `
            }
            onClick={onCreateRoom}
          >
            Create Room
          </button>
          <button
            className={
              /* tw */ `
                rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium
                text-slate-600 transition-colors hover:bg-slate-200
              `
            }
            onClick={() => setMode("join")}
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Room ID"
            className={
              /* tw */ `
                rounded-md border px-3 py-1.5 text-xs focus:ring-2
                focus:ring-blue-500 focus:outline-none
              `
            }
          />
          <button
            className={
              /* tw */ `
                rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium
                text-white transition-colors hover:bg-blue-700
              `
            }
            onClick={() => {
              onJoinRoom(roomId);
              setMode("create");
            }}
          >
            Join
          </button>
          <button
            className={
              /* tw */ `
                rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium
                text-slate-600 transition-colors hover:bg-slate-200
              `
            }
            onClick={() => setMode("create")}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
