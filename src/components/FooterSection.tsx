export default function FooterSection() {
  return (
    <footer className="border-t border-border/50 py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg font-bold text-foreground">@icebergsampson</p>
        <p className="text-sm text-muted-foreground mt-2">Built by a non-dev. Powered by AI. One app at a time.</p>
        <div className="flex items-center justify-center gap-8 mt-8">
          <a href="/prompts" className="text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center">Prompts</a>
          <a href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center">Blog</a>
          <a href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center">Privacy</a>
          <a href="https://instagram.com/icebergsampson" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center">Instagram</a>
          <a href="https://youtube.com/@manplusbrain" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center">YouTube</a>
          <a href="https://github.com/benderdonethat" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center">GitHub</a>
        </div>
        <p className="text-xs text-muted-foreground/50 mt-8">© {new Date().getFullYear()} Iceberg Sampson. All rights reserved.</p>
      </div>
    </footer>
  );
}
