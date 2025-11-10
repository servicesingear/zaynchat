async function generate() {
  const prompt = document.getElementById("prompt").value;
  const responseDiv = document.getElementById("response");

  responseDiv.innerText = "Generating...";


  const res = await fetch("https://zaynchat.onrender.com/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  responseDiv.innerText = data.response || data.error;
}
