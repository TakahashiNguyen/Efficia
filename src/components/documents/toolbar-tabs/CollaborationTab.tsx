import { Button } from "@/components/ui/button";
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserPlus } from "lucide-react";
import React from "react";

interface CollaborationTabProps {
  participants: string[];
  onConnectToPeer: (id: string) => void;
  clientId: string;
  isConnected: boolean;
}

export function CollaborationTabTrigger() {
  return (
    <TabsTrigger
      value="collaboration"
      className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent"
    >
      Collaboration
    </TabsTrigger>
  );
}

export const CollaborationTab: React.FC<CollaborationTabProps> = ({
  participants,
  onConnectToPeer,
  clientId,
  isConnected,
}) => {
  return (
    <TabsContent value="collaboration" className="m-0 p-1">
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="text-muted-foreground text-sm">
              {isConnected ? "Connected to network" : "Disconnected"}
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => {
              const id = prompt("Enter Peer ID to connect:");
              if (id) onConnectToPeer(id);
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Peer
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-muted-foreground text-sm font-medium">
            Participants
          </h3>
          <div className="flex flex-wrap gap-3">
            {participants.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">
                No other participants in this session.
              </p>
            ) : (
              <div className="flex -space-x-2">
                <TooltipProvider>
                  {participants.map((peer) => (
                    <Tooltip key={peer}>
                      <TooltipTrigger asChild>
                        <div
                          className="bg-primary text-primary-foreground border-background flex h-8 w-8 cursor-help items-center justify-center rounded-full border-2 text-xs font-medium"
                          title={peer}
                        >
                          {peer.slice(0, 2).toUpperCase()}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>{peer}</TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>

        <div className="border-border border-t pt-4">
          <div className="text-muted-foreground text-xs">
            <p>Your Client ID:</p>
            <code className="bg-muted rounded px-1">{clientId}</code>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
