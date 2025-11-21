"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, ChevronRight, ChevronLeft, Target, Activity, Apple, Pill, AlertCircle, Dumbbell } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type QuizData = {
  // Objetivos principais
  objetivos: string[];
  objetivosSecundarios: string[];
  
  // Dados físicos
  peso: string;
  altura: string;
  idade: string;
  
  // Saúde e restrições
  nivelAtividade: string;
  medicamentos: string;
  restricoesAlimentares: string[];
  dificuldadesAtividade: string[];
  problemasColuna: boolean;
  outrosProblemas: string;
  
  // Preferências
  aceitaNotificacoes: boolean;
  grupoEspecifico: string;
};

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [quizData, setQuizData] = useState<QuizData>({
    objetivos: [],
    objetivosSecundarios: [],
    peso: "",
    altura: "",
    idade: "",
    nivelAtividade: "",
    medicamentos: "",
    restricoesAlimentares: [],
    dificuldadesAtividade: [],
    problemasColuna: false,
    outrosProblemas: "",
    aceitaNotificacoes: false,
    grupoEspecifico: "",
  });

  const totalSteps = 6;

  const handleCheckboxChange = (field: keyof QuizData, value: string) => {
    const currentArray = quizData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setQuizData({ ...quizData, [field]: newArray });
  };

  const handleNext = () => {
    // Validações básicas por etapa
    if (step === 1 && quizData.objetivos.length === 0) {
      toast.error("Selecione pelo menos um objetivo principal");
      return;
    }
    if (step === 2 && (!quizData.peso || !quizData.altura || !quizData.idade)) {
      toast.error("Preencha todos os dados físicos");
      return;
    }
    if (step === 3 && !quizData.nivelAtividade) {
      toast.error("Selecione seu nível de atividade física");
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Usuário não autenticado");
        router.push("/login");
        return;
      }

      // Salvar dados do quiz no Supabase
      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          user_id: user.id,
          quiz_data: quizData,
          completed_quiz: true,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Perfil configurado com sucesso!");
      router.push("/avatar");
    } catch (error) {
      console.error("Erro ao salvar quiz:", error);
      toast.error("Erro ao salvar suas preferências");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Vamos personalizar sua jornada
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Etapa {step} de {totalSteps}
          </p>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Objetivos Principais */}
        {step === 1 && (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Quais são seus objetivos principais?</CardTitle>
              <CardDescription>Selecione todos que se aplicam</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Perder peso",
                "Ganhar massa muscular",
                "Dormir melhor",
                "Reduzir ansiedade",
                "Melhorar alimentação",
                "Aumentar energia",
                "Aliviar tensão muscular",
                "Aliviar dores",
                "Aumentar flexibilidade",
                "Aumentar amplitude dos movimentos",
              ].map((objetivo) => (
                <div key={objetivo} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <Checkbox
                    id={objetivo}
                    checked={quizData.objetivos.includes(objetivo)}
                    onCheckedChange={() => handleCheckboxChange("objetivos", objetivo)}
                  />
                  <Label htmlFor={objetivo} className="cursor-pointer flex-1 text-base">
                    {objetivo}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Dados Físicos */}
        {step === 2 && (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-2">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Conte-nos sobre você</CardTitle>
              <CardDescription>Precisamos desses dados para personalizar seu plano</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  placeholder="Ex: 70"
                  value={quizData.peso}
                  onChange={(e) => setQuizData({ ...quizData, peso: e.target.value })}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input
                  id="altura"
                  type="number"
                  placeholder="Ex: 170"
                  value={quizData.altura}
                  onChange={(e) => setQuizData({ ...quizData, altura: e.target.value })}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  placeholder="Ex: 30"
                  value={quizData.idade}
                  onChange={(e) => setQuizData({ ...quizData, idade: e.target.value })}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Nível de Atividade Física */}
        {step === 3 && (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-2">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Qual seu nível de atividade física atual?</CardTitle>
              <CardDescription>Seja honesto para criarmos um plano adequado</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={quizData.nivelAtividade} onValueChange={(value) => setQuizData({ ...quizData, nivelAtividade: value })}>
                <div className="space-y-3">
                  {[
                    { value: "sedentario", label: "Sedentário", desc: "Pouca ou nenhuma atividade física" },
                    { value: "leve", label: "Levemente ativo", desc: "Exercícios leves 1-3 dias/semana" },
                    { value: "moderado", label: "Moderadamente ativo", desc: "Exercícios moderados 3-5 dias/semana" },
                    { value: "ativo", label: "Muito ativo", desc: "Exercícios intensos 6-7 dias/semana" },
                    { value: "atleta", label: "Atleta", desc: "Treinos intensos diários ou profissional" },
                  ].map((nivel) => (
                    <div key={nivel.value} className="flex items-start space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors cursor-pointer">
                      <RadioGroupItem value={nivel.value} id={nivel.value} className="mt-1" />
                      <Label htmlFor={nivel.value} className="cursor-pointer flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">{nivel.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{nivel.desc}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Medicamentos e Restrições Alimentares */}
        {step === 4 && (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-2">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Medicamentos e Restrições</CardTitle>
              <CardDescription>Essas informações nos ajudam a criar um plano seguro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="medicamentos">Toma algum medicamento regularmente?</Label>
                <Input
                  id="medicamentos"
                  placeholder="Ex: Remédio para pressão, diabetes, etc. (ou deixe em branco)"
                  value={quizData.medicamentos}
                  onChange={(e) => setQuizData({ ...quizData, medicamentos: e.target.value })}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="mb-3 block">Possui restrições alimentares?</Label>
                <div className="space-y-3">
                  {[
                    "Vegetariano",
                    "Vegano",
                    "Intolerância à lactose",
                    "Intolerância ao glúten/Celíaco",
                    "Alergia a frutos do mar",
                    "Alergia a amendoim/nozes",
                    "Diabetes",
                    "Hipertensão",
                    "Colesterol alto",
                  ].map((restricao) => (
                    <div key={restricao} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <Checkbox
                        id={restricao}
                        checked={quizData.restricoesAlimentares.includes(restricao)}
                        onCheckedChange={() => handleCheckboxChange("restricoesAlimentares", restricao)}
                      />
                      <Label htmlFor={restricao} className="cursor-pointer flex-1">
                        {restricao}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Dificuldades e Limitações Físicas */}
        {step === 5 && (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center mb-2">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Limitações Físicas</CardTitle>
              <CardDescription>Queremos garantir exercícios seguros para você</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Possui dificuldade em realizar algum tipo de atividade física?</Label>
                <div className="space-y-3">
                  {[
                    "Atividades de alto impacto (corrida, pulos)",
                    "Atividades que exigem flexibilidade",
                    "Exercícios em pé por muito tempo",
                    "Exercícios no chão",
                    "Levantar peso",
                    "Movimentos rápidos",
                  ].map((dificuldade) => (
                    <div key={dificuldade} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <Checkbox
                        id={dificuldade}
                        checked={quizData.dificuldadesAtividade.includes(dificuldade)}
                        onCheckedChange={() => handleCheckboxChange("dificuldadesAtividade", dificuldade)}
                      />
                      <Label htmlFor={dificuldade} className="cursor-pointer flex-1">
                        {dificuldade}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <Checkbox
                  id="problemasColuna"
                  checked={quizData.problemasColuna}
                  onCheckedChange={(checked) => setQuizData({ ...quizData, problemasColuna: checked as boolean })}
                />
                <Label htmlFor="problemasColuna" className="cursor-pointer flex-1 font-semibold">
                  Possui problemas na coluna
                </Label>
              </div>
              
              <div>
                <Label htmlFor="outrosProblemas">Outros problemas de saúde ou limitações</Label>
                <Input
                  id="outrosProblemas"
                  placeholder="Descreva qualquer outra condição relevante (opcional)"
                  value={quizData.outrosProblemas}
                  onChange={(e) => setQuizData({ ...quizData, outrosProblemas: e.target.value })}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Preferências e Grupo Específico */}
        {step === 6 && (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mb-2">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Últimas configurações</CardTitle>
              <CardDescription>Quase lá! Só mais algumas perguntas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <Checkbox
                  id="notificacoes"
                  checked={quizData.aceitaNotificacoes}
                  onCheckedChange={(checked) => setQuizData({ ...quizData, aceitaNotificacoes: checked as boolean })}
                  className="mt-1"
                />
                <Label htmlFor="notificacoes" className="cursor-pointer flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">Aceito receber notificações</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Lembretes para beber água, fazer exercícios e manter sua rotina
                  </div>
                </Label>
              </div>
              
              <div>
                <Label className="mb-3 block">Você se identifica com algum grupo específico?</Label>
                <RadioGroup value={quizData.grupoEspecifico} onValueChange={(value) => setQuizData({ ...quizData, grupoEspecifico: value })}>
                  <div className="space-y-3">
                    {[
                      { value: "maes", label: "Rotina saudável para mães" },
                      { value: "escritorio", label: "Trabalho em escritório" },
                      { value: "rapido", label: "Treinos de 15 minutos por dia" },
                      { value: "estudante", label: "Estudante" },
                      { value: "idoso", label: "Terceira idade" },
                      { value: "nenhum", label: "Nenhum específico" },
                    ].map((grupo) => (
                      <div key={grupo.value} className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors cursor-pointer">
                        <RadioGroupItem value={grupo.value} id={grupo.value} />
                        <Label htmlFor={grupo.value} className="cursor-pointer flex-1">
                          {grupo.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 gap-2"
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            className="flex-1 gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            disabled={loading}
          >
            {loading ? "Salvando..." : step === totalSteps ? "Finalizar" : "Próximo"}
            {!loading && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
