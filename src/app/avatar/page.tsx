"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ChevronRight, User, Shirt, Palette, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type AvatarData = {
  corPele: string;
  tipoCabelo: string;
  corCabelo: string;
  tipoRoupa: string;
  corRoupa: string;
  acessorios: string[];
};

export default function AvatarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [avatarData, setAvatarData] = useState<AvatarData>({
    corPele: "#FFD1A3",
    tipoCabelo: "curto",
    corCabelo: "#4A3728",
    tipoRoupa: "casual",
    corRoupa: "#3B82F6",
    acessorios: [],
  });

  const coresPele = [
    "#FFD1A3", "#F0C090", "#E8B896", "#D4A574", "#C68642", "#8D5524"
  ];

  const coresCabelo = [
    "#000000", "#4A3728", "#8B4513", "#D2691E", "#FFD700", "#FF6347"
  ];

  const tiposCabelo = [
    { id: "curto", nome: "Curto" },
    { id: "medio", nome: "Médio" },
    { id: "longo", nome: "Longo" },
    { id: "careca", nome: "Careca" },
  ];

  const tiposRoupa = [
    { id: "casual", nome: "Casual" },
    { id: "esportivo", nome: "Esportivo" },
    { id: "formal", nome: "Formal" },
    { id: "confortavel", nome: "Confortável" },
  ];

  const coresRoupa = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"
  ];

  const acessoriosDisponiveis = [
    { id: "oculos", nome: "Óculos", premium: false },
    { id: "bone", nome: "Boné", premium: false },
    { id: "relogio", nome: "Relógio", premium: false },
    { id: "fone", nome: "Fone de Ouvido", premium: true },
    { id: "corrente", nome: "Corrente", premium: true },
  ];

  const handleAcessorioToggle = (id: string) => {
    const newAcessorios = avatarData.acessorios.includes(id)
      ? avatarData.acessorios.filter(a => a !== id)
      : [...avatarData.acessorios, id];
    
    setAvatarData({ ...avatarData, acessorios: newAcessorios });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Usuário não autenticado");
        router.push("/login");
        return;
      }

      // Salvar dados do avatar no Supabase
      const { error } = await supabase
        .from("user_profiles")
        .update({
          avatar_data: avatarData,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Avatar criado com sucesso!");
      router.push("/home");
    } catch (error) {
      console.error("Erro ao salvar avatar:", error);
      toast.error("Erro ao salvar avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Crie seu Avatar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personalize seu personagem que te acompanhará na jornada
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview do Avatar */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Preview do Avatar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Avatar Simplificado */}
                <div className="relative">
                  {/* Corpo */}
                  <div 
                    className="w-32 h-48 rounded-full relative"
                    style={{ backgroundColor: avatarData.corPele }}
                  >
                    {/* Cabeça */}
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full"
                      style={{ backgroundColor: avatarData.corPele }}
                    >
                      {/* Cabelo */}
                      {avatarData.tipoCabelo !== "careca" && (
                        <div 
                          className="absolute -top-2 left-1/2 -translate-x-1/2 w-28 h-16 rounded-t-full"
                          style={{ backgroundColor: avatarData.corCabelo }}
                        />
                      )}
                      
                      {/* Olhos */}
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-4">
                        <div className="w-3 h-3 bg-gray-800 rounded-full" />
                        <div className="w-3 h-3 bg-gray-800 rounded-full" />
                      </div>
                      
                      {/* Boca */}
                      <div className="absolute top-14 left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-800 rounded-full" />
                    </div>
                    
                    {/* Roupa */}
                    <div 
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-t-3xl"
                      style={{ backgroundColor: avatarData.corRoupa }}
                    />
                  </div>
                  
                  {/* Acessórios */}
                  {avatarData.acessorios.includes("oculos") && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-4 border-2 border-gray-800 rounded-lg" />
                  )}
                  {avatarData.acessorios.includes("bone") && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-gray-800 rounded-t-full" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customização */}
          <div className="space-y-6">
            {/* Cor da Pele */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette className="w-5 h-5" />
                  Cor da Pele
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 flex-wrap">
                  {coresPele.map((cor) => (
                    <button
                      key={cor}
                      onClick={() => setAvatarData({ ...avatarData, corPele: cor })}
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        avatarData.corPele === cor
                          ? "border-emerald-500 scale-110"
                          : "border-gray-300 hover:scale-105"
                      }`}
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cabelo */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5" />
                  Cabelo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tipo</p>
                  <div className="grid grid-cols-2 gap-2">
                    {tiposCabelo.map((tipo) => (
                      <Button
                        key={tipo.id}
                        variant={avatarData.tipoCabelo === tipo.id ? "default" : "outline"}
                        onClick={() => setAvatarData({ ...avatarData, tipoCabelo: tipo.id })}
                        className="w-full"
                      >
                        {tipo.nome}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cor</p>
                  <div className="flex gap-3 flex-wrap">
                    {coresCabelo.map((cor) => (
                      <button
                        key={cor}
                        onClick={() => setAvatarData({ ...avatarData, corCabelo: cor })}
                        className={`w-10 h-10 rounded-full border-4 transition-all ${
                          avatarData.corCabelo === cor
                            ? "border-emerald-500 scale-110"
                            : "border-gray-300 hover:scale-105"
                        }`}
                        style={{ backgroundColor: cor }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Roupa */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shirt className="w-5 h-5" />
                  Roupa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estilo</p>
                  <div className="grid grid-cols-2 gap-2">
                    {tiposRoupa.map((tipo) => (
                      <Button
                        key={tipo.id}
                        variant={avatarData.tipoRoupa === tipo.id ? "default" : "outline"}
                        onClick={() => setAvatarData({ ...avatarData, tipoRoupa: tipo.id })}
                        className="w-full"
                      >
                        {tipo.nome}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cor</p>
                  <div className="flex gap-3 flex-wrap">
                    {coresRoupa.map((cor) => (
                      <button
                        key={cor}
                        onClick={() => setAvatarData({ ...avatarData, corRoupa: cor })}
                        className={`w-10 h-10 rounded-full border-4 transition-all ${
                          avatarData.corRoupa === cor
                            ? "border-emerald-500 scale-110"
                            : "border-gray-300 hover:scale-105"
                        }`}
                        style={{ backgroundColor: cor }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acessórios */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5" />
                  Acessórios
                </CardTitle>
                <CardDescription>Alguns acessórios são desbloqueados com níveis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {acessoriosDisponiveis.map((acessorio) => (
                    <div
                      key={acessorio.id}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                        avatarData.acessorios.includes(acessorio.id)
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-gray-200 dark:border-gray-700"
                      } ${acessorio.premium ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{acessorio.nome}</span>
                        {acessorio.premium && (
                          <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">
                            Premium
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={avatarData.acessorios.includes(acessorio.id) ? "default" : "outline"}
                        onClick={() => handleAcessorioToggle(acessorio.id)}
                        disabled={acessorio.premium}
                      >
                        {avatarData.acessorios.includes(acessorio.id) ? "Remover" : "Adicionar"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botão Finalizar */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-8 py-6 text-lg"
          >
            {loading ? "Salvando..." : "Finalizar e Começar"}
            {!loading && <ChevronRight className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
