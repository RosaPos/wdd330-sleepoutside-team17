const serverURL =
  import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";
const baseURL = serverURL.endsWith("/") ? serverURL : `${serverURL}/`;

async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  }

  const error = new Error("Service request failed");
  error.name = "servicesError";
  error.message = jsonResponse;
  throw error;
}

export default class ExternalServices {
  async getData(category) {
    const searchTerm = encodeURIComponent(category);
    const response = await fetch(`${baseURL}products/search/${searchTerm}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    const response = await fetch(`${baseURL}checkout`, options);
    return convertToJson(response);
  }
}
