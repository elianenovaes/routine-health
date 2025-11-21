"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Home, CheckSquare, Users, BarChart3, User, Heart } from "lucide-react";
import { toast } from "sonner";

// Importar as telas
import HojeScreen from "./components/HojeScreen";
import HabitosScreen from "./components/HabitosScreen";
import ComunidadeScreen from "./components/ComunidadeScreen";
import RelatoriosScreen from "./components/RelatoriosScreen";
import PerfilScreen from "./components/PerfilScreen";

type Screen = "hoje" | "habitos" | "comunidade" | "relatorios" | "perfil";

export default function HomePage() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<Screen>("hoje");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
      
      // Buscar perfil do usuário
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (!profile || !profile.completed_quiz) {
        router.push("/quiz");
        return;
      }

      setProfile(profile);
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "hoje" as Screen, label: "Hoje", icon: Home },
    { id: "habitos" as Screen, label: "Hábitos", icon: CheckSquare },
    { id: "comunidade" as Screen, label: "Comunidade", icon: Users },
    { id: "relatorios" as Screen, label: "Relatórios", icon: BarChart3 },
    { id: "perfil" as Screen, label: "Perfil", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      {/* Conteúdo da tela atual */}
      <div className="min-h-screen">
        {currentScreen === "hoje" && <HojeScreen user={user} profile={profile} />}
        {currentScreen === "habitos" && <HabitosScreen user={user} profile={profile} />}
        {currentScreen === "comunidade" && <ComunidadeScreen user={user} profile={profile} />}
        {currentScreen === "relatorios" && <RelatoriosScreen user={user} profile={profile} />}
        {currentScreen === "perfil" && <PerfilScreen user={user} profile={profile} />}
      </div>

      {/* Barra de Navegação Inferior Fixa */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                      : "text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? "scale-110" : ""} transition-transform`} />
                  <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
