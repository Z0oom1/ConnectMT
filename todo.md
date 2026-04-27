# ConnectMT - TODO

## Design System & Tema
- [x] Configurar tema dark mode com cores: #0B0F14 (fundo), #2DAAFF (azul neon), #1A1F26 (cinza grafite)
- [x] Implementar glassmorphism em componentes (transparência leve + bordas suaves)
- [x] Configurar tipografia Inter com pesos leve e medium
- [x] Criar componentes base com efeito glass
- [x] Implementar transições suaves de 300ms globalmente

## Tela Home
- [x] Criar layout com silhueta da moto (SVG ou 3D outline)
- [x] Implementar status dinâmico (🟢 ativa / 🔴 parada)
- [x] Adicionar animação de scan azul ao abrir o app (fade + zoom suave)
- [x] Implementar glow pulsante azul na silhueta da moto
- [x] Exibir texto dinâmico: "Tudo normal", "Detectei vibração incomum", "Moto parada há 2h"
- [x] Animação de inicialização tipo "sistema iniciando"

## Dashboard
- [x] Criar cards animados com animação spring
- [x] Card de velocidade (em tempo real)
- [x] Card de inclinação
- [x] Card de temperatura
- [x] Card de localização
- [x] Ícones com micro movimento
- [x] Animação de cards subindo ao carregar

## Chat com IA
- [x] Implementar interface tipo chat (não básica)
- [x] Fundo escuro com mensagens com glow azul leve
- [x] Animação de "pensando" (pontos pulsando)
- [x] Visualização de onda sonora reagindo durante respostas
- [x] Integração com LLM para diagnóstico inteligente
- [ ] Capacidade de detectar padrões de vibração avançada
- [x] Personalidade própria da IA nas respostas (ConnectMT Tech)

## Text-to-Speech (Síntese de Voz)
- [ ] Integrar API de text-to-speech para respostas da IA
- [ ] Implementar reprodução de áudio com personalidade
- [ ] Controles de play/pause/stop
- [ ] Indicador visual de áudio reproduzindo

## Modo Capacete
- [x] Criar tela minimalista com apenas o essencial
- [x] Botão grande 🎤 "Falar com IA"
- [x] Implementar pulso circular animado ao escutar
- [x] Onda sonora em tempo real durante gravação
- [x] Feedback tátil (vibração) ao iniciar/finalizar gravação
- [ ] Feedback sonoro ao interagir
- [ ] Integração de transcrição de áudio (speech-to-text)
- [ ] Envio automático de comando de voz para IA

## Mapa
- [x] Implementar mapa estilo dark neon
- [x] Trajeto com linha azul neon
- [x] Ponto da moto com glow
- [x] Funcionalidade de replay de rota (animação tipo "linha sendo desenhada")
- [ ] Integração com Google Maps com tema customizado escuro

## Tela de Alertas
- [x] Criar tela com fundo escuro + vermelho sutil
- [x] Exibir alertas como "Possível queda detectada"
- [x] Animação de flash leve
- [x] Feedback de vibração ao receber alerta
- [x] Sistema de notificações críticas

## Micro-Animações Globais
- [x] Botões com efeito de pressionado realista
- [x] Transições suaves de 300ms em todas as mudanças
- [x] Loading com linha animada (não spinner comum)
- [x] Feedback tátil (vibração) em interações
- [x] Hover effects em elementos interativos
- [x] Transições de página fluidas

## Navegação & Fluxo
- [x] Criar navegação entre telas (Início, Diagnóstico, IA, Pilotagem, Mapa, Alertas, Ajustes)
- [x] Menu de navegação bottom mobile-first com 7 itens
- [x] Integração de autenticação com Manus OAuth
- [x] Persistência de estado do usuário

## Testes & Validação
- [ ] Testar todas as animações em dispositivos mobile reais
- [ ] Validar responsividade em diferentes tamanhos de tela
- [ ] Testar integração de IA e respostas
- [ ] Validar transcrição de áudio e text-to-speech
- [ ] Testar feedback tátil e sonoro
- [ ] Validar performance das animações

## Deployment
- [ ] Criar checkpoint final
- [ ] Publicar aplicativo
- [ ] Gerar link para testes do usuário
