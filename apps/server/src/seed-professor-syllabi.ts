import { config } from 'dotenv';
config();

import { PrismaService } from './prisma/prisma.service';
import { SemesterType } from '@prisma/client';

const prisma = new PrismaService();

export async function seedProfessorSyllabi() {
  console.log('🎓 Starting Professor Syllabi seeding...');

  try {
    // Find professor with email john.smith@isakwa.edu (or create one if needed)
    let professor = await prisma.user.findUnique({
      where: { email: 'john.smith@isakwa.edu' },
      include: {
        professorProfile: true
      }
    });

    if (!professor) {
      console.log('Professor not found, creating one...');
      // Get computer science department
      const department = await prisma.department.findFirst({
        where: { name: 'Computer Science' }
      });

      if (!department) {
        throw new Error('Computer Science department not found');
      }

      professor = await prisma.user.create({
        data: {
          email: 'john.smith@isakwa.edu',
          password: '$2b$10$rLY.HDJTSEjkVHZ3XKJQzOGSjR7Dx2U2BZKwVhHD5Y7qZPyE8XgLa', // professor123
          firstName: 'John',
          lastName: 'Smith',
          role: 'PROFESSOR',
          isActive: true,
          professorProfile: {
            create: {
              departmentId: department.id,
              title: 'Associate Professor',
              phoneNumber: '+381-11-123-4567',
              officeRoom: 'A-101',
              jmbg: '1234567890123'
            }
          }
        },
        include: {
          professorProfile: true
        }
      });
    }

    // Get or create study program
    let studyProgram = await prisma.studyProgram.findFirst({
      where: { name: 'Computer Science' }
    });

    if (!studyProgram) {
      const faculty = await prisma.faculty.findFirst({
        where: { name: 'Computer Science' }
      });

      if (!faculty) {
        throw new Error('Computer Science faculty not found');
      }

      studyProgram = await prisma.studyProgram.create({
        data: {
          name: 'Computer Science',
          code: 'CS',
          level: 'Bachelor',
          duration: 4,
          facultyId: faculty.id,
          description: 'Bachelor degree in Computer Science'
        }
      });
    }

    // Create or get subjects for professor
    const subjectsData = [
      {
        name: 'Data Structures and Algorithms',
        code: 'CS101',
        description: 'Comprehensive course covering fundamental data structures and algorithmic techniques',
        credits: 6,
        ects: 6,
        semester: 1,
        mandatory: true,
        numberOfLectures: 30,
        numberOfExercises: 15
      },
      {
        name: 'Object-Oriented Programming',
        code: 'CS201',
        description: 'Introduction to object-oriented programming concepts using Java',
        credits: 7,
        ects: 7,
        semester: 2,
        mandatory: true,
        numberOfLectures: 45,
        numberOfExercises: 30
      },
      {
        name: 'Database Systems',
        code: 'CS301',
        description: 'Database design, SQL, and database management systems',
        credits: 6,
        ects: 6,
        semester: 3,
        mandatory: true,
        numberOfLectures: 30,
        numberOfExercises: 30
      },
      {
        name: 'Web Development',
        code: 'CS401',
        description: 'Modern web development technologies and frameworks',
        credits: 5,
        ects: 5,
        semester: 4,
        mandatory: false,
        numberOfLectures: 30,
        numberOfExercises: 45
      }
    ];

    const subjects = [];
    for (const subjectData of subjectsData) {
      let subject = await prisma.subject.findUnique({
        where: { code: subjectData.code }
      });

      if (!subject) {
        subject = await prisma.subject.create({
          data: {
            ...subjectData,
            studyProgramId: studyProgram.id
          }
        });
      }

      // Assign professor to subject
      const existingAssignment = await prisma.professorAssignment.findFirst({
        where: {
          professorId: professor.id,
          subjectId: subject.id,
          academicYear: '2024/2025'
        }
      });

      if (!existingAssignment) {
        await prisma.professorAssignment.create({
          data: {
            professorId: professor.id,
            subjectId: subject.id,
            studyProgramId: studyProgram.id,
            academicYear: '2024/2025',
            teachingType: 'LECTURE',
            isActive: true
          }
        });
      }

      subjects.push(subject);
    }

    // Create detailed syllabi for each subject
    const syllabusTemplates = [
      {
        subject: 'Data Structures and Algorithms',
        title: 'Data Structures and Algorithms Syllabus',
        description: `This course introduces students to fundamental data structures and algorithms essential for computer science. Students will learn to analyze algorithmic complexity, implement various data structures, and apply appropriate algorithms for problem-solving. The course covers arrays, linked lists, stacks, queues, trees, graphs, and sorting/searching algorithms.`,
        objectives: `By the end of this course, students will be able to:
- Understand and implement fundamental data structures (arrays, linked lists, stacks, queues, trees, graphs)
- Analyze time and space complexity using Big O notation
- Apply appropriate algorithms for sorting and searching
- Design efficient solutions for computational problems
- Understand advanced data structures like heaps, hash tables, and balanced trees`,
        topics: [
          { title: 'Introduction to Algorithms and Complexity Analysis', description: 'Big O notation, time and space complexity, algorithm analysis techniques', weekNumber: 1 },
          { title: 'Arrays and Dynamic Arrays', description: 'Array operations, dynamic arrays, vector implementation', weekNumber: 2 },
          { title: 'Linked Lists', description: 'Singly linked lists, doubly linked lists, circular lists', weekNumber: 3 },
          { title: 'Stacks and Queues', description: 'Stack operations, queue operations, priority queues', weekNumber: 4 },
          { title: 'Recursion and Divide & Conquer', description: 'Recursive algorithms, divide and conquer strategy', weekNumber: 5 },
          { title: 'Trees and Binary Trees', description: 'Tree terminology, binary tree operations, tree traversals', weekNumber: 6 },
          { title: 'Binary Search Trees', description: 'BST properties, insertion, deletion, searching', weekNumber: 7 },
          { title: 'Balanced Trees (AVL, Red-Black)', description: 'Self-balancing trees, rotations, balanced tree properties', weekNumber: 8 },
          { title: 'Heaps and Priority Queues', description: 'Heap properties, heap operations, heapsort', weekNumber: 9 },
          { title: 'Hash Tables', description: 'Hash functions, collision resolution, hash table implementation', weekNumber: 10 },
          { title: 'Graphs - Representation and Traversal', description: 'Graph representations, BFS, DFS algorithms', weekNumber: 11 },
          { title: 'Graph Algorithms', description: 'Shortest path algorithms, minimum spanning trees', weekNumber: 12 },
          { title: 'Sorting Algorithms', description: 'Bubble sort, selection sort, insertion sort, merge sort, quicksort', weekNumber: 13 },
          { title: 'Advanced Topics and Applications', description: 'Dynamic programming, greedy algorithms, real-world applications', weekNumber: 14 },
          { title: 'Review and Final Exam Preparation', description: 'Course review, practice problems, exam preparation', weekNumber: 15 }
        ],
        materials: [
          { title: 'Introduction to Algorithms (CLRS)', description: 'Primary textbook by Cormen, Leiserson, Rivest, and Stein' },
          { title: 'Lecture Slides - Data Structures', description: 'Comprehensive slides covering all data structures topics' },
          { title: 'Programming Assignments', description: 'Hands-on coding exercises for each data structure' },
          { title: 'Algorithm Visualization Tools', description: 'Interactive tools to visualize algorithm execution' }
        ]
      },
      {
        subject: 'Object-Oriented Programming',
        title: 'Object-Oriented Programming with Java Syllabus',
        description: `This course provides a comprehensive introduction to object-oriented programming (OOP) concepts using Java. Students will learn the fundamental principles of OOP including encapsulation, inheritance, polymorphism, and abstraction. The course emphasizes practical programming skills through hands-on projects and assignments.`,
        objectives: `Upon completion of this course, students will be able to:
- Understand and apply object-oriented programming principles
- Design and implement Java applications using OOP concepts
- Utilize inheritance, polymorphism, and encapsulation effectively
- Work with Java collections framework and exception handling
- Develop GUI applications using JavaFX or Swing
- Apply design patterns to solve common programming problems`,
        topics: [
          { title: 'Introduction to Java and OOP', description: 'Java basics, OOP principles, development environment setup', weekNumber: 1 },
          { title: 'Classes and Objects', description: 'Class definition, object instantiation, constructors, methods', weekNumber: 2 },
          { title: 'Encapsulation and Data Hiding', description: 'Access modifiers, getters and setters, information hiding', weekNumber: 3 },
          { title: 'Inheritance and Method Overriding', description: 'Class inheritance, super keyword, method overriding', weekNumber: 4 },
          { title: 'Polymorphism and Abstract Classes', description: 'Runtime polymorphism, abstract classes, virtual methods', weekNumber: 5 },
          { title: 'Interfaces and Multiple Inheritance', description: 'Interface definition, implementation, multiple inheritance through interfaces', weekNumber: 6 },
          { title: 'Exception Handling', description: 'Try-catch blocks, custom exceptions, exception hierarchy', weekNumber: 7 },
          { title: 'Java Collections Framework', description: 'List, Set, Map interfaces, ArrayList, HashMap, TreeSet', weekNumber: 8 },
          { title: 'Generics and Type Safety', description: 'Generic classes, methods, type parameters, wildcards', weekNumber: 9 },
          { title: 'File I/O and Serialization', description: 'File handling, input/output streams, object serialization', weekNumber: 10 },
          { title: 'Multithreading and Concurrency', description: 'Thread creation, synchronization, concurrent collections', weekNumber: 11 },
          { title: 'GUI Development with JavaFX', description: 'Scene graphs, event handling, FXML, CSS styling', weekNumber: 12 },
          { title: 'Design Patterns', description: 'Singleton, Factory, Observer, MVC patterns', weekNumber: 13 },
          { title: 'Final Project Development', description: 'Comprehensive OOP project development and presentation', weekNumber: 14 },
          { title: 'Course Review and Assessment', description: 'Final project presentations, course review, exam preparation', weekNumber: 15 }
        ],
        materials: [
          { title: 'Head First Java', description: 'Beginner-friendly Java programming textbook' },
          { title: 'Effective Java by Joshua Bloch', description: 'Best practices for Java programming' },
          { title: 'Java Programming Exercises', description: 'Progressive coding exercises and solutions' },
          { title: 'JavaFX Tutorial Materials', description: 'Comprehensive GUI development resources' }
        ]
      },
      {
        subject: 'Database Systems',
        title: 'Database Systems and SQL Syllabus',
        description: `This course covers the fundamental concepts of database systems, including data modeling, database design, SQL programming, and database management. Students will learn to design efficient databases, write complex SQL queries, and understand database internals including indexing, transactions, and concurrency control.`,
        objectives: `Students completing this course will be able to:
- Design normalized relational databases using ER modeling
- Write complex SQL queries for data retrieval and manipulation
- Understand database internals including storage, indexing, and query optimization
- Implement database applications with proper transaction management
- Work with both SQL and NoSQL database technologies
- Apply database security and backup/recovery procedures`,
        topics: [
          { title: 'Introduction to Database Systems', description: 'Database concepts, DBMS architecture, data models', weekNumber: 1 },
          { title: 'Entity-Relationship Modeling', description: 'ER diagrams, entities, attributes, relationships, constraints', weekNumber: 2 },
          { title: 'Relational Model and Normalization', description: 'Relational algebra, functional dependencies, normal forms', weekNumber: 3 },
          { title: 'SQL Basics - DDL and DML', description: 'Creating tables, data types, INSERT, UPDATE, DELETE operations', weekNumber: 4 },
          { title: 'Advanced SQL Queries', description: 'JOINs, subqueries, aggregate functions, window functions', weekNumber: 5 },
          { title: 'Database Design Process', description: 'Requirements analysis, conceptual design, logical design', weekNumber: 6 },
          { title: 'Indexing and Query Optimization', description: 'B+ trees, hash indexing, query execution plans', weekNumber: 7 },
          { title: 'Transaction Management', description: 'ACID properties, concurrency control, locking mechanisms', weekNumber: 8 },
          { title: 'Database Recovery and Backup', description: 'Failure types, recovery algorithms, backup strategies', weekNumber: 9 },
          { title: 'Stored Procedures and Triggers', description: 'PL/SQL programming, stored procedures, database triggers', weekNumber: 10 },
          { title: 'Database Security', description: 'Access control, SQL injection prevention, encryption', weekNumber: 11 },
          { title: 'NoSQL Databases', description: 'Document stores, key-value stores, graph databases', weekNumber: 12 },
          { title: 'Database Administration', description: 'Performance tuning, monitoring, maintenance tasks', weekNumber: 13 },
          { title: 'Database Project Implementation', description: 'Hands-on database project development', weekNumber: 14 },
          { title: 'Final Project Presentation and Review', description: 'Project presentations, course review, final assessment', weekNumber: 15 }
        ],
        materials: [
          { title: 'Database System Concepts by Silberschatz', description: 'Comprehensive database systems textbook' },
          { title: 'SQL Practice Problems', description: 'Extensive SQL query exercises and solutions' },
          { title: 'MySQL/PostgreSQL Documentation', description: 'Official database system documentation' },
          { title: 'Database Design Case Studies', description: 'Real-world database design examples' }
        ]
      },
      {
        subject: 'Web Development',
        title: 'Modern Web Development Syllabus',
        description: `This course introduces students to modern web development technologies and practices. Students will learn both front-end and back-end development, working with HTML5, CSS3, JavaScript, and popular frameworks. The course emphasizes practical skills through project-based learning and modern development workflows.`,
        objectives: `By completing this course, students will be able to:
- Create responsive and interactive web applications using modern technologies
- Develop both client-side and server-side components of web applications
- Use popular JavaScript frameworks and libraries (React, Node.js)
- Implement RESTful APIs and work with databases in web applications
- Apply modern development practices including version control and testing
- Deploy web applications to cloud platforms`,
        topics: [
          { title: 'Web Development Fundamentals', description: 'HTTP protocol, web architecture, development environment setup', weekNumber: 1 },
          { title: 'HTML5 and Semantic Markup', description: 'Modern HTML elements, forms, multimedia, accessibility', weekNumber: 2 },
          { title: 'CSS3 and Responsive Design', description: 'Flexbox, Grid, media queries, mobile-first design', weekNumber: 3 },
          { title: 'JavaScript Fundamentals', description: 'ES6+ features, DOM manipulation, event handling', weekNumber: 4 },
          { title: 'Asynchronous JavaScript', description: 'Promises, async/await, fetch API, AJAX', weekNumber: 5 },
          { title: 'Introduction to React', description: 'Components, JSX, props, state management', weekNumber: 6 },
          { title: 'Advanced React Concepts', description: 'Hooks, context API, routing, component lifecycle', weekNumber: 7 },
          { title: 'Node.js and Express.js', description: 'Server-side JavaScript, routing, middleware', weekNumber: 8 },
          { title: 'RESTful API Development', description: 'API design, HTTP methods, status codes, authentication', weekNumber: 9 },
          { title: 'Database Integration', description: 'MongoDB, SQL databases, ORMs, data modeling', weekNumber: 10 },
          { title: 'Authentication and Security', description: 'JWT tokens, password hashing, CORS, security best practices', weekNumber: 11 },
          { title: 'Testing and Development Tools', description: 'Unit testing, integration testing, build tools, bundlers', weekNumber: 12 },
          { title: 'Deployment and DevOps', description: 'Cloud deployment, CI/CD, containerization with Docker', weekNumber: 13 },
          { title: 'Final Project Development', description: 'Full-stack web application development', weekNumber: 14 },
          { title: 'Project Presentations and Course Review', description: 'Final project demos, peer review, course wrap-up', weekNumber: 15 }
        ],
        materials: [
          { title: 'MDN Web Docs', description: 'Comprehensive web development documentation and tutorials' },
          { title: 'React Official Documentation', description: 'Official React.js documentation and guides' },
          { title: 'Node.js and Express.js Tutorials', description: 'Backend development learning materials' },
          { title: 'Web Development Best Practices Guide', description: 'Industry standards and coding conventions' }
        ]
      }
    ];

    let syllabusCreated = 0;

    for (const template of syllabusTemplates) {
      const subject = subjects.find(s => s.name === template.subject);
      if (!subject) {
        console.warn(`Subject not found: ${template.subject}`);
        continue;
      }

      // Check if syllabus already exists
      const existingSyllabus = await prisma.syllabus.findFirst({
        where: {
          subjectId: subject.id,
          academicYear: '2024/2025'
        }
      });

      if (existingSyllabus) {
        console.log(`Syllabus already exists for ${template.subject}`);
        continue;
      }

      // Create syllabus
      const syllabus = await prisma.syllabus.create({
        data: {
          subjectId: subject.id,
          title: template.title,
          description: template.description,
          objectives: template.objectives,
          academicYear: '2024/2025',
          createdBy: professor.id,
          isActive: true
        }
      });

      // Create syllabus topics
      for (let i = 0; i < template.topics.length; i++) {
        const topic = template.topics[i];
        await prisma.syllabusTopic.create({
          data: {
            syllabusId: syllabus.id,
            title: topic.title,
            description: topic.description,
            weekNumber: topic.weekNumber,
            createdBy: professor.id,
            isActive: true
          }
        });
      }

      // Create syllabus materials
      for (const material of template.materials) {
        await prisma.syllabusMaterial.create({
          data: {
            syllabusId: syllabus.id,
            title: material.title,
            description: material.description,
            filePath: `/materials/${subject.code}/${material.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
            createdBy: professor.id,
            isActive: true
          }
        });
      }

      syllabusCreated++;
      console.log(`Syllabus created for ${template.subject} (${subject.code})`);
    }

    console.log(`Professor Syllabi seeding completed! Created ${syllabusCreated} syllabi for Professor ${professor.firstName} ${professor.lastName}.`);
    
    return {
      professorEmail: professor.email,
      syllabusCreated,
      subjectsAssigned: subjects.length
    };

  } catch (error) {
    console.error('Error during Professor Syllabi seeding:', error);
    throw error;
  }
}

// Run if this file is executed directly
async function main() {
  try {
    const results = await seedProfessorSyllabi();
    console.log('Seeding results:', results);
  } catch (error) {
    console.error('Failed to seed professor syllabi:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Check if this file is being run directly
if (require.main === module) {
  main();
}
