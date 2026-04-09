import { useParams } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface PostContent {
  title: string;
  date: string;
  readTime: string;
  category: string;
  body: string;
}

const postContent: Record<string, PostContent> = {
  "why-free-slack-apps": {
    title: "Why We Build Free Slack Apps (And Give Them Away)",
    date: "April 9, 2026",
    readTime: "4 min",
    category: "Behind the Build",
    body: `Most Slack apps charge between $3 and $10 per user per month. For a team of 20, that is $60 to $200 a month for a single tool. Multiply that across 4 or 5 apps, and you are spending more on Slack integrations than you are on Slack itself.

We think that is backwards.

The apps we build at freeslackapps.com are free. Not freemium. Not "free for up to 3 users." Free. Every feature, every workspace, no credit card.

**How is that possible?**

We build with AI. The development cycle that used to take a team of engineers weeks now takes a single builder days. The cost of building software has collapsed, but the price of most SaaS has not caught up. We are closing that gap.

Every app is multi-tenant from day one. One deployment serves every workspace. The marginal cost of adding a new team is effectively zero. A database row, some encrypted tokens, and a welcome message.

**What is the catch?**

There is no catch, but there is a bet. We believe that giving away genuinely useful software builds something more valuable than subscription revenue: trust, distribution, and a front-row seat to what teams actually need.

When we see patterns across thousands of workspaces, we will know exactly what to build next. When we have distribution, we will have options. For now, the best version of this company is one that ships free tools that people actually use.

**What is next?**

We are shipping a new app every week. Stream Line for live sellers. Sensei for team knowledge bases. Invoice Pilot, Time Punch, Lead Catcher, and 25 more on the roadmap. Each one built to replace something you are currently paying for or doing manually in a spreadsheet.

If you want to follow the build, sign up on the home page. Pick what you want to hear about. We will only email you what you asked for.`,
  },
  "slack-app-vs-google-sheets": {
    title: "Your Team Is Using Google Sheets When They Should Be Using Slack",
    date: "April 9, 2026",
    readTime: "5 min",
    category: "Productivity",
    body: `Every team has at least one Google Sheet that has become mission-critical infrastructure. The sales tracker. The shift schedule. The inventory log. The "master sheet" that six people edit and nobody trusts.

Spreadsheets are infinitely flexible. That is both their superpower and their fatal flaw. They do not enforce structure. They do not send reminders. They do not know who changed what or why. And they live in a tab that nobody has open when the decision is actually being made.

Your team lives in Slack. That is where conversations happen, where decisions get made, and where work actually moves. When the tool lives where the work happens, adoption is not a problem. People use it because it is already there.

**What a Slack app does that a spreadsheet cannot**

A purpose-built Slack app gives you structured input. Instead of trusting someone to type a number in the right cell, they tap a button and fill out a form. The data goes where it belongs, formatted correctly, every time.

It gives you automation. Daily summaries, goal notifications, stale-data alerts. No one has to remember to check the sheet. The app brings the insight to the conversation.

It gives you context. When someone logs a sale in Stream Line, the app knows their history. It can compare this stream to the last five. It can tell them they are 80% to their weekly goal. A spreadsheet just shows a number.

**When to keep the spreadsheet**

If you need ad-hoc analysis, pivot tables, or one-time calculations, spreadsheets still win. They are great for exploration. They are terrible for repetitive team workflows.

**The switch is free**

Every Slack app on freeslackapps.com is free. If your team is tracking something in a spreadsheet and it involves more than one person, there is probably a better way. Check the catalog and see if we have already built it.`,
  },
  "stream-line-live-seller-guide": {
    title: "The Live Seller's Guide to Stream Line",
    date: "April 9, 2026",
    readTime: "6 min",
    category: "App Spotlight",
    body: `If you sell live on Whatnot, TikTok, eBay Live, or any other platform, you know the post-stream chaos. The show ends, the adrenaline fades, and you are left trying to remember what you sold, what the total was, and whether that stream was better or worse than last week.

Stream Line is a free Slack app that fixes this.

**What it does**

Stream Line lives in your Slack workspace. After a stream, you tap "Log Stream" and fill in the basics: platform, revenue, items sold, viewers. It takes about 30 seconds. From there, Stream Line does the rest.

Your App Home dashboard shows your running totals, trends, and performance over time. You can compare your last five streams side by side to see what is working and what is not. Set goals and get daily progress notifications at 6 PM so you always know where you stand.

**CSV import**

Already tracking in a spreadsheet? Stream Line auto-detects Whatnot, TikTok, and eBay CSV formats and imports your history. Upload once and your entire track record is in the app.

**Built for teams**

If you have multiple streamers, each person sees their own data while supervisors see everyone. Role-based access means streamers log their own streams and owners get the full picture.

**Why it is free**

Stream Line is part of freeslackapps.com. Every feature, every workspace, no charge. We built it because live selling is growing fast and the tools have not caught up. The options are either expensive SaaS or a messy spreadsheet. We wanted a third option.

**Get started**

Install Stream Line from freeslackapps.com. It takes under a minute. Log your first stream and you will see why spreadsheets were never the right tool for this.`,
  },
  "knowledge-base-slack-sensei": {
    title: "Stop Losing Answers in Slack Threads. Use Sensei.",
    date: "April 9, 2026",
    readTime: "5 min",
    category: "App Spotlight",
    body: `Someone on your team asked how to reset a client password. Three people answered in a thread. That thread is now buried under 400 messages. Next month, someone new asks the same question.

This happens in every Slack workspace. Institutional knowledge exists, but it is trapped in threads that no one can find. Sensei fixes this.

**What Sensei does**

Sensei is a free Slack knowledge base. You write articles, tag them, and organize them by channel. When someone has a question, they search Sensei instead of scrolling through threads or pinging the one person who "probably knows."

Every article supports markdown, templates, and tags. Five built-in templates (Meeting Notes, Project Spec, Troubleshooting, How-To Guide, Decision Log) make it easy to standardize how your team documents things.

**AI-powered answers**

When someone asks a question in a channel where Sensei is active, the app searches your knowledge base and responds with an answer based on your own articles. It cites which articles it used. It does not make things up.

You can also right-click any Slack thread and convert it to a knowledge base article with one click. Sensei uses AI to clean up the conversational fluff and format it into a structured article.

**Stale article detection**

Articles go stale. Sensei checks for articles that have not been updated in 30 days and DMs the author with three options: Update, Still Accurate, or Archive. Your knowledge base stays current without anyone having to remember to review it.

**Knowledge gap tracking**

When someone searches and gets zero results, Sensei tracks that. Your App Home shows the most common unanswered searches with a "Write This" button so you can fill the gaps.

**It is free**

No per-user fees. No limits on articles or workspaces. Sensei is part of freeslackapps.com. Install it, write your first article, and stop answering the same question twice.`,
  },
  "non-dev-building-slack-apps": {
    title: "I Am Not a Developer. I Have Shipped Two Slack Apps.",
    date: "April 9, 2026",
    readTime: "7 min",
    category: "Behind the Build",
    body: `I did not go to school for computer science. I have never had a job with "engineer" in the title. A year ago, if you asked me what PostgreSQL was, I would have guessed it was a type of database but could not have told you how to spell it.

Today, I have two production Slack apps serving real workspaces. Stream Line for live sellers and Sensei for team knowledge bases. Both are free, both are multi-tenant, both use encrypted databases and AI features. I built them with Claude.

**What "built with AI" actually means**

It does not mean I typed "make me a Slack app" and got a working product. It means I had a clear problem, broke it into pieces, and used AI as a development partner for every piece. I made every product decision. I chose every feature. I designed every interaction. The AI wrote the code. I directed the build.

Think of it like being an architect who does not lay bricks. You still need to know what a building should look like, how the rooms should connect, and where the load-bearing walls go. You just have a very fast construction crew.

**What I actually do**

I spend my time on product thinking. What does the user see first? What happens when they tap this button? What data do we need to store? What should the daily notification say? How do we handle a team with 3 people vs 50?

These are not engineering questions. They are product questions. And they are the questions that determine whether an app gets used or abandoned.

**The hard parts**

Shipping is still hard. Debugging is still frustrating. Deployment is still a series of things that can go wrong. I have spent entire nights fixing a bug that turned out to be a single misplaced character.

But the barrier to entry has fundamentally changed. You no longer need to know how to code to build software. You need to know how to think clearly about problems and communicate precisely about what you want.

**Why this matters**

There are millions of people who understand their industry better than any developer ever could. The live seller who knows exactly what metrics matter after a stream. The team lead who knows which questions get asked every week. The freelancer who knows which invoicing steps always get skipped.

These people have always had the product instinct. Now they can ship.

**What is next**

I am building a new free Slack app every week at freeslackapps.com. Each one solves a real problem for a specific audience. If you have an idea for one, sign up and reply to any email. I read all of them.`,
  },
};

const BlogPost = () => {
  useScrollReveal();
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? postContent[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <a href="/blog" className="text-primary hover:underline">Back to Blog</a>
        </div>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    "Behind the Build": "bg-purple-500/10 text-purple-400",
    "Productivity": "bg-blue-500/10 text-blue-400",
    "App Spotlight": "bg-emerald-500/10 text-emerald-400",
  };

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <a href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">&larr; Back to Blog</a>
        <div className="mt-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[post.category] || "bg-gray-500/10 text-gray-400"}`}>
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground">{post.date}</span>
            <span className="text-xs text-muted-foreground">{post.readTime}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-8">{post.title}</h1>
        </div>
        <div className="prose prose-invert max-w-none">
          {post.body.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              return <h2 key={i} className="text-lg font-semibold text-foreground mt-8 mb-3">{paragraph.replace(/\*\*/g, "")}</h2>;
            }
            const formatted = paragraph.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground">$1</strong>');
            return <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: formatted }} />;
          })}
        </div>
        <div className="mt-16 border-t border-border/50 pt-8 text-center">
          <p className="text-foreground font-semibold mb-2">Want more posts like this?</p>
          <p className="text-sm text-muted-foreground mb-4">Sign up on the home page and toggle "Newsletter" on.</p>
          <a href="/" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Sign Up Free</a>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
