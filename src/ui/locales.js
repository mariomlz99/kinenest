// Rows: NL, FR, ES, DE, PT, IT. Code and ROS identifiers stay English.
export const LANGUAGES = ["en","nl","fr","es","de","pt","it"];
export const UI = {
  "Preparation": ["Voorbereiding","Préparation","Preparación","Vorbereitung","Preparação","Preparazione"],
  "Core exercises": ["Kernoefeningen", "Exercices du Core", "Ejercicios del Core", "Core-Übungen", "Exercícios do Core", "Esercizi Core"],
  "Core exercise": ["Kernoefening", "Exercice du Core", "Ejercicio del Core", "Core-Übung", "Exercício do Core", "Esercizio Core"],
  "Further exercises — optional": ["Verdiepende oefeningen — optioneel", "Exercices complémentaires — facultatifs", "Ejercicios adicionales — opcionales", "Weitere Übungen — optional", "Exercícios adicionais — opcionais", "Ulteriori esercizi — facoltativi"],
  "Further exercises": ["Verdiepende oefeningen", "Exercices complémentaires", "Ejercicios adicionales", "Weitere Übungen", "Exercícios adicionais", "Ulteriori esercizi"],
  "Optional practice. You can complete Core without this exercise.": ["Optionele oefening. Je kunt Core zonder deze oefening afronden.", "Exercice facultatif. Vous pouvez terminer le Core sans cet exercice.", "Práctica opcional. Puedes completar el Core sin este ejercicio.", "Optionale Übung. Du kannst Core ohne diese Übung abschließen.", "Prática opcional. Podes concluir o Core sem este exercício.", "Pratica facoltativa. Puoi completare il Core senza questo esercizio."],
  "Follow the Core exercises, then continue to Build & launch. Further exercises are optional.": ["Volg de kernoefeningen en ga daarna naar Build & launch. Verdiepende oefeningen zijn optioneel.", "Suivez les exercices du Core, puis passez à Build & launch. Les exercices complémentaires sont facultatifs.", "Sigue los ejercicios del Core y continúa con Build & launch. Los ejercicios adicionales son opcionales.", "Folge den Core-Übungen und danach Build & launch. Weitere Übungen sind optional.", "Segue os exercícios do Core e depois Build & launch. Os exercícios adicionais são opcionais.", "Segui gli esercizi Core, poi prosegui con Build & launch. Gli ulteriori esercizi sono facoltativi."],
  "Next Core exercise": ["Volgende kernoefening", "Exercice suivant du Core", "Siguiente ejercicio del Core", "Nächste Core-Übung", "Próximo exercício do Core", "Prossimo esercizio Core"],
  "Return to Core": ["Terug naar Core", "Revenir au Core", "Volver al Core", "Zurück zu Core", "Voltar ao Core", "Torna al Core"],
  "Subscribers & Callbacks": ["Subscribers en callbacks", "Abonnés et callbacks", "Suscriptores y callbacks", "Subscriber und Callbacks", "Subscritores e callbacks", "Subscriber e callback"],
  "Messages & Services": ["Berichten en services", "Messages et services", "Mensajes y servicios", "Nachrichten und Services", "Mensagens e serviços", "Messaggi e servizi"],
  "6 sessions · Core path + optional practice": ["6 sessies · Kernpad + optionele oefeningen", "6 sessions · Parcours Core + pratique facultative", "6 sesiones · Ruta Core + práctica opcional", "6 Sessions · Core-Pfad + optionale Übungen", "6 sessões · Percurso Core + prática opcional", "6 sessioni · Percorso Core + pratica facoltativa"],
  "Core + Further exercises · Python / C++": ["Core + verdiepende oefeningen · Python / C++", "Core + exercices complémentaires · Python / C++", "Core + ejercicios adicionales · Python / C++", "Core + weitere Übungen · Python / C++", "Core + exercícios adicionais · Python / C++", "Core + ulteriori esercizi · Python / C++"],
  "Optional practice in sensing, perception and control. These exercises are available now and are not required to complete Core.": ["Optionele oefeningen in sensoren, perceptie en besturing. Ze zijn nu beschikbaar en niet nodig om Core af te ronden.", "Pratique facultative des capteurs, de la perception et de la commande. Ces exercices sont disponibles et ne sont pas nécessaires pour terminer le Core.", "Práctica opcional de sensores, percepción y control. Estos ejercicios ya están disponibles y no son necesarios para completar el Core.", "Optionale Übungen zu Sensoren, Wahrnehmung und Regelung. Sie sind verfügbar und für den Core-Abschluss nicht erforderlich.", "Prática opcional de sensores, perceção e controlo. Estes exercícios estão disponíveis e não são necessários para concluir o Core.", "Pratica facoltativa su sensori, percezione e controllo. Questi esercizi sono disponibili e non sono necessari per completare il Core."],
  "Learn the ROS 2 mental model first: nodes exchange typed messages, callbacks react, and tools reveal the running system.": ["Leer eerst het ROS 2-model: nodes wisselen getypeerde berichten uit, callbacks reageren en tools tonen het draaiende systeem.", "Découvrez d’abord le modèle ROS 2 : les nœuds échangent des messages typés, les callbacks réagissent et les outils révèlent le système actif.", "Aprende primero el modelo de ROS 2: los nodos intercambian mensajes tipados, los callbacks reaccionan y las herramientas muestran el sistema activo.", "Lerne zuerst das ROS-2-Modell: Nodes tauschen typisierte Nachrichten aus, Callbacks reagieren und Werkzeuge zeigen das laufende System.", "Aprende primeiro o modelo do ROS 2: os nós trocam mensagens tipadas, os callbacks reagem e as ferramentas mostram o sistema ativo.", "Impara prima il modello ROS 2: i nodi scambiano messaggi tipizzati, i callback reagiscono e gli strumenti mostrano il sistema in esecuzione."],

  "KineNest checker helper: report_*() records your computed result for this exercise. It is not a ROS 2 API.": ["KineNest-controlehulp: report_*() meldt je berekende resultaat voor deze oefening. Het is geen ROS 2-API.","Outil de vérification KineNest : report_*() transmet votre résultat calculé pour cet exercice. Ce n’est pas une API ROS 2.","Ayuda de verificación de KineNest: report_*() registra el resultado calculado para este ejercicio. No es una API de ROS 2.","KineNest-Prüfhilfe: report_*() meldet dein berechnetes Ergebnis für diese Übung. Es ist keine ROS-2-API.","Ajuda de verificação do KineNest: report_*() regista o resultado calculado neste exercício. Não é uma API do ROS 2.","Funzione di verifica KineNest: report_*() registra il risultato calcolato per questo esercizio. Non è un’API ROS 2."],
  "Real Python and browser-compiled C++ throughout the coding course.": ["Echte Python en in de browser gecompileerd C++ in alle programmeeroefeningen.","Du vrai Python et du C++ compilé dans le navigateur dans tous les exercices de programmation.","Python real y C++ compilado en el navegador en todos los ejercicios de programación.","Echtes Python und im Browser kompiliertes C++ in allen Programmierübungen.","Python real e C++ compilado no navegador em todos os exercícios de programação.","Python reale e C++ compilato nel browser in tutti gli esercizi di programmazione."],
  "Write real Python and compile C++ throughout Sessions 2–6. Inspect topics, process sensors and control a robot in one browser tab.": ["Schrijf echte Python en compileer C++ in alle oefeningen van sessies 2–6. Bekijk topics, verwerk sensoren en bestuur een robot in één browsertab.","Écrivez du vrai Python et compilez du C++ dans toutes les sessions 2–6. Inspectez les topics, traitez les capteurs et contrôlez un robot dans un seul onglet.","Escribe Python real y compila C++ en todas las sesiones 2–6. Inspecciona topics, procesa sensores y controla un robot en una pestaña del navegador.","Schreibe echtes Python und kompiliere C++ in allen Übungen der Sessions 2–6. Untersuche Topics, verarbeite Sensordaten und steuere einen Roboter in einem Browser-Tab.","Escreve Python real e compila C++ em todas as sessões 2–6. Inspeciona tópicos, processa sensores e controla um robô num separador do navegador.","Scrivi Python reale e compila C++ in tutte le sessioni 2–6. Esamina i topic, elabora i sensori e controlla un robot in una scheda del browser."],
  "Python, NumPy, the C++ compiler and your algorithms are real. The rclpy/rclcpp-shaped APIs, CLI and sensors are educational implementations for these exercises.": ["Python, NumPy, de C++-compiler en je algoritmen zijn echt. De API’s naar het model van rclpy/rclcpp, de CLI en de sensoren zijn educatieve implementaties voor deze oefeningen.","Python, NumPy, le compilateur C++ et vos algorithmes sont réels. Les API inspirées de rclpy/rclcpp, la CLI et les capteurs sont des implémentations pédagogiques pour ces exercices.","Python, NumPy, el compilador C++ y tus algoritmos son reales. Las API inspiradas en rclpy/rclcpp, la CLI y los sensores son implementaciones educativas para estos ejercicios.","Python, NumPy, der C++-Compiler und deine Algorithmen sind echt. Die APIs nach dem Vorbild von rclpy/rclcpp, die CLI und die Sensoren sind didaktische Implementierungen für diese Übungen.","Python, NumPy, o compilador C++ e os teus algoritmos são reais. As APIs inspiradas em rclpy/rclcpp, a CLI e os sensores são implementações educativas para estes exercícios.","Python, NumPy, il compilatore C++ e i tuoi algoritmi sono reali. Le API ispirate a rclpy/rclcpp, la CLI e i sensori sono implementazioni didattiche per questi esercizi."],
  "Real Python and browser-compiled C++ with an educational robotics runtime.": ["Echte Python en C++ gecompileerd in de browser, met een educatieve robotica-runtime.","Du vrai Python et du C++ compilé dans le navigateur, avec un environnement robotique pédagogique.","Python real y C++ compilado en el navegador, con un entorno educativo de robótica.","Echtes Python und im Browser kompiliertes C++ mit einer didaktischen Robotik-Laufzeit.","Python real e C++ compilado no navegador, com um ambiente educativo de robótica.","Python reale e C++ compilato nel browser, con un runtime didattico di robotica."],
  "On a real ROS 2 machine, use an ament_python package for Python or an ament_cmake package with rclcpp for C++. Declare dependencies in package.xml.": ["Gebruik op een echte ROS 2-machine een ament_python-package voor Python of een ament_cmake-package met rclcpp voor C++. Declareer afhankelijkheden in package.xml.","Sur une vraie machine ROS 2, utilisez un package ament_python pour Python ou un package ament_cmake avec rclcpp pour C++. Déclarez les dépendances dans package.xml.","En una máquina con ROS 2, usa un paquete ament_python para Python o un paquete ament_cmake con rclcpp para C++. Declara las dependencias en package.xml.","Verwende auf einem echten ROS-2-System ein ament_python-Paket für Python oder ein ament_cmake-Paket mit rclcpp für C++. Deklariere Abhängigkeiten in package.xml.","Numa máquina com ROS 2, usa um pacote ament_python para Python ou um pacote ament_cmake com rclcpp para C++. Declara as dependências em package.xml.","Su una macchina con ROS 2, usa un pacchetto ament_python per Python oppure ament_cmake con rclcpp per C++. Dichiara le dipendenze in package.xml."],
  "For C++, CMakeLists.txt uses find_package, add_executable, ament_target_dependencies and install(TARGETS ...) to build and install the node. Build with colcon build, source the workspace setup, then launch with ros2 run.": ["Voor C++ gebruikt CMakeLists.txt find_package, add_executable, ament_target_dependencies en install(TARGETS ...) om de node te bouwen en te installeren. Bouw met colcon build, laad de workspace-setup en start met ros2 run.","Pour C++, CMakeLists.txt utilise find_package, add_executable, ament_target_dependencies et install(TARGETS ...) pour compiler et installer le nœud. Compilez avec colcon build, chargez la configuration du workspace, puis lancez avec ros2 run.","En C++, CMakeLists.txt usa find_package, add_executable, ament_target_dependencies e install(TARGETS ...) para compilar e instalar el nodo. Compila con colcon build, carga la configuración del workspace y ejecuta con ros2 run.","Für C++ verwendet CMakeLists.txt find_package, add_executable, ament_target_dependencies und install(TARGETS ...), um den Knoten zu bauen und zu installieren. Baue mit colcon build, lade die Workspace-Umgebung und starte mit ros2 run.","Em C++, CMakeLists.txt usa find_package, add_executable, ament_target_dependencies e install(TARGETS ...) para compilar e instalar o nó. Compila com colcon build, carrega a configuração do workspace e executa com ros2 run.","Per C++, CMakeLists.txt usa find_package, add_executable, ament_target_dependencies e install(TARGETS ...) per compilare e installare il nodo. Compila con colcon build, carica l’ambiente del workspace e avvia con ros2 run."],
  "KineNest provides educational compatibility headers in the browser. The kinenest::report_* helpers record learning evidence; they are not native ROS 2 APIs. Package builds in the learning terminal are bounded browser models, not native colcon builds.": ["KineNest biedt educatieve compatibiliteitsheaders in de browser. De kinenest::report_*-hulpfuncties registreren leerevidentie; het zijn geen native ROS 2-API’s. Package-builds in de leerterminal zijn begrensde browsermodellen, geen native colcon-builds.","KineNest fournit des en-têtes de compatibilité pédagogiques dans le navigateur. Les fonctions kinenest::report_* recueillent les observations pour les vérifications ; ce ne sont pas des API ROS 2 natives. Les builds de packages dans le terminal pédagogique sont des modèles limités du navigateur, pas des builds colcon natifs.","KineNest proporciona cabeceras educativas de compatibilidad en el navegador. Las funciones kinenest::report_* registran evidencias para las comprobaciones; no son API nativas de ROS 2. Los builds de paquetes en el terminal de aprendizaje son modelos limitados del navegador, no builds colcon nativos.","KineNest stellt didaktische Kompatibilitätsheader im Browser bereit. Die Hilfsfunktionen kinenest::report_* erfassen Nachweise für die Übungen; sie sind keine nativen ROS-2-APIs. Paket-Builds im Lernterminal sind begrenzte Browsermodelle, keine nativen colcon-Builds.","KineNest fornece cabeçalhos educativos de compatibilidade no navegador. As funções kinenest::report_* registam evidências para as verificações; não são APIs nativas do ROS 2. As builds de pacotes no terminal de aprendizagem são modelos limitados no navegador, não builds colcon nativas.","KineNest fornisce header didattici di compatibilità nel browser. Le funzioni kinenest::report_* registrano evidenze per le verifiche; non sono API native di ROS 2. Le build dei pacchetti nel terminale didattico sono modelli limitati nel browser, non build colcon native."],
  "Native custom messages and actions use interface files, package.xml and rosidl_generate_interfaces in CMakeLists.txt. The browser uses local headers shaped like generated interfaces; it does not run rosidl.": ["Eigen berichten en actions in native ROS 2 gebruiken interfacebestanden, package.xml en rosidl_generate_interfaces in CMakeLists.txt. De browser gebruikt lokale headers naar het model van gegenereerde interfaces; rosidl draait hier niet.","Les messages et actions personnalisés natifs utilisent des fichiers d’interface, package.xml et rosidl_generate_interfaces dans CMakeLists.txt. Le navigateur utilise des en-têtes locaux inspirés des interfaces générées ; il n’exécute pas rosidl.","Los mensajes y acciones personalizados nativos usan archivos de interfaz, package.xml y rosidl_generate_interfaces en CMakeLists.txt. El navegador usa cabeceras locales con la estructura de interfaces generadas; no ejecuta rosidl.","Native eigene Nachrichten und Actions verwenden Interfacedateien, package.xml und rosidl_generate_interfaces in CMakeLists.txt. Der Browser nutzt lokale Header nach dem Muster generierter Interfaces; rosidl wird hier nicht ausgeführt.","As mensagens e ações personalizadas nativas usam ficheiros de interface, package.xml e rosidl_generate_interfaces em CMakeLists.txt. O navegador usa cabeçalhos locais semelhantes às interfaces geradas; não executa rosidl.","Messaggi e azioni personalizzati nativi usano file di interfaccia, package.xml e rosidl_generate_interfaces in CMakeLists.txt. Il browser usa header locali con la struttura delle interfacce generate; non esegue rosidl."],
  "Experimental C++ · compiled in your browser.": ["Experimentele C++ · gecompileerd in je browser.","C++ expérimental · compilé dans votre navigateur.","C++ experimental · compilado en tu navegador.","Experimentelles C++ · in deinem Browser kompiliert.","C++ experimental · compilado no teu navegador.","C++ sperimentale · compilato nel tuo browser."],
  "Ready. Complete the TODOs and Run.": ["Klaar. Vul de TODO’s in en klik op Uitvoeren.","Prêt. Complétez les TODO et lancez le programme.","Listo. Completa los TODO y ejecuta.","Bereit. Ergänze die TODOs und starte das Programm.","Pronto. Completa os TODOs e executa.","Pronto. Completa i TODO ed esegui."],
  "Questions?": ["Vragen?","Des questions ?","¿Preguntas?","Fragen?","Dúvidas?","Domande?"],
  "Sessions": ["Sessies","Sessions","Sesiones","Sitzungen","Sessões","Sessioni"],
  "Welcome to KineNest": ["Welkom bij KineNest","Bienvenue dans KineNest","Bienvenido a KineNest","Willkommen bei KineNest","Bem-vindo ao KineNest","Benvenuto in KineNest"],
  "Learn robotics concepts directly in your browser.": ["Leer roboticaconcepten rechtstreeks in je browser.","Apprenez les concepts de la robotique directement dans votre navigateur.","Aprende conceptos de robótica directamente en tu navegador.","Lerne Robotikkonzepte direkt im Browser.","Aprende conceitos de robótica diretamente no navegador.","Impara i concetti della robotica direttamente nel browser."],
  "Explore code, sensors and robot behavior without installing a robotics stack or creating an account.": ["Experimenteer met code, sensoren en robotgedrag zonder roboticasoftware te installeren of een account aan te maken.","Explorez le code, les capteurs et le comportement du robot, sans installer de logiciels de robotique ni créer de compte.","Explora código, sensores y el comportamiento del robot sin instalar software de robótica ni crear una cuenta.","Erkunde Code, Sensoren und das Verhalten des Roboters, ohne Robotiksoftware zu installieren oder ein Konto anzulegen.","Explora código, sensores e o comportamento do robô sem instalar software de robótica nem criar uma conta.","Esplora codice, sensori e comportamento del robot senza installare software di robotica né creare un account."],
  "Start Session 1": ["Start sessie 1","Commencer la session 1","Empezar la sesión 1","Sitzung 1 starten","Começar a sessão 1","Inizia la sessione 1"],
  "6 sessions · About 90 minutes each": ["6 sessies · Ongeveer 90 minuten per sessie","6 sessions · Environ 90 minutes chacune","6 sesiones · Unos 90 minutos cada una","6 Sitzungen · Jeweils etwa 90 Minuten","6 sessões · Cerca de 90 minutos cada","6 sessioni · Circa 90 minuti ciascuna"],
  "Real Python. Browser C++ in supported exercises.": ["Echte Python. C++ in de browser voor ondersteunde oefeningen.","Du vrai Python. C++ dans le navigateur pour les exercices pris en charge.","Python real. C++ en el navegador para los ejercicios compatibles.","Echtes Python. C++ im Browser in unterstützten Übungen.","Python real. C++ no navegador nos exercícios compatíveis.","Python reale. C++ nel browser negli esercizi supportati."],
  "A safe place to learn robotics by making things move.": ["Een veilige plek om robotica te leren door dingen te laten bewegen.","Un espace sûr pour apprendre la robotique en mettant les choses en mouvement.","Un lugar seguro para aprender robótica poniendo las cosas en movimiento.","Ein sicherer Ort, um Robotik zu lernen und Dinge in Bewegung zu bringen.","Um espaço seguro para aprender robótica ao pôr as coisas em movimento.","Un luogo sicuro per imparare la robotica mettendo le cose in movimento."],
  "Why KineNest?": ["Waarom KineNest?","Pourquoi KineNest ?","¿Por qué KineNest?","Warum KineNest?","Porquê KineNest?","Perché KineNest?"],
  "“Kine” comes from kinematics and motion. “Nest” is a place to begin, experiment and learn before moving to real robots.": ["“Kine” komt van kinematica en beweging. “Nest” is een plek om te beginnen, te experimenteren en te leren vóór je met echte robots werkt.","« Kine » vient de la cinématique et du mouvement. « Nest » est un lieu pour débuter, expérimenter et apprendre avant de passer aux robots réels.","«Kine» viene de cinemática y movimiento. «Nest» es un lugar para empezar, experimentar y aprender antes de trabajar con robots reales.","„Kine“ steht für Kinematik und Bewegung. „Nest“ ist ein Ort zum Anfangen, Experimentieren und Lernen, bevor es an echte Roboter geht.","«Kine» vem de cinemática e movimento. «Nest» é um lugar para começar, experimentar e aprender antes de trabalhar com robôs reais.","“Kine” deriva da cinematica e movimento. “Nest” è un luogo per iniziare, sperimentare e imparare prima di passare ai robot reali."],
  "Support": ["Steun","Soutien","Apoyo","Unterstützung","Apoio","Supporto"],
  "Support KineNest": ["Steun KineNest","Soutenir KineNest","Apoyar KineNest","KineNest unterstützen","Apoiar o KineNest","Sostieni KineNest"],
  "KineNest is free and open source. Optional contributions help support development and maintenance.": ["KineNest is gratis en open source. Vrijwillige bijdragen ondersteunen de ontwikkeling en het onderhoud.","KineNest est gratuit et open source. Les contributions facultatives soutiennent le développement et la maintenance.","KineNest es gratuito y de código abierto. Las contribuciones opcionales ayudan a mantener y desarrollar el proyecto.","KineNest ist kostenlos und quelloffen. Freiwillige Beiträge unterstützen Entwicklung und Wartung.","O KineNest é gratuito e de código aberto. Contribuições opcionais ajudam a apoiar o desenvolvimento e a manutenção.","KineNest è gratuito e open source. I contributi facoltativi sostengono lo sviluppo e la manutenzione."],
  "No account or application backend. No analytics. Preferences stay in your browser. Runtime assets download only when needed.": ["Geen account of applicatiebackend. Geen analytics. Voorkeuren blijven in je browser. Runtimebestanden worden alleen gedownload wanneer nodig.","Aucun compte ni serveur applicatif. Aucun suivi analytique. Les préférences restent dans le navigateur. Les fichiers d’exécution se téléchargent uniquement au besoin.","Sin cuenta ni servidor de aplicación. Sin analítica. Las preferencias quedan en tu navegador. Los archivos de ejecución se descargan solo cuando hacen falta.","Kein Konto, Anwendungsserver oder Tracking. Einstellungen bleiben im Browser. Laufzeitdateien werden nur bei Bedarf geladen.","Sem conta, servidor de aplicação ou análise de utilização. As preferências ficam no navegador. Os ficheiros de execução são descarregados apenas quando necessários.","Nessun account, backend applicativo o analytics. Le preferenze restano nel browser. I file di esecuzione vengono scaricati solo quando servono."],
  "Build information": ["Buildinformatie","Informations de compilation","Información de compilación","Build-Informationen","Informação da compilação","Informazioni sulla build"],
  "Run Python": [
    "Python uitvoeren",
    "Exécuter Python",
    "Ejecutar Python",
    "Python ausführen",
    "Executar Python",
    "Esegui Python"
  ],
  "Stop Python": [
    "Python stoppen",
    "Arrêter Python",
    "Detener Python",
    "Python stoppen",
    "Parar Python",
    "Ferma Python"
  ],
  "Restore starter code": [
    "Startcode herstellen",
    "Restaurer le code initial",
    "Restaurar código inicial",
    "Startcode wiederherstellen",
    "Restaurar código inicial",
    "Ripristina il codice iniziale"
  ],
  "Check solution": [
    "Oplossing controleren",
    "Vérifier la solution",
    "Comprobar solución",
    "Lösung prüfen",
    "Verificar solução",
    "Verifica soluzione"
  ],
  "Reveal next hint": [
    "Volgende hint",
    "Indice suivant",
    "Siguiente pista",
    "Nächster Hinweis",
    "Próxima dica",
    "Mostra il prossimo suggerimento"
  ],
  "Python workspace": [
    "Python-werkruimte",
    "Espace Python",
    {
      "fallback": "en"
    },
    {
      "fallback": "en"
    },
    {
      "fallback": "en"
    },
    "Ambiente Python"
  ],
  "+ New terminal": [
    "+ Nieuwe terminal",
    "+ Nouveau terminal",
    "+ Nuevo terminal",
    "+ Neues Terminal",
    "+ Novo terminal",
    "+ Nuovo terminale"
  ],
  "Show LiDAR rays": [
    "LiDAR-stralen tonen",
    "Afficher les rayons LiDAR",
    "Mostrar rayos LiDAR",
    "LiDAR-Strahlen anzeigen",
    "Mostrar raios LiDAR",
    "Mostra i raggi LiDAR"
  ],
  "Show student centroid overlay": [
    "Berekend zwaartepunt tonen",
    "Afficher le centroïde calculé",
    "Mostrar centroide calculado",
    "Berechneten Schwerpunkt anzeigen",
    "Mostrar centroide calculado",
    "Mostra il centroide calcolato"
  ],
  "Exercise": [
    "Oefening",
    "Exercice",
    "Ejercicio",
    "Übung",
    "Exercício",
    "Esercizio"
  ],
  "Parameters": [
    "Parameters",
    "Paramètres",
    "Parámetros",
    "Parameter",
    "Parâmetros",
    "Parametri"
  ],
  "Action progress": [
    "Actievoortgang",
    "Progression de l’action",
    "Progreso de la acción",
    "Aktionsfortschritt",
    "Progresso da ação",
    "Avanzamento action"
  ],
  "TF frames": [
    "TF-frames",
    "Repères TF",
    "Marcos TF",
    "TF-Koordinatensysteme",
    "Referenciais TF",
    "Sistemi di riferimento TF"
  ],
  "Exercise complete. Your code passed the behavioural checks.": [
    "Oefening voltooid. Gedragscontroles geslaagd.",
    "Exercice terminé. Vérifications du comportement réussies.",
    "Ejercicio completado. Comprobaciones de comportamiento superadas.",
    "Übung abgeschlossen. Verhaltensprüfungen bestanden.",
    "Exercício concluído. Verificações de comportamento aprovadas.",
    "Esercizio completato. Il codice ha superato le verifiche del comportamento."
  ],
  "Not complete yet. Review the checks, output and hints.": [
    "Nog niet voltooid. Bekijk controles, uitvoer en hints.",
    "Pas encore terminé. Consultez les vérifications, la sortie et les indices.",
    "Aún no está completo. Revisa comprobaciones, salida y pistas.",
    "Noch nicht abgeschlossen. Prüfe Ergebnisse, Ausgabe und Hinweise.",
    "Ainda incompleto. Revê as verificações, a saída e as dicas.",
    "Non ancora completo. Controlla verifiche, output e suggerimenti."
  ],
  "Ready. Complete the TODOs and Run Python.": [
    "Klaar. Vul de TODO’s aan en voer Python uit.",
    "Prêt. Complétez les TODO puis exécutez Python.",
    "Listo. Completa los TODO y ejecuta Python.",
    "Bereit. TODOs ergänzen und Python ausführen.",
    "Pronto. Completa os TODO e executa Python.",
    "Pronto. Completa i TODO ed esegui Python."
  ],
  "Callbacks can update node state": [
    "Callbacks kunnen nodetoestand bijwerken",
    "Les callbacks peuvent modifier l’état du nœud",
    "Los callbacks pueden actualizar el estado del nodo",
    "Callbacks können den Knotenzustand ändern",
    "Os callbacks podem atualizar o estado do nó",
    "I callback possono aggiornare lo stato del nodo"
  ],
  "On a real ROS 2 machine": [
    "Op een echte ROS 2-machine",
    "Sur une vraie machine ROS 2",
    "En una máquina con ROS 2 real",
    "Auf einem echten ROS 2-System",
    "Numa máquina com ROS 2 real",
    "Su una macchina ROS 2 reale"
  ],
  "Execute": [
    "Uitvoeren",
    "Exécuter",
    "Ejecutar",
    "Ausführen",
    "Executar",
    "Esegui"
  ],
  "Stop command": [
    "Opdracht stoppen",
    "Arrêter la commande",
    "Detener comando",
    "Befehl stoppen",
    "Parar comando",
    "Ferma comando"
  ],
  "Close": [
    "Sluiten",
    "Fermer",
    "Cerrar",
    "Schließen",
    "Fechar",
    "Chiudi"
  ],
  "All hints revealed": [
    "Alle hints getoond",
    "Tous les indices affichés",
    "Todas las pistas mostradas",
    "Alle Hinweise angezeigt",
    "Todas as dicas apresentadas",
    "Tutti i suggerimenti sono visibili"
  ],
  "A Python workspace": [
    "Een Python-workspace",
    "Un workspace Python",
    "Un workspace Python",
    "Ein Python-Workspace",
    "Um workspace Python",
    "Un workspace Python"
  ],
  "Custom interfaces and CMake": [
    "Eigen interfaces en CMake",
    "Interfaces personnalisées et CMake",
    "Interfaces propias y CMake",
    "Eigene Schnittstellen und CMake",
    "Interfaces próprias e CMake",
    "Interfacce personalizzate e CMake"
  ],
  "What changes on a real robot?": [
    "Wat verandert op een echte robot?",
    "Qu’est-ce qui change sur un vrai robot ?",
    "¿Qué cambia en un robot real?",
    "Was ändert sich am echten Roboter?",
    "O que muda num robô real?",
    "Cosa cambia su un robot reale?"
  ],
  "Custom interfaces on a real ROS 2 machine": [
    "Eigen interfaces op een echte ROS 2-machine",
    "Interfaces personnalisées sur une vraie machine ROS 2",
    "Interfaces propias en ROS 2 real",
    "Eigene Schnittstellen auf einem echten ROS 2-System",
    "Interfaces próprias em ROS 2 real",
    "Interfacce personalizzate su una macchina ROS 2 reale"
  ],
  "Real interface packages use ament_cmake and rosidl_generate_interfaces during the build. The browser provides generated-like Python classes directly. You do not need to write or run CMake here.": [
    "Echte interfacepackages gebruiken ament_cmake en rosidl_generate_interfaces. De browser levert de Python-klassen direct; hier voer je geen CMake uit.",
    "Les vrais packages utilisent ament_cmake et rosidl_generate_interfaces. Le navigateur fournit les classes Python ; aucun CMake n’est exécuté ici.",
    "Los paquetes reales usan ament_cmake y rosidl_generate_interfaces. El navegador proporciona las clases Python; aquí no se ejecuta CMake.",
    "Echte Pakete nutzen ament_cmake und rosidl_generate_interfaces. Der Browser liefert Python-Klassen direkt; hier läuft kein CMake.",
    "Os pacotes reais usam ament_cmake e rosidl_generate_interfaces. O navegador fornece classes Python; aqui não se executa CMake.",
    "I pacchetti di interfacce reali usano ament_cmake e rosidl_generate_interfaces durante la compilazione. Il browser fornisce direttamente classi Python equivalenti a quelle generate. Qui non serve scrivere o eseguire CMake."
  ],
  "The browser taught the graph and control loop. A real ROS 2 installation adds packages, dependencies, build tools and middleware. These commands belong on a real machine, not in the learning terminal.": [
    "De browser leerde je de graaf en regellus. Een echte ROS 2-installatie voegt packages, afhankelijkheden, bouwtools en middleware toe. Deze opdrachten horen op een echte machine, niet in de leerterminal.",
    "Le navigateur vous a appris le graphe et la boucle de commande. Une vraie installation ROS 2 ajoute packages, dépendances, outils de construction et middleware. Ces commandes appartiennent à une vraie machine, pas au terminal pédagogique.",
    "El navegador enseña el grafo y el control. Una instalación real de ROS 2 añade paquetes, dependencias, compilación y middleware. Estos comandos se ejecutan en una máquina real, no en el terminal de aprendizaje.",
    "Der Browser vermittelt Graph und Regelkreis. Eine echte ROS 2-Installation ergänzt Pakete, Abhängigkeiten, Build-Werkzeuge und Middleware. Diese Befehle gehören auf einen echten Rechner, nicht ins Lernterminal.",
    "O navegador ensina o grafo e o controlo. Uma instalação real de ROS 2 acrescenta pacotes, dependências, compilação e middleware. Estes comandos executam-se numa máquina real, não no terminal de aprendizagem.",
    "Il browser introduce il grafo e il ciclo di controllo. Un'installazione ROS 2 reale aggiunge pacchetti, dipendenze, strumenti di compilazione e middleware. Questi comandi vanno eseguiti su una macchina reale, non nel terminale didattico."
  ],
  "Use ament_python for a Python package. package.xml declares dependencies and metadata. setup.py packages the module and registers a console_scripts entry point such as detector = camera_detector.detector:main. setup.cfg installs scripts where ros2 run expects them. Put node creation and spinning inside main().": [
    "Gebruik ament_python voor een Python-package. package.xml beschrijft afhankelijkheden en metadata. setup.py verpakt de module en registreert een console_scripts-entrypoint zoals detector = camera_detector.detector:main. setup.cfg installeert scripts waar ros2 run ze verwacht. Maak en spin de node in main().",
    "Utilisez ament_python pour un package Python. package.xml déclare les dépendances et métadonnées. setup.py empaquette le module et enregistre un point d’entrée console_scripts tel que detector = camera_detector.detector:main. setup.cfg installe les scripts où ros2 run les attend. Créez le nœud et appelez spin dans main().",
    "Usa ament_python. package.xml declara dependencias; setup.py empaqueta el módulo y registra console_scripts, por ejemplo detector = camera_detector.detector:main. setup.cfg coloca los scripts donde ros2 run los busca. Crea el nodo y llama a spin dentro de main().",
    "Nutze ament_python. package.xml deklariert Abhängigkeiten; setup.py paketiert das Modul und registriert console_scripts, etwa detector = camera_detector.detector:main. setup.cfg installiert Skripte für ros2 run. Erstelle den Knoten und rufe spin in main() auf.",
    "Usa ament_python. package.xml declara dependências; setup.py empacota o módulo e regista console_scripts, por exemplo detector = camera_detector.detector:main. setup.cfg instala os scripts onde ros2 run os procura. Cria o nó e chama spin dentro de main().",
    "Usa ament_python per un pacchetto Python. package.xml dichiara dipendenze e metadati. setup.py crea il pacchetto e registra un entry point console_scripts, per esempio detector = camera_detector.detector:main. setup.cfg installa gli script dove ros2 run li cerca. Crea il nodo ed esegui spin dentro main()."
  ],
  "First source your installed ROS distribution’s setup.bash and install the declared dependencies. colcon builds packages; sourcing install/setup.bash makes the built workspace discoverable. Python-only exercises do not require writing CMake.": [
    "Source eerst setup.bash van de geïnstalleerde ROS-distributie en installeer de afhankelijkheden. colcon bouwt packages; source install/setup.bash maakt de workspace vindbaar. Voor de Python-oefeningen schrijf je geen CMake.",
    "Sourcez d’abord setup.bash de la distribution ROS installée et installez les dépendances. colcon construit les packages ; source install/setup.bash rend le workspace accessible. Les exercices Python ne nécessitent pas d’écrire du CMake.",
    "Primero carga setup.bash de tu distribución ROS e instala las dependencias. colcon compila los paquetes; source install/setup.bash permite descubrir el workspace. La ruta Python no requiere escribir CMake.",
    "Lade zuerst setup.bash deiner ROS-Distribution und installiere die Abhängigkeiten. colcon baut Pakete; source install/setup.bash macht den Workspace auffindbar. Für den Python-Pfad musst du kein CMake schreiben.",
    "Carrega primeiro setup.bash da distribuição ROS e instala as dependências. colcon compila os pacotes; source install/setup.bash torna o workspace detetável. O percurso Python não exige escrever CMake.",
    "Prima carica setup.bash della distribuzione ROS installata e installa le dipendenze dichiarate. colcon compila i pacchetti; source install/setup.bash rende disponibile il workspace compilato. Gli esercizi Python non richiedono CMake."
  ],
  "Real custom-interface packages use ament_cmake and rosidl_generate_interfaces to generate language bindings during the build. The browser provides the small Python classes directly; it does not run an interface generator. CMakeLists.txt also belongs in future C++/ament_cmake packages, not in the core Python exercises.": [
    "Echte interfacepackages gebruiken ament_cmake en rosidl_generate_interfaces om taalbindings te genereren. De browser levert kleine Python-klassen rechtstreeks, zonder generator. CMakeLists.txt hoort ook bij toekomstige C++/ament_cmake-packages, niet bij de basis-Python-oefeningen.",
    "Les vrais packages d’interfaces utilisent ament_cmake et rosidl_generate_interfaces pour générer les bindings. Le navigateur fournit directement de petites classes Python, sans générateur. CMakeLists.txt concerne aussi les futurs packages C++/ament_cmake, pas les exercices Python de base.",
    "Los paquetes de interfaces reales usan ament_cmake y rosidl_generate_interfaces para generar clases durante la compilación. El navegador proporciona las clases directamente. CMakeLists.txt también se usa en paquetes C++/ament_cmake, fuera de estos ejercicios Python.",
    "Echte Schnittstellenpakete nutzen ament_cmake und rosidl_generate_interfaces zur Codegenerierung beim Build. Der Browser liefert die Klassen direkt. CMakeLists.txt gehört auch zu C++/ament_cmake-Paketen, nicht zu diesen Python-Übungen.",
    "Os pacotes de interfaces reais usam ament_cmake e rosidl_generate_interfaces para gerar classes na compilação. O navegador fornece as classes diretamente. CMakeLists.txt também pertence a pacotes C++/ament_cmake, fora destes exercícios Python.",
    "I pacchetti di interfacce reali usano ament_cmake e rosidl_generate_interfaces per generare i binding durante la compilazione. Il browser fornisce direttamente le classi Python, senza generatore. CMakeLists.txt riguarda anche i futuri pacchetti C++/ament_cmake, non gli esercizi Python di base."
  ],
  "Install real rclpy and message packages through your ROS distribution. Replace educational helpers with logging or your own tests. Provide real camera/LiDAR drivers, correct QoS, a real TF broadcaster and an action server matching your interface. TF timestamps, middleware discovery, executors and hardware safety now matter. Begin with a simulator or a stationary robot before enabling motion.": [
    "Installeer echte rclpy- en berichtpackages via je ROS-distributie. Vervang onderwijshelpers door logging of eigen tests. Voorzie camera/LiDAR-drivers, juiste QoS, een TF-broadcaster en een passende action-server. Tijdstempels, discovery, executors en hardwareveiligheid worden belangrijk. Begin in een simulator of met een stilstaande robot.",
    "Installez les vrais packages rclpy et de messages via votre distribution ROS. Remplacez les helpers pédagogiques par des logs ou vos tests. Prévoyez des pilotes caméra/LiDAR, une QoS correcte, un broadcaster TF et un serveur d’action adapté. Horodatages, découverte, executors et sécurité matérielle deviennent importants. Commencez en simulation ou avec un robot immobile.",
    "Instala rclpy y los mensajes de tu distribución ROS. Sustituye los helpers educativos por registros o pruebas. Añade drivers de cámara/LiDAR, QoS apropiada, TF y un servidor de acción. Los tiempos, executors, descubrimiento y seguridad del hardware importan. Empieza en simulación o con el robot parado.",
    "Installiere rclpy und Nachrichtenpakete aus deiner ROS-Distribution. Ersetze Lehrhilfen durch Logging oder Tests. Ergänze Kamera-/LiDAR-Treiber, passende QoS, TF und einen Aktionsserver. Zeitstempel, Executors, Discovery und Hardwaresicherheit sind wichtig. Beginne in Simulation oder mit stehendem Roboter.",
    "Instala rclpy e mensagens da distribuição ROS. Substitui os helpers educativos por registos ou testes. Acrescenta drivers de câmara/LiDAR, QoS adequada, TF e um servidor de ação. Tempos, executors, descoberta e segurança do hardware são importantes. Começa em simulação ou com o robô parado.",
    "Installa rclpy e i pacchetti di messaggi tramite la distribuzione ROS. Sostituisci gli helper didattici con log o test tuoi. Servono driver per camera/LiDAR, QoS corretto, un broadcaster TF e un action server con l'interfaccia prevista. Timestamp TF, discovery, executor e sicurezza hardware diventano importanti. Inizia con un simulatore o un robot fermo prima di attivare il movimento."
  ],
  "The browser’s 2-second velocity timeout, bounded callbacks, latest-only planar TF and limited action server are teaching choices. They are not guarantees from ROS 2.": [
    "De time-out van 2 seconden, begrensde callbacks, nieuwste vlakke TF en beperkte action-server zijn onderwijskeuzes. ROS 2 garandeert dit gedrag niet.",
    "Le délai de vitesse de 2 secondes, les callbacks bornés, le TF plan limité au dernier état et le serveur d’action restreint sont des choix pédagogiques, pas des garanties de ROS 2.",
    "El límite de velocidad de dos segundos, los callbacks limitados, TF plano actual y el servidor de acción reducido son decisiones educativas, no garantías de ROS 2.",
    "Zwei-Sekunden-Geschwindigkeitslimit, begrenzte Callbacks, aktuelles planares TF und eingeschränkter Aktionsserver sind Lehrentscheidungen, keine ROS 2-Garantien.",
    "O prazo de dois segundos, callbacks limitados, TF plano atual e servidor de ação reduzido são escolhas educativas, não garantias de ROS 2.",
    "Il timeout di velocità di 2 secondi, i callback limitati, TF planare senza storico e l'action server ridotto sono scelte didattiche del browser. Non sono garanzie di ROS 2."
  ],
  "Scan subscriber accessed range data in three callbacks": [
    "Scan-subscriber las afstanden in drie callbacks",
    "Le subscriber du scan a lu les distances dans trois callbacks",
    "Subscriber de scan leyó distancias en tres callbacks",
    "Scan-Subscriber las Entfernungen in drei Callbacks",
    "Subscriber de scan leu distâncias em três callbacks",
    "Il subscriber ha letto i dati di distanza in tre callback"
  ],
  "Front, left and right sectors computed from actual scan angles": [
    "Voor-, linker- en rechtersector berekend uit echte scanhoeken",
    "Secteurs avant, gauche et droit calculés à partir des angles du scan",
    "Sectores frontal, izquierdo y derecho calculados con ángulos del scan",
    "Sektoren vorne, links und rechts aus Scanwinkeln berechnet",
    "Setores frontal, esquerdo e direito calculados com ângulos do scan",
    "Settori frontale, sinistro e destro calcolati dagli angoli della scansione"
  ],
  "Reacted to obstacle, travelled over 2 m and avoided collisions": [
    "Gereageerd op obstakel, meer dan 2 m gereden zonder botsing",
    "Réaction à l’obstacle et trajet de plus de 2 m sans collision",
    "Reaccionó al obstáculo y recorrió más de 2 m sin colisiones",
    "Auf Hindernis reagiert, über 2 m ohne Kollision gefahren",
    "Reagiu ao obstáculo e percorreu mais de 2 m sem colisões",
    "Reazione all'ostacolo, percorso oltre 2 m e nessuna collisione"
  ],
  "Declared and used parameters while publishing motion": [
    "Parameters gedeclareerd en gebruikt bij bewegingscommando’s",
    "Paramètres déclarés et utilisés pour commander le mouvement",
    "Parámetros declarados y usados al publicar movimiento",
    "Parameter deklariert und zur Bewegungssteuerung verwendet",
    "Parâmetros declarados e usados ao publicar movimento",
    "Parametri dichiarati e usati per pubblicare il movimento"
  ],
  "Published three valid TargetInfo messages through the graph": [
    "Drie geldige TargetInfo-berichten gepubliceerd",
    "Trois messages TargetInfo valides publiés dans le graphe",
    "Tres mensajes TargetInfo válidos publicados",
    "Drei gültige TargetInfo-Nachrichten veröffentlicht",
    "Três mensagens TargetInfo válidas publicadas",
    "Tre messaggi TargetInfo validi pubblicati nel grafo"
  ],
  "Action completed and final result received": [
    "Actie voltooid en eindresultaat ontvangen",
    "Action terminée et résultat final reçu",
    "Acción completada y resultado final recibido",
    "Aktion abgeschlossen und Endergebnis empfangen",
    "Ação concluída e resultado final recebido",
    "Action completata e risultato finale ricevuto"
  ],
  "Goal accepted, feedback processed and success result received": [
    "Doel geaccepteerd, feedback verwerkt en succesresultaat ontvangen",
    "Objectif accepté, feedback traité et résultat réussi reçu",
    "Objetivo aceptado, feedback procesado y resultado correcto",
    "Ziel angenommen, Feedback verarbeitet und Erfolg empfangen",
    "Objetivo aceite, feedback processado e resultado de sucesso recebido",
    "Goal accettato, feedback elaborato e risultato positivo ricevuto"
  ],
  "Active goal cancelled and cancellation result received": [
    "Lopend doel geannuleerd en resultaat ontvangen",
    "Objectif actif annulé et résultat d’annulation reçu",
    "Objetivo activo cancelado y resultado recibido",
    "Aktives Ziel abgebrochen und Ergebnis empfangen",
    "Objetivo ativo cancelado e resultado recebido",
    "Goal attivo annullato e risultato di annullamento ricevuto"
  ],
  "Odometry callback reported correct x, y and yaw": [
    "Odometrie-callback rapporteerde correcte x, y en yaw",
    "Le callback d’odométrie a rapporté x, y et yaw correctement",
    "Callback de odometría informó x, y, yaw correctos",
    "Odometrie-Callback meldete korrekte x, y und yaw",
    "Callback de odometria comunicou x, y e yaw corretos",
    "Il callback Odometry ha riportato x, y e yaw corretti"
  ],
  "TF lookup reported the laser origin in odom three times": [
    "TF-query rapporteerde de laseroorsprong driemaal in odom",
    "La requête TF a rapporté trois fois l’origine du laser dans odom",
    "Consulta TF informó tres veces el origen del láser en odom",
    "TF-Abfrage meldete den Laserursprung dreimal in odom",
    "Consulta TF comunicou três vezes a origem do laser em odom",
    "La query TF ha riportato tre volte l'origine del laser in odom"
  ],
  "Computed target coordinates in base_link from TF": [
    "Doelcoördinaten in base_link berekend met TF",
    "Coordonnées de la cible dans base_link calculées avec TF",
    "Coordenadas del objetivo en base_link calculadas con TF",
    "Zielkoordinaten in base_link aus TF berechnet",
    "Coordenadas do alvo em base_link calculadas com TF",
    "Coordinate del target calcolate in base_link tramite TF"
  ],
  "Used odometry and stopped at the goal for 0.5 seconds": [
    "Feedback gebruikt en 0.5 s stilgestaan bij het doel",
    "Feedback utilisé et arrêt à la cible pendant 0.5 s",
    "Usó odometría y paró en el objetivo durante 0.5 s",
    "Odometrie genutzt und 0.5 s am Ziel angehalten",
    "Usou odometria e parou no alvo durante 0.5 s",
    "Odometria usata; robot fermo al goal per 0,5 secondi"
  ],
  "Reached the goal with scan safety and no collisions": [
    "Doel bereikt met scanveiligheid en zonder botsingen",
    "Cible atteinte avec sécurité LiDAR et sans collision",
    "Objetivo alcanzado con seguridad LiDAR y sin colisiones",
    "Ziel mit Scan-Schutz ohne Kollision erreicht",
    "Alvo alcançado com segurança LiDAR e sem colisões",
    "Goal raggiunto con sicurezza LiDAR e senza collisioni"
  ],
  "Processed images and scan, centered target and stopped at safe range": [
    "Beelden en scan verwerkt, doel gecentreerd en veilig gestopt",
    "Images et scan traités, cible centrée et arrêt à distance sûre",
    "Procesó imagen y scan, centró el objetivo y paró a distancia segura",
    "Bilder und Scan verarbeitet, Ziel zentriert und sicher angehalten",
    "Processou imagem e scan, centrou o alvo e parou a distância segura",
    "Immagini e scan elaborati; target centrato e arresto a distanza sicura"
  ],
  "Camera callback received at least 3 images": [
    "Camera-callback ontving minstens 3 beelden",
    "Le callback caméra a reçu au moins 3 images",
    "Callback de cámara recibió al menos 3 imágenes",
    "Kamera-Callback empfing mindestens 3 Bilder",
    "Callback da câmara recebeu pelo menos 3 imagens",
    "Il callback della camera ha ricevuto almeno 3 immagini"
  ],
  "Image width and height accessed": [
    "Breedte en hoogte van het beeld gelezen",
    "Largeur et hauteur de l’image lues",
    "Anchura y altura de imagen leídas",
    "Bildbreite und -höhe gelesen",
    "Largura e altura da imagem lidas",
    "Larghezza e altezza dell'immagine lette"
  ],
  "Image pixels accessed for processing": [
    "Beeldpixels gelezen voor verwerking",
    "Pixels de l’image lus pour traitement",
    "Píxeles de imagen leídos para procesar",
    "Bildpixel zur Verarbeitung gelesen",
    "Píxeis da imagem lidos para processar",
    "Pixel dell'immagine letti per l'elaborazione"
  ],
  "Correct shape and channel means reported": [
    "Correcte vorm en kanaalgemiddelden gerapporteerd",
    "Forme et moyennes des canaux correctement rapportées",
    "Forma y medias de canales correctas",
    "Korrekte Form und Kanalmittelwerte gemeldet",
    "Forma e médias dos canais corretas",
    "Forma dell'array e medie dei canali corrette"
  ],
  "Detection correct in all 4 varied scenes": [
    "Detectie correct in alle 4 gevarieerde scènes",
    "Détection correcte dans les 4 scènes variées",
    "Detección correcta en las 4 escenas",
    "Erkennung in allen 4 Szenen korrekt",
    "Deteção correta nas 4 cenas",
    "Rilevamento corretto nelle 4 scene di prova"
  ],
  "Centroid correct in all 4 varied scenes": [
    "Zwaartepunt correct in alle 4 gevarieerde scènes",
    "Centroïde correct dans les 4 scènes variées",
    "Centroide correcto en las 4 escenas",
    "Schwerpunkt in allen 4 Szenen korrekt",
    "Centroide correto nas 4 cenas",
    "Centroide corretto nelle 4 scene di prova"
  ],
  "Target centered and robot stopped for 8 camera frames": [
    "Doel gecentreerd en robot stil voor 8 camerabeelden",
    "Cible centrée et robot arrêté pendant 8 images",
    "Objetivo centrado y robot parado durante 8 imágenes",
    "Ziel zentriert und Roboter für 8 Bilder angehalten",
    "Alvo centrado e robô parado durante 8 imagens",
    "Target centrato e robot fermo per 8 immagini"
  ],
  "Language": [
    "Taal",
    "Langue",
    "Idioma",
    "Sprache",
    "Idioma",
    "Lingua"
  ],
  "Layout": [
    "Indeling",
    "Disposition",
    "Diseño",
    "Anordnung",
    "Disposição",
    "Disposizione"
  ],
  "Light": [
    "Licht",
    "Clair",
    "Claro",
    "Hell",
    "Claro",
    "Chiaro"
  ],
  "Dark": [
    "Donker",
    "Sombre",
    "Oscuro",
    "Dunkel",
    "Escuro",
    "Scuro"
  ],
  "Workbench": [
    "Werkbank",
    "Atelier",
    "Mesa de trabajo",
    "Arbeitsplatz",
    "Bancada",
    "Banco di lavoro"
  ],
  "Stacked": [
    "Onder elkaar",
    "Empilé",
    "Apilado",
    "Untereinander",
    "Empilhado",
    "Verticale"
  ],
  "Reset": [
    "Resetten",
    "Réinitialiser",
    "Reiniciar",
    "Zurücksetzen",
    "Reiniciar",
    "Ripristina"
  ],
  "Mission": [
    "Opdracht",
    "Mission",
    "Tarea",
    "Aufgabe",
    "Tarefa",
    "Missione"
  ],
  "Robot": [
    "Robot",
    "Robot",
    "Robot",
    "Roboter",
    "Robô",
    "Robot"
  ],
  "Graph": [
    "Graaf",
    "Graphe",
    "Grafo",
    "Graph",
    "Grafo",
    "Grafo"
  ],
  "Learning terminals": [
    "Leerterminals",
    "Terminaux pédagogiques",
    "Terminales de aprendizaje",
    "Lernterminals",
    "Terminais de aprendizagem",
    "Terminali didattici"
  ],
  "Session": [
    "Sessie",
    "Session",
    "Sesión",
    "Sitzung",
    "Sessão",
    "Sessione"
  ],
  "Nodes & Topics": [
    "Nodes en topics",
    "Nœuds et topics",
    "Nodos y topics",
    "Knoten und Topics",
    "Nós e topics",
    "Nodi e topic"
  ],
  "Callbacks & LiDAR": [
    "Callbacks en LiDAR",
    "Callbacks et LiDAR",
    "Callbacks y LiDAR",
    "Callbacks und LiDAR",
    "Callbacks e LiDAR",
    "Callback e LiDAR"
  ],
  "Perception & Services": [
    "Perceptie en services",
    "Perception et services",
    "Percepción y servicios",
    "Wahrnehmung und Dienste",
    "Perceção e serviços",
    "Percezione e servizi"
  ],
  "Parameters & Actions": [
    "Parameters en acties",
    "Paramètres et actions",
    "Parámetros y acciones",
    "Parameter und Aktionen",
    "Parâmetros e ações",
    "Parametri e action"
  ],
  "Odometry & Frames": [
    "Odometrie en frames",
    "Odométrie et repères",
    "Odometría y marcos",
    "Odometrie und Koordinatensysteme",
    "Odometria e referenciais",
    "Odometria e riferimenti"
  ],
  "Debugging Challenge": [
    "Debugopdracht",
    "Défi de débogage",
    "Reto de depuración",
    "Debugging-Aufgabe",
    "Desafio de depuração",
    "Sfida di debugging"
  ],
  "Home": ["Start","Accueil","Inicio","Startseite","Início","Home"],
  "Real environment": [
    "Echte omgeving",
    "Environnement réel",
    "Entorno real",
    "Reale Umgebung",
    "Ambiente real",
    "Ambiente reale"
  ],
  "Source": [
    "Broncode",
    "Code source",
    "Código fuente",
    "Quellcode",
    "Código-fonte",
    "Codice sorgente"
  ],
  "Licences": [
    "Licenties",
    "Licences",
    "Licencias",
    "Lizenzen",
    "Licenças",
    "Licenze"
  ],
  "About": [
    "Over het project",
    "À propos",
    "Acerca del proyecto",
    "Über das Projekt",
    "Sobre o projeto",
    "Informazioni"
  ],
  "Technical details": [
    "Technische details",
    "Détails techniques",
    "Detalles técnicos",
    "Technische Details",
    "Detalhes técnicos",
    "Dettagli tecnici"
  ],
  "Educational runtime": [
    "Educatieve runtime",
    "Runtime pédagogique",
    "Runtime educativo",
    "Lernumgebung",
    "Runtime educativo",
    "Runtime didattico"
  ],
  "Interactive robotics learning in your browser.": [
    "Interactief robotica leren in je browser.",
    "Apprentissage interactif de la robotique dans votre navigateur.",
    "Aprendizaje interactivo de robótica en tu navegador.",
    "Robotik interaktiv im Browser lernen.",
    "Aprendizagem interativa de robótica no navegador.",
    "Robotica interattiva nel browser."
  ],
  "6 sessions · Python · No installation": [
    "6 sessies · Python · Geen installatie",
    "6 sessions · Python · Sans installation",
    "6 sesiones · Python · Sin instalación",
    "6 Sitzungen · Python · Ohne Installation",
    "6 sessões · Python · Sem instalação",
    "6 sessioni · Python · Nessuna installazione"
  ],
  "Open-source browser robotics education": [
    "Open-source roboticaonderwijs in de browser",
    "Enseignement robotique open source dans le navigateur",
    "Educación robótica de código abierto en el navegador",
    "Open-Source-Robotiklehre im Browser",
    "Ensino de robótica de código aberto no navegador",
    "Didattica della robotica open source nel browser"
  ],
  "Real Python with an educational robotics runtime.": [
    "Echte Python met een educatieve roboticaruntime.",
    "Python réel avec un runtime robotique pédagogique.",
    "Python real con un runtime educativo de robótica.",
    "Echtes Python mit einer Robotik-Lernumgebung.",
    "Python real com um runtime educativo de robótica.",
    "Python reale con un runtime di robotica didattico."
  ],
  "Complete the TODOs, then Run. Tab indents; Escape then Tab leaves the editor. Stop terminates Python.": [
    "Vul de TODO’s aan en voer uit. Tab springt in; Escape en Tab verlaten de editor. Stop beëindigt Python.",
    "Complétez les TODO puis exécutez. Tab indente ; Échap puis Tab quitte l’éditeur. Stop termine Python.",
    "Completa los TODO y ejecuta. Tab indenta; Escape y Tab salen del editor. Detener termina Python.",
    "TODOs ergänzen und ausführen. Tab rückt ein; Escape und Tab verlassen den Editor. Stop beendet Python.",
    "Completa os TODO e executa. Tab indenta; Escape e Tab saem do editor. Parar termina Python.",
    "Completa i TODO, poi esegui. Tab indenta; Esc seguito da Tab esce dall'editor. Stop termina Python."
  ],
  "Exercise complete.": [
    "Oefening voltooid.",
    "Exercice terminé.",
    "Ejercicio completado.",
    "Übung abgeschlossen.",
    "Exercício concluído.",
    "Esercizio completato."
  ],
  "Not complete yet. Travel at least 1 m.": [
    "Nog niet voltooid. Rij minstens 1 m.",
    "Pas encore terminé. Parcourez au moins 1 m.",
    "Aún incompleto. Recorre al menos 1 m.",
    "Noch nicht abgeschlossen. Fahre mindestens 1 m.",
    "Ainda incompleto. Percorre pelo menos 1 m.",
    "Non ancora completo. Percorri almeno 1 m."
  ],
  "Ready. Discover the graph in the terminal.": [
    "Klaar. Verken de graaf in de terminal.",
    "Prêt. Explorez le graphe dans le terminal.",
    "Listo. Explora el grafo en el terminal.",
    "Bereit. Erkunde den Graphen im Terminal.",
    "Pronto. Explora o grafo no terminal.",
    "Pronto. Esplora il grafo dal terminale."
  ],
  "Loading lesson…": [
    "Les laden…",
    "Chargement de l’exercice…",
    "Cargando ejercicio…",
    "Übung wird geladen…",
    "A carregar exercício…",
    "Caricamento esercizio…"
  ],
  "Reset complete.": [
    "Reset voltooid.",
    "Réinitialisation terminée.",
    "Reinicio completado.",
    "Zurückgesetzt.",
    "Reinício concluído.",
    "Ripristino completato."
  ],
  "Ready": [
    "Klaar",
    "Prêt",
    "Listo",
    "Bereit",
    "Pronto",
    "Pronto"
  ],
  "Command active": [
    "Opdracht actief",
    "Commande active",
    "Comando activo",
    "Befehl aktiv",
    "Comando ativo",
    "Comando attivo"
  ],
  "Store the latest detection on self so another callback can use it.": [
    "Bewaar de laatste detectie op self voor andere callbacks.",
    "Mémorisez la dernière détection sur self pour les autres callbacks.",
    "Guarda la última detección en self para otros callbacks.",
    "Speichere die letzte Erkennung in self für andere Callbacks.",
    "Guarda a última deteção em self para outros callbacks.",
    "Salva l'ultimo rilevamento in self per usarlo in un altro callback."
  ],
  "Camera callback → node state → other callbacks.": [
    "Camera-callback → nodetoestand → andere callbacks.",
    "Callback caméra → état du nœud → autres callbacks.",
    "Callback de cámara → estado del nodo → otros callbacks.",
    "Kamera-Callback → Knotenzustand → andere Callbacks.",
    "Callback da câmara → estado do nó → outros callbacks.",
    "Callback della camera → stato del nodo → altri callback."
  ],
  "Put your Python node in an ament_python package. Build the workspace with colcon, then run the node with ros2 run.": [
    "Plaats je Python-node in een ament_python-package. Bouw met colcon en start met ros2 run.",
    "Placez le nœud Python dans un package ament_python. Construisez avec colcon, puis lancez avec ros2 run.",
    "Coloca el nodo Python en un paquete ament_python. Compila con colcon y ejecútalo con ros2 run.",
    "Lege den Python-Knoten in ein ament_python-Paket. Baue mit colcon und starte mit ros2 run.",
    "Coloca o nó Python num pacote ament_python. Compila com colcon e executa com ros2 run.",
    "Inserisci il nodo Python in un pacchetto ament_python. Compila il workspace con colcon, poi avvia il nodo con ros2 run."
  ],
  "/cmd_vel discovered": [
    "/cmd_vel ontdekt",
    "/cmd_vel découvert",
    "/cmd_vel descubierto",
    "/cmd_vel entdeckt",
    "/cmd_vel descoberto",
    "/cmd_vel individuato"
  ],
  "Valid Twist published": [
    "Geldige Twist gepubliceerd",
    "Twist valide publié",
    "Twist válido publicado",
    "Gültigen Twist veröffentlicht",
    "Twist válido publicado",
    "Twist valido pubblicato"
  ],
  "Distance travelled:": [
    "Afgelegde afstand:",
    "Distance parcourue :",
    "Distancia recorrida:",
    "Zurückgelegte Strecke:",
    "Distância percorrida:",
    "Distanza percorsa:"
  ],
  "Scan callback reported three correct finite distances": [
    "Scan-callback rapporteerde drie juiste eindige afstanden",
    "Callback scan : trois distances finies correctes",
    "Callback de scan informó tres distancias finitas correctas",
    "Scan-Callback meldete drei korrekte endliche Abstände",
    "Callback de scan comunicou três distâncias finitas corretas",
    "Il callback scan ha riportato tre distanze finite corrette"
  ],
  "Moved, then stopped 0.55–1.10 m before the obstacle": [
    "Gereden en 0.55–1.10 m voor obstakel gestopt",
    "Déplacement puis arrêt à 0.55–1.10 m de l’obstacle",
    "Avanzó y paró a 0.55–1.10 m del obstáculo",
    "Gefahren und 0.55–1.10 m vor dem Hindernis angehalten",
    "Avançou e parou a 0.55–1.10 m do obstáculo",
    "Movimento seguito da arresto a 0,55–1,10 m dall'ostacolo"
  ],
  "Visited the waypoints in order and stopped at the final goal": [
    "Waypoints op volgorde bezocht en bij einddoel gestopt",
    "Points de passage visités dans l’ordre, arrêt à l’arrivée",
    "Visitó los puntos en orden y paró en el destino",
    "Wegpunkte der Reihe nach besucht und am Ziel angehalten",
    "Visitou os pontos por ordem e parou no destino",
    "Waypoint visitati in ordine e arresto all'ultimo goal"
  ],
  "Official ROS 2 package tutorial": [
    "Officiële ROS 2-packagehandleiding",
    "Tutoriel officiel des packages ROS 2",
    "Tutorial oficial de paquetes ROS 2",
    "Offizielles ROS 2-Paket-Tutorial",
    "Tutorial oficial de pacotes ROS 2",
    "Tutorial ufficiale sui pacchetti ROS 2"
  ],
  "Official custom-interface tutorial": [
    "Officiële handleiding voor eigen interfaces",
    "Tutoriel officiel des interfaces personnalisées",
    "Tutorial oficial de interfaces propias",
    "Offizielles Tutorial für eigene Schnittstellen",
    "Tutorial oficial de interfaces próprias",
    "Tutorial ufficiale sulle interfacce personalizzate"
  ],
  "Use a second terminal to observe messages. Ctrl+C stops a stream.": [
    "Gebruik een tweede terminal om berichten te volgen. Ctrl+C stopt de stream.",
    "Observez les messages dans un second terminal. Ctrl+C arrête le flux.",
    "Observa mensajes en otro terminal. Ctrl+C detiene el flujo.",
    "Beobachte Nachrichten im zweiten Terminal. Ctrl+C stoppt den Stream.",
    "Observa mensagens noutro terminal. Ctrl+C para o fluxo.",
    "Osserva i messaggi in un secondo terminale. Ctrl+C ferma il flusso."
  ],
  "A Twist carries velocity, not position. Here, one command runs for 2 seconds, then the controller stops automatically.": [
    "Een Twist bevat snelheid, geen positie. Hier duurt één opdracht 2 seconden; daarna stopt de controller.",
    "Twist contient une vitesse, pas une position. Ici, une commande dure 2 secondes, puis le contrôleur s’arrête.",
    "Twist contiene velocidad, no posición. Aquí un comando dura 2 segundos y el controlador se detiene.",
    "Twist enthält Geschwindigkeit, keine Position. Hier wirkt ein Befehl 2 Sekunden, dann stoppt der Controller.",
    "Twist contém velocidade, não posição. Aqui um comando dura 2 segundos e o controlador para.",
    "Twist contiene velocità, non posizione. Qui un comando dura 2 secondi, poi il controllore si ferma automaticamente."
  ],
  "One graph, multiple terminals. Observe in one; publish in another.": [
    "Eén graaf, meerdere terminals. Volg berichten in één en publiceer in een andere.",
    "Un graphe, plusieurs terminaux. Observez dans l’un, publiez dans l’autre.",
    "Un grafo, varios terminales. Observa en uno y publica en otro.",
    "Ein Graph, mehrere Terminals. Beobachte in einem, sende im anderen.",
    "Um grafo, vários terminais. Observa num e publica noutro.",
    "Un grafo, più terminali. Osserva in uno; pubblica in un altro."
  ],
  "Camera · /camera/image_raw": [
    "Camera · /camera/image_raw",
    "Caméra · /camera/image_raw",
    "Cámara · /camera/image_raw",
    "Kamera · /camera/image_raw",
    "Câmara · /camera/image_raw",
    "Camera · /camera/image_raw"
  ],
  "No student detection reported": [
    "Nog geen detectie gerapporteerd",
    "Aucune détection signalée",
    "Sin detección comunicada",
    "Noch keine Erkennung gemeldet",
    "Nenhuma deteção comunicada",
    "Nessun rilevamento riportato dal codice"
  ],
  "Waiting for image…": [
    "Wachten op beeld…",
    "En attente d’image…",
    "Esperando imagen…",
    "Warte auf Bild…",
    "À espera de imagem…",
    "In attesa dell'immagine…"
  ],
  "Loading…": [
    "Laden…",
    "Chargement…",
    "Cargando…",
    "Wird geladen…",
    "A carregar…",
    "Caricamento…"
  ],
  "Enable JavaScript to load the browser lab.": [
    "Schakel JavaScript in om de les te laden.",
    "Activez JavaScript pour charger l’exercice.",
    "Activa JavaScript para cargar el ejercicio.",
    "Aktiviere JavaScript, um die Übung zu laden.",
    "Ativa JavaScript para carregar o exercício.",
    "Abilita JavaScript per caricare l'ambiente didattico."
  ],
  "This lab needs JavaScript enabled to run the robot simulator.": [
    "Deze les heeft JavaScript nodig voor de simulator.",
    "Cet exercice nécessite JavaScript pour le simulateur.",
    "Este ejercicio necesita JavaScript para el simulador.",
    "Diese Übung benötigt JavaScript für den Simulator.",
    "Este exercício precisa de JavaScript para o simulador.",
    "JavaScript deve essere attivo per eseguire il simulatore del robot."
  ],
  "travel": [
    "afstand",
    "trajet",
    "recorrido",
    "Strecke",
    "percurso",
    "percorso"
  ],
  "Terminals share one graph. Observe messages and robot motion.": [
    "Terminals delen één graaf. Volg berichten en robotbeweging.",
    "Les terminaux partagent un graphe. Observez messages et mouvement.",
    "Los terminales comparten un grafo. Observa mensajes y movimiento.",
    "Die Terminals teilen einen Graphen. Beobachte Nachrichten und Bewegung.",
    "Os terminais partilham um grafo. Observa mensagens e movimento.",
    "I terminali condividono un grafo. Osserva messaggi e movimento."
  ],
  "Review the terminal error and try again.": [
    "Bekijk de terminalfout en probeer opnieuw.",
    "Consultez l’erreur du terminal et réessayez.",
    "Revisa el error del terminal e inténtalo de nuevo.",
    "Prüfe den Terminalfehler und versuche es erneut.",
    "Revê o erro do terminal e tenta novamente.",
    "Controlla l'errore nel terminale e riprova."
  ],
  "Review the terminal error.": [
    "Bekijk de terminalfout.",
    "Consultez l’erreur du terminal.",
    "Revisa el error del terminal.",
    "Prüfe den Terminalfehler.",
    "Revê o erro do terminal.",
    "Controlla l'errore nel terminale."
  ],
  "Run your detector before checking.": [
    "Voer je detector uit voor de controle.",
    "Exécutez le détecteur avant la vérification.",
    "Ejecuta el detector antes de comprobar.",
    "Starte den Detektor vor der Prüfung.",
    "Executa o detetor antes de verificar.",
    "Esegui il rilevatore prima della verifica."
  ],
  "Camera": [
    "Camera",
    "Caméra",
    "Cámara",
    "Kamera",
    "Câmara",
    "Camera"
  ],
  "Frames": [
    "Frames",
    "Repères",
    "Marcos",
    "Koordinatensysteme",
    "Referenciais",
    "Riferimenti"
  ],
  "Transform inspector": [
    "Transformatie-inspector",
    "Inspecteur de transformations",
    "Inspector de transformaciones",
    "Transformationsinspektor",
    "Inspetor de transformações",
    "Ispettore delle trasformazioni"
  ],
  "Target frame": [
    "Doelframe",
    "Repère cible",
    "Marco destino",
    "Zielkoordinatensystem",
    "Referencial de destino",
    "Riferimento di destinazione"
  ],
  "Source frame": [
    "Bronframe",
    "Repère source",
    "Marco origen",
    "Quellkoordinatensystem",
    "Referencial de origem",
    "Riferimento sorgente"
  ],
  "Express the source frame in the target frame: Python: lookup_transform(target_frame, source_frame, ...); C++: lookupTransform(target_frame, source_frame, ...).": [
    "Druk het bronframe uit in het doelframe: Python: lookup_transform(target_frame, source_frame, ...); C++: lookupTransform(target_frame, source_frame, ...).",
    "Exprimez le repère source dans le repère cible : Python: lookup_transform(target_frame, source_frame, ...); C++: lookupTransform(target_frame, source_frame, ...).",
    "Expresa el marco origen en el marco destino: Python: lookup_transform(target_frame, source_frame, ...); C++: lookupTransform(target_frame, source_frame, ...).",
    "Drücke das Quellkoordinatensystem im Zielkoordinatensystem aus: Python: lookup_transform(target_frame, source_frame, ...); C++: lookupTransform(target_frame, source_frame, ...).",
    "Expressa o referencial de origem no referencial de destino: Python: lookup_transform(target_frame, source_frame, ...); C++: lookupTransform(target_frame, source_frame, ...).",
    "Esprimi il riferimento sorgente in quello di destinazione: Python: lookup_transform(target_frame, source_frame, ...); C++: lookupTransform(target_frame, source_frame, ...)."
  ],
  "Relative target vector": [
    "Relatieve doelvector",
    "Vecteur relatif vers la cible",
    "Vector relativo al objetivo",
    "Relativer Zielvektor",
    "Vetor relativo ao alvo",
    "Vettore relativo al target"
  ],
  "TF hierarchy": [
    "TF-hiërarchie",
    "Hiérarchie TF",
    "Jerarquía TF",
    "TF-Hierarchie",
    "Hierarquia TF",
    "Gerarchia TF"
  ],
  "Selected frame": [
    "Geselecteerd frame",
    "Repère sélectionné",
    "Marco seleccionado",
    "Ausgewähltes Koordinatensystem",
    "Referencial selecionado",
    "Riferimento selezionato"
  ],
  "Frame": [
    "Frame",
    "Repère",
    "Marco",
    "Koordinatensystem",
    "Referencial",
    "Riferimento"
  ],
  "Parent": [
    "Ouderframe",
    "Parent",
    "Padre",
    "Übergeordnet",
    "Pai",
    "Padre"
  ],
  "distance": [
    "afstand",
    "distance",
    "distancia",
    "Abstand",
    "distância",
    "distanza"
  ],
  "bearing": [
    "richting",
    "direction",
    "dirección",
    "Richtung",
    "direção",
    "angolo direzionale"
  ],
  "Latest 2D transforms only. Real tf2 also supports 3D transforms and time history.": [
    "Alleen de laatste 2D-transformaties. Echte tf2 ondersteunt ook 3D en tijdhistoriek.",
    "Dernières transformations 2D uniquement. tf2 réel gère aussi la 3D et l’historique temporel.",
    "Solo transformaciones 2D actuales. tf2 real también admite 3D e historial temporal.",
    "Nur aktuelle 2D-Transformationen. Echtes tf2 unterstützt auch 3D und Zeitverläufe.",
    "Apenas transformações 2D atuais. tf2 real também suporta 3D e histórico temporal.",
    "Solo l'ultima trasformazione 2D. tf2 reale supporta anche trasformazioni 3D e storico temporale."
  ],
  "Grid: 1 m · +x right · +y up": [
    "Raster: 1 m · +x rechts · +y boven",
    "Grille : 1 m · +x droite · +y haut",
    "Cuadrícula: 1 m · +x derecha · +y arriba",
    "Raster: 1 m · +x rechts · +y oben",
    "Grelha: 1 m · +x direita · +y acima",
    "Griglia: 1 m · +x a destra · +y in alto"
  ],
  "Python source code": [
    "Python-broncode",
    "Code source Python",
    "Código fuente Python",
    "Python-Quellcode",
    "Código-fonte Python",
    "Codice sorgente Python"
  ],
  "Python output": [
    "Python-uitvoer",
    "Sortie Python",
    "Salida Python",
    "Python-Ausgabe",
    "Saída Python",
    "Output Python"
  ],
  "Course sessions": [
    "Cursussessies",
    "Sessions du cours",
    "Sesiones del curso",
    "Kurssitzungen",
    "Sessões do curso",
    "Sessioni del corso"
  ],
  "Coordinate frames in the robot world": [
    "Coördinatenframes in de robotwereld",
    "Repères dans le monde du robot",
    "Marcos de coordenadas en el mundo del robot",
    "Koordinatensysteme in der Roboterwelt",
    "Referenciais no mundo do robô",
    "Sistemi di riferimento nel mondo del robot"
  ],
  "From browser to a real robot": [
    "Van browser naar echte robot",
    "Du navigateur au robot réel",
    "Del navegador a un robot real",
    "Vom Browser zum echten Roboter",
    "Do navegador a um robô real",
    "Dal browser a un robot reale"
  ],
  "Made with love in Belgium 🇧🇪 by": [
    "Met liefde gemaakt in België 🇧🇪 door",
    "Créé avec amour en Belgique 🇧🇪 par",
    "Hecho con amor en Bélgica 🇧🇪 por",
    "Mit Liebe in Belgien 🇧🇪 entwickelt von",
    "Feito com amor na Bélgica 🇧🇪 por",
    "Realizzato con amore in Belgio 🇧🇪 da"
  ],
  "with development assistance from": [
    "met ontwikkelhulp van",
    "avec une aide au développement de",
    "con asistencia de desarrollo de",
    "mit Entwicklungsunterstützung durch",
    "com assistência ao desenvolvimento de",
    "con assistenza allo sviluppo da"
  ],
  "by": [
    "van",
    "par",
    "de",
    "von",
    "da",
    "di"
  ],
  "KineNest helps students reach robotics concepts before dealing with installations, workspaces and dependencies.": [
    "KineNest laat studenten robotica begrijpen voordat ze installaties, workspaces en afhankelijkheden moeten beheren.",
    "KineNest permet d’aborder la robotique avant les installations, workspaces et dépendances.",
    "KineNest permite estudiar robótica antes de resolver instalaciones, workspaces y dependencias.",
    "KineNest vermittelt Robotikkonzepte vor Installation, Workspace-Einrichtung und Abhängigkeiten.",
    "O KineNest permite aprender robótica antes de lidar com instalações, workspaces e dependências.",
    "KineNest permette di studiare la robotica prima di affrontare installazioni, workspace e dipendenze."
  ],
  "Write real Python and compile C++ in supported exercises. Inspect topics, process sensors and control a robot in one browser tab.": [
  "Schrijf echte Python en compileer C++ in ondersteunde oefeningen. Inspecteer topics, verwerk sensoren en bestuur een robot in één browsertab.",
  "Écrivez du Python réel et compilez du C++ dans les exercices compatibles. Inspectez les topics, traitez les capteurs et pilotez un robot dans un seul onglet.",
  "Escribe Python real y compila C++ en los ejercicios compatibles. Inspecciona topics, procesa sensores y controla un robot en una pestaña.",
  "Schreibe echtes Python und kompiliere C++ in unterstützten Übungen. Untersuche Topics, verarbeite Sensordaten und steuere einen Roboter in einem Browser-Tab.",
  "Escreve Python real e compila C++ nos exercícios compatíveis. Inspeciona topics, processa sensores e controla um robô num separador.",
  "Scrivi Python reale e compila C++ negli esercizi supportati. Esamina i topic, elabora i sensori e controlla un robot in una scheda del browser."
],
  "KineNest is an independent open educational project created by Mario Malizia, with development assistance from ChatGPT by OpenAI.": [
    "KineNest is een onafhankelijk open onderwijsproject van Mario Malizia, met ontwikkelhulp van ChatGPT van OpenAI.",
    "KineNest est un projet éducatif ouvert et indépendant créé par Mario Malizia, avec l’aide au développement de ChatGPT d’OpenAI.",
    "KineNest es un proyecto educativo abierto e independiente creado por Mario Malizia, con asistencia de desarrollo de ChatGPT de OpenAI.",
    "KineNest ist ein unabhängiges offenes Bildungsprojekt von Mario Malizia, mit Entwicklungsunterstützung durch ChatGPT von OpenAI.",
    "O KineNest é um projeto educativo aberto e independente de Mario Malizia, com assistência ao desenvolvimento do ChatGPT da OpenAI.",
    "KineNest è un progetto educativo aperto e indipendente creato da Mario Malizia, con assistenza allo sviluppo di ChatGPT di OpenAI."
  ],
  "Python, NumPy and your algorithms are real. The robotics APIs, CLI and sensors are educational implementations for these exercises.": [
    "Python, NumPy en je algoritmen zijn echt. De robotica-API’s, CLI en sensoren zijn didactische implementaties voor deze oefeningen.",
    "Python, NumPy et vos algorithmes sont réels. Les API robotiques, la CLI et les capteurs sont des implémentations pédagogiques.",
    "Python, NumPy y tus algoritmos son reales. Las API robóticas, la CLI y los sensores son implementaciones educativas.",
    "Python, NumPy und deine Algorithmen sind echt. Robotik-APIs, CLI und Sensoren sind didaktische Implementierungen.",
    "Python, NumPy e os teus algoritmos são reais. As APIs de robótica, a CLI e os sensores são implementações educativas.",
    "Python, NumPy e i tuoi algoritmi sono reali. API di robotica, CLI e sensori sono implementazioni didattiche per questi esercizi."
  ],
  "No DDS, full QoS, TF history, native OpenCV, Gazebo, RViz, Nav2, SLAM or native package builds run here.": [
    "Hier draaien geen DDS, volledige QoS, TF-historiek, native OpenCV, Gazebo, RViz, Nav2, SLAM of native pakketbuilds.",
    "Cet environnement n’exécute pas DDS, QoS complet, historique TF, OpenCV natif, Gazebo, RViz, Nav2, SLAM ni compilation native de paquets.",
    "Aquí no se ejecutan DDS, QoS completo, historial TF, OpenCV nativo, Gazebo, RViz, Nav2, SLAM ni compilaciones nativas de paquetes.",
    "Hier laufen weder DDS, vollständiges QoS, TF-Zeitverlauf, natives OpenCV, Gazebo, RViz, Nav2, SLAM noch native Paket-Builds.",
    "Aqui não se executam DDS, QoS completo, histórico TF, OpenCV nativo, Gazebo, RViz, Nav2, SLAM nem compilação nativa de pacotes.",
    "Qui non si eseguono DDS, QoS completo, storico TF, OpenCV nativo, Gazebo, RViz, Nav2, SLAM o compilazioni native di pacchetti."
  ],
  "KineNest currently models the latest planar transform. Real tf2 also supports 3D transforms and time history.": [
    "KineNest modelleert de recentste vlakke transformatie. Echte tf2 ondersteunt ook 3D-transformaties en tijdshistoriek.",
    "KineNest modélise la dernière transformation plane. tf2 réel gère aussi les transformations 3D et l’historique temporel.",
    "KineNest modela la última transformación plana. tf2 real también admite transformaciones 3D e historial temporal.",
    "KineNest modelliert die neueste ebene Transformation. Echtes tf2 unterstützt auch 3D-Transformationen und Zeitverläufe.",
    "O KineNest modela a transformação planar mais recente. O tf2 real também suporta transformações 3D e histórico temporal.",
    "KineNest modella l’ultima trasformazione planare. tf2 reale supporta anche trasformazioni 3D e storico temporale."
  ],
  "Assessment and privacy": [
    "Evaluatie en privacy",
    "Évaluation et confidentialité",
    "Evaluación y privacidad",
    "Bewertung und Datenschutz",
    "Avaliação e privacidade",
    "Valutazione e privacy"
  ],
  "Checks observe behaviour and accept multiple solutions. They support practice, not secure grading.": [
    "Controles beoordelen gedrag en accepteren meerdere oplossingen. Ze dienen om te oefenen, niet voor beveiligde beoordeling.",
    "Les vérifications observent le comportement et acceptent plusieurs solutions. Elles servent à s’exercer, pas à sécuriser une notation.",
    "Las verificaciones observan el comportamiento y aceptan varias soluciones. Sirven para practicar, no para calificación segura.",
    "Prüfungen beobachten Verhalten und akzeptieren mehrere Lösungen. Sie dienen dem Üben, nicht einer manipulationssicheren Benotung.",
    "As verificações observam o comportamento e aceitam várias soluções. Servem para praticar, não para classificação segura.",
    "Le verifiche osservano il comportamento e accettano più soluzioni. Servono per esercitarsi, non per assegnare voti in modo sicuro."
  ],
  "No account, backend, payment or analytics. Preferences stay in your browser. Python downloads Pyodide and NumPy on first use.": [
    "Geen account, backend, betaling of analytics. Voorkeuren blijven in je browser. Python downloadt Pyodide en NumPy bij het eerste gebruik.",
    "Aucun compte, backend, paiement ni suivi analytique. Les préférences restent dans le navigateur. Python télécharge Pyodide et NumPy à la première utilisation.",
    "Sin cuenta, backend, pagos ni analítica. Las preferencias quedan en tu navegador. Python descarga Pyodide y NumPy al primer uso.",
    "Kein Konto, Backend, Bezahlsystem oder Tracking. Einstellungen bleiben im Browser. Python lädt beim ersten Start Pyodide und NumPy.",
    "Sem conta, backend, pagamentos ou análise de utilização. As preferências ficam no navegador. Python descarrega Pyodide e NumPy na primeira utilização.",
    "Nessun account, backend, pagamento o analytics. Le preferenze restano nel browser. Python scarica Pyodide e NumPy al primo utilizzo."
  ],
  "Stop terminates the execution worker, including infinite loops. Each tab has a separate world.": [
    "Stop beëindigt de worker, ook bij oneindige lussen. Elke tab heeft een eigen wereld.",
    "Stop termine le worker, même en cas de boucle infinie. Chaque onglet a son propre monde.",
    "Stop termina el worker, incluidos los bucles infinitos. Cada pestaña tiene su propio mundo.",
    "Stop beendet den Worker, auch bei Endlosschleifen. Jeder Tab hat eine eigene Welt.",
    "Stop termina o worker, incluindo ciclos infinitos. Cada separador tem o seu mundo.",
    "Stop termina il worker, inclusi i cicli infiniti. Ogni scheda ha un mondo separato."
  ],
  "Licence and independence": [
    "Licentie en onafhankelijkheid",
    "Licence et indépendance",
    "Licencia e independencia",
    "Lizenz und Unabhängigkeit",
    "Licença e independência",
    "Licenza e indipendenza"
  ],
  "Original code and lessons use Apache-2.0. Third-party components retain their own terms.": [
    "Originele code en lessen gebruiken Apache-2.0. Onderdelen van derden behouden hun eigen voorwaarden.",
    "Le code et les cours originaux sont sous Apache-2.0. Les composants tiers conservent leurs conditions.",
    "El código y las lecciones originales usan Apache-2.0. Los componentes de terceros conservan sus condiciones.",
    "Originalcode und Lektionen stehen unter Apache-2.0. Drittanbieterkomponenten behalten ihre eigenen Bedingungen.",
    "O código e as lições originais usam Apache-2.0. Os componentes de terceiros mantêm os seus termos.",
    "Codice e lezioni originali usano Apache-2.0. I componenti di terzi mantengono i propri termini."
  ],
  "KineNest teaches concepts and workflows used with ROS™ 2.": [
    "KineNest onderwijst concepten en werkwijzen uit ROS™ 2.",
    "KineNest enseigne des concepts et méthodes utilisés avec ROS™ 2.",
    "KineNest enseña conceptos y flujos de trabajo de ROS™ 2.",
    "KineNest vermittelt Konzepte und Abläufe aus ROS™ 2.",
    "O KineNest ensina conceitos e métodos usados com ROS™ 2.",
    "KineNest insegna concetti e flussi di lavoro usati con ROS™ 2."
  ],
  "ROS is a trademark of Open Source Robotics Foundation, Inc. KineNest is not affiliated with or endorsed by Open Robotics.": [
    "ROS is een handelsmerk van Open Source Robotics Foundation, Inc. KineNest is niet verbonden aan of goedgekeurd door Open Robotics.",
    "ROS est une marque d’Open Source Robotics Foundation, Inc. KineNest n’est ni affilié à Open Robotics ni approuvé par cette organisation.",
    "ROS es una marca de Open Source Robotics Foundation, Inc. KineNest no está afiliado a Open Robotics ni cuenta con su respaldo.",
    "ROS ist eine Marke der Open Source Robotics Foundation, Inc. KineNest ist weder mit Open Robotics verbunden noch von ihr empfohlen.",
    "ROS é uma marca da Open Source Robotics Foundation, Inc. O KineNest não é afiliado nem apoiado pela Open Robotics.",
    "ROS è un marchio di Open Source Robotics Foundation, Inc. KineNest non è affiliato né approvato da Open Robotics."
  ],
  "Show all frames": [
    "Alle frames tonen",
    "Afficher tous les repères",
    "Mostrar todos los marcos",
    "Alle Koordinatensysteme zeigen",
    "Mostrar todos os referenciais",
    "Mostra tutti i riferimenti"
  ],
  "Client created → request → response → robot reset": [
    "code-client gemaakt → verzoek → antwoord → robot gereset",
    "Client code créé → requête → réponse → robot réinitialisé",
    "Cliente code creado → petición → respuesta → robot reiniciado",
    "code-Client erstellt → Anfrage → Antwort → Roboter zurückgesetzt",
    "Cliente code criado → pedido → resposta → robô reiniciado",
    "Client code creato → richiesta → risposta → robot ripristinato"
  ],
  "Code published control commands": [
    "code publiceerde besturingscommando’s",
    "code a publié des commandes de contrôle",
    "code publicó comandos de control",
    "code veröffentlichte Steuerbefehle",
    "code publicou comandos de controlo",
    "code ha pubblicato comandi di controllo"
  ],
  "Timer fired and code published at least 5 messages": [
  "Timer actief en minstens 5 berichten gepubliceerd",
  "Timer actif et au moins 5 messages publiés",
  "Temporizador activo y al menos 5 mensajes publicados",
  "Timer aktiv und mindestens 5 Nachrichten veröffentlicht",
  "Temporizador ativo e pelo menos 5 mensagens publicadas",
  "Il timer è scattato e il codice ha pubblicato almeno 5 messaggi"
],
  "Subscriber received 3 String messages": [
    "code-subscriber ontving 3 String-berichten",
    "Le subscriber code a reçu 3 messages String",
    "Subscriber code recibió 3 mensajes String",
    "code-Subscriber empfing 3 String-Nachrichten",
    "Subscriber code recebeu 3 mensagens String",
    "Il subscriber code ha ricevuto 3 messaggi String"
  ],
  "Live parameter changed and code read both values": [
    "Parameter gewijzigd tijdens uitvoering en beide waarden gelezen",
    "Paramètre modifié pendant l’exécution et deux valeurs lues",
    "Parámetro cambiado en vivo; code leyó ambos valores",
    "Parameter live geändert; code las beide Werte",
    "Parâmetro alterado em execução; code leu ambos os valores",
    "Parametro modificato durante l'esecuzione; code ha letto entrambi i valori"
  ],
  "Code": [
    "Code",
    "Code",
    "Código",
    "Code",
    "Código",
    "Codice"
  ],
  "Code language": [
    "Programmeertaal",
    "Langage de programmation",
    "Lenguaje de programación",
    "Programmiersprache",
    "Linguagem de programação",
    "Linguaggio di programmazione"
  ],
  "Compare": [
    "Vergelijken",
    "Comparer",
    "Comparar",
    "Vergleichen",
    "Comparar",
    "Confronta"
  ],
  "Run C++": [
    "C++ uitvoeren",
    "Exécuter C++",
    "Ejecutar C++",
    "C++ ausführen",
    "Executar C++",
    "Esegui C++"
  ],
  "Stop": [
    "Stoppen",
    "Arrêter",
    "Detener",
    "Stoppen",
    "Parar",
    "Ferma"
  ],
  "C++ source code": [
    "C++-broncode",
    "Code source C++",
    "Código fuente C++",
    "C++-Quellcode",
    "Código-fonte C++",
    "Codice sorgente C++"
  ],
  "Code output": [
    "Code-uitvoer",
    "Sortie du code",
    "Salida del código",
    "Code-Ausgabe",
    "Saída do código",
    "Output del codice"
  ],
  "This exercise uses Python. Your C++ draft is preserved.": [
    "Deze oefening gebruikt Python. Je C++-code blijft bewaard.",
    "Cet exercice utilise Python. Votre code C++ est conservé.",
    "Este ejercicio usa Python. Tu código C++ se conserva.",
    "Diese Übung verwendet Python. Dein C++-Entwurf bleibt erhalten.",
    "Este exercício usa Python. O teu código C++ é preservado.",
    "Questo esercizio usa Python. Il codice C++ resta salvato."
  ],
  "Experimental C++ · first run downloads about 60 MB. Cached when available.": [
  "Experimentele C++ · de eerste uitvoering downloadt ongeveer 60 MB. Cache indien beschikbaar.",
  "C++ expérimental · le premier lancement télécharge environ 60 Mo. Cache si disponible.",
  "C++ experimental · la primera ejecución descarga unos 60 MB. Caché si está disponible.",
  "Experimentelles C++ · beim ersten Start werden etwa 60 MB geladen. Cache, wenn verfügbar.",
  "C++ experimental · a primeira execução transfere cerca de 60 MB. Cache quando disponível.",
  "C++ sperimentale · la prima esecuzione scarica circa 60 MB. Cache quando disponibile."
],
  "C++ comparison draft. Execution is not available for this exercise.": [
    "C++-code ter vergelijking. Uitvoeren is voor deze oefening niet beschikbaar.",
    "Code C++ de comparaison. L’exécution n’est pas disponible pour cet exercice.",
    "Código C++ para comparar. La ejecución no está disponible en este ejercicio.",
    "C++-Vergleichsentwurf. Ausführung ist für diese Übung nicht verfügbar.",
    "Código C++ para comparação. A execução não está disponível neste exercício.",
    "Codice C++ per il confronto. L’esecuzione non è disponibile per questo esercizio."
  ],
  "Complete the TODOs, then Run. Tab indents; Escape then Tab leaves the editor. Stop terminates execution.": [
    "Vul de TODOs aan en voer uit. Tab springt in; Escape en Tab verlaten de editor. Stop beëindigt de uitvoering.",
    "Complétez les TODOs, puis exécutez. Tab indente ; Échap puis Tab quitte l’éditeur. Stop termine l’exécution.",
    "Completa los TODOs y ejecuta. Tab indenta; Escape y Tab sale del editor. Stop termina la ejecución.",
    "TODOs ergänzen und ausführen. Tab rückt ein; Escape und Tab verlassen den Editor. Stop beendet die Ausführung.",
    "Completa os TODOs e executa. Tab indenta; Escape e Tab sai do editor. Stop termina a execução.",
    "Completa i TODO ed esegui. Tab indenta; Esc seguito da Tab esce dall’editor. Stop termina l’esecuzione."
  ],
  "Loading Python runtime…": [
    "Python-runtime laden…",
    "Chargement de Python…",
    "Cargando Python…",
    "Python-Laufzeit laden…",
    "A carregar Python…",
    "Caricamento di Python…"
  ],
  "Loading NumPy…": [
    "NumPy laden…",
    "Chargement de NumPy…",
    "Cargando NumPy…",
    "NumPy laden…",
    "A carregar NumPy…",
    "Caricamento di NumPy…"
  ],
  "Loading C++ toolchain…": [
    "C++-toolchain laden…",
    "Chargement des outils C++…",
    "Cargando herramientas C++…",
    "C++-Werkzeuge laden…",
    "A carregar ferramentas C++…",
    "Caricamento degli strumenti C++…"
  ],
  "Compiling C++…": [
    "C++ compileren…",
    "Compilation C++…",
    "Compilando C++…",
    "C++ kompilieren…",
    "A compilar C++…",
    "Compilazione C++…"
  ],
  "Linking WebAssembly…": [
    "WebAssembly linken…",
    "Édition des liens WebAssembly…",
    "Enlazando WebAssembly…",
    "WebAssembly linken…",
    "A ligar WebAssembly…",
    "Collegamento WebAssembly…"
  ],
  "Python stopped": [
    "Python gestopt",
    "Python arrêté",
    "Python detenido",
    "Python angehalten",
    "Python parado",
    "Python fermato"
  ],
  "Python executing…": [
    "Python wordt uitgevoerd…",
    "Python en cours…",
    "Python en ejecución…",
    "Python wird ausgeführt…",
    "Python em execução…",
    "Python in esecuzione…"
  ],
  "Python running · callbacks ready": [
    "Python actief · callbacks gereed",
    "Python actif · callbacks prêts",
    "Python activo · callbacks listos",
    "Python aktiv · Callbacks bereit",
    "Python ativo · callbacks prontos",
    "Python attivo · callback pronti"
  ],
  "C++ stopped": [
    "C++ gestopt",
    "C++ arrêté",
    "C++ detenido",
    "C++ angehalten",
    "C++ parado",
    "C++ fermato"
  ],
  "C++ executing…": [
    "C++ wordt uitgevoerd…",
    "C++ en cours…",
    "C++ en ejecución…",
    "C++ wird ausgeführt…",
    "C++ em execução…",
    "C++ in esecuzione…"
  ],
  "C++ running · callbacks ready": [
    "C++ actief · callbacks gereed",
    "C++ actif · callbacks prêts",
    "C++ activo · callbacks listos",
    "C++ aktiv · Callbacks bereit",
    "C++ ativo · callbacks prontos",
    "C++ attivo · callback pronti"
  ],
  "RGB channel means:": [
    "Gemiddelde RGB-kanalen:",
    "Moyennes des canaux RGB :",
    "Medias de los canales RGB:",
    "RGB-Kanalmittelwerte:",
    "Médias dos canais RGB:",
    "Medie dei canali RGB:"
  ]
};

Object.assign(UI, {
  "Build & launch": ["Bouwen en starten","Compiler et lancer","Compilar y lanzar","Bauen und starten","Compilar e lançar","Compila e avvia"],
  "Native ROS 2": ["Native ROS 2","ROS 2 natif","ROS 2 nativo","Natives ROS 2","ROS 2 nativo","ROS 2 nativo"],
  "ROS 2 Foundations": ["ROS 2-basis","Fondements de ROS 2","Fundamentos de ROS 2","ROS 2-Grundlagen","Fundamentos de ROS 2","Fondamenti di ROS 2"],
  "Learn nodes, topics, sensors, services, parameters, actions, odometry, frames and debugging.": ["Leer over nodes, topics, sensoren, services, parameters, actions, odometrie, frames en debuggen.","Apprenez les nœuds, topics, capteurs, services, paramètres, actions, l’odométrie, les repères et le débogage.","Aprende nodos, temas, sensores, servicios, parámetros, acciones, odometría, marcos y depuración.","Lerne Knoten, Topics, Sensoren, Services, Parameter, Actions, Odometrie, Frames und Debugging.","Aprende nós, tópicos, sensores, serviços, parâmetros, ações, odometria, referenciais e depuração.","Impara nodi, topic, sensori, servizi, parametri, azioni, odometria, frame e debug."],
  "From KineNest to ROS 2": ["Van KineNest naar ROS 2","De KineNest à ROS 2","De KineNest a ROS 2","Von KineNest zu ROS 2","Do KineNest ao ROS 2","Da KineNest a ROS 2"],
  "Build a workspace, package your nodes, run them and launch a small system.": ["Bouw een werkruimte, verpak je nodes, voer ze uit en start een klein systeem.","Créez un espace de travail, empaquetez vos nœuds, exécutez-les et lancez un petit système.","Crea un espacio de trabajo, empaqueta tus nodos, ejecútalos y lanza un sistema pequeño.","Erstelle einen Arbeitsbereich, verpacke deine Knoten, führe sie aus und starte ein kleines System.","Cria um workspace, organiza os nós num pacote, executa-os e lança um pequeno sistema.","Crea un workspace, organizza i nodi in un pacchetto, eseguili e avvia un piccolo sistema."],
  "Start the final Core section": ["Start het laatste Core-deel","Commencer la dernière section du Core","Iniciar la sección final del Core","Letzten Core-Abschnitt starten","Iniciar a secção final do Core","Inizia la sezione finale del Core"],
  "Future learning tracks": ["Toekomstige leerroutes","Futurs parcours d’apprentissage","Futuras rutas de aprendizaje","Künftige Lernpfade","Futuros percursos de aprendizagem","Percorsi futuri"],
  "Exploring": ["In verkenning","À l’étude","En exploración","In Planung","Em estudo","In esplorazione"],
  "Communication & QoS": ["Communicatie en QoS","Communication et QoS","Comunicación y QoS","Kommunikation und QoS","Comunicação e QoS","Comunicazione e QoS"],
  "Understand what happens underneath ROS 2 communication.": ["Begrijp wat er onder ROS 2-communicatie gebeurt.","Comprenez les mécanismes sous la communication ROS 2.","Comprende qué ocurre bajo la comunicación de ROS 2.","Verstehe die Grundlagen der ROS 2-Kommunikation.","Compreende o que acontece por baixo da comunicação ROS 2.","Comprendi cosa avviene sotto la comunicazione ROS 2."],
  "Manipulation": ["Manipulatie","Manipulation","Manipulación","Manipulation","Manipulação","Manipolazione"],
  "Explore kinematics, trajectories and robotic arms.": ["Verken kinematica, trajecten en robotarmen.","Explorez la cinématique, les trajectoires et les bras robotiques.","Explora cinemática, trayectorias y brazos robóticos.","Erkunde Kinematik, Trajektorien und Roboterarme.","Explora cinemática, trajetórias e braços robóticos.","Esplora cinematica, traiettorie e bracci robotici."],
  "Navigation & Planning": ["Navigatie en planning","Navigation et planification","Navegación y planificación","Navigation und Planung","Navegação e planeamento","Navigazione e pianificazione"],
  "Move from reactive behavior to deliberate motion planning.": ["Ga van reactief gedrag naar gerichte bewegingsplanning.","Passez d’un comportement réactif à la planification du mouvement.","Pasa del comportamiento reactivo a la planificación del movimiento.","Gehe von reaktivem Verhalten zu gezielter Bewegungsplanung über.","Passa de comportamento reativo para planeamento de movimento.","Passa dal comportamento reattivo alla pianificazione del movimento."],
  "Future learning tracks are being explored. Scope may change.": ["Toekomstige leerroutes worden onderzocht. De inhoud kan veranderen.","Les futurs parcours sont à l’étude. Leur contenu peut changer.","Se están estudiando futuras rutas. Su alcance puede cambiar.","Künftige Lernpfade werden geprüft. Der Umfang kann sich ändern.","Os percursos futuros estão em estudo. O âmbito pode mudar.","I percorsi futuri sono in esplorazione. L’ambito può cambiare."],
  "Transition to native ROS 2 Jazzy": ["Overstap naar native ROS 2 Jazzy","Passage à ROS 2 Jazzy natif","Transición a ROS 2 Jazzy nativo","Übergang zu nativem ROS 2 Jazzy","Transição para ROS 2 Jazzy nativo","Passaggio a ROS 2 Jazzy nativo"],
  "First source your installed ROS distribution’s setup.bash and install the declared dependencies. colcon builds packages; sourcing install/local_setup.bash makes the built workspace discoverable. Python-only exercises do not require writing CMake.": ["Source eerst setup.bash van je ROS-distributie en installeer de opgegeven afhankelijkheden. colcon bouwt pakketten; source install/local_setup.bash om de gebouwde werkruimte vindbaar te maken. Voor Python-oefeningen hoef je geen CMake te schrijven.","Sourcez d’abord le setup.bash de votre distribution ROS et installez les dépendances déclarées. colcon compile les paquets ; sourcer install/local_setup.bash rend l’espace de travail visible. Les exercices Python ne demandent pas de CMake.","Primero activa setup.bash de tu distribución ROS e instala las dependencias declaradas. colcon compila paquetes; activar install/local_setup.bash hace visible el espacio compilado. Los ejercicios Python no requieren escribir CMake.","Source zuerst setup.bash deiner ROS-Distribution und installiere die deklarierten Abhängigkeiten. colcon baut Pakete; source install/local_setup.bash macht den gebauten Arbeitsbereich auffindbar. Für Python-Übungen brauchst du kein CMake.","Primeiro carrega setup.bash da tua distribuição ROS e instala as dependências declaradas. colcon compila pacotes; carregar install/local_setup.bash torna o workspace visível. Os exercícios Python não exigem CMake.","Prima carica setup.bash della tua distribuzione ROS e installa le dipendenze dichiarate. colcon compila i pacchetti; caricare install/local_setup.bash rende individuabile il workspace compilato. Gli esercizi Python non richiedono CMake."],
  "The browser taught the graph and control loop. A real ROS 2 installation adds packages, dependencies, build tools and middleware. The final KineNest workspace lets you rehearse this workflow in a browser. The commands below belong on a real ROS 2 Jazzy installation.": ["De browser leerde je de graaf en regellus. Een echte ROS 2-installatie voegt pakketten, afhankelijkheden, bouwgereedschap en middleware toe. In de laatste KineNest-werkruimte oefen je deze werkwijze. De onderstaande opdrachten horen bij een echte ROS 2 Jazzy-installatie.","Le navigateur vous a appris le graphe et la boucle de contrôle. Une installation ROS 2 réelle ajoute paquets, dépendances, outils de compilation et middleware. L’espace de travail final de KineNest permet de s’y entraîner. Les commandes ci-dessous s’exécutent dans ROS 2 Jazzy natif.","El navegador enseñó el grafo y el bucle de control. Una instalación real de ROS 2 añade paquetes, dependencias, herramientas de compilación y middleware. El espacio final de KineNest permite practicar este flujo. Los comandos siguientes son para ROS 2 Jazzy nativo.","Im Browser hast du Graph und Regelkreis kennengelernt. Eine echte ROS 2-Installation ergänzt Pakete, Abhängigkeiten, Build-Werkzeuge und Middleware. Im letzten KineNest-Arbeitsbereich übst du diesen Ablauf. Die folgenden Befehle gehören zu einer nativen ROS 2 Jazzy-Installation.","O browser ensinou o grafo e o ciclo de controlo. Uma instalação real de ROS 2 acrescenta pacotes, dependências, ferramentas de compilação e middleware. O workspace final do KineNest permite praticar este fluxo. Os comandos abaixo destinam-se a ROS 2 Jazzy nativo.","Nel browser hai imparato il grafo e il ciclo di controllo. Un’installazione reale di ROS 2 aggiunge pacchetti, dipendenze, strumenti di build e middleware. Il workspace finale di KineNest permette di provare questo flusso. I comandi seguenti si usano in ROS 2 Jazzy nativo."],
  "← Return to the final Core workspace": ["← Terug naar de laatste Core-werkruimte","← Retour à l’espace de travail final du Core","← Volver al espacio final del Core","← Zurück zum letzten Core-Arbeitsbereich","← Voltar ao workspace final do Core","← Torna al workspace finale del Core"]
});

Object.assign(UI, {
  "You have already assembled, built and launched a two-node package in KineNest. Carry that same package and command sequence to a Jazzy installation.": ["Je hebt in KineNest een pakket met twee nodes gebouwd en gestart. Gebruik hetzelfde pakket en dezelfde opdrachten in Jazzy.","Vous avez assemblé, compilé et lancé un paquet à deux nœuds dans KineNest. Reprenez ce paquet et ces commandes dans Jazzy.","Ya has creado, compilado y lanzado un paquete de dos nodos en KineNest. Usa ese paquete y esos comandos en Jazzy.","Du hast in KineNest ein Paket mit zwei Knoten erstellt, gebaut und gestartet. Nutze dasselbe Paket und dieselben Befehle in Jazzy.","Já criaste, compilaste e lançaste um pacote com dois nós no KineNest. Usa o mesmo pacote e comandos no Jazzy.","Hai creato, compilato e avviato un pacchetto con due nodi in KineNest. Usa lo stesso pacchetto e gli stessi comandi in Jazzy."],
  "Open the final Core workspace to review and export your package": ["Open de laatste Core-werkruimte om je pakket te bekijken en exporteren","Ouvrir l’espace de travail final pour examiner et exporter votre paquet","Abre el espacio final para revisar y exportar tu paquete","Öffne den letzten Core-Arbeitsbereich, um dein Paket zu prüfen und zu exportieren","Abre o workspace final para rever e exportar o teu pacote","Apri il workspace finale per controllare ed esportare il pacchetto"],
  "Move your package to Jazzy": ["Breng je pakket naar Jazzy","Transférer votre paquet vers Jazzy","Lleva tu paquete a Jazzy","Übertrage dein Paket nach Jazzy","Leva o teu pacote para Jazzy","Porta il pacchetto in Jazzy"],
  "Export the Python or C++ package ZIP and extract my_robot_pkg into ~/ros2_ws/src. Check package.xml and install its declared native dependencies before building.": ["Exporteer het Python- of C++-pakket als ZIP en pak my_robot_pkg uit in ~/ros2_ws/src. Controleer package.xml en installeer de vermelde afhankelijkheden vóór het bouwen.","Exportez le paquet Python ou C++ en ZIP et extrayez my_robot_pkg dans ~/ros2_ws/src. Vérifiez package.xml et installez les dépendances déclarées avant la compilation.","Exporta el ZIP del paquete Python o C++ y extrae my_robot_pkg en ~/ros2_ws/src. Revisa package.xml e instala las dependencias declaradas antes de compilar.","Exportiere das Python- oder C++-Paket als ZIP und entpacke my_robot_pkg nach ~/ros2_ws/src. Prüfe package.xml und installiere die angegebenen Abhängigkeiten vor dem Build.","Exporta o ZIP do pacote Python ou C++ e extrai my_robot_pkg para ~/ros2_ws/src. Verifica package.xml e instala as dependências declaradas antes da compilação.","Esporta lo ZIP del pacchetto Python o C++ ed estrai my_robot_pkg in ~/ros2_ws/src. Controlla package.xml e installa le dipendenze dichiarate prima della compilazione."],
  "Start each executable in its own sourced terminal, as you did in the bridge. Stop both before using the launch file.": ["Start elk programma in een eigen terminal waarin de omgeving is geladen, zoals in de brug. Stop beide voordat je het launchbestand gebruikt.","Lancez chaque exécutable dans son propre terminal avec l’environnement chargé, comme dans la passerelle. Arrêtez-les avant le fichier launch.","Inicia cada ejecutable en su propia terminal con el entorno cargado, como en el puente. Detén ambos antes de usar el archivo launch.","Starte jedes Programm in einem eigenen Terminal mit geladener Umgebung, wie im Brückenkurs. Beende beide vor der Launch-Datei.","Inicia cada executável no seu terminal com o ambiente carregado, como na ponte. Pára ambos antes de usar o ficheiro launch.","Avvia ogni eseguibile nel proprio terminale con l’ambiente caricato, come nel percorso ponte. Fermali entrambi prima del file launch."],
  "How the same files connect": ["Hoe dezelfde bestanden samenwerken","Comment ces fichiers s’articulent","Cómo se conectan los mismos archivos","Wie dieselben Dateien zusammenhängen","Como se ligam os mesmos ficheiros","Come si collegano gli stessi file"],
  "package.xml declares the package and dependencies. setup.py with setup.cfg, or CMakeLists.txt for C++, defines executable installation. The node source files provide the behavior. launch/system_launch.py starts both installed executables with a parameter and topic remapping.": ["package.xml beschrijft het pakket en de afhankelijkheden. setup.py met setup.cfg, of CMakeLists.txt voor C++, bepaalt de installatie van programma’s. De nodebronnen bepalen het gedrag. launch/system_launch.py start beide programma’s met een parameter en topicomleiding.","package.xml déclare le paquet et ses dépendances. setup.py avec setup.cfg, ou CMakeLists.txt en C++, définit l’installation des exécutables. Les sources des nœuds définissent leur comportement. launch/system_launch.py démarre les deux exécutables avec un paramètre et un remappage de topic.","package.xml declara el paquete y sus dependencias. setup.py con setup.cfg, o CMakeLists.txt en C++, define la instalación de ejecutables. Los fuentes de los nodos definen su comportamiento. launch/system_launch.py inicia ambos ejecutables con un parámetro y un remapeo de tema.","package.xml deklariert Paket und Abhängigkeiten. setup.py mit setup.cfg oder CMakeLists.txt für C++ legt die Installation der Programme fest. Der Quellcode bestimmt ihr Verhalten. launch/system_launch.py startet beide mit einem Parameter und Topic-Remapping.","package.xml declara o pacote e as dependências. setup.py com setup.cfg, ou CMakeLists.txt em C++, define a instalação dos executáveis. Os ficheiros dos nós definem o comportamento. launch/system_launch.py inicia ambos com um parâmetro e um remapeamento de tópico.","package.xml dichiara il pacchetto e le dipendenze. setup.py con setup.cfg, oppure CMakeLists.txt per C++, definisce l’installazione degli eseguibili. I sorgenti dei nodi definiscono il comportamento. launch/system_launch.py avvia entrambi con un parametro e una rimappatura del topic."],
  "A wrong remapping produces two live topics without a connected publisher and subscriber. Inspect the graph, correct the launch file, rebuild and relaunch, just as in KineNest.": ["Een verkeerde omleiding levert twee actieve topics op zonder verbinding tussen publisher en subscriber. Bekijk de graaf, herstel het launchbestand, bouw opnieuw en start opnieuw, zoals in KineNest.","Un mauvais remappage crée deux topics actifs sans connexion entre publisher et subscriber. Examinez le graphe, corrigez le fichier launch, recompilez et relancez, comme dans KineNest.","Un remapeo incorrecto crea dos temas activos sin conexión entre publisher y subscriber. Inspecciona el grafo, corrige el archivo launch, recompila y vuelve a lanzar, como en KineNest.","Ein falsches Remapping erzeugt zwei aktive Topics ohne Verbindung zwischen Publisher und Subscriber. Prüfe den Graphen, korrigiere die Launch-Datei, baue und starte erneut, wie in KineNest.","Um remapeamento errado cria dois tópicos ativos sem ligação entre publisher e subscriber. Inspeciona o grafo, corrige o ficheiro launch, recompila e relança, como no KineNest.","Una rimappatura errata crea due topic attivi senza collegamento tra publisher e subscriber. Esamina il grafo, correggi il file launch, ricompila e riavvia, come in KineNest."],
  "Native ROS 2 adds Linux processes, full ament and colcon, DDS/RMW discovery, complete QoS and TF behavior, real drivers and hardware timing. KineNest models these boundaries for learning.": ["Native ROS 2 voegt Linux-processen, volledig ament en colcon, DDS/RMW-detectie, volledig QoS- en TF-gedrag, echte drivers en hardwaretiming toe. KineNest modelleert deze onderdelen om te leren.","ROS 2 natif ajoute les processus Linux, ament et colcon complets, la découverte DDS/RMW, les comportements QoS et TF complets, les pilotes et le temps matériel réels. KineNest en propose un modèle pédagogique.","ROS 2 nativo añade procesos Linux, ament y colcon completos, descubrimiento DDS/RMW, comportamiento QoS y TF completo, controladores reales y tiempos del hardware. KineNest los modela para aprender.","Natives ROS 2 ergänzt Linux-Prozesse, vollständiges ament und colcon, DDS/RMW-Erkennung, vollständiges QoS- und TF-Verhalten, echte Treiber und Hardware-Zeitverhalten. KineNest modelliert diese Bereiche zum Lernen.","O ROS 2 nativo acrescenta processos Linux, ament e colcon completos, descoberta DDS/RMW, comportamento completo de QoS e TF, controladores reais e temporização do hardware. O KineNest modela estas partes para aprendizagem.","ROS 2 nativo aggiunge processi Linux, ament e colcon completi, scoperta DDS/RMW, comportamento completo di QoS e TF, driver reali e tempi dell’hardware. KineNest ne offre un modello didattico."],
  "The exported starter packages were built, run and launched on native Jazzy during Core validation. Your edits and hardware setup still need their own native tests.": ["De geëxporteerde startpakketten zijn tijdens de Core-validatie gebouwd en gestart op native Jazzy. Test eigen wijzigingen en hardware afzonderlijk op native ROS 2.","Les paquets de départ exportés ont été compilés et lancés sur Jazzy natif lors de la validation du Core. Vos modifications et votre matériel demandent leurs propres tests natifs.","Los paquetes iniciales exportados se compilaron y ejecutaron en Jazzy nativo durante la validación del Core. Tus cambios y hardware necesitan sus propias pruebas nativas.","Die exportierten Startpakete wurden bei der Core-Prüfung unter nativem Jazzy gebaut und gestartet. Eigene Änderungen und Hardware brauchen eigene native Tests.","Os pacotes iniciais exportados foram compilados e executados em Jazzy nativo durante a validação do Core. As tuas alterações e o hardware precisam de testes nativos próprios.","I pacchetti iniziali esportati sono stati compilati ed eseguiti su Jazzy nativo durante la verifica del Core. Le tue modifiche e l’hardware richiedono test nativi propri."],
  "Official Jazzy package tutorial": ["Officiële Jazzy-pakkettutorial","Tutoriel officiel Jazzy sur les paquets","Tutorial oficial de paquetes Jazzy","Offizielles Jazzy-Pakettutorial","Tutorial oficial Jazzy sobre pacotes","Tutorial ufficiale Jazzy sui pacchetti"],
  "Official Jazzy package launch tutorial": ["Officiële Jazzy-tutorial over launch in pakketten","Tutoriel officiel Jazzy sur launch dans les paquets","Tutorial oficial Jazzy sobre launch en paquetes","Offizielles Jazzy-Tutorial zu Launch in Paketen","Tutorial oficial Jazzy sobre launch em pacotes","Tutorial ufficiale Jazzy su launch nei pacchetti"],
  "Official Jazzy launch tutorial": ["Officiële Jazzy-launchtutorial","Tutoriel officiel Jazzy sur launch","Tutorial oficial Jazzy de launch","Offizielles Jazzy-Launch-Tutorial","Tutorial oficial Jazzy de launch","Tutorial ufficiale Jazzy su launch"]
});

// Linked names stay fixed; the sentence and flag description follow the UI language.
export const ATTRIBUTION = Object.freeze({
  en: ['Made with love in Belgium 🇧🇪 by ', ', an {flag} soul, with development assistance from ', ' by ', 'Italian'],
  nl: ['Met liefde gemaakt in België 🇧🇪 door ', ', met een {flag} ziel, met ontwikkelhulp van ', ' van ', 'Italiaans'],
  fr: ['Créé avec amour en Belgique 🇧🇪 par ', ', à l’âme {flag}, avec l’aide au développement de ', ' par ', 'italienne'],
  es: ['Hecho con amor en Bélgica 🇧🇪 por ', ', de alma {flag}, con ayuda en el desarrollo de ', ' de ', 'italiana'],
  de: ['Mit Liebe in Belgien 🇧🇪 entwickelt von ', ', mit {flag} Seele, mit Entwicklungsunterstützung durch ', ' von ', 'italienisch'],
  pt: ['Feito com amor na Bélgica 🇧🇪 por ', ', de alma {flag}, com apoio ao desenvolvimento de ', ' da ', 'italiana'],
  it: ['Realizzato con amore in Belgio 🇧🇪 da ', ', dall’anima {flag}, con il supporto allo sviluppo di ', ' di ', 'italiana']
});

Object.assign(UI, {
  "KineNest Core": [
    "KineNest Core",
    "KineNest Core",
    "KineNest Core",
    "KineNest Core",
    "KineNest Core",
    "KineNest Core"
  ],
  "Core finale": [
    "Core-finale",
    "Finale du Core",
    "Final del Core",
    "Core-Finale",
    "Final do Core",
    "Finale del Core"
  ],
  "Explore next": [
    "Ontdek hierna",
    "À explorer ensuite",
    "Explora después",
    "Als Nächstes entdecken",
    "Explora a seguir",
    "Esplora dopo"
  ],
  "Complete the Core with workspace, packages, build, ros2 run, launch and the native Jazzy transition.": [
    "Rond de Core af met werkruimte, pakketten, build, ros2 run, launch en de overstap naar native Jazzy.",
    "Terminez le Core avec espace de travail, paquets, compilation, ros2 run, launch et transition vers Jazzy natif.",
    "Completa el Core con espacio de trabajo, paquetes, compilación, ros2 run, launch y transición a Jazzy nativo.",
    "Schließe den Core mit Arbeitsbereich, Paketen, Build, ros2 run, Launch und dem Übergang zu nativem Jazzy ab.",
    "Conclui o Core com workspace, pacotes, compilação, ros2 run, launch e transição para Jazzy nativo.",
    "Completa il Core con workspace, pacchetti, build, ros2 run, launch e passaggio a Jazzy nativo."
  ],
  "No new ROS concepts from here. Diagnose and combine what you learned in the previous sessions.": [
    "Vanaf hier geen nieuwe ROS-concepten. Zoek fouten en combineer wat je in de vorige sessies leerde.",
    "Plus de nouveaux concepts ROS ici. Diagnostiquez et combinez les acquis des sessions précédentes.",
    "Aquí no hay conceptos ROS nuevos. Diagnostica y combina lo aprendido en las sesiones anteriores.",
    "Ab hier kommen keine neuen ROS-Konzepte hinzu. Finde Fehler und kombiniere das Wissen aus den bisherigen Sitzungen.",
    "A partir daqui não há novos conceitos ROS. Diagnostica e combina o que aprendeste nas sessões anteriores.",
    "Da qui nessun nuovo concetto ROS. Diagnostica e combina ciò che hai imparato nelle sessioni precedenti."
  ]
});

Object.assign(UI, {
  "Timer published 3 String messages on /chatter": [
    "Timer publiceerde 3 String-berichten op /chatter",
    "Le timer a publié 3 messages String sur /chatter",
    "El temporizador publicó 3 mensajes String en /chatter",
    "Timer hat 3 String-Nachrichten auf /chatter gesendet",
    "O temporizador publicou 3 mensagens String em /chatter",
    "Il timer ha pubblicato 3 messaggi String su /chatter"
  ],
  "Declared speed on /student_controller and published motion": [
    "speed gedeclareerd op /student_controller en beweging gepubliceerd",
    "speed déclaré sur /student_controller et commande de mouvement publiée",
    "speed declarado en /student_controller y movimiento publicado",
    "speed auf /student_controller deklariert und Bewegung gesendet",
    "speed declarado em /student_controller e movimento publicado",
    "speed dichiarato su /student_controller e moto pubblicato"
  ],
  "Odometry callback reported correct x and y": [
    "Odometrie-callback meldde correcte x en y",
    "Le callback d’odométrie a transmis x et y corrects",
    "El callback de odometría informó x e y correctos",
    "Odometrie-Callback meldete korrekte x und y",
    "O callback de odometria comunicou x e y corretos",
    "Il callback di odometria ha riportato x e y corretti"
  ]
});
