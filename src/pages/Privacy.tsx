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
            <p>All sensitive data stored by our Slack apps (bot tokens, article content in Sensei) is encrypted using AES-256-GCM before it touches the database.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Contact</h2>
            <p>Questions about this policy? Reach out at iceberg@freeslackapps.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
