/**
 * Formats a phone number string to a readable format
 * Handles various input formats including with/without +1, with/without dashes, etc.
 *
 * @param phoneNumber - The phone number string to format
 * @returns Formatted phone number string or original string if invalid
 *
 * @example
 * formatPhone("9133427580") // "(913) 342-7580"
 * formatPhone("+19133427580") // "(913) 342-7580"
 * formatPhone("913-342-7580") // "(913) 342-7580"
 * formatPhone("(913) 342-7580") // "(913) 342-7580"
 */
export function formatPhone(phoneNumber: string): string {
  if (!phoneNumber) return phoneNumber

  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '')

  // Handle different lengths
  if (digits.length === 10) {
    // Standard 10-digit US number
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // 11-digit number starting with 1 (US country code)
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  } else if (digits.length === 11 && !digits.startsWith('1')) {
    // 11-digit number not starting with 1, treat as 10-digit
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  } else if (digits.length < 10) {
    // Too short, return original
    return phoneNumber
  } else {
    // Too long or unexpected format, return original
    return phoneNumber
  }
}
