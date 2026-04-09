import { useScrollReveal } from "@/hooks/useScrollReveal";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

const posts: BlogPost[] = [
  {
    slug: "why-free-slack-apps",
    title: "Why We Build Free Slack Apps (And Give Them Away)",
    excerpt: "Most Slack apps charge per user per month. We think the best productivity tools should be free. Here is the thinking behind freeslackapps.com and what we are building next.",
    date: "April 9, 2026",
    readTime: "4 min",
    category: "Behind the Build",
  },
  {
    slug: "slack-app-vs-google-sheets",
    title: "Your Team Is Using Google Sheets When They Should Be Using Slack",
    excerpt: "Spreadsheets are flexible. They are also where workflows go to die. Here is why purpose-built Slack apps beat shared spreadsheets for tracking, logging, and team coordination.",
    date: "April 9, 2026",
    readTime: "5 min",
    category: "Productivity",
  },
  {
    slug: "stream-line-live-seller-guide",
    title: "The Live Seller's Guide to Stream Line",
    excerpt: "If you sell on Whatnot, TikTok, or eBay Live, Stream Line was built for you. Track streams, compare performance, import CSVs, and set goals without leaving Slack.",
    date: "April 9, 2026",
    readTime: "6 min",
    category: "App Spotlight",
  },
  {
    slug: "knowledge-base-slack-sensei",
    title: "Stop Losing Answers in Slack Threads. Use Sensei.",
    excerpt: "Your team answers the same questions every week in Slack. Sensei turns those threads into a searchable knowledge base with AI-powered answers. Free.",
    date: "April 9, 2026",
    readTime: "5 min",
    category: "App Spotlight",
  },
  {
    slug: "non-dev-building-slack-apps",
    title: "I Am Not a Developer. I Have Shipped Two Slack Apps.",
    excerpt: "No CS degree. No bootcamp. Just Claude, a problem worth solving, and the stubbornness to ship. Here is what building software looks like when you are not a developer.",
    date: "April 9, 2026",
    readTime: "7 min",
    category: "Behind the Build",
  },
];

const categoryColors: Record<string, string> = {
  "Behind the Build": "bg-purple-500/10 text-purple-400",
  "Productivity": "bg-blue-500/10 text-blue-400",
  "App Spotlight": "bg-emerald-500/10 text-emerald-400",
};

const Blog = () => {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">&larr; Back to Home</a>
        <h1 className="text-3xl font-bold text-foreground mt-8 mb-4">Blog</h1>
        <p className="text-muted-foreground mb-12">How we build free Slack apps, why we give them away, and what is coming next.</p>

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group border border-border/50 rounded-lg p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer"
              onClick={() => window.location.href = `/blog/${post.slug}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[post.category] || "bg-gray-500/10 text-gray-400"}`}>
                  {post.category}
                </span>
                <span className="text-xs text-muted-foreground">{post.date}</span>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{post.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 border border-border/50 rounded-lg p-8 text-center">
          <p className="text-foreground font-semibold mb-2">Want the next post in your inbox?</p>
          <p className="text-sm text-muted-foreground mb-4">Sign up on the home page and toggle "Newsletter" on. That is it.</p>
          <a href="/" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Go Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Blog;
