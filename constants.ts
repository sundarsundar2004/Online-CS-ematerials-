import { Subject } from './types';

export const SUBJECTS: Subject[] = [
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Master the fundamental building blocks of efficient software.',
    iconName: 'Binary',
    topics: [
      { id: 'arrays', title: 'Arrays & Strings', prompt: 'Explain Arrays and Strings in computer science, focusing on memory layout, common operations (insertion, deletion, access), and time complexity. Provide code examples in Python and C++.' },
      { id: 'linked-lists', title: 'Linked Lists', prompt: 'Explain Singly and Doubly Linked Lists. Compare them with arrays. Implement a basic Node class and traversal logic in Python.' },
      { id: 'trees', title: 'Trees & Graphs', prompt: 'Introduction to Trees (Binary Trees, BST) and Graphs (BFS, DFS). specific focus on traversal algorithms with visual descriptions.' },
      { id: 'sorting', title: 'Sorting Algorithms', prompt: 'Detailed comparison of Quick Sort, Merge Sort, and Bubble Sort. Include Big-O notation analysis for best, average, and worst cases.' },
    ]
  },
  {
    id: 'web-dev',
    title: 'Modern Web Development',
    description: 'Full-stack technologies from React to Node.js.',
    iconName: 'Globe',
    topics: [
      { id: 'dom', title: 'The DOM & Events', prompt: 'What is the Document Object Model? Explain how the browser renders HTML and how Event Bubbling/Capturing works in JavaScript.' },
      { id: 'react-hooks', title: 'React Hooks Deep Dive', prompt: 'Explain the React Hook lifecycle. Deep dive into useState, useEffect, and useMemo with practical examples of preventing re-renders.' },
      { id: 'rest-graphql', title: 'REST vs GraphQL', prompt: 'Compare RESTful API architecture with GraphQL. Discuss over-fetching, under-fetching, and endpoint management.' },
      { id: 'auth', title: 'Authentication (JWT/OAuth)', prompt: 'Explain modern web authentication flows. detailed explanation of JWT structure and OAuth 2.0 handshake steps.' },
    ]
  },
  {
    id: 'ai-ml',
    title: 'Artificial Intelligence',
    description: 'Neural networks, LLMs, and machine learning basics.',
    iconName: 'Brain',
    topics: [
      { id: 'neural-nets', title: 'Neural Networks 101', prompt: 'Explain the basic structure of a Neural Network: Neurons, Weights, Biases, and Activation Functions (ReLU, Sigmoid).' },
      { id: 'transformers', title: 'Transformers & LLMs', prompt: 'How do Transformer models work? Explain the Attention Mechanism (Self-Attention) simply without complex math.' },
      { id: 'supervised', title: 'Supervised Learning', prompt: 'Define Supervised Learning. Explain Regression vs Classification problems with real-world examples.' },
    ]
  },
  {
    id: 'db',
    title: 'Database Systems',
    description: 'SQL, NoSQL, and data modeling strategies.',
    iconName: 'Database',
    topics: [
      { id: 'sql-basics', title: 'SQL Fundamentals', prompt: 'Core SQL commands: SELECT, INSERT, UPDATE, DELETE. Explain Joins (INNER, LEFT, RIGHT, FULL) with Venn diagram descriptions.' },
      { id: 'normalization', title: 'Normalization', prompt: 'Explain Database Normalization (1NF, 2NF, 3NF). Why do we do it? What are the trade-offs?' },
      { id: 'acid', title: 'ACID Properties', prompt: 'Define ACID (Atomicity, Consistency, Isolation, Durability) in the context of relational database transactions.' },
    ]
  }
];

export const INITIAL_GREETING = "## Welcome to CS OmniLearn \nSelect a subject from the dashboard to begin your learning journey. \n\nOur AI-powered platform generates custom, up-to-date e-materials for every topic.";
