export async function getJson(url, signal) {
  const response = await fetch(url, { cache: "no-store", signal })
  if (!response.ok)
    throw new Error(
      "자료를 불러오지 못했어요. 연결을 확인하고 다시 시도해 주세요.",
    )
  return response.json()
}
