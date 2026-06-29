"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, User, Clock } from "lucide-react"

export default function HomePage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "C") ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault()
      }
    }

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault()
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("selectstart", handleSelectStart)

    // Check if user has already taken the test
    const testCompleted = localStorage.getItem("pythonTestCompleted")
    if (testCompleted) {
      setHasStarted(true)
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("selectstart", handleSelectStart)
    }
  }, [])

  const handleStartTest = () => {
    if (firstName.trim() && lastName.trim()) {
      localStorage.setItem("userFirstName", firstName.trim())
      localStorage.setItem("userLastName", lastName.trim())
      window.location.href = "/quiz"
    }
  }

  if (hasStarted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <BookOpen className="w-16 h-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-red-500 mb-2">Test Tugallangan</h2>
              <p className="text-gray-300">
                Siz allaqachon HTML testini topshirgansiz. Har bir foydalanuvchi faqat bir marta test topshirishi
                mumkin.
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = "/results")}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Natijalarni Ko'rish
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <BookOpen className="w-20 h-20 mx-auto text-white mb-4" />
          <h1 className="text-4xl font-bold mb-2">HTML Bilim Testi</h1>
          <p className="text-gray-300 text-lg">HTML dasturlash tilidan bilimingizni sinab ko'ring</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Ma'lumotlaringizni kiriting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-300">
                  Ism
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Ismingizni kiriting"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-300">
                  Familiya
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Familiyangizni kiriting"
                />
              </div>
              <Button
                onClick={handleStartTest}
                disabled={!firstName.trim() || !lastName.trim()}
                className="w-full bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400"
              >
                Testni Boshlash
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                  <h3 className="text-lg font-semibold text-white">Test Haqida</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li>• Jami 50 ta savol</li>
                  <li>• Turli kategoriyalar bo'yicha</li>
                  <li>• Ochiq va yopiq savollar</li>
                  <li>• Har bir savolga javob berish majburiy</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-white" />
                  <h3 className="text-lg font-semibold text-white">Qoidalar</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li>• Faqat bir marta test topshirish mumkin</li>
                  <li>• Barcha savollarni javoblash kerak</li>
                  <li>• Vaqt chekovi yo'q</li>
                  <li>• Natijalar test tugagandan keyin ko'rsatiladi</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
