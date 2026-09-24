export function toneFor(color: string) {
  const map: Record<string, { bg: string; text: string; bar: string }> = {
    nova: { bg: "bg-[#edf1ff]", text: "text-[#284bce]", bar: "bg-[#284bce]" },
    web: { bg: "bg-[#f3edfb]", text: "text-[#8b5fbf]", bar: "bg-[#8b5fbf]" },
    green: { bg: "bg-[#eaf7f1]", text: "text-[#2f9d6f]", bar: "bg-[#2f9d6f]" },
  };
  return map[color] ?? map.nova;
}