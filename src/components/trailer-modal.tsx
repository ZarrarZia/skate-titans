'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type TrailerModalProps = {
  children: React.ReactNode;
};

export function TrailerModal({ children }: TrailerModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Game Trailer</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          <iframe
            className="h-full w-full rounded-lg"
            src="https://www.youtube.com/embed/S3pZkL9v-dY?autoplay=1&mute=1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
