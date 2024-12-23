export interface BookCoverProps {
  title: string
  writer: string
  genre:
    | 'default'
    | '아비도스'
    | '게헨나'
    | '밀레니엄'
    | '트리니티'
    | '백귀야행'
    | '산해경'
    | '붉은겨울'
    | '아리우스'
    | '발키리'
    | '총학생회'
}
export const genreStyles = {
    default: {
      background: 'bg-zinc-100',
      spine: 'from-zinc-200',
      title: 'text-zinc-800',
      writer: 'text-zinc-600',
      titleFont: 'var(--font-sans)',
      writerFont: 'var(--font-sans)',
      decoration: '',
      pattern: '',
      overlay: '',
    },
    아비도스: {
      background: 'bg-sky-50 dark:bg-sky-950',
      spine: 'from-sky-200 dark:from-sky-900',
      title: 'text-slate-800 dark:text-slate-200',
      writer: 'text-slate-600 dark:text-slate-400',
      titleFont: 'var(--font-serif)',
      writerFont: 'var(--font-serif)',
      decoration: `
        before:absolute before:inset-4
        before:border before:border-sky-200/70 dark:before:border-sky-700/70
        after:absolute after:inset-8
        after:border after:border-sky-300/50 dark:after:border-sky-800/50

        [&>div>div]:relative [&>div>div]:z-10

        [&_div.decoration]:absolute [&_div.decoration]:inset-0
        [&_div.decoration]:before:absolute [&_div.decoration]:before:top-6 
        [&_div.decoration]:before:left-1/2 [&_div.decoration]:before:-translate-x-1/2
        [&_div.decoration]:before:w-16 [&_div.decoration]:before:h-16
        [&_div.decoration]:before:border-2 [&_div.decoration]:before:border-sky-300/40 dark:before:border-sky-700/40
        [&_div.decoration]:before:rotate-45 [&_div.decoration]:before:scale-y-50

        [&_div.lines]:absolute [&_div.lines]:inset-0
        [&_div.lines]:before:content-['𓂀'] [&_div.lines]:before:absolute
        [&_div.lines]:before:top-24 [&_div.lines]:before:left-6
        [&_div.lines]:before:text-sky-400/60 dark:before:text-sky-600/60 [&_div.lines]:before:text-lg

        [&_div.lines]:after:content-['𓃭'] [&_div.lines]:after:absolute
        [&_div.lines]:after:bottom-8 [&_div.lines]:after:right-6
        [&_div.lines]:after:text-sky-400/60 dark:after:text-sky-600/60 [&_div.lines]:after:text-lg

        [&_div.shapes]:absolute [&_div.shapes]:inset-0
        [&_div.shapes]:before:content-[''] [&_div.shapes]:before:absolute
        [&_div.shapes]:before:top-1/2 [&_div.shapes]:before:left-1/2
        [&_div.shapes]:before:-translate-x-1/2 [&_div.shapes]:before:-translate-y-1/2
        [&_div.shapes]:before:w-24 [&_div.shapes]:before:h-24
        [&_div.shapes]:before:border [&_div.shapes]:before:border-sky-200/30 dark:before:border-sky-700/30
        [&_div.shapes]:before:rotate-45 [&_div.shapes]:before:scale-y-[0.6]

        [&_div.dots]:absolute [&_div.dots]:inset-0
        [&_div.dots]:before:content-['●'] [&_div.dots]:before:absolute
        [&_div.dots]:before:top-16 [&_div.dots]:before:right-8
        [&_div.dots]:before:text-[8px] [&_div.dots]:before:text-sky-300/60 dark:before:text-sky-700/60

        [&_div.dots]:after:content-['●'] [&_div.dots]:after:absolute
        [&_div.dots]:after:bottom-16 [&_div.dots]:after:left-8
        [&_div.dots]:after:text-[8px] [&_div.dots]:after:text-sky-300/60 dark:after:text-sky-700/60
      `,
      pattern: `
        after:absolute after:inset-0
        after:bg-[radial-gradient(circle_at_30%_20%,transparent_85%,rgb(14_165_233_/_0.05))] dark:after:bg-[radial-gradient(circle_at_30%_20%,transparent_85%,rgb(14_165_233_/_0.1))]
        after:[mask-image:repeating-linear-gradient(45deg,#000_0px,#000_1px,transparent_1px,transparent_8px)]
        after:bg-[linear-gradient(135deg,transparent_70%,rgb(14_165_233_/_0.1))] dark:after:bg-[linear-gradient(135deg,transparent_70%,rgb(14_165_233_/_0.15))]
        after:bg-[url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230ea5e9' fill-opacity='0.07' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")]
      `,
      overlay: 'from-transparent via-transparent to-sky-100/30 dark:to-sky-900/30',
    },
    게헨나: {
      background: 'bg-neutral-800 dark:bg-neutral-900',
      spine: 'from-red-950 dark:from-red-900',
      title: 'text-red-50 dark:text-red-100',
      writer: 'text-red-200 dark:text-red-300',
      titleFont: 'var(--font-sans)',
      writerFont: 'var(--font-sans)',
      decoration: `
        before:absolute before:inset-4
        before:border before:border-red-900/50 dark:before:border-red-800/50
        before:rotate-[0.8deg]
        after:absolute after:top-0 after:right-0 
        after:w-20 after:h-1 after:bg-red-600/80 dark:after:bg-red-700/80
        after:-rotate-[2deg]

        [&>div>div]:relative [&>div>div]:z-10

        [&_div.decoration]:absolute [&_div.decoration]:inset-0
        [&_div.decoration]:before:absolute [&_div.decoration]:before:bottom-12 
        [&_div.decoration]:before:left-8 [&_div.decoration]:before:w-16 
        [&_div.decoration]:before:h-[1px] [&_div.decoration]:before:bg-red-700/40 dark:before:bg-red-600/40
        [&_div.decoration]:before:rotate-[8deg]
        
        [&_div.decoration]:after:absolute [&_div.decoration]:after:top-16
        [&_div.decoration]:after:right-6 [&_div.decoration]:after:w-12
        [&_div.decoration]:after:h-[1px] [&_div.decoration]:after:bg-red-700/40 dark:after:bg-red-600/40
        [&_div.decoration]:after:-rotate-[12deg]

        [&_div.lines]:absolute [&_div.lines]:inset-0
        [&_div.lines]:before:content-[''] [&_div.lines]:before:absolute
        [&_div.lines]:before:top-[30%] [&_div.lines]:before:right-3
        [&_div.lines]:before:w-8 [&_div.lines]:before:h-[1px]
        [&_div.lines]:before:bg-red-600/60 dark:before:bg-red-500/60
        [&_div.lines]:before:rotate-[15deg]

        [&_div.lines]:after:content-[''] [&_div.lines]:after:absolute
        [&_div.lines]:after:bottom-[40%] [&_div.lines]:after:left-4
        [&_div.lines]:after:w-10 [&_div.lines]:after:h-[1px]
        [&_div.lines]:after:bg-red-600/60 dark:after:bg-red-500/60
        [&_div.lines]:after:-rotate-[18deg]

        [&_div.shapes]:absolute [&_div.shapes]:inset-0
        [&_div.shapes]:before:content-[''] [&_div.shapes]:before:absolute
        [&_div.shapes]:before:top-8 [&_div.shapes]:before:right-8
        [&_div.shapes]:before:w-3 [&_div.shapes]:before:h-3
        [&_div.shapes]:before:border-2 [&_div.shapes]:before:border-red-700/40 dark:before:border-red-600/40
        [&_div.shapes]:before:rotate-[25deg]

        [&_div.shapes]:after:content-[''] [&_div.shapes]:after:absolute
        [&_div.shapes]:after:bottom-10 [&_div.shapes]:after:left-6
        [&_div.shapes]:after:w-4 [&_div.shapes]:after:h-4
        [&_div.shapes]:after:border [&_div.shapes]:after:border-red-700/40 dark:after:border-red-600/40
        [&_div.shapes]:after:-rotate-[15deg]

        [&_div.dots]:absolute [&_div.dots]:inset-0
        [&_div.dots]:before:content-['•'] [&_div.dots]:before:absolute
        [&_div.dots]:before:top-[45%] [&_div.dots]:before:right-4
        [&_div.dots]:before:text-red-600/70 dark:before:text-red-500/70 [&_div.dots]:before:text-lg

        [&_div.dots]:after:content-['•'] [&_div.dots]:after:absolute
        [&_div.dots]:after:bottom-[35%] [&_div.dots]:after:left-8
        [&_div.dots]:after:text-red-600/70 dark:after:text-red-500/70 [&_div.dots]:after:text-lg
      `,
      pattern: `
        after:absolute after:inset-0
        after:bg-[radial-gradient(circle_at_30%_70%,transparent_85%,rgb(220_38_38_/_0.15))] dark:after:bg-[radial-gradient(circle_at_30%_70%,transparent_85%,rgb(220_38_38_/_0.2))]
        after:bg-[linear-gradient(45deg,transparent_85%,rgb(220_38_38_/_0.2))] dark:after:bg-[linear-gradient(45deg,transparent_85%,rgb(220_38_38_/_0.25))]
        after:[mask-image:repeating-linear-gradient(45deg,#000_0px,#000_1px,transparent_1px,transparent_3px)]
        after:bg-[radial-gradient(circle_at_70%_30%,transparent_90%,rgb(220_38_38_/_0.1))] dark:after:bg-[radial-gradient(circle_at_70%_30%,transparent_90%,rgb(220_38_38_/_0.15))]
      `,
      overlay: 'from-transparent via-transparent to-neutral-900/40 dark:to-neutral-950/50',
    },
    밀레니엄: {
      background: 'bg-slate-50 dark:bg-slate-900',
      spine: 'from-blue-600 dark:from-blue-800',
      title: 'text-slate-900 dark:text-slate-100',
      writer: 'text-blue-900 dark:text-blue-300',
      titleFont: 'var(--font-sans)',
      writerFont: 'var(--font-sans)',
      decoration: `
        before:absolute before:inset-4
        before:border before:border-blue-400/30 dark:before:border-blue-500/30
        before:rounded-lg
        after:absolute after:bottom-6 after:right-6
        after:w-12 after:h-12
        after:border-2 after:border-blue-500/40 dark:after:border-blue-600/40
        after:rounded-full
        [&>div]:before:absolute [&>div]:before:top-6
        [&>div]:before:left-6 [&>div]:before:w-8
        [&>div]:before:h-8 [&>div]:before:border
        [&>div]:before:border-blue-400/30 dark:before:border-blue-500/30
        [&>div]:before:rotate-45
        [&>div]:after:absolute [&>div]:after:top-1/2
        [&>div]:after:left-4 [&>div]:after:w-16
        [&>div]:after:h-[1px] [&>div]:after:bg-blue-400/40 dark:after:bg-blue-500/40
        [&>div]:after:content-[''] [&>div]:after:absolute
        [&>div]:after:top-8 [&>div]:after:right-4
        [&>div]:after:w-3 [&>div]:after:h-3
        [&>div]:after:border [&>div]:after:border-blue-500/30 dark:after:border-blue-600/30
        [&>div]:after:rotate-45
        [&>div]:before:content-[''] [&>div]:before:absolute
        [&>div]:before:bottom-12 [&>div]:before:right-8
        [&>div]:before:w-16 [&>div]:before:h-[1px]
        [&>div]:before:bg-blue-400/30 dark:before:bg-blue-500/30 [&>div]:before:-rotate-45

        [&_div.shapes]:absolute [&_div.shapes]:inset-0
        [&_div.shapes]:after:content-[''] [&_div.shapes]:after:absolute
        [&_div.shapes]:after:bottom-4 [&_div.shapes]:after:right-4
        [&_div.shapes]:after:w-24 [&_div.shapes]:after:h-[3px]
        [&_div.shapes]:after:bg-blue-500/40 dark:after:bg-blue-600/40
        [&_div.shapes]:after:rotate-[-35deg]
      `,
      pattern: `
        after:absolute after:inset-0
        after:bg-[linear-gradient(135deg,transparent_70%,rgb(59_130_246_/_0.1))] dark:after:bg-[linear-gradient(135deg,transparent_70%,rgb(59_130_246_/_0.15))]
        after:bg-[radial-gradient(circle_at_30%_20%,transparent_85%,rgb(59_130_246_/_0.15))] dark:after:bg-[radial-gradient(circle_at_30%_20%,transparent_85%,rgb(59_130_246_/_0.2))]
        after:[mask-image:repeating-linear-gradient(135deg,#000_0px,#000_1px,transparent_1px,transparent_4px)]
        after:bg-[radial-gradient(circle_at_70%_80%,transparent_85%,rgb(59_130_246_/_0.1))] dark:after:bg-[radial-gradient(circle_at_70%_80%,transparent_85%,rgb(59_130_246_/_0.15))]
      `,
      overlay: 'from-transparent via-transparent to-slate-100/30 dark:to-slate-950/40',
    },
    트리니티: {
      background: 'bg-cream-50 dark:bg-slate-900',
      spine: 'from-amber-100 dark:from-amber-900',
      title: 'text-slate-800 dark:text-amber-100',
      writer: 'text-slate-600 dark:text-amber-300/70',
      titleFont: 'var(--font-serif)',
      writerFont: 'var(--font-serif)',
      decoration: `
        before:absolute before:inset-4
        before:border before:border-amber-300/40 dark:before:border-amber-500/30
        before:rounded-sm
        after:absolute after:inset-8
        after:border after:border-amber-400/30 dark:after:border-amber-600/20
        after:rounded-sm

        [&>div>div]:relative [&>div>div]:z-10

        [&_div.decoration]:absolute [&_div.decoration]:inset-0
        [&_div.decoration]:before:absolute [&_div.decoration]:before:top-6 
        [&_div.decoration]:before:left-1/2 [&_div.decoration]:before:-translate-x-1/2
        [&_div.decoration]:before:w-20 [&_div.decoration]:before:h-[1px]
        [&_div.decoration]:before:bg-amber-300/40 dark:before:bg-amber-500/30

        [&_div.decoration]:after:absolute [&_div.decoration]:after:bottom-6
        [&_div.decoration]:after:left-1/2 [&_div.decoration]:after:-translate-x-1/2
        [&_div.decoration]:after:w-20 [&_div.decoration]:after:h-[1px]
        [&_div.decoration]:after:bg-amber-300/40 dark:after:bg-amber-500/30

        [&_div.lines]:absolute [&_div.lines]:inset-0
        [&_div.lines]:before:absolute [&_div.lines]:before:top-[calc(50%-16px)]
        [&_div.lines]:before:left-4 [&_div.lines]:before:right-4
        [&_div.lines]:before:h-[1px] [&_div.lines]:before:bg-amber-200/30 dark:before:bg-amber-500/20

        [&_div.lines]:after:absolute [&_div.lines]:after:top-[calc(50%+16px)]
        [&_div.lines]:after:left-4 [&_div.lines]:after:right-4
        [&_div.lines]:after:h-[1px] [&_div.lines]:after:bg-amber-200/30 dark:after:bg-amber-500/20

        [&_div.shapes]:absolute [&_div.shapes]:inset-0
        [&_div.shapes]:before:absolute [&_div.shapes]:before:top-12
        [&_div.shapes]:before:left-1/2 [&_div.shapes]:before:-translate-x-1/2
        [&_div.shapes]:before:w-8 [&_div.shapes]:before:h-8
        [&_div.shapes]:before:border [&_div.shapes]:before:border-amber-300/40 dark:before:border-amber-500/30
        [&_div.shapes]:before:rotate-45

        [&_div.shapes]:after:absolute [&_div.shapes]:after:bottom-12
        [&_div.shapes]:after:left-1/2 [&_div.shapes]:after:-translate-x-1/2
        [&_div.shapes]:after:w-8 [&_div.shapes]:after:h-8
        [&_div.shapes]:after:border [&_div.shapes]:after:border-amber-300/40 dark:after:border-amber-500/30
        [&_div.shapes]:after:rotate-45

        [&_div.dots]:absolute [&_div.dots]:inset-0
        [&_div.dots]:before:absolute [&_div.dots]:before:top-1/2
        [&_div.dots]:before:left-6 [&_div.dots]:before:-translate-y-1/2
        [&_div.dots]:before:w-2 [&_div.dots]:before:h-2
        [&_div.dots]:before:border [&_div.dots]:before:border-amber-400/40 dark:before:border-amber-500/30
        [&_div.dots]:before:rounded-full

        [&_div.dots]:after:absolute [&_div.dots]:after:top-1/2
        [&_div.dots]:after:right-6 [&_div.dots]:after:-translate-y-1/2
        [&_div.dots]:after:w-2 [&_div.dots]:after:h-2
        [&_div.dots]:after:border [&_div.dots]:after:border-amber-400/40 dark:after:border-amber-500/30
        [&_div.dots]:after:rounded-full
      `,
      pattern: `
        after:absolute after:inset-0
        after:bg-[linear-gradient(135deg,transparent_80%,rgb(251_191_36_/_0.1))] dark:after:bg-[linear-gradient(135deg,transparent_80%,rgb(251_191_36_/_0.15))]
        after:bg-[radial-gradient(circle_at_30%_20%,transparent_90%,rgb(251_191_36_/_0.08))] dark:after:bg-[radial-gradient(circle_at_30%_20%,transparent_90%,rgb(251_191_36_/_0.12))]
        after:[mask-image:repeating-linear-gradient(45deg,#000_0px,#000_1px,transparent_1px,transparent_12px)]
        after:bg-[url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0l12 12-12 12L0 12 12 0zm2 12l-2-2-2 2 2 2 2-2z' fill='%23f59e0b' fill-opacity='0.03'/%3E%3C/svg%3E")] dark:after:bg-[url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0l12 12-12 12L0 12 12 0zm2 12l-2-2-2 2 2 2 2-2z' fill='%23f59e0b' fill-opacity='0.06'/%3E%3C/svg%3E")]
      `,
      overlay: 'from-transparent via-transparent to-amber-50/30 dark:to-amber-900/30',
    },
    백귀야행: {
      background: 'bg-pink-50 dark:bg-pink-950',
      spine: 'from-pink-200 dark:from-pink-800',
      title: 'text-slate-800 dark:text-slate-200',
      writer: 'text-slate-700 dark:text-slate-400',
      titleFont: 'var(--font-serif)',
      writerFont: 'var(--font-serif)',
      decoration: `
        before:absolute before:inset-4
        before:border before:border-pink-200 dark:before:border-pink-700
        after:absolute after:inset-8
        after:border after:border-pink-300/30 dark:after:border-pink-600/30

        [&>div>div]:relative [&>div>div]:z-10

        [&_div.decoration]:absolute [&_div.decoration]:inset-0
        [&_div.decoration]:before:absolute [&_div.decoration]:before:top-4 
        [&_div.decoration]:before:left-4 [&_div.decoration]:before:w-3 
        [&_div.decoration]:before:h-3 [&_div.decoration]:before:rounded-full
        [&_div.decoration]:before:border [&_div.decoration]:before:border-pink-300/70 dark:before:border-pink-600/70
        
        [&_div.decoration]:after:absolute [&_div.decoration]:after:bottom-4 
        [&_div.decoration]:after:right-4 [&_div.decoration]:after:w-3 
        [&_div.decoration]:after:h-3 [&_div.decoration]:after:rounded-full
        [&_div.decoration]:after:border [&_div.decoration]:after:border-pink-300/70 dark:after:border-pink-600/70

        [&_div.decoration]:before:content-['●'] 
        [&_div.decoration]:before:absolute
        [&_div.decoration]:before:text-[8px] 
        [&_div.decoration]:before:text-pink-300/70 dark:before:text-pink-600/70
        [&_div.decoration]:before:top-12 
        [&_div.decoration]:before:left-8

        [&_div.decoration]:after:content-['●'] 
        [&_div.decoration]:after:absolute
        [&_div.decoration]:after:text-[8px] 
        [&_div.decoration]:after:text-pink-300/70 dark:after:text-pink-600/70
        [&_div.decoration]:after:bottom-12 
        [&_div.decoration]:after:right-8

        [&_div.lines]:absolute [&_div.lines]:inset-0
        [&_div.lines]:before:content-[''] 
        [&_div.lines]:before:absolute
        [&_div.lines]:before:top-8 
        [&_div.lines]:before:left-1/2
        [&_div.lines]:before:w-16 
        [&_div.lines]:before:h-[1px]
        [&_div.lines]:before:bg-pink-200/40 dark:before:bg-pink-700/40
        [&_div.lines]:before:rotate-[-45deg]

        [&_div.lines]:after:content-[''] 
        [&_div.lines]:after:absolute
        [&_div.lines]:after:bottom-8 
        [&_div.lines]:after:right-1/2
        [&_div.lines]:after:w-16 
        [&_div.lines]:after:h-[1px]
        [&_div.lines]:after:bg-pink-200/40 dark:after:bg-pink-700/40
        [&_div.lines]:after:rotate-[-45deg]

        [&_div.circles]:absolute [&_div.circles]:inset-0
        [&_div.circles]:before:content-[''] 
        [&_div.circles]:before:absolute
        [&_div.circles]:before:top-1/2 
        [&_div.circles]:before:left-6
        [&_div.circles]:before:w-2 
        [&_div.circles]:before:h-2
        [&_div.circles]:before:rounded-full 
        [&_div.circles]:before:bg-pink-200/60 dark:before:bg-pink-700/60

        [&_div.circles]:after:content-[''] 
        [&_div.circles]:after:absolute
        [&_div.circles]:after:bottom-1/2 
        [&_div.circles]:after:right-6
        [&_div.circles]:after:w-2 
        [&_div.circles]:after:h-2
        [&_div.circles]:after:rounded-full 
        [&_div.circles]:after:bg-pink-200/60 dark:after:bg-pink-700/60
      `,
      pattern: `
        after:absolute after:inset-0
        after:bg-[radial-gradient(circle_at_20%_20%,rgb(252_231_243)_0%,transparent_35%)] dark:after:bg-[radial-gradient(circle_at_20%_20%,rgb(253_164_175)_0%,transparent_35%)]
        after:bg-[radial-gradient(circle_at_80%_80%,rgb(252_231_243)_0%,transparent_35%)] dark:after:bg-[radial-gradient(circle_at_80%_80%,rgb(253_164_175)_0%,transparent_35%)]
        after:[mask-image:repeating-linear-gradient(135deg,#000_0px,#000_1px,transparent_1px,transparent_12px)]
        after:bg-[radial-gradient(circle_at_50%_50%,rgb(252_231_243)_0%,transparent_25%)] dark:after:bg-[radial-gradient(circle_at_50%_50%,rgb(253_164_175)_0%,transparent_25%)]
      `,
      overlay: 'from-transparent via-transparent to-pink-100/20 dark:to-pink-950/30',
    },
    산해경: {
      background: 'bg-neutral-900',
      spine: 'from-neutral-950',
      title: 'text-amber-200',
      writer: 'text-amber-400/70',
      titleFont: 'var(--font-serif)',
      writerFont: 'var(--font-serif)',
      decoration: `
        before:absolute before:inset-4
        before:border before:border-amber-500/10
        after:absolute after:inset-8
        after:border after:border-amber-400/5
        [&>div]:before:absolute [&>div]:before:top-6 
        [&>div]:before:right-6 [&>div]:before:w-12 
        [&>div]:before:h-12 [&>div]:before:border 
        [&>div]:before:border-amber-400/20
        [&>div]:before:rotate-45
        [&>div]:after:absolute [&>div]:after:bottom-6 
        [&>div]:after:left-6 [&>div]:after:w-16 
        [&>div]:after:h-[1px] [&>div]:after:bg-amber-400/20
      `,
      pattern: `
        after:absolute after:inset-0
        after:bg-[radial-gradient(circle_at_30%_20%,transparent_85%,rgb(23_23_23_/_0.8))]
        after:bg-[linear-gradient(135deg,transparent_75%,rgb(245_158_11_/_0.1))]
        after:[mask-image:repeating-linear-gradient(135deg,#000_0px,#000_1px,transparent_1px,transparent_4px)]
      `,
      overlay: 'from-transparent via-transparent to-neutral-950/50',
    },
    붉은겨울: {
      background: 'bg-slate-50 dark:bg-slate-900',
      spine: 'from-red-700 dark:from-red-800',
      title: 'text-slate-900 dark:text-slate-100',
      writer: 'text-slate-700 dark:text-slate-300',
      titleFont: 'var(--font-sans)',
      writerFont: 'var(--font-sans)',
      decoration: `
        before:absolute before:inset-4
        before:border before:border-red-300/50 dark:before:border-red-700/50
        after:absolute after:top-0 after:left-0
        after:border-t-[40px] after:border-l-[40px]
        after:border-t-red-200/30 after:border-l-transparent dark:after:border-t-red-800/30

        [&>div>div]:relative [&>div>div]:z-10

        [&_div.decoration]:absolute [&_div.decoration]:inset-0
        [&_div.decoration]:before:absolute [&_div.decoration]:before:top-6
        [&_div.decoration]:before:left-6 [&_div.decoration]:before:w-4
        [&_div.decoration]:before:h-4 [&_div.decoration]:before:border
        [&_div.decoration]:before:border-red-400/50 dark:before:border-red-600/50 [&_div.decoration]:before:rotate-45

        [&_div.decoration]:after:absolute [&_div.decoration]:after:bottom-6
        [&_div.decoration]:after:right-6 [&_div.decoration]:after:w-4
        [&_div.decoration]:after:h-4 [&_div.decoration]:after:border
        [&_div.decoration]:after:border-red-400/50 dark:before:border-red-600/50 [&_div.decoration]:after:rotate-45

        [&_div.lines]:absolute [&_div.lines]:inset-0
        [&_div.lines]:before:content-['★'] [&_div.lines]:before:absolute
        [&_div.lines]:before:top-8 [&_div.lines]:before:left-1/2
        [&_div.lines]:before:text-red-400/40 dark:before:text-red-600/40 [&_div.lines]:before:text-lg

        [&_div.lines]:after:content-['★'] [&_div.lines]:after:absolute
        [&_div.lines]:after:bottom-8 [&_div.lines]:after:right-8
        [&_div.lines]:after:text-red-400/40 dark:after:text-red-600/40 [&_div.lines]:after:text-sm

        [&_div.shapes]:absolute [&_div.shapes]:inset-0
        [&_div.shapes]:before:content-['❄'] [&_div.shapes]:before:absolute
        [&_div.shapes]:before:top-12 [&_div.shapes]:before:right-10
        [&_div.shapes]:before:text-slate-300/40 dark:before:text-slate-600/40 [&_div.shapes]:before:text-sm

        [&_div.shapes]:after:content-['❄'] [&_div.shapes]:after:absolute
        [&_div.shapes]:after:bottom-16 [&_div.shapes]:after:left-8
        [&_div.shapes]:after:text-slate-300/40 dark:after:text-slate-600/40 [&_div.shapes]:after:text-xs

        [&_div.dots]:absolute [&_div.dots]:inset-0
        [&_div.dots]:before:absolute [&_div.dots]:before:top-1/2
        [&_div.dots]:before:left-0 [&_div.dots]:before:w-full
        [&_div.dots]:before:h-[1px] [&_div.dots]:before:bg-red-400/30 dark:before:bg-red-600/30

        [&_div.dots]:after:absolute [&_div.dots]:after:top-[calc(50%+8px)]
        [&_div.dots]:after:left-0 [&_div.dots]:after:w-full
        [&_div.dots]:after:h-[1px] [&_div.dots]:after:bg-red-400/20 dark:after:bg-red-600/20
      `,
      pattern: `
        after:absolute after:inset-0
        after:bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255)_0%,transparent_60%)] dark:after:bg-[radial-gradient(circle_at_30%_20%,rgb(185_28_28)_0%,transparent_60%)]
        after:bg-[linear-gradient(45deg,transparent_85%,rgb(185_28_28_/_0.1))] dark:after:bg-[linear-gradient(45deg,transparent_85%,rgb(239_68_68_/_0.1))]
        after:[mask-image:repeating-radial-gradient(circle_at_center,#000_0px,#000_1px,transparent_1px,transparent_6px)]
        after:bg-[linear-gradient(180deg,transparent_80%,rgb(241_245_249_/_0.3))] dark:after:bg-[linear-gradient(180deg,transparent_80%,rgb(15_23_42_/_0.3))]
      `,
      overlay: 'from-transparent via-transparent to-slate-100/50 dark:to-slate-950/50',
    },
    아리우스: {
      background: 'bg-slate-950',
      spine: 'from-slate-900',
      title: 'text-slate-300',
      writer: 'text-slate-500',
      titleFont: 'var(--font-serif)',
      writerFont: 'var(--font-serif)',
      decoration: `
        before:absolute before:inset-4
        before:border before:border-slate-800
        before:rotate-[0.5deg]
        after:absolute after:inset-8
        after:border after:border-slate-800/50
        after:-rotate-[0.25deg]
        [&>div]:before:absolute [&>div]:before:bottom-6 
        [&>div]:before:right-6 [&>div]:before:w-12 
        [&>div]:before:h-12 [&>div]:before:border-b 
        [&>div]:before:border-r [&>div]:before:border-slate-800/70
      `,
      pattern: `
        after:absolute after:inset-0
        after:bg-[radial-gradient(circle_at_30%_20%,transparent_85%,rgb(15_23_42_/_0.8))]
        after:bg-[linear-gradient(135deg,transparent_75%,rgb(51_65_85_/_0.1))]
        after:[mask-image:repeating-linear-gradient(135deg,#000_0px,#000_1px,transparent_1px,transparent_4px)]
      `,
      overlay: 'from-transparent via-transparent to-slate-950/50',
    },
    발키리: {
      background: 'bg-violet-50 dark:bg-violet-950',
      spine: 'from-violet-100 dark:from-violet-900',
      title: 'text-violet-800 dark:text-violet-200',
      writer: 'text-violet-600 dark:text-violet-400',
      titleFont: 'var(--font-sans)',
      writerFont: 'var(--font-sans)',
      decoration: `
        before:absolute before:inset-4
        before:border-2 before:border-violet-200 dark:before:border-violet-700
        before:rounded-lg before:rotate-[0.5deg]
        after:absolute after:inset-6
        after:border after:border-dashed after:border-violet-300/70 dark:after:border-violet-600/70
        after:rounded-lg after:-rotate-[0.25deg]

        [&>div>div]:relative [&>div>div]:z-10

        [&_div.decoration]:absolute [&_div.decoration]:inset-0
        [&_div.decoration]:before:absolute [&_div.decoration]:before:top-0 
        [&_div.decoration]:before:left-0 [&_div.decoration]:before:w-24 
        [&_div.decoration]:before:h-[1px] [&_div.decoration]:before:bg-violet-300/50 dark:before:bg-violet-600/50
        [&_div.decoration]:before:rotate-[-35deg] [&_div.decoration]:before:translate-y-8
        
        [&_div.decoration]:after:absolute [&_div.decoration]:after:bottom-0 
        [&_div.decoration]:after:right-0 [&_div.decoration]:after:w-24 
        [&_div.decoration]:after:h-[1px] [&_div.decoration]:after:bg-violet-300/50 dark:after:bg-violet-600/50
        [&_div.decoration]:after:rotate-[-35deg] [&_div.decoration]:after:-translate-y-8

        [&_div.lines]:absolute [&_div.lines]:inset-0
        [&_div.lines]:before:content-[''] [&_div.lines]:before:absolute
        [&_div.lines]:before:top-6 [&_div.lines]:before:right-6
        [&_div.lines]:before:w-12 [&_div.lines]:before:h-12
        [&_div.lines]:before:border [&_div.lines]:before:border-violet-300/40 dark:before:border-violet-600/40
        [&_div.lines]:before:rotate-[35deg]

        [&_div.lines]:after:content-[''] [&_div.lines]:after:absolute
        [&_div.lines]:after:bottom-6 [&_div.lines]:after:left-6
        [&_div.lines]:after:w-12 [&_div.lines]:after:h-12
        [&_div.lines]:after:border [&_div.lines]:after:border-violet-300/40 dark:after:border-violet-600/40
        [&_div.lines]:after:rotate-[35deg]

        [&_div.angles]:absolute [&_div.angles]:inset-0
        [&_div.angles]:before:content-[''] [&_div.angles]:before:absolute
        [&_div.angles]:before:top-1/2 [&_div.angles]:before:left-4
        [&_div.angles]:before:w-3 [&_div.angles]:before:h-3
        [&_div.angles]:before:border-t [&_div.angles]:before:border-l
        [&_div.angles]:before:border-violet-300/60 dark:before:border-violet-600/60
        [&_div.angles]:before:rotate-[-45deg]

        [&_div.angles]:after:content-[''] [&_div.angles]:after:absolute
        [&_div.angles]:after:top-1/2 [&_div.angles]:after:right-4
        [&_div.angles]:after:w-3 [&_div.angles]:after:h-3
        [&_div.angles]:after:border-t [&_div.angles]:after:border-r
        [&_div.angles]:after:border-violet-300/60 dark:after:border-violet-600/60
        [&_div.angles]:after:rotate-[45deg]
      `,
      pattern: `
        after:absolute after:inset-0
        after:bg-[radial-gradient(circle_at_50%_50%,rgb(237_233_254_/_0.5)_0%,transparent_70%)] dark:after:bg-[radial-gradient(circle_at_50%_50%,rgb(139_92_246_/_0.1)_0%,transparent_70%)]
        after:bg-[linear-gradient(45deg,transparent_90%,rgb(237_233_254_/_0.3))] dark:after:bg-[linear-gradient(45deg,transparent_90%,rgb(139_92_246_/_0.15))]
        after:[mask-image:repeating-linear-gradient(45deg,#000_0px,#000_1px,transparent_1px,transparent_8px)]
        after:[mask-image:repeating-linear-gradient(-45deg,#000_0px,#000_1px,transparent_1px,transparent_8px)]
      `,
      overlay: 'from-violet-50/30 via-transparent to-violet-100/40 dark:from-violet-900/30 dark:via-transparent dark:to-violet-950/40',
    },
    총학생회: {
      background: 'bg-white dark:bg-slate-900',
      spine: 'from-blue-500 dark:from-blue-800',
      title: 'text-blue-900 dark:text-blue-100',
      writer: 'text-blue-700 dark:text-blue-300',
      titleFont: 'var(--font-sans)',
      writerFont: 'var(--font-sans)',
      decoration: `
        before:absolute before:inset-4
        before:border-2 before:border-blue-200 dark:before:border-blue-700
        before:rounded-md
        after:absolute after:inset-8
        after:border after:border-pink-200/30 dark:after:border-pink-400/20

        [&>div>div]:relative [&>div>div]:z-10

        [&_div.decoration]:absolute [&_div.decoration]:inset-0
        [&_div.decoration]:before:content-[''] [&_div.decoration]:before:absolute
        [&_div.decoration]:before:top-1/2 [&_div.decoration]:before:left-1/2
        [&_div.decoration]:before:-translate-x-1/2 [&_div.decoration]:before:-translate-y-1/2
        [&_div.decoration]:before:w-12 [&_div.decoration]:before:h-12
        [&_div.decoration]:before:border-2 [&_div.decoration]:before:border-blue-400 dark:before:border-blue-600
        [&_div.decoration]:before:rounded-full
        [&_div.decoration]:before:opacity-60

        [&_div.lines]:absolute [&_div.lines]:inset-0
        [&_div.lines]:before:content-[''] [&_div.lines]:before:absolute
        [&_div.lines]:before:top-1/2 [&_div.lines]:before:left-1/2
        [&_div.lines]:before:-translate-x-1/2 [&_div.lines]:before:-translate-y-1/2
        [&_div.lines]:before:w-16 [&_div.lines]:before:h-[1px]
        [&_div.lines]:before:bg-gradient-to-r [&_div.lines]:before:from-transparent
        [&_div.lines]:before:via-blue-400 dark:before:via-blue-500
        [&_div.lines]:before:to-transparent
        [&_div.lines]:before:opacity-80
        [&_div.lines]:before:shadow-[0_0_8px_rgba(59,130,246,0.6)]

        [&_div.lines]:after:content-[''] [&_div.lines]:after:absolute
        [&_div.lines]:after:top-1/2 [&_div.lines]:after:left-1/2
        [&_div.lines]:after:-translate-x-1/2 [&_div.lines]:after:-translate-y-1/2
        [&_div.lines]:after:w-[1px] [&_div.lines]:after:h-16
        [&_div.lines]:after:bg-gradient-to-b [&_div.lines]:after:from-transparent
        [&_div.lines]:after:via-blue-400 dark:after:via-blue-500
        [&_div.lines]:after:to-transparent
        [&_div.lines]:after:opacity-80
        [&_div.lines]:after:shadow-[0_0_8px_rgba(59,130,246,0.6)]

        [&_div.shapes]:absolute [&_div.shapes]:inset-0
        [&_div.shapes]:before:content-[''] [&_div.shapes]:before:absolute
        [&_div.shapes]:before:top-1/2 [&_div.shapes]:before:left-1/2
        [&_div.shapes]:before:-translate-x-1/2 [&_div.shapes]:before:-translate-y-1/2
        [&_div.shapes]:before:w-24 [&_div.shapes]:before:h-24
        [&_div.shapes]:before:border [&_div.shapes]:before:border-blue-400/30 dark:before:border-blue-600/30
        [&_div.shapes]:before:rounded-full

        [&_div.dots]:absolute [&_div.dots]:inset-0
        [&_div.dots]:before:content-[''] [&_div.dots]:before:absolute
        [&_div.dots]:before:top-8 [&_div.dots]:before:right-8
        [&_div.dots]:before:w-3 [&_div.dots]:before:h-3
        [&_div.dots]:before:rounded-full [&_div.dots]:before:bg-blue-300/40 dark:before:bg-blue-600/40

        [&_div.dots]:after:content-[''] [&_div.dots]:after:absolute
        [&_div.dots]:after:bottom-8 [&_div.dots]:after:left-8
        [&_div.dots]:after:w-3 [&_div.dots]:after:h-3
        [&_div.dots]:after:rounded-full [&_div.dots]:after:bg-blue-300/40 dark:after:bg-blue-600/40
      `,
      pattern: `
        after:absolute after:inset-0
        after:bg-[radial-gradient(circle_at_30%_20%,transparent_85%,rgb(59_130_246_/_0.1))] dark:after:bg-[radial-gradient(circle_at_30%_20%,transparent_85%,rgb(59_130_246_/_0.15))]
        after:bg-[linear-gradient(135deg,transparent_70%,rgb(59_130_246_/_0.1))] dark:after:bg-[linear-gradient(135deg,transparent_70%,rgb(59_130_246_/_0.15))]
        after:[mask-image:repeating-linear-gradient(45deg,#000_0px,#000_1px,transparent_1px,transparent_8px)]
      `,
      overlay: 'from-transparent via-transparent to-blue-50/30 dark:to-blue-900/30',
    },
  }