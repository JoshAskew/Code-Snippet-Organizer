export const runCode = async (language: string, code: string) => {
  const url = "http://localhost:5001/api/execute";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language: language.toLowerCase(), code }),  // .toLowerCase() or uppercase as required
    });

    const responseText = await response.text();
    console.log("Response text:", responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = JSON.parse(responseText);
    return data.output || "Error executing code";
  } catch (error) {
    console.error("Error executing code:", error);
    return `Failed to execute code: ${(error as Error).message}`;
  }
};
