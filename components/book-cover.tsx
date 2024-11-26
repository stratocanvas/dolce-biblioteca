interface BookCoverProps {
  title: string
  writer: string
}

export default function BookCover({ title, writer }: BookCoverProps) {
  return (
    <div className="flex-shrink-0 mx-auto md:mx-0">
      <div className="w-48 h-64 relative rounded-lg overflow-hidden shadow-xl">
        <div className="absolute left-0 top-0 w-4 h-full bg-zinc-700" />
        <div className="absolute left-4 right-0 top-0 bottom-0 bg-zinc-200">
          <div className="p-4 h-full flex flex-col justify-between">
            <div className="text-zinc-800 text-lg font-bold break-words">
              {title}
            </div>
            <div className="text-zinc-500 text-sm">{writer}</div>
          </div>
          <div className="absolute top-0 left-0 w-full h-2 bg-white/10" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-black/20" />
        </div>
      </div>
    </div>
  )
}
