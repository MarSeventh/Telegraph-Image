export async function onRequest(context) {
    // 重定向到/dashboard
    return Response.redirect("/dashboard", 302)
}