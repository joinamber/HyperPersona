
import { 
  Code, 
  Globe, 
  Layers, 
  Zap, 
  Shield, 
  Database, 
  Smartphone, 
  Cpu, 
  Server
} from 'lucide-react';

export interface Slide {
  id: number;
  title: string;
  content: React.ReactNode;
  background?: string;
  contentType?: 'code' | 'diagram' | 'features' | 'title' | 'text';
}

export const architectureDiagramData = {
  nodes: [
    { id: 'client', label: 'Client', x: 150, y: 100, color: '#4f46e5' },
    { id: 'api', label: 'API', x: 350, y: 100, color: '#0f766e' },
    { id: 'db', label: 'Database', x: 550, y: 100, color: '#b45309' },
    { id: 'cache', label: 'Cache', x: 350, y: 200, color: '#be123c' },
    { id: 'cdn', label: 'CDN', x: 150, y: 200, color: '#4d7c0f' },
  ],
  edges: [
    { from: 'client', to: 'api', animated: true },
    { from: 'api', to: 'db', animated: true },
    { from: 'api', to: 'cache', animated: true, dashed: true },
    { from: 'client', to: 'cdn', animated: true },
  ]
};

export const components = [
  { 
    icon: <Code className="h-5 w-5 text-indigo-300" />, 
    title: "Clean Code", 
    description: "Write readable, maintainable code with clear patterns and separation of concerns." 
  },
  { 
    icon: <Zap className="h-5 w-5 text-yellow-300" />, 
    title: "Performance", 
    description: "Optimize for speed with code splitting, lazy loading, and efficient algorithms." 
  },
  { 
    icon: <Shield className="h-5 w-5 text-red-300" />, 
    title: "Security", 
    description: "Protect against common attacks with proper validation, sanitization and authentication." 
  },
  { 
    icon: <Smartphone className="h-5 w-5 text-green-300" />, 
    title: "Responsive Design", 
    description: "Create interfaces that work seamlessly across all devices and screen sizes." 
  },
  { 
    icon: <Database className="h-5 w-5 text-blue-300" />, 
    title: "Data Management", 
    description: "Implement efficient state management with tools like Redux, Context API, or React Query." 
  },
  { 
    icon: <Cpu className="h-5 w-5 text-purple-300" />, 
    title: "Testing", 
    description: "Ensure reliability with unit, integration, and end-to-end tests for critical paths." 
  },
];

export const codeExamples = {
  components: `// Bad: Monolithic component
function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch data, handle events, manage state, render UI
  // All in one large component
  // ...
}

// Good: Composable components with separation of concerns
function UserDashboard() {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <UserDataProvider>
        <DashboardLayout>
          <UserStats />
          <UserTable />
          <UserActions />
        </DashboardLayout>
      </UserDataProvider>
    </ErrorBoundary>
  );
}`,

  performance: `// Bad: Rendering entire list on each change
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Good: Memoizing components to avoid unnecessary re-renders
const UserItem = memo(({ user }) => (
  <li>{user.name}</li>
));

function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  );
}`,

  hooks: `// Custom hook for API data fetching with loading, error states
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(\`API error: \${response.status}\`);
        }
        
        const result = await response.json();
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [url]);
  
  return { data, loading, error };
}`
};

export const mobileFirstCode = `// Mobile-first media queries using Tailwind
function ResponsiveLayout() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-4">
        <h2 className="text-lg md:text-xl lg:text-2xl">Card Title</h2>
        <p className="mt-2 text-sm md:text-base">Card content that adjusts size based on screen</p>
      </Card>
      
      {/* More cards... */}
    </div>
  );
}`;

export const accessibilityCode = `// Accessibility improvements
function SearchForm() {
  return (
    <form role="search" aria-label="Site search">
      <label htmlFor="search" className="sr-only">Search</label>
      <input 
        id="search"
        type="search"
        placeholder="Search..."
        aria-required="true"
      />
      <button
        type="submit"
        aria-label="Submit search"
      >
        <SearchIcon className="h-4 w-4" />
      </button>
    </form>
  );
}`;

export const slides: Slide[] = [
  {
    id: 1,
    title: "Modern Web Development Best Practices",
    content: "A Guide For Today's Web Developers",
    background: "bg-gradient-to-br from-indigo-800 via-violet-900 to-purple-800",
    contentType: 'title'
  },
  {
    id: 2,
    title: "Why Best Practices Matter",
    content: [
      "• Reduces technical debt",
      "• Improves maintainability",
      "• Increases development velocity",
      "• Ensures better user experience",
      "• Makes scaling your application easier",
      "• Facilitates team collaboration"
    ],
    background: "bg-gradient-to-r from-teal-700 to-emerald-900",
    contentType: 'text'
  },
  {
    id: 3,
    title: "Component Architecture",
    content: codeExamples.components,
    background: "bg-gradient-to-br from-gray-900 to-slate-800",
    contentType: 'code'
  },
  {
    id: 4,
    title: "Performance Optimization",
    content: codeExamples.performance,
    background: "bg-gradient-to-br from-gray-900 to-slate-800",
    contentType: 'code'
  },
  {
    id: 5,
    title: "Custom Hooks for Reusability",
    content: codeExamples.hooks,
    background: "bg-gradient-to-br from-gray-900 to-slate-800",
    contentType: 'code'
  },
  {
    id: 6,
    title: "Modern Application Architecture",
    content: "architectureDiagram",
    background: "bg-gradient-to-br from-blue-900 to-indigo-900",
    contentType: 'diagram'
  },
  {
    id: 7,
    title: "Core Principles of Modern Web Dev",
    content: "features",
    background: "bg-gradient-to-br from-purple-900 to-indigo-900",
    contentType: 'features'
  },
  {
    id: 8,
    title: "Mobile-First Approach",
    content: mobileFirstCode,
    background: "bg-gradient-to-br from-gray-900 to-slate-800",
    contentType: 'code'
  },
  {
    id: 9,
    title: "Accessibility Is Not Optional",
    content: accessibilityCode,
    background: "bg-gradient-to-br from-gray-900 to-slate-800",
    contentType: 'code'
  },
  {
    id: 10,
    title: "Key Takeaways",
    content: [
      "• Separate concerns with composable components",
      "• Optimize for performance at every level",
      "• Make your code reusable and testable",
      "• Think mobile-first and responsive design",
      "• Always consider accessibility",
      "• Use modern state management techniques",
      "• Test early and often"
    ],
    background: "bg-gradient-to-r from-amber-700 to-orange-800",
    contentType: 'text'
  },
  {
    id: 11,
    title: "Thank You!",
    content: "Questions?",
    background: "bg-gradient-to-br from-green-700 to-emerald-900",
    contentType: 'title'
  }
];
