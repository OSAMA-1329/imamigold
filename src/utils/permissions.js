// Role-based rules
export const canDirectMessage = (a, b) => {
  if (!a || !b || a.id === b.id) return false;
  const pair = [a.role, b.role].sort().join("-");
  // disallowed: retail-retail, wholesale-wholesale, retail-wholesale
  if (pair === "retail-retail") return false;
  if (pair === "wholesale-wholesale") return false;
  if (pair === "retail-wholesale") return false;
  return true;
};

export const canCreateGroup = (role) => role === "admin" || role === "purchase";

export const canSeeUser = (viewer, target) => {
  if (viewer.role === "admin") return true;
  if (viewer.role === "retail" && target.role === "wholesale") return false;
  if (viewer.role === "wholesale" && target.role === "retail") return false;
  return true;
};

export const visibleChats = (user, chats) => {
  return chats.filter((c) => {
    if (c.type === "direct") return c.participants.includes(user.id);
    // group: member or admin
    if (user.role === "admin") return true;
    if (!c.members.includes(user.id)) return false;
    if (user.role === "wholesale" && c.category === "admin-retail") return false;
    if (user.role === "retail" && c.category === "purchase-wholesale") return false;
    return true;
  });
};
