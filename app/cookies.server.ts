import { createCookie } from '@remix-run/node'

// Create a logical container for managing the background color cookie
export const bgColorCookie = createCookie('bgColor')
