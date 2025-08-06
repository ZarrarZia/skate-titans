import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Twitter, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tighter">Skate Titans</span>
          </Link>
          <p className="text-muted-foreground">The ultimate endless runner experience.</p>
          <div className="flex gap-2">
            <Link href="#"><Button variant="ghost" size="icon"><Twitter /></Button></Link>
            <Link href="#"><Button variant="ghost" size="icon"><Instagram /></Button></Link>
            <Link href="#"><Button variant="ghost" size="icon"><Facebook /></Button></Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
            <li><Link href="/characters" className="text-muted-foreground hover:text-primary">Characters</Link></li>
            <li><Link href="/leaderboard" className="text-muted-foreground hover:text-primary">Leaderboard</Link></li>
            <li><Link href="/download" className="text-muted-foreground hover:text-primary">Download</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Support</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Newsletter</h3>
          <p className="mb-4 text-muted-foreground">Get the latest news and updates.</p>
          <form className="flex gap-2">
            <Input type="email" placeholder="Enter your email" />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="container mx-auto flex items-center justify-center px-4 py-4 md:px-6">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Skate Titans. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
