export const runCode = async (language: string, code: string) => {
  const url = "http://localhost:5001/api/execute";
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language, code }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.output || "Error executing code";
  } catch (error) {
    console.error("Error executing code:", error);
    return `Failed to execute code: ${(error as Error).message}`;
  }
};
