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
import { ArrowUpDown, ChevronRight } from "lucide-react"
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import { Button } from "@/components/ui/button"
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
  novel_id: string
  title: string
  author: {
    name: string
  }
  tags?: string[]
}

interface BookmarkedEpisode {
  episode_id: string
  title: string
  index: number
  bookmark_id: string
}

interface BookmarkedNovel {
  novel_id: string
  title: string
  author: string
  tags?: string[]
  episodes: BookmarkedEpisode[]
}

interface LibraryData {
  lastRead: any[]
  recentlyRead: any[]
  bookmarks: BookmarkedNovel[]
  favourites: any[]
}

async function fetchLibraryData() {
  const response = await fetch('/api/library')
  if (!response.ok) {
    throw new Error('Failed to fetch library data')
  }
  return response.json() as Promise<LibraryData>
}

export default function BookmarksPage() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const { data, isLoading, error } = useQuery({
    queryKey: ['library'],
    queryFn: fetchLibraryData,
  })

  const columns: ColumnDef<BookmarkedNovel>[] = [
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
            <Link
              href={`/novel/${row.original.novel_id}`}
              className="font-medium hover:underline"
            >
              {getValue() as string}
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: "author",
      header: "작가",
    },
  ]

  const table = useReactTable({
    data: data?.bookmarks ?? [],
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
    getSubRows: row => row.episodes?.map(episode => ({
      ...episode,
      novel_id: row.novel_id,
      author: row.author,
    })),
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
              북마크
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
            북마크
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
                      className={row.depth === 1 ? 'bg-muted/50' : undefined}
                    >
                      {row.getVisibleCells().map((cell) => {
                        if (row.depth === 1 && cell.column.id === "title") {
                          return (
                            <TableCell key={cell.id} colSpan={2}>
                              <Link
                                href={`/novel/${row.original.novel_id}/episode/${row.original.episode_id}`}
                                className="hover:underline ml-10"
                              >
                                {row.original.index}화. {row.original.title}
                              </Link>
                            </TableCell>
                          )
                        }
                        if (row.depth === 1) {
                          return null
                        }
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      북마크가 없습니다.
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
