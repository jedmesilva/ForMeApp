import { useState } from "react";
import { Camera, Type, Sparkles, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { processShoppingListText, processServiceRequest, analyzeShoppingListImage, convertImageToBase64 } from "@/lib/openai";

interface CreateRequestFormProps {
  type: "purchase" | "service";
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateRequestForm({ type, onSuccess, onCancel }: CreateRequestFormProps) {
  const [creationMode, setCreationMode] = useState<"manual" | "ai">("manual");
  const [aiInput, setAiInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    items: "",
    category: "",
    establishment: "",
    address: "",
    reward: "",
    urgency: "media",
    notes: ""
  });
  
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const processWithAI = async () => {
    if (!aiInput && !imageFile) {
      toast({
        title: "Entrada necessária",
        description: "Digite um texto ou faça upload de uma imagem para processar com IA",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      if (type === "purchase") {
        if (imageFile) {
          // Processar imagem
          const base64Image = await convertImageToBase64(imageFile);
          const result = await analyzeShoppingListImage(base64Image);
          
          setFormData({
            ...formData,
            title: result.title,
            description: `Lista extraída da imagem: ${result.items.join(", ")}`,
            items: result.items.join("\n"),
            notes: result.notes
          });
        } else {
          // Processar texto
          const result = await processShoppingListText(aiInput);
          
          setFormData({
            ...formData,
            title: result.title,
            description: `Lista de compras: ${result.items.join(", ")}`,
            items: result.items.join("\n"),
            category: result.category
          });
        }
      } else {
        // Processar solicitação de serviço
        const result = await processServiceRequest(aiInput);
        
        setFormData({
          ...formData,
          title: result.title,
          description: result.description,
          category: result.category,
          notes: `Duração estimada: ${result.estimatedDuration}`
        });
      }
      
      setCreationMode("manual");
      toast({
        title: "Processamento concluído",
        description: "Os dados foram preenchidos automaticamente. Revise e ajuste se necessário."
      });
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Não foi possível processar com IA. Verifique se a chave da API está configurada.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o título e descrição",
        variant: "destructive"
      });
      return;
    }

    // Simular envio
    toast({
      title: "Solicitação criada!",
      description: "Sua solicitação foi publicada com sucesso"
    });
    
    onSuccess();
  };

  const establishments = [
    { id: "1", name: "🛒 Supermercado Central" },
    { id: "2", name: "🥖 Padaria do Bairro" },
    { id: "3", name: "💊 Farmácia Saúde" },
    { id: "4", name: "🍖 Açougue Premium" }
  ];

  const serviceCategories = [
    "Casa e Jardim",
    "Educação",
    "Tecnologia", 
    "Saúde",
    "Transporte",
    "Beleza",
    "Outros"
  ];

  return (
    <div className="space-y-6">
      <Tabs value={creationMode} onValueChange={(value) => setCreationMode(value as "manual" | "ai")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Type size={16} />
            Manual
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles size={16} />
            Agente IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-purple-600" size={20} />
                Criar com Inteligência Artificial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Descreva sua {type === "purchase" ? "lista de compras" : "necessidade de serviço"}</Label>
                <Textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder={
                    type === "purchase" 
                      ? "Ex: Preciso de ingredientes para fazer um bolo de chocolate, leite, ovos, farinha..." 
                      : "Ex: Preciso montar um guarda-roupa novo que comprei, é de madeira com 3 portas..."
                  }
                  className="mt-1"
                  rows={3}
                />
              </div>

              {type === "purchase" && (
                <div>
                  <Label>Ou faça upload de uma foto da lista</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              removeImage();
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Camera className="mx-auto text-gray-400 mb-2" size={24} />
                          <p className="text-sm text-gray-600">Clique para enviar uma foto</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              )}

              <Button 
                onClick={processWithAI}
                disabled={isProcessing || (!aiInput && !imageFile)}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    Processar com IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder={type === "purchase" ? "Ex: Compras do supermercado" : "Ex: Montagem de móvel"}
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder={type === "purchase" ? "Descreva os itens que precisa comprar" : "Descreva o serviço que precisa"}
                  rows={3}
                />
              </div>

              {type === "purchase" ? (
                <>
                  <div>
                    <Label htmlFor="items">Lista de Itens</Label>
                    <Textarea
                      id="items"
                      value={formData.items}
                      onChange={(e) => setFormData({...formData, items: e.target.value})}
                      placeholder="Ex: Leite 1L, Pão francês, Ovos (12 unidades)..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Estabelecimento Preferido</Label>
                    <Select value={formData.establishment} onValueChange={(value) => setFormData({...formData, establishment: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Qualquer estabelecimento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Qualquer estabelecimento</SelectItem>
                        {establishments.map((est) => (
                          <SelectItem key={est.id} value={est.id}>
                            {est.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <div>
                  <Label>Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="address">Endereço de {type === "purchase" ? "Entrega" : "Atendimento"} *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Rua, número, bairro..."
                />
              </div>

              <div>
                <Label htmlFor="reward">Recompensa (R$) *</Label>
                <Input
                  id="reward"
                  type="number"
                  value={formData.reward}
                  onChange={(e) => setFormData({...formData, reward: e.target.value})}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <Label>Urgência</Label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">🟢 Baixa</SelectItem>
                    <SelectItem value="media">🟡 Média</SelectItem>
                    <SelectItem value="alta">🟠 Alta</SelectItem>
                    <SelectItem value="muito-alta">🔴 Muito Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Instruções especiais, preferências..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Publicar Solicitação
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}