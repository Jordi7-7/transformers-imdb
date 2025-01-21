"use client";

import { useState } from "react";

const Home = () => {
  const [review, setReview] = useState<string>("");
  const [result, setResult] = useState<{
    sentiment: string;
    predicted_class: number;
    review: string;
    inference_time: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/predict_api";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Crear el FormData con el campo 'review'
      const formData = new FormData();
      formData.append("review", review);

      // Enviar la solicitud como form-data
      const response = await fetch(`${apiUrl}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error en la API. Intenta nuevamente.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      } else {
        setError("Se produjo un error desconocido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Análisis de Reseña de Película
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Escribe una reseña para saber si es positiva o negativa.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Escribe tu reseña aquí..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
            rows={5}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Analizando..." : "Enviar Reseña"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {result && (
          <div className="mt-6 p-4 border rounded-lg text-center text-gray-500">
            <p className="text-gray-700 text-lg">
              Resultados del análisis:
            </p>
            <ul className="mt-2 space-y-2">
              <li>
                <strong>Reseña:</strong> {result.review}
              </li>
              <li>
                <strong>Sentimiento:</strong>{" "}
                <span
                  className={`font-bold ${
                    result.sentiment === "positivo" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {result.sentiment}
                </span>
              </li>
              <li>
                <strong>Clase Predicha:</strong> {result.predicted_class}
              </li>
              <li>
                <strong>Tiempo de Inferencia:</strong> {result.inference_time}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
