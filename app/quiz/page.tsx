"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Code } from "lucide-react"
import { pythonQuestions } from "@/lib/questions"

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [userName, setUserName] = useState("")

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

    // Get user name
    const firstName = localStorage.getItem("userFirstName")
    const lastName = localStorage.getItem("userLastName")
    if (firstName && lastName) {
      setUserName(`${firstName} ${lastName}`)
    } else {
      window.location.href = "/"
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("selectstart", handleSelectStart)
    }
  }, [])

  const question = pythonQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / pythonQuestions.length) * 100
  const answeredQuestions = Object.keys(answers).length
  const totalQuestions = pythonQuestions.length

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < pythonQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleFinishTest = () => {
    if (answeredQuestions === totalQuestions) {
      localStorage.setItem("quizAnswers", JSON.stringify(answers))
      localStorage.setItem("pythonTestCompleted", "true")
      window.location.href = "/results"
    }
  }

  const isCurrentAnswered = answers[question.id] !== undefined
  const canFinish = answeredQuestions === totalQuestions

  // Function to render question text with code formatting
  const renderQuestionText = (text: string) => {
    const parts = text.split(/```python\n([\s\S]*?)\n```/)
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is code
        return (
          <div key={index} className="my-4 p-4 bg-gray-800 rounded-lg border border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Python</span>
            </div>
            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
              <code>{part}</code>
            </pre>
          </div>
        )
      } else {
        // This is regular text
        return (
          <span key={index} className="whitespace-pre-wrap">
            {part}
          </span>
        )
      }
    })
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Python Bilim Testi</h1>
            <div className="text-right">
              <p className="text-gray-300">Foydalanuvchi: {userName}</p>
              <p className="text-sm text-gray-400">
                Javoblangan: {answeredQuestions}/{totalQuestions}
              </p>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-gray-800" />
          <p className="text-sm text-gray-400 mt-2">
            Savol {currentQuestion + 1} / {totalQuestions}
          </p>
        </div>

        {/* Question Card */}
        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                {isCurrentAnswered ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                Savol {currentQuestion + 1}
              </CardTitle>
              <span className="text-sm bg-gray-700 px-2 py-1 rounded text-gray-300">{question.category}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="text-lg text-white leading-relaxed">{renderQuestionText(question.question)}</div>
            </div>

            <RadioGroup value={answers[question.id] || ""} onValueChange={handleAnswerChange} className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} className="border-gray-600 text-white" />
                  <Label
                    htmlFor={`option-${index}`}
                    className="text-white cursor-pointer flex-1 p-3 rounded hover:bg-gray-800 transition-colors"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Oldingi
          </Button>

          <div className="flex gap-2">
            {currentQuestion === pythonQuestions.length - 1 ? (
              <Button
                onClick={handleFinishTest}
                disabled={!canFinish}
                className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600"
              >
                Testni Tugatish
                {!canFinish && (
                  <span className="ml-2 text-xs">({totalQuestions - answeredQuestions} ta javob kerak)</span>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-white text-black hover:bg-gray-200">
                Keyingi
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Overview */}
        <Card className="bg-gray-900 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">Savollar Holati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-2">
              {pythonQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? "bg-white text-black"
                      : answers[pythonQuestions[index].id]
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white rounded"></div>
                <span className="text-gray-300">Joriy savol</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span className="text-gray-300">Javoblangan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-700 rounded"></div>
                <span className="text-gray-300">Javoblanmagan</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
