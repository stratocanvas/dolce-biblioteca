interface EpisodeLayoutProps {
  children: React.ReactNode
  params: {
    novelId: string
  }
}

export default function EpisodeLayout({ children }: EpisodeLayoutProps) {
  return <div className="bg-articleBackground">{children}</div>
}
