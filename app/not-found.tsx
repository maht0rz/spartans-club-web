import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

export default function NotFound() {
  const cookieLng = cookies().get("lng")?.value?.toLowerCase();
  const h = headers();
  const accept = (h.get("accept-language") || "").toLowerCase();
  const fromHeader = accept.startsWith("en") ? "en" : accept.startsWith("sk") ? "sk" : null;
  const lng = (cookieLng === "en" || cookieLng === "sk" ? cookieLng : fromHeader) || "sk";
  redirect(`/${lng}/`);
}


