// GATE CS Syllabus & Weightage Data
// Extracted 1:1 from the GATE CS Flutter App

export const GATE_SUBJECTS = [
  { id: 1, name: 'C Programming', code: 'CP', examId: 'gate', branchCode: 'CS', totalChapters: 7, avgMarks: 4.6, icon: '💻' },
  { id: 11, name: 'Data Structures', code: 'DS', examId: 'gate', branchCode: 'CS', totalChapters: 7, avgMarks: 4.2, icon: '🌳' },
  { id: 2, name: 'Algorithms', code: 'ALGO', examId: 'gate', branchCode: 'CS', totalChapters: 6, avgMarks: 9.3, icon: '⚡' },
  { id: 3, name: 'Theory of Computation', code: 'TOC', examId: 'gate', branchCode: 'CS', totalChapters: 6, avgMarks: 7.4, icon: '⚙️' },
  { id: 4, name: 'Compiler Design', code: 'CD', examId: 'gate', branchCode: 'CS', totalChapters: 5, avgMarks: 5.5, icon: '🛠️' },
  { id: 5, name: 'Operating System', code: 'OS', examId: 'gate', branchCode: 'CS', totalChapters: 8, avgMarks: 8.2, icon: '🖥️' },
  { id: 6, name: 'Databases', code: 'DBMS', examId: 'gate', branchCode: 'CS', totalChapters: 6, avgMarks: 7.2, icon: '🗄️' },
  { id: 7, name: 'Computer Networks', code: 'CN', examId: 'gate', branchCode: 'CS', totalChapters: 7, avgMarks: 7.9, icon: '🌐' },
  { id: 8, name: 'Computer Organization & Architecture', code: 'COA', examId: 'gate', branchCode: 'CS', totalChapters: 8, avgMarks: 7.1, icon: '📐' },
  { id: 9, name: 'Digital Logic', code: 'DL', examId: 'gate', branchCode: 'CS', totalChapters: 5, avgMarks: 6.1, icon: '🔌' },
  { id: 10, name: 'Engineering Mathematics', code: 'MATHS', examId: 'gate', branchCode: 'CS', totalChapters: 3, avgMarks: 7.2, icon: '📐' },
  { id: 13, name: 'Discrete Mathematics', code: 'DM', examId: 'gate', branchCode: 'CS', totalChapters: 5, avgMarks: 8.9, icon: '🧩' },
  { id: 12, name: 'General Aptitude', code: 'GA', examId: 'gate', branchCode: 'CS', totalChapters: 5, avgMarks: 15.0, icon: '🧠' }
];

export const GATE_CHAPTERS = {
  1: [ // C Programming
    { id: 1, subjectId: 1, name: 'Data Types and Operators', orderIndex: 1, isImportant: false },
    { id: 2, subjectId: 1, name: 'Control Flow Statements', orderIndex: 2, isImportant: false },
    { id: 3, subjectId: 1, name: 'Functions & Storage Classes', orderIndex: 3, isImportant: false },
    { id: 7, subjectId: 1, name: 'Recursion', orderIndex: 4, isImportant: true },
    { id: 4, subjectId: 1, name: 'Arrays and Pointers', orderIndex: 5, isImportant: true },
    { id: 5, subjectId: 1, name: 'Strings', orderIndex: 6, isImportant: false },
    { id: 6, subjectId: 1, name: 'Structure and Union', orderIndex: 7, isImportant: false }
  ],
  11: [ // Data Structures
    { id: 101, subjectId: 11, name: 'Introduction to Data Structures', orderIndex: 1, isImportant: false },
    { id: 102, subjectId: 11, name: 'Arrays', orderIndex: 2, isImportant: false },
    { id: 103, subjectId: 11, name: 'Linked List', orderIndex: 3, isImportant: false },
    { id: 104, subjectId: 11, name: 'Stack and Queues', orderIndex: 4, isImportant: true },
    { id: 105, subjectId: 11, name: 'Trees, BST and Binary Heaps', orderIndex: 5, isImportant: true },
    { id: 106, subjectId: 11, name: 'Graphs', orderIndex: 6, isImportant: true },
    { id: 107, subjectId: 11, name: 'Hashing', orderIndex: 7, isImportant: true }
  ],
  2: [ // Algorithms
    { id: 9, subjectId: 2, name: 'Searching, Sorting and Hashing', orderIndex: 1, isImportant: true },
    { id: 10, subjectId: 2, name: 'Divide and Conquer', orderIndex: 2, isImportant: true },
    { id: 11, subjectId: 2, name: 'Greedy Algorithms', orderIndex: 3, isImportant: true },
    { id: 12, subjectId: 2, name: 'Dynamic Programming', orderIndex: 4, isImportant: true },
    { id: 13, subjectId: 2, name: 'Graph Traversals, MST and Shortest Paths', orderIndex: 5, isImportant: true },
    { id: 15, subjectId: 2, name: 'Asymptotic Worst-Case Time & Space Complexity', orderIndex: 6, isImportant: true }
  ],
  3: [ // Theory of Computation
    { id: 16, subjectId: 3, name: 'Finite Automata', orderIndex: 1, isImportant: true },
    { id: 17, subjectId: 3, name: 'Regular Languages', orderIndex: 2, isImportant: true },
    { id: 18, subjectId: 3, name: 'Context-Free Grammars', orderIndex: 3, isImportant: false },
    { id: 19, subjectId: 3, name: 'Pushdown Automata', orderIndex: 4, isImportant: false },
    { id: 20, subjectId: 3, name: 'Turing Machines', orderIndex: 5, isImportant: true },
    { id: 21, subjectId: 3, name: 'Undecidability', orderIndex: 6, isImportant: true }
  ],
  4: [ // Compiler Design
    { id: 22, subjectId: 4, name: 'Lexical Analysis', orderIndex: 1, isImportant: false },
    { id: 23, subjectId: 4, name: 'Syntax Analysis (Parsing)', orderIndex: 2, isImportant: true },
    { id: 24, subjectId: 4, name: 'Syntax-Directed Translation & Runtime Environments', orderIndex: 3, isImportant: true },
    { id: 25, subjectId: 4, name: 'Intermediate Code Generation', orderIndex: 4, isImportant: false },
    { id: 26, subjectId: 4, name: 'Local Optimization & Data Flow Analyses', orderIndex: 5, isImportant: true }
  ],
  5: [ // Operating System
    { id: 27, subjectId: 5, name: 'Introduction', orderIndex: 1, isImportant: false },
    { id: 28, subjectId: 5, name: 'Process Management', orderIndex: 2, isImportant: false },
    { id: 29, subjectId: 5, name: 'CPU and I/O Scheduling', orderIndex: 3, isImportant: true },
    { id: 30, subjectId: 5, name: 'IPC, Concurrency and Synchronization', orderIndex: 4, isImportant: true },
    { id: 31, subjectId: 5, name: 'Deadlock', orderIndex: 5, isImportant: true },
    { id: 32, subjectId: 5, name: 'Memory Management and Virtual Memory', orderIndex: 6, isImportant: true },
    { id: 33, subjectId: 5, name: 'File System & Device Management', orderIndex: 7, isImportant: false },
    { id: 34, subjectId: 5, name: 'System Calls, Processes and Threads', orderIndex: 8, isImportant: true }
  ],
  6: [ // Databases
    { id: 35, subjectId: 6, name: 'ER Model', orderIndex: 1, isImportant: false },
    { id: 36, subjectId: 6, name: 'Relational Model', orderIndex: 2, isImportant: false },
    { id: 37, subjectId: 6, name: 'SQL', orderIndex: 3, isImportant: true },
    { id: 38, subjectId: 6, name: 'Integrity Constraints and Normal Forms', orderIndex: 4, isImportant: true },
    { id: 39, subjectId: 6, name: 'Transactions and Concurrency Control', orderIndex: 5, isImportant: true },
    { id: 40, subjectId: 6, name: 'File Organization and Indexing (B and B+ Trees)', orderIndex: 6, isImportant: true }
  ],
  7: [ // Computer Networks
    { id: 42, subjectId: 7, name: 'Principles of Layering and Switching', orderIndex: 1, isImportant: false },
    { id: 43, subjectId: 7, name: 'Physical Layer', orderIndex: 2, isImportant: false },
    { id: 44, subjectId: 7, name: 'Data Link Layer (Framing, Flow & Error Control)', orderIndex: 3, isImportant: true },
    { id: 45, subjectId: 7, name: 'IPv4, CIDR, Fragmentation and NAT', orderIndex: 4, isImportant: true },
    { id: 46, subjectId: 7, name: 'TCP Flow & Congestion Control and Socket API', orderIndex: 5, isImportant: true },
    { id: 47, subjectId: 7, name: 'DNS, SMTP, FTP and HTTP', orderIndex: 6, isImportant: false },
    { id: 49, subjectId: 7, name: 'Routing Algorithms (DVR, LSR)', orderIndex: 7, isImportant: true }
  ],
  8: [ // Computer Organization & Architecture
    { id: 51, subjectId: 8, name: 'Instruction Set and Addressing Modes', orderIndex: 1, isImportant: true },
    { id: 72, subjectId: 8, name: 'ALU and Data Path', orderIndex: 2, isImportant: false },
    { id: 73, subjectId: 8, name: 'Control Unit Design', orderIndex: 3, isImportant: false },
    { id: 52, subjectId: 8, name: 'Pipelining & Hazards', orderIndex: 4, isImportant: true },
    { id: 53, subjectId: 8, name: 'Memory Interfacing and Hierarchy', orderIndex: 5, isImportant: false },
    { id: 54, subjectId: 8, name: 'Cache Memory', orderIndex: 6, isImportant: true },
    { id: 55, subjectId: 8, name: 'Virtual Memory (TLB, Paging)', orderIndex: 7, isImportant: true },
    { id: 56, subjectId: 8, name: 'I/O Interface (Interrupt and DMA)', orderIndex: 8, isImportant: true }
  ],
  9: [ // Digital Logic
    { id: 57, subjectId: 9, name: 'Boolean Algebra', orderIndex: 1, isImportant: false },
    { id: 58, subjectId: 9, name: 'Combinational Circuits (MUX, Decoder, Adders)', orderIndex: 2, isImportant: true },
    { id: 59, subjectId: 9, name: 'Sequential Circuits (Flip Flops, Counters, Registers)', orderIndex: 3, isImportant: true },
    { id: 60, subjectId: 9, name: 'Minimization & K-Maps', orderIndex: 4, isImportant: true },
    { id: 61, subjectId: 9, name: 'Number Representation and Computer Arithmetic', orderIndex: 5, isImportant: true }
  ],
  10: [ // Engineering Mathematics
    { id: 62, subjectId: 10, name: 'Linear Algebra (Matrices, Eigenvalues, Rank)', orderIndex: 1, isImportant: true },
    { id: 63, subjectId: 10, name: 'Calculus (Limits, Continuity, Maxima/Minima)', orderIndex: 2, isImportant: false },
    { id: 64, subjectId: 10, name: 'Probability and Statistics (Distributions, Bayes)', orderIndex: 3, isImportant: true }
  ],
  13: [ // Discrete Mathematics
    { id: 66, subjectId: 13, name: 'Propositional and First-Order Logic', orderIndex: 1, isImportant: true },
    { id: 67, subjectId: 13, name: 'Sets, Relations and Functions', orderIndex: 2, isImportant: true },
    { id: 71, subjectId: 13, name: 'Monoids, Groups and Lattices', orderIndex: 3, isImportant: false },
    { id: 68, subjectId: 13, name: 'Graphs: Connectivity, Matching and Colouring', orderIndex: 4, isImportant: true },
    { id: 69, subjectId: 13, name: 'Combinatorics and Generating Functions', orderIndex: 5, isImportant: true }
  ],
  12: [ // General Aptitude
    { id: 121, subjectId: 12, name: 'Verbal Ability (Grammar, Vocabulary, Reading)', orderIndex: 1, isImportant: true },
    { id: 122, subjectId: 12, name: 'Quantitative Aptitude (Arithmetic, Algebra, Percentages)', orderIndex: 2, isImportant: true },
    { id: 123, subjectId: 12, name: 'Analytical Aptitude (Logic, Deduction, Sequences)', orderIndex: 3, isImportant: true },
    { id: 124, subjectId: 12, name: 'Spatial Aptitude (Transformations, Geometry)', orderIndex: 4, isImportant: false },
    { id: 125, subjectId: 12, name: 'Numerical Ability (Data Interpretation, Computation)', orderIndex: 5, isImportant: true }
  ]
};

// ─── Weightage Data ─────────────────────────────────────────────────────────

export const RECENT_WEIGHTAGES = [
  { subject: 'Prog. & Data Structures', marks2023: 11, marks2024: 8, marks2025Avg: 10, threeYearAvg: 9.7, volatility: '8-11' },
  { subject: 'Algorithms', marks2023: 6, marks2024: 8, marks2025Avg: 8, threeYearAvg: 7.3, volatility: '6-8' },
  { subject: 'Operating Systems', marks2023: 7, marks2024: 10, marks2025Avg: 8, threeYearAvg: 8.3, volatility: '7-10' },
  { subject: 'DBMS', marks2023: 5, marks2024: 8, marks2025Avg: 8, threeYearAvg: 7.0, volatility: '5-8' },
  { subject: 'COA', marks2023: 12, marks2024: 9, marks2025Avg: 8, threeYearAvg: 9.7, volatility: '8-12' },
  { subject: 'Digital Logic', marks2023: 6, marks2024: 5, marks2025Avg: 6, threeYearAvg: 5.7, volatility: '5-6' },
  { subject: 'Theory of Computation', marks2023: 9, marks2024: 7, marks2025Avg: 9, threeYearAvg: 8.3, volatility: '7-9' },
  { subject: 'Compiler Design', marks2023: 5, marks2024: 8, marks2025Avg: 5, threeYearAvg: 6.0, volatility: '5-8' },
  { subject: 'Computer Networks', marks2023: 8, marks2024: 9, marks2025Avg: 8, threeYearAvg: 8.3, volatility: '8-9' }
];

export const HISTORICAL_WEIGHTAGES = [
  { subject: 'Prog. & Data Structures', marks2023: 10, marks2022: 10, marks2021: 10, marks2020: 8, marks2019: 8, fiveYearAvg: 9.2 },
  { subject: 'Algorithms', marks2023: 6, marks2022: 7, marks2021: 7, marks2020: 6, marks2019: 7, fiveYearAvg: 6.6 },
  { subject: 'Operating Systems', marks2023: 5, marks2022: 7, marks2021: 7, marks2020: 8, marks2019: 8, fiveYearAvg: 7.0 },
  { subject: 'DBMS', marks2023: 5, marks2022: 6, marks2021: 6, marks2020: 6, marks2019: 7, fiveYearAvg: 6.0 },
  { subject: 'Computer Networks', marks2023: 6, marks2022: 5, marks2021: 6, marks2020: 7, marks2019: 7, fiveYearAvg: 6.2 },
  { subject: 'COA', marks2023: 8, marks2022: 10, marks2021: 8, marks2020: 10, marks2019: 10, fiveYearAvg: 9.2 },
  { subject: 'Discrete Mathematics', marks2023: 6, marks2022: 7, marks2021: 7, marks2020: 8, marks2019: 8, fiveYearAvg: 7.2 },
  { subject: 'Theory of Computation', marks2023: 7, marks2022: 7, marks2021: 8, marks2020: 7, marks2019: 8, fiveYearAvg: 7.4 },
  { subject: 'Compiler Design', marks2023: 4, marks2022: 4, marks2021: 4, marks2020: 4, marks2019: 4, fiveYearAvg: 4.0 },
  { subject: 'Digital Logic', marks2023: 5, marks2022: 4, marks2021: 5, marks2020: 4, marks2019: 4, fiveYearAvg: 4.4 },
  { subject: 'Engg. Mathematics', marks2023: 7, marks2022: 6, marks2021: 6, marks2020: 7, marks2019: 7, fiveYearAvg: 6.6 },
  { subject: 'General Aptitude', marks2023: 10, marks2022: 10, marks2021: 10, marks2020: 10, marks2019: 10, fiveYearAvg: 10.0 }
];

export const ALL_TIME_YEARS = [
  '2026-2', '2026-1', '2025-2', '2025-1', '2024-2', '2024-1', '2023', '2022', '2021-2', '2021-1', 
  '2020', '2019', '2018', '2017-2', '2017-1', '2016-2', '2016-1', '2015-3', '2015-2', '2015-1', 
  '2014-3', '2014-2', '2014-1', '2013', '2012', '2011', '2010'
];

export const ALL_TIME_WEIGHTAGES = [
  { subject: 'Quantitative Aptitude', average: 7.70, volatility: '5-13', allMarks: [6, 6, 8, 7, 7, 8, 5, 6, 6, 7, 7, 8, 13, 11, 10, 8, 7, 6, 10, 8, 8, 8, 8, 9, 6, 6, 9] },
  { subject: 'Verbal Aptitude', average: 5.19, volatility: '1-9', allMarks: [1, 1, 2, 4, 3, 3, 4, 3, 4, 4, 6, 7, 2, 4, 5, 7, 8, 9, 5, 7, 7, 7, 7, 6, 9, 9, 6] },
  { subject: 'Analytical Aptitude', average: 3.30, volatility: '0-7', allMarks: [7, 5, 4, 2, 3, 0, 3, 3, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { subject: 'Spatial Aptitude', average: 2.40, volatility: '0-4', allMarks: [1, 3, 1, 2, 2, 4, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { subject: 'Algorithms', average: 9.33, volatility: '4-16', allMarks: [12, 16, 8, 8, 6, 9, 6, 6, 10, 9, 8, 6, 8, 8, 6, 9, 7, 15, 9, 10, 12, 11, 4, 13, 12, 13, 11] },
  { subject: 'Discrete Mathematics', average: 8.92, volatility: '0-19', allMarks: [0, 0, 3, 6, 9, 6, 10, 13, 6, 9, 8, 8, 11, 6, 6, 9, 8, 6, 19, 13, 14, 8, 12, 8, 9, 5, 11] },
  { subject: 'Operating System', average: 8.22, volatility: '6-12', allMarks: [7, 6, 7, 8, 10, 10, 9, 10, 8, 6, 10, 10, 9, 6, 6, 7, 9, 6, 8, 10, 7, 9, 8, 12, 9, 8, 7] },
  { subject: 'Computer Networks', average: 7.85, volatility: '5-10', allMarks: [9, 8, 6, 8, 9, 9, 8, 10, 7, 9, 6, 9, 7, 5, 8, 9, 10, 8, 8, 6, 9, 7, 8, 7, 9, 6, 7] },
  { subject: 'Theory of Computation', average: 7.41, volatility: '3-12', allMarks: [5, 6, 7, 10, 7, 5, 9, 8, 11, 8, 9, 8, 8, 9, 12, 9, 9, 3, 7, 5, 5, 6, 6, 8, 5, 8, 7] },
  { subject: 'Databases', average: 7.19, volatility: '0-11', allMarks: [6, 6, 9, 8, 8, 8, 5, 7, 7, 8, 8, 8, 6, 8, 8, 6, 5, 6, 6, 6, 8, 8, 0, 7, 11, 7, 7] },
  { subject: 'Engineering Mathematics', average: 7.16, volatility: '0-10', allMarks: [0, 0, 9, 7, 6, 8, 6, 6, 9, 8, 5, 8, 7, 10, 8, 4, 5, 8, 3, 8, 9, 7, 10, 4, 7, 10, 7] },
  { subject: 'CO & Architecture', average: 7.11, volatility: '2-11', allMarks: [11, 11, 9, 8, 8, 8, 10, 7, 6, 5, 9, 4, 8, 6, 10, 11, 5, 5, 5, 2, 5, 5, 7, 9, 5, 7, 6] },
  { subject: 'Digital Logic', average: 6.11, volatility: '3-10', allMarks: [7, 8, 9, 6, 6, 6, 6, 5, 7, 6, 6, 8, 6, 10, 3, 3, 7, 6, 5, 3, 6, 7, 4, 5, 5, 7, 8] },
  { subject: 'Compiler Design', average: 5.48, volatility: '3-10', allMarks: [6, 6, 6, 6, 8, 10, 7, 4, 6, 7, 4, 6, 5, 4, 6, 5, 7, 3, 4, 6, 5, 6, 3, 3, 4, 6, 5] },
  { subject: 'C Programming', average: 4.62, volatility: '1-10', allMarks: [6, 1, 6, 5, 4, 4, 1, 5, 6, 4, 3, 8, 8, 10, 9, 5, 6, 7, 1, 5, 0, 3, 1, 2, 7, 1, 2] },
  { subject: 'Data Structures', average: 4.22, volatility: '1-8', allMarks: [3, 2, 6, 5, 4, 2, 8, 4, 2, 6, 7, 4, 2, 3, 3, 7, 7, 5, 6, 7, 4, 3, 3, 3, 2, 1, 5] }
];
