// Mock data for Imami Gold Retail Hub
const now = Date.now();
const m = (mins) => new Date(now - mins * 60000).toISOString();

const avatar = (seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
const groupAvatar = (seed) => `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}`;

const make = (id, name, role, dept, online = false) => ({
  id, name, role, dept,
  email: `${name.toLowerCase().replace(/\s+/g, ".")}@imamihub.com`,
  avatar: avatar(name),
  online,
  lastSeen: online ? m(0) : m(Math.floor(Math.random() * 240) + 5),
  status: online ? "online" : "offline",
  title: { admin: "System Administrator", purchase: "Purchase Manager", wholesale: "Wholesale Partner", retail: "Retail Associate" }[role],
});

export const users = [
  make("u-admin-1", "Alex Morgan", "admin", "Operations", true),
  // Purchase
  make("u-pur-1", "Sara Chen", "purchase", "Procurement", true),
  make("u-pur-2", "Marcus Patel", "purchase", "Procurement", true),
  make("u-pur-3", "Lina Volkov", "purchase", "Procurement", false),
  make("u-pur-4", "Diego Santos", "purchase", "Procurement", true),
  make("u-pur-5", "Ivy Tanaka", "purchase", "Procurement", false),
  // Wholesale (10)
  ...Array.from({ length: 10 }, (_, i) =>
    make(`u-whl-${i + 1}`, ["Northwind Supply", "Atlas Wholesale", "Vertex Distributors", "Hellman Bros", "Iron Crate Co", "Pacific Bulk", "Cedar Trade", "Orbit Goods", "Stoneway Ltd", "Greenfield Bulk"][i], "wholesale", "Partner", i % 3 === 0)
  ),
  // Retail (20)
  ...Array.from({ length: 20 }, (_, i) =>
    make(`u-ret-${i + 1}`, ["Maya Reeves","Tom Becker","Priya Shah","Owen Wright","Nadia Cruz","Felix Yu","Ella Brooks","Hiro Sato","Zara Khan","Ben Carter","Cleo Rivers","Jonas Fink","Amara Diallo","Leo Park","Sophie Marsh","Theo Lang","Iris Bloom","Ravi Mehta","Nora Holt","Kai Bennett"][i], "retail", "Store " + String.fromCharCode(65 + (i % 8)), i % 2 === 0)
  ),
];

export const findUser = (id) => users.find((u) => u.id === id);

const seedMessages = (a, b, snippets) =>
  snippets.map((text, i) => ({
    id: `msg-${a}-${b}-${i}`,
    senderId: i % 2 === 0 ? a : b,
    text,
    time: m(snippets.length * 6 - i * 6),
    status: "read",
    reactions: [],
  }));

export const directChats = [
  {
    id: "dm-1", type: "direct", participants: ["u-admin-1", "u-pur-1"],
    pinned: true, archived: false, unread: 0,
    messages: seedMessages("u-admin-1", "u-pur-1", [
      "Morning Sara — Q3 vendor list ready?",
      "Yes Alex, just finalized. Sending the PDF now.",
      "Great. Loop in wholesale on pricing.",
      "On it. Will sync with Northwind today.",
    ]),
  },
  {
    id: "dm-2", type: "direct", participants: ["u-pur-1", "u-whl-1"],
    pinned: false, archived: false, unread: 2,
    messages: seedMessages("u-pur-1", "u-whl-1", [
      "Hi Northwind, do you have 500 units of SKU-2241?",
      "Yes, in stock. $8.40/unit at that volume.",
      "Can you ship by Friday?",
      "Confirmed. PO please.",
    ]),
  },
  {
    id: "dm-3", type: "direct", participants: ["u-pur-2", "u-ret-3"],
    pinned: false, archived: false, unread: 1,
    messages: seedMessages("u-pur-2", "u-ret-3", [
      "Priya, the seasonal display kits arrive Wednesday.",
      "Perfect, I'll prep the floor plan.",
      "Need any extra promo stands?",
    ]),
  },
  {
    id: "dm-4", type: "direct", participants: ["u-admin-1", "u-ret-1"],
    pinned: false, archived: false, unread: 0,
    messages: seedMessages("u-admin-1", "u-ret-1", [
      "Maya, congrats on hitting target this week.",
      "Thanks Alex! Team really pulled together.",
    ]),
  },
  {
    id: "dm-5", type: "direct", participants: ["u-pur-3", "u-whl-4"],
    pinned: false, archived: true, unread: 0,
    messages: seedMessages("u-pur-3", "u-whl-4", [
      "Closing out PO-8821.",
      "Acknowledged.",
    ]),
  },
];

export const groupChats = [
  {
    id: "grp-1", type: "group", name: "Admin Announcements",
    description: "Company-wide updates from leadership",
    avatar: groupAvatar("announce"), category: "admin-all",
    members: ["u-admin-1", "u-pur-1", "u-pur-2", "u-pur-3", "u-ret-1", "u-ret-2", "u-ret-3"],
    pinned: true, unread: 3,
    messages: seedMessages("u-admin-1", "u-pur-1", [
      "Team — new fiscal year kicks off Monday.",
      "Quarterly all-hands moved to Thursday 3pm.",
      "Please update your profile photos by EOW.",
    ]),
  },
  {
    id: "grp-2", type: "group", name: "Purchase Team",
    description: "Internal procurement coordination",
    avatar: groupAvatar("purchase"), category: "purchase-only",
    members: ["u-pur-1", "u-pur-2", "u-pur-3", "u-pur-4", "u-pur-5", "u-admin-1"],
    pinned: false, unread: 0,
    messages: seedMessages("u-pur-1", "u-pur-2", [
      "Stand-up notes uploaded.",
      "Reviewing vendor pricing today.",
      "Marcus take the Atlas account?",
      "On it.",
    ]),
  },
  {
    id: "grp-3", type: "group", name: "Retail Operations",
    description: "Daily store operations and floor coordination",
    avatar: groupAvatar("retail-ops"), category: "admin-retail",
    members: ["u-admin-1", "u-ret-1", "u-ret-2", "u-ret-3", "u-ret-4", "u-ret-5", "u-pur-2"],
    pinned: false, unread: 5,
    messages: seedMessages("u-admin-1", "u-ret-1", [
      "POS update rolling out tonight.",
      "Stores should reboot terminals at 8am.",
      "Report any sync issues here.",
    ]),
  },
  {
    id: "grp-4", type: "group", name: "Daily Order Updates",
    description: "Purchase ↔ Retail order pipeline",
    avatar: groupAvatar("orders"), category: "purchase-retail",
    members: ["u-pur-1", "u-pur-2", "u-ret-1", "u-ret-3", "u-ret-7", "u-ret-10"],
    pinned: false, unread: 1,
    messages: seedMessages("u-pur-1", "u-ret-1", [
      "Order #4421 dispatched, ETA Tuesday.",
      "Thanks — confirm SKU 9921 included?",
      "Yes, full pallet.",
    ]),
  },
];

export const notifications = [
  { id: "n1", type: "mention", text: "Sara Chen mentioned you in Purchase Team", time: m(4), unread: true },
  { id: "n2", type: "message", text: "New message from Northwind Supply", time: m(22), unread: true },
  { id: "n3", type: "group", text: "You were added to Daily Order Updates", time: m(180), unread: true },
  { id: "n4", type: "announcement", text: "Quarterly all-hands moved to Thursday", time: m(420), unread: false },
  { id: "n5", type: "system", text: "Backup completed successfully", time: m(720), unread: false },
];

export const activityFeed = [
  { id: "a1", actor: "Sara Chen", action: "created group", target: "Q4 Vendor Reviews", time: m(12) },
  { id: "a2", actor: "Maya Reeves", action: "joined", target: "Retail Operations", time: m(40) },
  { id: "a3", actor: "Marcus Patel", action: "shared file", target: "pricing-oct.pdf", time: m(95) },
  { id: "a4", actor: "Alex Morgan", action: "pinned message in", target: "Admin Announcements", time: m(180) },
  { id: "a5", actor: "Northwind Supply", action: "sent quote to", target: "Sara Chen", time: m(260) },
];

export const chartData = {
  activity: Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
    active: 18 + Math.floor(Math.random() * 12),
    messages: 120 + Math.floor(Math.random() * 80),
  })),
  volume: Array.from({ length: 12 }, (_, i) => ({
    hour: `${i * 2}:00`,
    direct: 20 + Math.floor(Math.random() * 30),
    group: 10 + Math.floor(Math.random() * 25),
  })),
  groups: [
    { name: "Admin", value: 18 },
    { name: "Purchase", value: 32 },
    { name: "Retail", value: 28 },
    { name: "Wholesale", value: 14 },
    { name: "Cross-team", value: 8 },
  ],
};
