"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Novel {
  id: string
  title: string
  author: string
  tags?: string[]
}

interface Episode {
  episode_id: string
  title: string
  index: number
  novel_id: string
  novel: Novel
}

interface ReadHistory {
  episode_id: string
  scroll_position: number
  timestamp: number
  episode: Episode
}

interface LibraryData {
  lastRead: ReadHistory[]
  recentlyRead: Novel[]
  bookmarks: any[]
  favourites: any[]
}

interface GroupedHistory {
  id: string
  title: string
  author: string
  lastRead: number
  type: 'novel'
  subRows?: EpisodeRow[]
}

interface EpisodeRow {
  id: string
  index: number
  title: string
  timestamp: number
  episode_id: string
  novel_id: string
  type: 'episode'
  author: string
  lastRead: number
}

async function fetchLibraryData() {
  const response = await fetch('/api/library')
  if (!response.ok) {
    throw new Error('Failed to fetch library data')
  }
  return response.json() as Promise<LibraryData>
}

function groupHistoryByNovel(history: ReadHistory[]): GroupedHistory[] {
  const grouped = history.reduce((acc, item) => {
    const novel = item.episode.novel
    const novelId = novel.id

    if (!acc[novelId]) {
      acc[novelId] = {
        id: novel.id,
        title: novel.title,
        author: novel.author,
        lastRead: item.timestamp,
        type: 'novel',
        subRows: [],
      }
    }

    acc[novelId].subRows?.push({
      id: item.episode_id,
      index: item.episode.index,
      title: item.episode.title,
      timestamp: item.timestamp,
      episode_id: item.episode_id,
      novel_id: novel.id,
      type: 'episode',
      author: novel.author,
      lastRead: item.timestamp,
    })

    acc[novelId].lastRead = Math.max(acc[novelId].lastRead, item.timestamp)

    return acc
  }, {} as Record<string, GroupedHistory>)

  return Object.values(grouped).sort((a, b) => b.lastRead - a.lastRead)
}

function formatTimestamp(timestamp: number) {
  try {
    // Ensure timestamp is a valid number
    if (!timestamp || isNaN(timestamp)) {
      return '알 수 없음'
    }
    
    const date = new Date(timestamp * 1000)
    
    // Validate the date is valid
    if (isNaN(date.getTime())) {
      return '알 수 없음'
    }
    
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: ko,
    })
  } catch (error) {
    console.error('Invalid timestamp:', timestamp, error)
    return '알 수 없음'
  }
}

function SubRows({ data, parentRow }: { data: EpisodeRow[], parentRow: any }) {
  return (
    <>
      {data.map(episode => (
        <TableRow key={episode.id} className="bg-muted/50">
          <TableCell colSpan={2}>
            <Link
              href={`/novel/${episode.novel_id}/episode/${episode.episode_id}`}
              className="hover:underline ml-10"
            >
              {episode.index}화. {episode.title}
            </Link>
          </TableCell>
          <TableCell>
            {formatTimestamp(episode.timestamp)}
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function HistoryPage() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const { data, isLoading, error } = useQuery({
    queryKey: ['library'],
    queryFn: fetchLibraryData,
  })

  const columns: ColumnDef<GroupedHistory>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            소설
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row, getValue }) => {
        return (
          <div className="flex items-center gap-2">
            {row.original.type === 'novel' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => row.toggleExpanded()}
                className="p-0 hover:bg-transparent"
              >
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${
                    row.getIsExpanded() ? "rotate-90" : ""
                  }`}
                />
              </Button>
            )}
            <Link
              href={row.original.type === 'novel' 
                ? `/novel/${row.original.id}`
                : `/novel/${row.original.novel_id}/episode/${row.original.episode_id}`}
              className={`hover:underline ${row.original.type === 'episode' ? 'ml-8' : 'font-medium'}`}
            >
              {row.original.type === 'episode' 
                ? `${row.original.index}화. ${getValue() as string}`
                : getValue() as string}
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: "author",
      header: "작가",
    },
    {
      accessorKey: "lastRead",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="whitespace-nowrap"
            >
              마지막으로 읽은 시간
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ getValue }) => {
        const timestamp = getValue() as number
        return (
          <div className="text-right">
            {formatTimestamp(timestamp)}
          </div>
        )
      },
    },
  ]

  const groupedHistory = React.useMemo(() => {
    if (!data?.lastRead) return []
    return groupHistoryByNovel(data.lastRead)
  }, [data?.lastRead])

  const table = useReactTable({
    data: groupedHistory,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      expanded,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getSubRows: row => row.type === 'novel' ? row.subRows : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center relative py-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-md">
              기록
            </h1>
          </div>
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">데이터를 불러오는데 실패했습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center relative py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-md">
            기록
          </h1>
        </div>
        <div className="w-full">
          <div className="flex items-center py-4 w-full">
            <Input
              placeholder="소설 제목으로 검색..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      데이터를 불러오는 중...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow 
                      key={row.id}
                      className={row.original.type === 'episode' ? 'bg-muted/50' : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      읽은 기록이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                이전
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                다음
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
