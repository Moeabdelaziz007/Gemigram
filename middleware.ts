export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/workspace/:path*", "/forge/:path*"],
}
