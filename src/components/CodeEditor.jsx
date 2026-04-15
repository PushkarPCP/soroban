/**
 * CodeEditor — Monaco-based code editor for Rust/Soroban development.
 * Features Rust syntax highlighting, custom dark theme, and action buttons.
 */

import { useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, CheckCircle, RotateCcw, Loader2, AlertCircle, Trophy, Lightbulb } from 'lucide-react'
import { validateCode, simulateRun } from '../utils/contractRunner'

export default function CodeEditor({ 
  starterCode, 
  validationKeywords = [], 
  solution = '',
  hints = [],
  onValidationSuccess,
  lessonTitle = '',
}) {
  const editorRef = useRef(null)
  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState('')
  const [validationResult, setValidationResult] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)

  function handleEditorDidMount(editor) {
    editorRef.current = editor
  }

  /**
   * Simulates running the user's code.
   */
  async function handleRun() {
    setIsRunning(true)
    setOutput('')
    setValidationResult(null)

    // Simulate async compilation delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 400))
    
    const result = simulateRun(code)
    setOutput(
      `${result.output}\n\n⏱️ Compilation time: ${result.compilationTime}s`
    )
    setIsRunning(false)
  }

  /**
   * Validates the user's code against the lesson criteria.
   */
  async function handleValidate() {
    setIsValidating(true)
    setOutput('')

    // Simulate validation delay
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 500))

    const result = validateCode(code, validationKeywords, solution)
    setValidationResult(result)
    
    let outputLines = [result.message, '']
    
    if (result.errors.length > 0) {
      outputLines.push('Errors:')
      result.errors.forEach(e => outputLines.push(`  ❌ ${e}`))
      outputLines.push('')
    }
    
    if (result.warnings.length > 0) {
      outputLines.push('Suggestions:')
      result.warnings.forEach(w => outputLines.push(`  💡 ${w}`))
      outputLines.push('')
    }
    
    outputLines.push(`Score: ${result.score}/100`)
    
    if (result.success && onValidationSuccess) {
      outputLines.push('')
      outputLines.push('🎉 Congratulations! Moving to the next step...')
      setTimeout(() => onValidationSuccess(result.score), 1500)
    }

    setOutput(outputLines.join('\n'))
    setIsValidating(false)
  }

  /**
   * Resets the code to the starter template.
   */
  function handleReset() {
    setCode(starterCode)
    setOutput('')
    setValidationResult(null)
    if (editorRef.current) {
      editorRef.current.setValue(starterCode)
    }
  }

  function nextHint() {
    setCurrentHint(prev => Math.min(prev + 1, hints.length - 1))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-sm text-[var(--color-text-muted)] font-mono ml-2">
            {lessonTitle || 'contract.rs'}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={handleRun} 
            disabled={isRunning || isValidating}
            className="btn-secondary flex-1 sm:flex-none !py-2 !px-4 text-xs"
          >
            {isRunning ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} />
            )}
            Run
          </button>
          
          <button 
            onClick={handleValidate} 
            disabled={isRunning || isValidating}
            className="btn-success flex-1 sm:flex-none !py-2 !px-4 text-xs"
          >
            {isValidating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCircle size={14} />
            )}
            Validate
          </button>
          
          <button 
            onClick={handleReset}
            className="btn-secondary flex-none !py-2 !px-3 text-xs"
            title="Reset to starter code"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="monaco-editor-container rounded-xl overflow-hidden">
        <Editor
          height="400px"
          language="rust"
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            suggest: { showWords: false },
            wordWrap: 'on',
            tabSize: 4,
            smoothScrolling: true,
            cursorSmoothCaretAnimation: 'on',
            cursorBlinking: 'smooth',
          }}
        />
      </div>

      {/* Hints Section */}
      {hints.length > 0 && (
        <div className="flex items-start gap-2">
          <button
            onClick={() => setShowHints(!showHints)}
            className="btn-secondary !py-1.5 !px-3 text-xs"
          >
            <Lightbulb size={14} />
            {showHints ? 'Hide Hints' : 'Need a Hint?'}
          </button>
          
          <AnimatePresence>
            {showHints && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 card !p-3 !bg-[rgba(249,115,22,0.05)] !border-[rgba(249,115,22,0.15)]"
              >
                <p className="text-sm text-[var(--color-neon-orange)] font-medium mb-1">
                  Hint {currentHint + 1}/{hints.length}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {hints[currentHint]}
                </p>
                {currentHint < hints.length - 1 && (
                  <button
                    onClick={nextHint}
                    className="text-xs text-[var(--color-neon-orange)] mt-2 bg-transparent border-none cursor-pointer hover:underline"
                  >
                    Show next hint →
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Output Panel */}
      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`rounded-xl p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap border
              ${validationResult?.success 
                ? 'bg-[rgba(34,197,94,0.05)] border-[rgba(34,197,94,0.2)] text-[#86efac]'
                : validationResult && !validationResult.success
                  ? 'bg-[rgba(239,68,68,0.05)] border-[rgba(239,68,68,0.2)] text-[#fca5a5]'
                  : 'bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-secondary)]'
              }`}
          >
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--color-border-default)]">
              {validationResult?.success ? (
                <Trophy size={16} className="text-[var(--color-success)]" />
              ) : validationResult ? (
                <AlertCircle size={16} className="text-[var(--color-error)]" />
              ) : (
                <Play size={16} className="text-[var(--color-neon-cyan)]" />
              )}
              <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                {validationResult ? 'Validation Output' : 'Console Output'}
              </span>
            </div>
            {output}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
