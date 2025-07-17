if (body.prompt === "TEST_FUNCTION") {
  return {
    statusCode: 200,
    body: JSON.stringify({ result: "✅ Function reached server and returned JSON." }),
  };
}
