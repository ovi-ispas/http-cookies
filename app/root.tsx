import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node'
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { bgColorCookie } from './cookies.server'

// When generating the page on the server at request time, read the background
// color from the cookie that the browser sends along with the incoming request
export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = await bgColorCookie.parse(cookieHeader)

  return json({ bgColor: cookie?.bgColor })
}

// If the background color has changed, update the cookie object and instruct
// the browser in the following redirect to reset the cookie with the new value
export async function action({ request }: ActionFunctionArgs) {
  const formActionData = await request.formData()

  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await bgColorCookie.parse(cookieHeader)) ?? {}
  cookie.bgColor = formActionData.get('bgColor')

  return redirect('.', {
    headers: {
      'Set-Cookie': await bgColorCookie.serialize(cookie),
    },
  })
}

export default function App() {
  const { bgColor } = useLoaderData<typeof loader>()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      {/* The value will already be embedded in the page even before hydration - no white screen */}
      <body style={{ backgroundColor: bgColor }}>
        <h1>HTTP Cookies</h1>
        <Form action="." method="post">
          <input type="color" name="bgColor" defaultValue="#ffffff" />{' '}
          <button>Set background color</button>
        </Form>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
