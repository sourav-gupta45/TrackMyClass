export const initialStudent = {
  name: "Alex Morgan",
  role: "B.Tech Computer Science (Sem 5)",
  rollNo: "CS-2024-042",
  email: "alex.morgan@university.edu",
  phone: "+1 (555) 019-2834",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  academicYear: "2026-2027",
  semester: "Semester 5"
};

export const initialSubjects = [
  {
    id: "CS301",
    code: "CS301",
    name: "Data Structures & Algorithms",
    faculty: "Prof. Robert Vance",
    room: "Lab 302",
    color: "#2563EB", // Primary Blue
    bgLight: "#EFF6FF"
  },
  {
    id: "CS302",
    code: "CS302",
    name: "Operating Systems",
    faculty: "Dr. Sarah Chen",
    room: "Hall B",
    color: "#10B981", // Emerald
    bgLight: "#ECFDF5"
  },
  {
    id: "CS303",
    code: "CS303",
    name: "Computer Networks",
    faculty: "Prof. Michael Scott",
    room: "Room 105",
    color: "#F59E0B", // Amber
    bgLight: "#FFFBEB"
  },
  {
    id: "CS304",
    code: "CS304",
    name: "Database Systems (DBMS)",
    faculty: "Dr. Elena Rostova",
    room: "Lab 201",
    color: "#8B5CF6", // Purple
    bgLight: "#F5F3FF"
  },
  {
    id: "MA301",
    code: "MA301",
    name: "Discrete Mathematics",
    faculty: "Prof. Alan Miller",
    room: "Hall A",
    color: "#EC4899", // Pink
    bgLight: "#FDF2F8"
  },
  {
    id: "CS305",
    code: "CS305",
    name: "Software Engineering & DevOps",
    faculty: "Prof. James Wilson",
    room: "Innovation Hub",
    color: "#06B6D4", // Cyan
    bgLight: "#ECFEFF"
  }
];

// Standard weekly timetable (1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun)
export const initialTimetable = {
  1: [ // Monday
    { id: "p1", period: 1, time: "09:00 AM - 10:00 AM", subjectId: "CS301" },
    { id: "p2", period: 2, time: "10:15 AM - 11:15 AM", subjectId: "CS302" },
    { id: "p3", period: 3, time: "11:30 AM - 12:30 PM", subjectId: "MA301" },
    { id: "p4", period: 4, time: "01:30 PM - 02:30 PM", subjectId: "CS304" },
    { id: "p5", period: 5, time: "02:45 PM - 03:45 PM", subjectId: "CS305" }
  ],
  2: [ // Tuesday
    { id: "p1", period: 1, time: "09:00 AM - 10:00 AM", subjectId: "CS303" },
    { id: "p2", period: 2, time: "10:15 AM - 11:15 AM", subjectId: "CS301" },
    { id: "p3", period: 3, time: "11:30 AM - 12:30 PM", subjectId: "CS302" },
    { id: "p4", period: 4, time: "01:30 PM - 03:30 PM", subjectId: "CS305" } // Lab session
  ],
  3: [ // Wednesday
    { id: "p1", period: 1, time: "09:00 AM - 10:00 AM", subjectId: "CS304" },
    { id: "p2", period: 2, time: "10:15 AM - 11:15 AM", subjectId: "CS303" },
    { id: "p3", period: 3, time: "11:30 AM - 12:30 PM", subjectId: "MA301" },
    { id: "p4", period: 4, time: "01:30 PM - 02:30 PM", subjectId: "CS301" }
  ],
  4: [ // Thursday
    { id: "p1", period: 1, time: "09:00 AM - 10:00 AM", subjectId: "CS302" },
    { id: "p2", period: 2, time: "10:15 AM - 11:15 AM", subjectId: "CS304" },
    { id: "p3", period: 3, time: "11:30 AM - 12:30 PM", subjectId: "CS303" },
    { id: "p4", period: 4, time: "01:30 PM - 02:30 PM", subjectId: "MA301" }
  ],
  5: [ // Friday
    { id: "p1", period: 1, time: "09:00 AM - 10:00 AM", subjectId: "CS301" },
    { id: "p2", period: 2, time: "10:15 AM - 11:15 AM", subjectId: "CS303" },
    { id: "p3", period: 3, time: "11:30 AM - 12:30 PM", subjectId: "CS302" },
    { id: "p4", period: 4, time: "01:30 PM - 03:30 PM", subjectId: "CS304" }
  ],
  6: [], // Saturday - Off / Revision
  0: []  // Sunday - Weekend Off
};

// Registered off-days / holidays
export const initialOffDays = {
  "2026-11-01": { type: "weekend", reason: "Sunday Weekly Off" },
  "2026-11-07": { type: "weekend", reason: "Saturday Off" },
  "2026-11-08": { type: "weekend", reason: "Sunday Weekly Off" },
  "2026-11-14": { type: "holiday", reason: "Children's Day & Tech Symposium" },
  "2026-11-15": { type: "weekend", reason: "Sunday Weekly Off" },
  "2026-11-21": { type: "weekend", reason: "Saturday Off" },
  "2026-11-22": { type: "weekend", reason: "Sunday Weekly Off" },
  "2026-11-26": { type: "holiday", reason: "Thanksgiving Holiday" },
  "2026-11-27": { type: "holiday", reason: "Institutional Holiday" },
  "2026-11-28": { type: "weekend", reason: "Saturday Off" },
  "2026-11-29": { type: "weekend", reason: "Sunday Weekly Off" }
};

// Seed attendance for November 2026 with realistic topic notes & homework
export const initialAttendanceRecords = {
  // Monday Nov 02
  "2026-11-02_p1": { status: "present", topic: "Red-Black Trees Introduction & Properties", homework: "Read CLRS Chapter 13", homeworkDone: true },
  "2026-11-02_p2": { status: "present", topic: "Process Synchronization & Semaphores", homework: "Solve Producer-Consumer problem in C", homeworkDone: true },
  "2026-11-02_p3": { status: "present", topic: "Graph Theory: Eulerian and Hamiltonian circuits", homework: "Exercise 4.2 Q 1-8", homeworkDone: true },
  "2026-11-02_p4": { status: "present", topic: "Relational Algebra joins & projections", homework: "", homeworkDone: false },
  "2026-11-02_p5": { status: "present", topic: "Git branch workflows & GitHub actions CI/CD", homework: "Set up test workflow", homeworkDone: true },

  // Tuesday Nov 03
  "2026-11-03_p1": { status: "absent", topic: "OSI vs TCP/IP model deep dive", homework: "Wireshark packet capture analysis", homeworkDone: false },
  "2026-11-03_p2": { status: "present", topic: "RB Tree Insertion & Case Rotations", homework: "Trace insertion of [10, 20, 30, 15]", homeworkDone: true },
  "2026-11-03_p3": { status: "present", topic: "Deadlocks: Necessary conditions & Banker's Algorithm", homework: "Solve Banker's safety test table", homeworkDone: true },
  "2026-11-03_p4": { status: "present", topic: "Dockerizing React & Node microservices", homework: "Submit Dockerfile", homeworkDone: true },

  // Wednesday Nov 04
  "2026-11-04_p1": { status: "present", topic: "SQL Subqueries & Correlated Queries", homework: "Practice 10 LeetCode SQL questions", homeworkDone: true },
  "2026-11-04_p2": { status: "absent", topic: "Data Link Layer framing & error detection CRC", homework: "Calculate CRC-16 checksum", homeworkDone: false },
  "2026-11-04_p3": { status: "present", topic: "Planar graphs and Kuratowski's theorem", homework: "Euler's formula proof", homeworkDone: true },
  "2026-11-04_p4": { status: "present", topic: "B-Trees and B+ Trees for database indexing", homework: "", homeworkDone: false },

  // Thursday Nov 05
  "2026-11-05_p1": { status: "present", topic: "Memory Management: Paging & Page Tables", homework: "Page hit/fault ratio calculation", homeworkDone: true },
  "2026-11-05_p2": { status: "present", topic: "Normalization: 1NF, 2NF, 3NF, BCNF", homework: "Normalize given schema to BCNF", homeworkDone: true },
  "2026-11-05_p3": { status: "absent", topic: "Sliding Window Protocols: Go-Back-N & Selective Repeat", homework: "Bandwidth-delay product worksheet", homeworkDone: false },
  "2026-11-05_p4": { status: "present", topic: "Recurrence relations using Generating Functions", homework: "Problems 3.1 to 3.5", homeworkDone: true },

  // Friday Nov 06
  "2026-11-06_p1": { status: "present", topic: "Heap sort and Priority Queues", homework: "Implement Min-Heap in Python/C++", homeworkDone: true },
  "2026-11-06_p2": { status: "present", topic: "IP Addressing & Subnetting CIDR", homework: "Subnet 192.168.1.0/24 into 4 subnets", homeworkDone: true },
  "2026-11-06_p3": { status: "present", topic: "Virtual Memory & Demand Paging", homework: "FIFO vs LRU replacement practice", homeworkDone: true },
  "2026-11-06_p4": { status: "present", topic: "Database Transactions: ACID properties", homework: "Concurrency control anomalies write-up", homeworkDone: false },

  // Monday Nov 09
  "2026-11-09_p1": { status: "present", topic: "Disjoint Set Union (DSU) & Union-Find", homework: "Solve Kruskal's MST using DSU", homeworkDone: true },
  "2026-11-09_p2": { status: "present", topic: "Page Replacement Algorithms (LRU, Optimal)", homework: "Count page faults for reference string", homeworkDone: true },
  "2026-11-09_p3": { status: "present", topic: "Pigeonhole Principle and Inclusion-Exclusion", homework: "Combinatorics assignment 3", homeworkDone: true },
  "2026-11-09_p4": { status: "present", topic: "Transaction Isolation Levels in PostgreSQL", homework: "", homeworkDone: false },
  "2026-11-09_p5": { status: "present", topic: "Agile Scrum & Jira sprint simulation", homework: "Write 3 user stories with acceptance criteria", homeworkDone: true },

  // Tuesday Nov 10
  "2026-11-10_p1": { status: "absent", topic: "Routing Protocols: Distance Vector & RIP", homework: "Count-to-infinity problem analysis", homeworkDone: false },
  "2026-11-10_p2": { status: "present", topic: "Kruskal & Prim's Minimum Spanning Tree", homework: "Code Prim's with adjacency list", homeworkDone: true },
  "2026-11-10_p3": { status: "present", topic: "File Systems: Inodes, FAT, ext4", homework: "Disk scheduling algorithms (SSTF, SCAN)", homeworkDone: true },
  "2026-11-10_p4": { status: "present", topic: "Continuous Deployment with Kubernetes basics", homework: "Deploy pod configuration yaml", homeworkDone: true },

  // Wednesday Nov 11
  "2026-11-11_p1": { status: "present", topic: "Two-Phase Locking (2PL) & Strict 2PL", homework: "Deadlock detection graphs", homeworkDone: true },
  "2026-11-11_p2": { status: "present", topic: "Link State Routing & OSPF Dijkstra algorithm", homework: "Simulate Dijkstra on 6-node network", homeworkDone: true },
  "2026-11-11_p3": { status: "present", topic: "Group Theory: Subgroups and Lagrange theorem", homework: "Prove cyclic group properties", homeworkDone: true },
  "2026-11-11_p4": { status: "present", topic: "Dijkstra's Shortest Path Algorithm", homework: "Implement Dijkstra in C++", homeworkDone: true },

  // Thursday Nov 12
  "2026-11-12_p1": { status: "present", topic: "I/O Hardware & Interrupt handling", homework: "DMA controller block diagram notes", homeworkDone: true },
  "2026-11-12_p2": { status: "present", topic: "NoSQL Databases: MongoDB vs Cassandra", homework: "Design schema for e-commerce cart", homeworkDone: true },
  "2026-11-12_p3": { status: "absent", topic: "Transport Layer: TCP 3-way handshake & Teardown", homework: "TCP SYN flood mitigation essay", homeworkDone: false },
  "2026-11-12_p4": { status: "absent", topic: "Permutations & Combinations with repetition", homework: "Review chapter 5 problems", homeworkDone: false },

  // Friday Nov 13
  "2026-11-13_p1": { status: "present", topic: "Bellman-Ford Algorithm for negative weight edges", homework: "Detect negative cycle in graph", homeworkDone: true },
  "2026-11-13_p2": { status: "absent", topic: "TCP Congestion Control (Slow start, Congestion avoidance)", homework: "Graph Reno vs Tahoe cwnd changes", homeworkDone: false },
  "2026-11-13_p3": { status: "present", topic: "Disk Scheduling: C-LOOK & LOOK", homework: "Compare head movements", homeworkDone: true },
  "2026-11-13_p4": { status: "present", topic: "Indexing & Query Optimization in RDBMS", homework: "EXPLAIN ANALYZE query tuning", homeworkDone: true },

  // Monday Nov 16
  "2026-11-16_p1": { status: "present", topic: "Floyd-Warshall All-Pairs Shortest Path", homework: "DP formulation worksheet", homeworkDone: true },
  "2026-11-16_p2": { status: "present", topic: "RAID Levels (RAID 0, 1, 5, 6, 10)", homework: "Calculate usable disk space for RAID 5", homeworkDone: true },
  "2026-11-16_p3": { status: "present", topic: "Graph coloring & chromatic numbers", homework: "Four Color Theorem summary", homeworkDone: true },
  "2026-11-16_p4": { status: "present", topic: "Distributed Transactions: 2PC (Two-Phase Commit)", homework: "CAP Theorem notes", homeworkDone: true },
  "2026-11-16_p5": { status: "present", topic: "Unit Testing & Test-Driven Development (TDD)", homework: "Write Jest unit tests for Auth module", homeworkDone: true },

  // Tuesday Nov 17
  "2026-11-17_p1": { status: "absent", topic: "Application Layer: DNS hierarchy & record types", homework: "Use dig and nslookup commands", homeworkDone: false },
  "2026-11-17_p2": { status: "present", topic: "Dynamic Programming: Longest Common Subsequence", homework: "Reconstruct LCS string", homeworkDone: true },
  "2026-11-17_p3": { status: "present", topic: "Linux kernel architecture & system calls", homework: "Trace sys_clone and fork", homeworkDone: true },
  "2026-11-17_p4": { status: "present", topic: "Microservices Architecture & API Gateway pattern", homework: "Set up reverse proxy with Nginx", homeworkDone: true },

  // Wednesday Nov 18
  "2026-11-18_p1": { status: "present", topic: "Database Sharding & Replication strategies", homework: "Master-replica failover diagram", homeworkDone: true },
  "2026-11-18_p2": { status: "present", topic: "HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC protocol)", homework: "Inspect HTTP headers in Chrome DevTools", homeworkDone: true },
  "2026-11-18_p3": { status: "present", topic: "Isomorphism of Graphs & Adjacency Matrices", homework: "Check graph isomorphism problem", homeworkDone: true },
  "2026-11-18_p4": { status: "present", topic: "0/1 Knapsack Problem with DP", homework: "Bounded vs Unbounded knapsack variants", homeworkDone: true },

  // Thursday Nov 19
  "2026-11-19_p1": { status: "present", topic: "Process scheduling in multi-core systems", homework: "CFS (Completely Fair Scheduler) study", homeworkDone: true },
  "2026-11-19_p2": { status: "present", topic: "Redis caching & Cache Invalidation strategies", homework: "Write-through vs Write-back report", homeworkDone: true },
  "2026-11-19_p3": { status: "present", topic: "Network Security: SSL/TLS handshake & Symmetric/Asymmetric encryption", homework: "Inspect certificate chains", homeworkDone: true },
  "2026-11-19_p4": { status: "present", topic: "Generating Trees & Posets (Partially Ordered Sets)", homework: "Draw Hasse diagrams for divisibility", homeworkDone: true },

  // Friday Nov 20 (Today!)
  "2026-11-20_p1": { status: "present", topic: "Matrix Chain Multiplication DP algorithm", homework: "Compute optimal parenthesization", homeworkDone: false },
  "2026-11-20_p2": { status: "present", topic: "BGP (Border Gateway Protocol) and Autonomous Systems", homework: "Read RFC 4271 overview", homeworkDone: false },
  "2026-11-20_p3": { status: "present", topic: "Container Virtualization vs Hypervisors", homework: "Inspect cgroups and namespaces", homeworkDone: false },
  "2026-11-20_p4": { status: "present", topic: "Graph Databases & Neo4j Cypher queries", homework: "Build social network graph query", homeworkDone: false }
};
