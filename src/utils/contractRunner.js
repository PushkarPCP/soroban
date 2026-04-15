/**
 * Soroban Academy — Mock Contract Runner
 * Validates user code against expected patterns and provides feedback.
 * In a production environment, this would compile to WASM and run in a sandbox.
 */

/**
 * Validates user code against lesson/challenge validation criteria.
 * Returns { success, message, errors, score }
 */
export function validateCode(code, validationKeywords, solution) {
  const result = {
    success: false,
    message: '',
    errors: [],
    warnings: [],
    score: 0,
  }

  // Basic syntax checks
  const syntaxErrors = checkRustSyntax(code)
  if (syntaxErrors.length > 0) {
    result.errors = syntaxErrors
    result.message = '❌ Syntax errors found. Fix them and try again.'
    return result
  }

  // Check for TODO markers (incomplete code)
  if (code.includes('// TODO') || code.includes('// YOUR CODE HERE')) {
    result.errors.push('Code still contains TODO markers. Complete all sections!')
    result.message = '⚠️ You haven\'t completed all the TODO sections yet.'
    return result
  }

  // Validate against keywords
  let matchedKeywords = 0
  const missingConcepts = []
  
  for (const keyword of validationKeywords) {
    if (code.includes(keyword)) {
      matchedKeywords++
    } else {
      missingConcepts.push(keyword)
    }
  }

  const keywordScore = (matchedKeywords / validationKeywords.length) * 100

  // Quality checks
  const qualityScore = checkCodeQuality(code)
  
  // Calculate final score
  result.score = Math.round(keywordScore * 0.7 + qualityScore * 0.3)

  if (result.score >= 80) {
    result.success = true
    result.message = '✅ Excellent! Your code passes all validations!'
    if (result.score === 100) {
      result.message = '🏆 Perfect score! Flawless implementation!'
    }
  } else if (result.score >= 50) {
    result.message = '⚠️ Getting close! Some concepts are missing.'
    result.errors.push(`Missing concepts: You're missing some key patterns. Score: ${result.score}%`)
    if (missingConcepts.length > 0) {
      result.warnings.push(`Consider implementing: ${missingConcepts.slice(0, 2).join(', ')}`)
    }
  } else {
    result.message = '❌ Your solution needs more work. Check the hints!'
    result.errors.push('Several key concepts are missing from your implementation.')
  }

  return result
}

/**
 * Basic Rust syntax validation.
 * Checks for common errors without a full parser.
 */
function checkRustSyntax(code) {
  const errors = []
  
  // Check balanced braces
  let braceCount = 0
  let parenCount = 0
  let inString = false
  let inComment = false
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i]
    const next = code[i + 1]
    
    // Skip comments
    if (char === '/' && next === '/') {
      while (i < code.length && code[i] !== '\n') i++
      continue
    }
    if (char === '/' && next === '*') {
      inComment = true
      continue
    }
    if (inComment && char === '*' && next === '/') {
      inComment = false
      i++
      continue
    }
    if (inComment) continue
    
    // Skip strings
    if (char === '"' && code[i - 1] !== '\\') {
      inString = !inString
      continue
    }
    if (inString) continue
    
    if (char === '{') braceCount++
    if (char === '}') braceCount--
    if (char === '(') parenCount++
    if (char === ')') parenCount--
    
    if (braceCount < 0) {
      errors.push('Unexpected closing brace `}` found')
      break
    }
    if (parenCount < 0) {
      errors.push('Unexpected closing parenthesis `)` found')
      break
    }
  }
  
  if (braceCount > 0) errors.push(`Missing ${braceCount} closing brace(s) \`}\``)
  if (braceCount < 0) errors.push(`Extra ${-braceCount} closing brace(s) \`}\``)
  if (parenCount > 0) errors.push(`Missing ${parenCount} closing parenthesis(es) \`)\``)
  if (parenCount < 0) errors.push(`Extra ${-parenCount} closing parenthesis(es) \`)\``)
  
  return errors
}

/**
 * Evaluates code quality and best practices.
 */
function checkCodeQuality(code) {
  let score = 100
  
  // Penalize empty function bodies
  if (/fn\s+\w+\([^)]*\)[^{]*\{\s*\}/.test(code)) {
    score -= 30
  }
  
  // Reward comments
  const commentLines = (code.match(/\/\/.+/g) || []).length
  if (commentLines >= 3) score = Math.min(100, score + 5)
  
  // Reward proper error handling
  if (code.includes('Result<') || code.includes('Option<')) {
    score = Math.min(100, score + 5)
  }
  
  // Penalize unwrap without context in non-test code
  const unwrapCount = (code.match(/\.unwrap\(\)/g) || []).length
  const unwrapOrCount = (code.match(/\.unwrap_or/g) || []).length
  if (unwrapCount > 2 && unwrapOrCount === 0) {
    score -= 10
  }
  
  return Math.max(0, score)
}

/**
 * Simulates "running" a Rust/Soroban contract.
 * Returns mock output for the UI.
 */
export function simulateRun(code) {
  const output = []
  
  // Extract println! statements for simulated output
  const printMatches = code.matchAll(/println!\("([^"]*)"(?:,\s*([^)]+))?\)/g)
  for (const match of printMatches) {
    let line = match[1]
    // Replace {} placeholders with [value] for display
    line = line.replace(/\{[^}]*\}/g, '[value]')
    output.push(line)
  }
  
  // Check for assert statements
  const assertCount = (code.match(/assert/g) || []).length
  if (assertCount > 0) {
    output.push(`\n📋 Running ${assertCount} assertion(s)...`)
  }
  
  // Simulate compilation
  output.unshift('🔨 Compiling contract...')
  output.push('')
  
  // Check for common issues
  const hasMain = code.includes('fn main()')
  const hasContract = code.includes('#[contract]')
  
  if (hasContract) {
    output.push('📦 Contract compiled to WASM')
    output.push('📐 Contract size: ~2.4 KB (optimized)')
    output.push('✅ All entry points validated')
  } else if (hasMain) {
    output.push('🏃 Running main()...')
  }
  
  if (output.length <= 3) {
    output.push('⚠️ No output generated. Add println! or contract logic.')
  }
  
  return {
    output: output.join('\n'),
    success: true,
    compilationTime: (Math.random() * 0.5 + 0.2).toFixed(2),
  }
}
