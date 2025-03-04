import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-600">🎉 Paiement Réussi !</h1>
        <p className="text-gray-700 mt-2">Merci pour votre achat. Votre commande est en cours de traitement.</p>
        <p className="mt-4 text-sm text-gray-500">Vous serez redirigé vers l'accueil dans quelques secondes...</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default Success;
