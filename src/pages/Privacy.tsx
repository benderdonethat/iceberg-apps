import { useScrollReveal } from "@/hooks/useScrollReveal";

const Privacy = () => {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">&larr; Back to Home</a>
        <h1 className="text-3xl font-bold text-foreground mt-8 mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p className="text-foreground font-medium">Last updated: April 9, 2026</p>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">What We Collect</h2>
            <p>When you sign up on freeslackapps.com, we collect your email address and your content preferences (releases, newsletter, prompts). That is it. We do not collect names, payment info, or browsing behavior beyond basic page views.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Slack Apps</h2>
            <p>When you install one of our free Slack apps, the app requests only the permissions it needs to function. Your workspace data stays in your workspace. We store a bot token (encrypted) to send messages on behalf of the app. We do not read, store, or sell your Slack messages, files, or user data.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">How We Use Your Email</h2>
            <p>We use your email to send you what you opted into: new app releases, our newsletter, and prompt packs. You can unsubscribe from any of these at any time by replying to the email or contacting us directly.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Analytics</h2>
            <p>We use Plausible Analytics, a privacy-friendly analytics tool that does not use cookies, does not track you across sites, and does not collect personal data. All data is aggregated. No individual visitor profiles are created.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Third Parties</h2>
            <p>We do not sell, rent, or share your data with anyone. Emails are sent through Resend. Slack apps run on Railway. The website is hosted on Vercel. None of these services receive more data than what is necessary to operate.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Data Encryption</h2>
            <p>All sensitive data stored by our Slack apps (bot tokens, article content in Sensei, platform API keys in Stream Line) is encrypted using AES-256-GCM before it touches the database. Database-level Row Level Security ensures that one workspace's data can never be accessed by another workspace, even in the event of an application-level bug.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Data Retention</h2>
            <p>Your data is stored for as long as your Slack app is installed. If you uninstall an app, your workspace is marked inactive but data is retained for 90 days in case you reinstall. After 90 days, data associated with inactive workspaces may be permanently deleted. Email subscriber data is retained until you unsubscribe.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">AI Features</h2>
            <p>Some of our apps use Claude (by Anthropic) for optional AI features such as answering questions, generating content, and converting threads to articles. AI responses are generated from your own data and may occasionally be inaccurate. We do not use your data to train any AI models. AI features can be disabled from each app's Setup menu. No data is sent to AI providers beyond what is needed to generate the specific response you requested.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Your Rights</h2>
            <p>You can request access to, transfer of, or deletion of your data at any time. To make a request, email iceberg@freeslackapps.com with your workspace name and the app in question. We will respond within 5 business days. If you uninstall the app from your Slack workspace, the bot token is immediately invalidated and the app can no longer access your workspace.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Contact</h2>
            <p>Questions about this policy? Email <a href="mailto:iceberg@freeslackapps.com" className="text-primary hover:underline">iceberg@freeslackapps.com</a>. We respond within 2 business days.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
