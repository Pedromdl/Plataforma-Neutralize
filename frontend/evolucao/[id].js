// pages/evolucao/[id].js
import { useState } from "react";
import { useRouter } from "next/router";
import PainMap from "@/components/PainMap";

export default function RegistroEvolucao() {
  const router = useRouter();
  const { id: pacienteId } = router.query;

  const [regioes, setRegioes] = useState({});
  const [observacoes, setObservacoes] = useState("");

  const handleSalvar = async () => {
    const response = await fetch("/api/evolucoes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Adicione o token JWT se necessário
      },
      body: JSON.stringify({
        paciente: pacienteId,
        regioes_de_dor: regioes,
        observacoes: observacoes,
      }),
    });

    if (response.ok) {
      alert("Evolução registrada com sucesso!");
      router.push("/pacientes"); // ou outra rota
    } else {
      alert("Erro ao salvar.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Registrar Evolução do Paciente</h1>
      <PainMap onRegionSelect={setRegioes} />

      <div style={{ marginTop: "20px" }}>
        <label>Observações:</label><br />
        <textarea
          rows={5}
          cols={50}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />
      </div>

      <button style={{ marginTop: "20px" }} onClick={handleSalvar}>
        Salvar Evolução
      </button>
    </div>
  );
}
