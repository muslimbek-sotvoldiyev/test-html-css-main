"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Trophy, BarChart3, User, Download } from "lucide-react"
import { pythonQuestions } from "@/lib/questions"

interface QuizResult {
  questionId: number
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  question: string
  category: string
  type: string
}

export default function ResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([])
  const [userName, setUserName] = useState("")
  const [score, setScore] = useState(0)
  const [categoryStats, setCategoryStats] = useState<Record<string, { correct: number; total: number }>>({})

  useEffect(() => {
    // Disable copy, right-click, and dev tools
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "C") ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "U") ||
        (e.ctrlKey && e.key === "c") ||
        (e.ctrlKey && e.key === "a")
      ) {
        e.preventDefault()
      }
    }
    const handleSelectStart = (e: Event) => e.preventDefault()

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("selectstart", handleSelectStart)

    // Load results
    const firstName = localStorage.getItem("userFirstName")
    const lastName = localStorage.getItem("userLastName")
    const answersJson = localStorage.getItem("quizAnswers")

    if (!firstName || !lastName || !answersJson) {
      window.location.href = "/"
      return
    }

    setUserName(`${firstName} ${lastName}`)
    const answers = JSON.parse(answersJson)

    // Calculate results
    const calculatedResults: QuizResult[] = []
    const categoryStatsTemp: Record<string, { correct: number; total: number }> = {}
    let correctCount = 0

    pythonQuestions.forEach((question) => {
      const userAnswer = answers[question.id] || ""
      const isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()

      if (isCorrect) correctCount++

      calculatedResults.push({
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        question: question.question,
        category: question.category,
        type: question.type,
      })

      // Category stats
      if (!categoryStatsTemp[question.category]) {
        categoryStatsTemp[question.category] = { correct: 0, total: 0 }
      }
      categoryStatsTemp[question.category].total++
      if (isCorrect) {
        categoryStatsTemp[question.category].correct++
      }
    })

    setResults(calculatedResults)
    setScore(correctCount)
    setCategoryStats(categoryStatsTemp)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("selectstart", handleSelectStart)
    }
  }, [])

  const percentage = Math.round((score / pythonQuestions.length) * 100)
  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A'lo", color: "bg-green-600" }
    if (percentage >= 80) return { grade: "Yaxshi", color: "bg-blue-600" }
    if (percentage >= 70) return { grade: "Qoniqarli", color: "bg-yellow-600" }
    if (percentage >= 60) return { grade: "O'rta", color: "bg-orange-600" }
    return { grade: "Qoniqarsiz", color: "bg-red-600" }
  }

  const gradeInfo = getGrade(percentage)

  const downloadResults = () => {
    const resultsText = `
HTML Test Natijalari
======================
Foydalanuvchi: ${userName}
Umumiy ball: ${score}/${pythonQuestions.length} (${percentage}%)
Baho: ${gradeInfo.grade}

Kategoriyalar bo'yicha natijalar:
${Object.entries(categoryStats)
  .map(
    ([category, stats]) =>
      `${category}: ${stats.correct}/${stats.total} (${Math.round((stats.correct / stats.total) * 100)}%)`,
  )
  .join("\n")}

Batafsil natijalar:
${results
  .map(
    (result, index) =>
      `${index + 1}. ${result.isCorrect ? "✓" : "✗"} ${result.question}
     Sizning javobingiz: ${result.userAnswer}
     To'g'ri javob: ${result.correctAnswer}
`,
  )
  .join("\n")}
    `

    const blob = new Blob([resultsText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `HTML-test-${userName.replace(/\s+/g, "-")}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h1 className="text-4xl font-bold mb-2">Test Natijalari</h1>
          <p className="text-gray-300 text-lg">Python bilim testi yakunlandi</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <User className="w-8 h-8 mx-auto text-white mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Foydalanuvchi</h3>
              <p className="text-gray-300">{userName}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 mx-auto text-white mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Umumiy Ball</h3>
              <p className="text-3xl font-bold text-white">
                {score}/{pythonQuestions.length}
              </p>
              <p className="text-gray-300">{percentage}%</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto text-white mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Baho</h3>
              <Badge className={`${gradeInfo.color} text-white text-lg px-4 py-2`}>{gradeInfo.grade}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Category Statistics */}
        <Card className="bg-gray-900 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Kategoriyalar bo'yicha natijalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(categoryStats).map(([category, stats]) => {
                const categoryPercentage = Math.round((stats.correct / stats.total) * 100)
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{category}</span>
                      <span className="text-gray-300">
                        {stats.correct}/{stats.total} ({categoryPercentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${categoryPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="bg-gray-900 border-gray-700 mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Batafsil natijalar</CardTitle>
            <Button
              onClick={downloadResults}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Natijalarni yuklab olish
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={result.questionId}
                  className={`p-4 rounded-lg border ${
                    result.isCorrect ? "border-green-600 bg-green-900/20" : "border-red-600 bg-red-900/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">Savol {index + 1}</span>
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {result.category}
                        </Badge>
                      </div>
                      <p className="text-gray-300 mb-3 whitespace-pre-wrap">{result.question}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-400">Sizning javobingiz: </span>
                          <span className={`font-medium ${result.isCorrect ? "text-green-400" : "text-red-400"}`}>
                            {result.userAnswer || "Javob berilmagan"}
                          </span>
                        </div>
                        {!result.isCorrect && (
                          <div>
                            <span className="text-sm text-gray-400">To'g'ri javob: </span>
                            <span className="font-medium text-green-400">{result.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center">
          <Button onClick={() => (window.location.href = "/")} className="bg-white text-black hover:bg-gray-200">
            Bosh sahifaga qaytish
          </Button>
        </div>
      </div>
    </div>
  )
}
