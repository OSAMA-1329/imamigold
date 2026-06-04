import { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { canSeeUser } from "../../utils/permissions";

export default function CreateGroupModal({ open, onOpenChange }) {
  const { users, currentUser, createGroup } = useApp();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selected, setSelected] = useState([]);

  const eligible = users.filter((u) => u.id !== currentUser.id && canSeeUser(currentUser, u));

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const submit = () => {
    if (!name.trim() || selected.length === 0) return;
    createGroup({ name, description: desc, members: selected });
    setName(""); setDesc(""); setSelected([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create new group</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
          <div>
            <div className="mb-2 text-xs font-medium text-muted-foreground">
              Add members ({selected.length} selected)
            </div>
            <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-border p-1 scrollbar-thin">
              {eligible.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggle(u.id)}
                  className={`flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                    selected.includes(u.id) ? "bg-accent" : "hover:bg-accent/50"
                  }`}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={u.avatar} />
                    <AvatarFallback>{u.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div>{u.name}</div>
                    <div className="text-[10px] capitalize text-muted-foreground">{u.role} · {u.dept}</div>
                  </div>
                  <div className={`h-4 w-4 rounded border ${selected.includes(u.id) ? "border-primary bg-primary" : "border-border"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!name.trim() || selected.length === 0}>Create group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
