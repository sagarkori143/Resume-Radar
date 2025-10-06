"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, X, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { validateResumeFile, formatFileSize } from "@/lib/utils/file-validation"
import { useRouter } from "next/navigation"

interface ResumeUploadProps {
  onUploadSuccess?: () => void
}

export function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }, [])

  const handleFileSelect = (selectedFile: File) => {
    setError(null)
    setSuccess(false)

    const validation = validateResumeFile(selectedFile)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }

    setFile(selectedFile)

    // Create preview URL for PDF
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setFile(null)
    setPreviewUrl(null)
    setError(null)
    setSuccess(false)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setSuccess(true)
      setTimeout(() => {
        handleRemoveFile()
        onUploadSuccess?.()
        router.refresh()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Drag and drop your PDF resume here, or click to browse
            </p>
            <label htmlFor="file-upload">
              <Button type="button" onClick={() => document.getElementById("file-upload")?.click()}>
                Choose File
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileInputChange}
                className="sr-only"
              />
            </label>
            <p className="text-xs text-muted-foreground mt-4">PDF only, max 10MB</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleRemoveFile} disabled={isUploading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {previewUrl && (
            <Card className="p-4">
              <h4 className="font-medium mb-3">Preview</h4>
              <div className="border rounded-lg overflow-hidden bg-muted">
                <iframe src={previewUrl} className="w-full h-[500px]" title="Resume Preview" />
              </div>
            </Card>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">Resume uploaded successfully!</p>
            </div>
          )}

          <Button onClick={handleUpload} disabled={isUploading || success} className="w-full">
            {isUploading ? "Uploading..." : success ? "Uploaded!" : "Upload Resume"}
          </Button>
        </div>
      )}
    </div>
  )
}
