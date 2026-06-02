export async function verifyCaptcha(token: string, remoteIp?: string): Promise<{ success: boolean; error?: string }> {
  // Read Cloudflare secret key from env
  const secretKey = (process.env.SECRET_KEY || "").trim();

  if (!token) {
    return { success: false, error: "CAPTCHA token is missing" };
  }

  // If using the official Turnstile test key, verify against it
  try {
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", token);
    if (remoteIp) {
      params.append("remoteip", remoteIp);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json();

    if (data.success) {
      return { success: true };
    } else {
      console.warn("Turnstile validation failed:", data["error-codes"]);
      return { 
        success: false, 
        error: `CAPTCHA validation failed: ${data["error-codes"]?.join(", ") || "Unknown error"}` 
      };
    }
  } catch (err: any) {
    console.error("Error verifying CAPTCHA token:", err);
    return { success: false, error: "Internal CAPTCHA verification service error" };
  }
}
