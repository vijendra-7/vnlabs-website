// High-Yield Formula Database for Engineering & GATE Exams
const DEFAULT_FORMULAS = [
    // ENGINEERING MATHEMATICS
    {
        id: "m1",
        title: "Eigenvalues & Matrix Properties",
        subject: "math",
        subjectName: "Engineering Math",
        latex: "\\sum \\lambda_i = \\text{Trace}(A), \\quad \\prod \\lambda_i = \\det(A)",
        notes: "Eigenvalues of triangular matrix are diagonal elements. If A is orthogonal, |det(A)| = 1 and eigenvalues have magnitude 1."
    },
    {
        id: "m2",
        title: "Rank-Nullity Theorem",
        subject: "math",
        subjectName: "Engineering Math",
        latex: "\\text{Rank}(A) + \\text{Nullity}(A) = n \\quad (\\text{where } A \\text{ is } m \\times n)",
        notes: "Nullity is the dimension of the null space (kernel) of A."
    },
    {
        id: "m3",
        title: "Bayes' Theorem",
        subject: "math",
        subjectName: "Engineering Math",
        latex: "P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)} = \\frac{P(B|A) \\cdot P(A)}{\\sum P(B|A_i) P(A_i)}",
        notes: "Crucial for conditional probability and false positive testing questions."
    },
    {
        id: "m4",
        title: "Poisson Distribution",
        subject: "math",
        subjectName: "Engineering Math",
        latex: "P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}, \\quad E(X) = \\text{Var}(X) = \\lambda",
        notes: "Mean and Variance are equal (\\lambda). Applicable when n is large and p is very small (\\lambda = np)."
    },
    {
        id: "m5",
        title: "Newton-Raphson Method",
        subject: "math",
        subjectName: "Engineering Math",
        latex: "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",
        notes: "Order of convergence is 2 (quadratic convergence). Fails when f'(x) = 0."
    },

    // THEORY OF COMPUTATION
    {
        id: "toc1",
        title: "Closure Properties Matrix",
        subject: "toc",
        subjectName: "Theory of Computation",
        latex: "\\text{Regular} \\subset \\text{DCFL} \\subset \\text{CFL} \\subset \\text{CSL} \\subset \\text{REC} \\subset \\text{RE}",
        notes: "Regular: Closed under ALL operations (Union, Intersect, Complement, Kleene, Diff). CFL: Closed under Union, Concat, Star; NOT closed under Intersection or Complement."
    },
    {
        id: "toc2",
        title: "Pumping Lemma for Regular Languages",
        subject: "toc",
        subjectName: "Theory of Computation",
        latex: "w = xyz, \\quad |y| \\ge 1, \\quad |xy| \\le p, \\quad xy^i z \\in L \\quad \\forall i \\ge 0",
        notes: "Used only to prove a language is NOT regular by contradiction."
    },

    // OPERATING SYSTEMS
    {
        id: "os1",
        title: "Virtual Memory & Effective Access Time",
        subject: "os",
        subjectName: "Operating Systems",
        latex: "EAT = h \\cdot (t_{\\text{TLB}} + t_m) + (1 - h) \\cdot (t_{\\text{TLB}} + (k + 1)t_m)",
        notes: "Where h = TLB hit ratio, t_TLB = TLB lookup time, t_m = memory access time, k = page table levels."
    },
    {
        id: "os2",
        title: "Disk Scheduling - Track Traversal",
        subject: "os",
        subjectName: "Operating Systems",
        latex: "\\text{Total Seek Time} = \\sum |T_{i} - T_{i-1}| \\times \\text{Seek Time per Cylinder}",
        notes: "SCAN (Elevator) goes to disk end; LOOK reverses at last request without going to the physical end."
    },
    {
        id: "os3",
        title: "Banker's Algorithm - Safety Criterion",
        subject: "os",
        subjectName: "Operating Systems",
        latex: "\\text{Need}[i][j] = \\text{Max}[i][j] - \\text{Allocation}[i][j] \\le \\text{Available}[j]",
        notes: "If Need <= Available, allocate and return Work = Work + Allocation."
    },

    // COMPUTER NETWORKS
    {
        id: "cn1",
        title: "Sliding Window - Efficiency",
        subject: "cn",
        subjectName: "Computer Networks",
        latex: "\\eta = \\frac{W}{1 + 2a}, \\quad \\text{where } a = \\frac{T_p}{T_t} = \\frac{\\text{Propagation Delay}}{\\text{Transmission Delay}}",
        notes: "For Stop-and-Wait (W=1): \\eta = \\frac{1}{1 + 2a}. Optimal window size for 100% efficiency is W = 1 + 2a."
    },
    {
        id: "cn2",
        title: "Throughput & Bandwidth-Delay Product",
        subject: "cn",
        subjectName: "Computer Networks",
        latex: "\\text{Throughput} = \\eta \\times \\text{Bandwidth}, \\quad \\text{BDP} = \\text{Bandwidth} \\times T_p",
        notes: "BDP represents the maximum number of bits in flight on the wire at any moment."
    },
    {
        id: "cn3",
        title: "IPv4 Subnetting & Usable Hosts",
        subject: "cn",
        subjectName: "Computer Networks",
        latex: "\\text{Usable Hosts} = 2^{32 - \\text{CIDR}} - 2",
        notes: "-2 accounts for Network ID (all 0s) and Directed Broadcast Address (all 1s)."
    },

    // ALGORITHMS & DATA STRUCTURES
    {
        id: "algo1",
        title: "Master Theorem for Divide & Conquer",
        subject: "algo",
        subjectName: "Algorithms",
        latex: "T(n) = a T(n/b) + \\Theta(n^k \\log^p n), \\quad c = \\log_b a",
        notes: "Case 1: If c > k, T(n) = Theta(n^c). Case 2: If c = k, T(n) = Theta(n^k log^(p+1) n). Case 3: If c < k, T(n) = Theta(n^k log^p n)."
    },
    {
        id: "algo2",
        title: "Binary Tree Nodes & Height Relation",
        subject: "algo",
        subjectName: "Data Structures",
        latex: "N_{\\text{max}} = 2^{h+1} - 1, \\quad N_{\\text{leaf}} = N_{\\text{deg2}} + 1",
        notes: "In any binary tree, number of leaf nodes (degree 0) is always 1 more than nodes with degree 2."
    },

    // DBMS
    {
        id: "db1",
        title: "B-Tree Order & Node Capacity",
        subject: "dbms",
        subjectName: "DBMS",
        latex: "\\text{Max Keys} = p - 1, \\quad \\text{Min Keys (Internal)} = \\lceil p/2 \\rceil - 1",
        notes: "Where p is the tree order (max children). Root must have at least 2 children (1 key)."
    },
    {
        id: "db2",
        title: "Normal Forms Checklist",
        subject: "dbms",
        subjectName: "DBMS",
        latex: "\\text{1NF} \\to \\text{2NF (No Partial FD)} \\to \\text{3NF (No Transitive FD)} \\to \\text{BCNF (LHS is Superkey)}",
        notes: "3NF is always lossless and dependency preserving. BCNF is always lossless but NOT always dependency preserving."
    }
];
