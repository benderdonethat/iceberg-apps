export default function FooterSection() {
  return (
    <footer className="border-t border-border py-14 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-semibold text-foreground">@icebergsampson</p>
        <p className="text-sm text-muted-foreground mt-2">Built by a non-dev. Powered by AI. One app at a time.</p>
        <div className="flex items-center justify-center gap-6 mt-6">
          <a href="https://instagram.com/icebergsampson" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center">Instagram</a>
          <a href="https://youtube.com/@icebergsampson" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center">YouTube</a>
          <a href="https://github.com/icebergsampson" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
