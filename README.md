
  # Math & Number Theory Concepts Visualizer

  This is a code bundle for Math Concepts Visualizer. The original project is available at https://www.figma.com/design/Ra0kweRvSPWs2cj63o5NwU/Math-Concepts-Visualizer.

# AlgoVis: Math & Number Theory Concepts Visualizer 🚀

## Overview
A single-page interactive web application designed to help competitive programmers and computer science students visualize complex algorithms step-by-step. The application simulates a real debugging experience, allowing users to trace code execution, understand internal states, and intuitively grasp Time and Space complexities.

## Key Features ✨
*   **Time-Travel Debugger (Step Forward & Backward):** 
    *   Press the **Down Arrow (⬇️)** key to step forward through the algorithm line-by-line.
    *   Press the **Up Arrow (⬆️)** key to step backwards and undo the last action using a custom state history stack.
*   **Interactive Visualizations:** Watch arrays and matrices update in real-time strictly synced with the C++ code execution.
*   **Side-by-Side UI:** A clean, dark-mode developer layout featuring a strict 50/50 split (Visualization Canvas on the left, C++ Code Tracker on the right).
*   **Dynamic UI Elements:** Includes operations counters, complexity trackers, and dynamic arrays (like the extracted SPF factors).

## Algorithms Included 🧮
1.  **Sieve of Eratosthenes:** Visualizes prime number generation and the crossing out of composites, demonstrating $O(N \log \log N)$ complexity.
2.  **Smallest Prime Factor (SPF):** 
    *   *Phase 1:* Demonstrates building the SPF array.
    *   *Phase 2:* Visualizes $O(\log N)$ fast prime factorization for multiple queries, extracting prime factors into a dynamic UI list.
3.  **Matrix Multiplication:** Traces the 3-nested loops of $O(N \times M \times P)$ matrix multiplication, highlighting row-by-column calculations dynamically.

## Live Demo 🌐
*(Add your live project link here, e.g., https://yourusername.github.io/Algorithm-Visualizer/)*

## Getting Started 🛠

To run this project locally on your machine, follow these steps:

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation & Running
1. Clone the repository:
   ```bash
   git clone [https://github.com/YourUsername/Algorithm-Visualizer.git](https://github.com/YourUsername/Algorithm-Visualizer.git)
   ```
2. Navigate to the project directory:
   ```bash
   cd Algorithm-Visualizer
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open your terminal and click on the local link provided (usually `http://localhost:5173` or `http://localhost:3000`) to view the application in your browser.

## Tech Stack 💻
*   **HTML5 & CSS3** (Extensive use of CSS Flexbox/Grid for precise, horizontal alignments)
*   **Vanilla JavaScript** (Custom state machines and history stacks for debugger logic)
*   **Node.js & npm** (For package management)
*   **Vite / Webpack** (Development server)

## Motivation 💡
This project was built to solidify the understanding of fundamental Number Theory and Linear Algebra algorithms used heavily in Competitive Programming and Problem Solving, providing visual proofs of their efficiency and behavior.
   
  
