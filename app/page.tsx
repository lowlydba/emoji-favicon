"use client"

import { useState, useEffect } from "react"
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { allEmojis } from "@/lib/emojiData"

const EMOJIS_PER_PAGE = 30

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEmojis, setFilteredEmojis] = useState(allEmojis)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmojis(allEmojis)
      setCurrentPage(1)
      return
    }

    const lowerCaseSearch = searchTerm.toLowerCase()
    const filtered = allEmojis.filter(
      (emoji) =>
        emoji.name.toLowerCase().includes(lowerCaseSearch) ||
        emoji.keywords.some((keyword) => keyword.toLowerCase().includes(lowerCaseSearch)),
    )
    setFilteredEmojis(filtered)
    setCurrentPage(1)
  }, [searchTerm])

  const totalPages = Math.ceil(filteredEmojis.length / EMOJIS_PER_PAGE)
  const startIndex = (currentPage - 1) * EMOJIS_PER_PAGE
  const endIndex = startIndex + EMOJIS_PER_PAGE
  const currentEmojis = filteredEmojis.slice(startIndex, endIndex)

  const generateEmojiSvg = (emoji: string) => {
    return `<svg xmlns="http://www.w3.org/2000/svg">
      <text y="27" font-size="27">${emoji}</text>
    </svg>`
  }

  const downloadSvg = (emoji: string, name: string) => {
    const svg = generateEmojiSvg(emoji)
    const blob = new Blob([svg], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${name.replace(/\s+/g, "-")}-favicon.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Unicode Emoji Favicon Library</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Unicode Emoji Favicon Library
          </p>

          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search emojis by name or keyword..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {currentEmojis.map((emojiItem) => (
            <Card key={emojiItem.name} className="p-4 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => downloadSvg(emojiItem.emoji, emojiItem.name)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <div className="flex flex-col items-center">
                <div className="text-5xl mb-2">{emojiItem.emoji}</div>
                <h3 className="text-sm font-medium text-center text-gray-700 dark:text-gray-300 line-clamp-1">
                  {emojiItem.name}
                </h3>
              </div>
            </Card>
          ))}
        </div>

        {filteredEmojis.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No emojis found matching your search.</p>
          </div>
        )}

        {filteredEmojis.length > EMOJIS_PER_PAGE && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      <footer className="mt-16 py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p><a href="https://www.github.com/lowlydba">@</a></p>
        </div>
      </footer>
    </main>
  )
}
