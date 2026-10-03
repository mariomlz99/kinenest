// Rows follow NL, FR, ES, DE, PT. Explicit English fallbacks cover retained reference text.
export const LANGUAGES = ["en","nl","fr","es","de","pt"];
export const UI = {
  "Run Python": [
    "Python uitvoeren",
    "Exécuter Python",
    "Ejecutar Python",
    "Python ausführen",
    "Executar Python"
  ],
  "Stop Python": [
    "Python stoppen",
    "Arrêter Python",
    "Detener Python",
    "Python stoppen",
    "Parar Python"
  ],
  "Restore starter code": [
    "Startcode herstellen",
    "Restaurer le code initial",
    "Restaurar código inicial",
    "Startcode wiederherstellen",
    "Restaurar código inicial"
  ],
  "Check solution": [
    "Oplossing controleren",
    "Vérifier la solution",
    "Comprobar solución",
    "Lösung prüfen",
    "Verificar solução"
  ],
  "Reveal next hint": [
    "Volgende hint",
    "Indice suivant",
    "Siguiente pista",
    "Nächster Hinweis",
    "Próxima dica"
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
    }
  ],
  "+ New terminal": [
    "+ Nieuwe terminal",
    "+ Nouveau terminal",
    "+ Nuevo terminal",
    "+ Neues Terminal",
    "+ Novo terminal"
  ],
  "Show LiDAR rays": [
    "LiDAR-stralen tonen",
    "Afficher les rayons LiDAR",
    "Mostrar rayos LiDAR",
    "LiDAR-Strahlen anzeigen",
    "Mostrar raios LiDAR"
  ],
  "Show student centroid overlay": [
    "Berekend zwaartepunt tonen",
    "Afficher le centroïde calculé",
    "Mostrar centroide calculado",
    "Berechneten Schwerpunkt anzeigen",
    "Mostrar centroide calculado"
  ],
  "Exercise": [
    "Oefening",
    "Exercice",
    "Ejercicio",
    "Übung",
    "Exercício"
  ],
  "Parameters": [
    "Parameters",
    "Paramètres",
    "Parámetros",
    "Parameter",
    "Parâmetros"
  ],
  "Action progress": [
    "Actievoortgang",
    "Progression de l’action",
    "Progreso de la acción",
    "Aktionsfortschritt",
    "Progresso da ação"
  ],
  "TF frames": [
    "TF-frames",
    "Repères TF",
    "Marcos TF",
    "TF-Koordinatensysteme",
    "Referenciais TF"
  ],
  "Exercise complete. Your code passed the behavioural checks.": [
    "Oefening voltooid. Gedragscontroles geslaagd.",
    "Exercice terminé. Vérifications du comportement réussies.",
    "Ejercicio completado. Comprobaciones de comportamiento superadas.",
    "Übung abgeschlossen. Verhaltensprüfungen bestanden.",
    "Exercício concluído. Verificações de comportamento aprovadas."
  ],
  "Not complete yet. Review the checks, output and hints.": [
    "Nog niet voltooid. Bekijk controles, uitvoer en hints.",
    "Pas encore terminé. Consultez les vérifications, la sortie et les indices.",
    "Aún no está completo. Revisa comprobaciones, salida y pistas.",
    "Noch nicht abgeschlossen. Prüfe Ergebnisse, Ausgabe und Hinweise.",
    "Ainda incompleto. Revê as verificações, a saída e as dicas."
  ],
  "Ready. Complete the TODOs and Run Python.": [
    "Klaar. Vul de TODO’s aan en voer Python uit.",
    "Prêt. Complétez les TODO puis exécutez Python.",
    "Listo. Completa los TODO y ejecuta Python.",
    "Bereit. TODOs ergänzen und Python ausführen.",
    "Pronto. Completa os TODO e executa Python."
  ],
  "Callbacks can update node state": [
    "Callbacks kunnen nodetoestand bijwerken",
    "Les callbacks peuvent modifier l’état du nœud",
    "Los callbacks pueden actualizar el estado del nodo",
    "Callbacks können den Knotenzustand ändern",
    "Os callbacks podem atualizar o estado do nó"
  ],
  "On a real ROS 2 machine": [
    "Op een echte ROS 2-machine",
    "Sur une vraie machine ROS 2",
    "En una máquina con ROS 2 real",
    "Auf einem echten ROS 2-System",
    "Numa máquina com ROS 2 real"
  ],
  "Execute": [
    "Uitvoeren",
    "Exécuter",
    "Ejecutar",
    "Ausführen",
    "Executar"
  ],
  "Stop command": [
    "Opdracht stoppen",
    "Arrêter la commande",
    "Detener comando",
    "Befehl stoppen",
    "Parar comando"
  ],
  "Close": [
    "Sluiten",
    "Fermer",
    "Cerrar",
    "Schließen",
    "Fechar"
  ],
  "All hints revealed": [
    "Alle hints getoond",
    "Tous les indices affichés",
    "Todas las pistas mostradas",
    "Alle Hinweise angezeigt",
    "Todas as dicas apresentadas"
  ],
  "A Python workspace": [
    "Een Python-workspace",
    "Un workspace Python",
    "Un workspace Python",
    "Ein Python-Workspace",
    "Um workspace Python"
  ],
  "Custom interfaces and CMake": [
    "Eigen interfaces en CMake",
    "Interfaces personnalisées et CMake",
    "Interfaces propias y CMake",
    "Eigene Schnittstellen und CMake",
    "Interfaces próprias e CMake"
  ],
  "What changes on a real robot?": [
    "Wat verandert op een echte robot?",
    "Qu’est-ce qui change sur un vrai robot ?",
    "¿Qué cambia en un robot real?",
    "Was ändert sich am echten Roboter?",
    "O que muda num robô real?"
  ],
  "Custom interfaces on a real ROS 2 machine": [
    "Eigen interfaces op een echte ROS 2-machine",
    "Interfaces personnalisées sur une vraie machine ROS 2",
    "Interfaces propias en ROS 2 real",
    "Eigene Schnittstellen auf einem echten ROS 2-System",
    "Interfaces próprias em ROS 2 real"
  ],
  "Real interface packages use ament_cmake and rosidl_generate_interfaces during the build. The browser provides generated-like Python classes directly. You do not need to write or run CMake here.": [
    "Echte interfacepackages gebruiken ament_cmake en rosidl_generate_interfaces. De browser levert de Python-klassen direct; hier voer je geen CMake uit.",
    "Les vrais packages utilisent ament_cmake et rosidl_generate_interfaces. Le navigateur fournit les classes Python ; aucun CMake n’est exécuté ici.",
    "Los paquetes reales usan ament_cmake y rosidl_generate_interfaces. El navegador proporciona las clases Python; aquí no se ejecuta CMake.",
    "Echte Pakete nutzen ament_cmake und rosidl_generate_interfaces. Der Browser liefert Python-Klassen direkt; hier läuft kein CMake.",
    "Os pacotes reais usam ament_cmake e rosidl_generate_interfaces. O navegador fornece classes Python; aqui não se executa CMake."
  ],
  "The browser taught the graph and control loop. A real ROS 2 installation adds packages, dependencies, build tools and middleware. These commands belong on a real machine, not in the learning terminal.": [
    "De browser leerde je de graaf en regellus. Een echte ROS 2-installatie voegt packages, afhankelijkheden, bouwtools en middleware toe. Deze opdrachten horen op een echte machine, niet in de leerterminal.",
    "Le navigateur vous a appris le graphe et la boucle de commande. Une vraie installation ROS 2 ajoute packages, dépendances, outils de construction et middleware. Ces commandes appartiennent à une vraie machine, pas au terminal pédagogique.",
    "El navegador enseña el grafo y el control. Una instalación real de ROS 2 añade paquetes, dependencias, compilación y middleware. Estos comandos se ejecutan en una máquina real, no en el terminal de aprendizaje.",
    "Der Browser vermittelt Graph und Regelkreis. Eine echte ROS 2-Installation ergänzt Pakete, Abhängigkeiten, Build-Werkzeuge und Middleware. Diese Befehle gehören auf einen echten Rechner, nicht ins Lernterminal.",
    "O navegador ensina o grafo e o controlo. Uma instalação real de ROS 2 acrescenta pacotes, dependências, compilação e middleware. Estes comandos executam-se numa máquina real, não no terminal de aprendizagem."
  ],
  "Use ament_python for a Python package. package.xml declares dependencies and metadata. setup.py packages the module and registers a console_scripts entry point such as detector = camera_detector.detector:main. setup.cfg installs scripts where ros2 run expects them. Put node creation and spinning inside main().": [
    "Gebruik ament_python voor een Python-package. package.xml beschrijft afhankelijkheden en metadata. setup.py verpakt de module en registreert een console_scripts-entrypoint zoals detector = camera_detector.detector:main. setup.cfg installeert scripts waar ros2 run ze verwacht. Maak en spin de node in main().",
    "Utilisez ament_python pour un package Python. package.xml déclare les dépendances et métadonnées. setup.py empaquette le module et enregistre un point d’entrée console_scripts tel que detector = camera_detector.detector:main. setup.cfg installe les scripts où ros2 run les attend. Créez le nœud et appelez spin dans main().",
    "Usa ament_python. package.xml declara dependencias; setup.py empaqueta el módulo y registra console_scripts, por ejemplo detector = camera_detector.detector:main. setup.cfg coloca los scripts donde ros2 run los busca. Crea el nodo y llama a spin dentro de main().",
    "Nutze ament_python. package.xml deklariert Abhängigkeiten; setup.py paketiert das Modul und registriert console_scripts, etwa detector = camera_detector.detector:main. setup.cfg installiert Skripte für ros2 run. Erstelle den Knoten und rufe spin in main() auf.",
    "Usa ament_python. package.xml declara dependências; setup.py empacota o módulo e regista console_scripts, por exemplo detector = camera_detector.detector:main. setup.cfg instala os scripts onde ros2 run os procura. Cria o nó e chama spin dentro de main()."
  ],
  "First source your installed ROS distribution’s setup.bash and install the declared dependencies. colcon builds packages; sourcing install/setup.bash makes the built workspace discoverable. Python-only exercises do not require writing CMake.": [
    "Source eerst setup.bash van de geïnstalleerde ROS-distributie en installeer de afhankelijkheden. colcon bouwt packages; source install/setup.bash maakt de workspace vindbaar. Voor de Python-oefeningen schrijf je geen CMake.",
    "Sourcez d’abord setup.bash de la distribution ROS installée et installez les dépendances. colcon construit les packages ; source install/setup.bash rend le workspace accessible. Les exercices Python ne nécessitent pas d’écrire du CMake.",
    "Primero carga setup.bash de tu distribución ROS e instala las dependencias. colcon compila los paquetes; source install/setup.bash permite descubrir el workspace. La ruta Python no requiere escribir CMake.",
    "Lade zuerst setup.bash deiner ROS-Distribution und installiere die Abhängigkeiten. colcon baut Pakete; source install/setup.bash macht den Workspace auffindbar. Für den Python-Pfad musst du kein CMake schreiben.",
    "Carrega primeiro setup.bash da distribuição ROS e instala as dependências. colcon compila os pacotes; source install/setup.bash torna o workspace detetável. O percurso Python não exige escrever CMake."
  ],
  "Real custom-interface packages use ament_cmake and rosidl_generate_interfaces to generate language bindings during the build. The browser provides the small Python classes directly; it does not run an interface generator. CMakeLists.txt also belongs in future C++/ament_cmake packages, not in the core Python exercises.": [
    "Echte interfacepackages gebruiken ament_cmake en rosidl_generate_interfaces om taalbindings te genereren. De browser levert kleine Python-klassen rechtstreeks, zonder generator. CMakeLists.txt hoort ook bij toekomstige C++/ament_cmake-packages, niet bij de basis-Python-oefeningen.",
    "Les vrais packages d’interfaces utilisent ament_cmake et rosidl_generate_interfaces pour générer les bindings. Le navigateur fournit directement de petites classes Python, sans générateur. CMakeLists.txt concerne aussi les futurs packages C++/ament_cmake, pas les exercices Python de base.",
    "Los paquetes de interfaces reales usan ament_cmake y rosidl_generate_interfaces para generar clases durante la compilación. El navegador proporciona las clases directamente. CMakeLists.txt también se usa en paquetes C++/ament_cmake, fuera de estos ejercicios Python.",
    "Echte Schnittstellenpakete nutzen ament_cmake und rosidl_generate_interfaces zur Codegenerierung beim Build. Der Browser liefert die Klassen direkt. CMakeLists.txt gehört auch zu C++/ament_cmake-Paketen, nicht zu diesen Python-Übungen.",
    "Os pacotes de interfaces reais usam ament_cmake e rosidl_generate_interfaces para gerar classes na compilação. O navegador fornece as classes diretamente. CMakeLists.txt também pertence a pacotes C++/ament_cmake, fora destes exercícios Python."
  ],
  "Install real rclpy and message packages through your ROS distribution. Replace educational helpers with logging or your own tests. Provide real camera/LiDAR drivers, correct QoS, a real TF broadcaster and an action server matching your interface. TF timestamps, middleware discovery, executors and hardware safety now matter. Begin with a simulator or a stationary robot before enabling motion.": [
    "Installeer echte rclpy- en berichtpackages via je ROS-distributie. Vervang onderwijshelpers door logging of eigen tests. Voorzie camera/LiDAR-drivers, juiste QoS, een TF-broadcaster en een passende action-server. Tijdstempels, discovery, executors en hardwareveiligheid worden belangrijk. Begin in een simulator of met een stilstaande robot.",
    "Installez les vrais packages rclpy et de messages via votre distribution ROS. Remplacez les helpers pédagogiques par des logs ou vos tests. Prévoyez des pilotes caméra/LiDAR, une QoS correcte, un broadcaster TF et un serveur d’action adapté. Horodatages, découverte, executors et sécurité matérielle deviennent importants. Commencez en simulation ou avec un robot immobile.",
    "Instala rclpy y los mensajes de tu distribución ROS. Sustituye los helpers educativos por registros o pruebas. Añade drivers de cámara/LiDAR, QoS apropiada, TF y un servidor de acción. Los tiempos, executors, descubrimiento y seguridad del hardware importan. Empieza en simulación o con el robot parado.",
    "Installiere rclpy und Nachrichtenpakete aus deiner ROS-Distribution. Ersetze Lehrhilfen durch Logging oder Tests. Ergänze Kamera-/LiDAR-Treiber, passende QoS, TF und einen Aktionsserver. Zeitstempel, Executors, Discovery und Hardwaresicherheit sind wichtig. Beginne in Simulation oder mit stehendem Roboter.",
    "Instala rclpy e mensagens da distribuição ROS. Substitui os helpers educativos por registos ou testes. Acrescenta drivers de câmara/LiDAR, QoS adequada, TF e um servidor de ação. Tempos, executors, descoberta e segurança do hardware são importantes. Começa em simulação ou com o robô parado."
  ],
  "The browser’s 2-second velocity timeout, bounded callbacks, latest-only planar TF and limited action server are teaching choices. They are not guarantees from ROS 2.": [
    "De time-out van 2 seconden, begrensde callbacks, nieuwste vlakke TF en beperkte action-server zijn onderwijskeuzes. ROS 2 garandeert dit gedrag niet.",
    "Le délai de vitesse de 2 secondes, les callbacks bornés, le TF plan limité au dernier état et le serveur d’action restreint sont des choix pédagogiques, pas des garanties de ROS 2.",
    "El límite de velocidad de dos segundos, los callbacks limitados, TF plano actual y el servidor de acción reducido son decisiones educativas, no garantías de ROS 2.",
    "Zwei-Sekunden-Geschwindigkeitslimit, begrenzte Callbacks, aktuelles planares TF und eingeschränkter Aktionsserver sind Lehrentscheidungen, keine ROS 2-Garantien.",
    "O prazo de dois segundos, callbacks limitados, TF plano atual e servidor de ação reduzido são escolhas educativas, não garantias de ROS 2."
  ],
  "Scan subscriber accessed range data in three callbacks": [
    "Scan-subscriber las afstanden in drie callbacks",
    "Le subscriber du scan a lu les distances dans trois callbacks",
    "Subscriber de scan leyó distancias en tres callbacks",
    "Scan-Subscriber las Entfernungen in drei Callbacks",
    "Subscriber de scan leu distâncias em três callbacks"
  ],
  "Python subscriber received 3 String messages": [
    "Python-subscriber ontving 3 String-berichten",
    "Le subscriber Python a reçu 3 messages String",
    "Subscriber Python recibió 3 mensajes String",
    "Python-Subscriber empfing 3 String-Nachrichten",
    "Subscriber Python recebeu 3 mensagens String"
  ],
  "Timer fired and Python published at least 5 commands": [
    "Timer actief en minstens 5 Python-publicaties",
    "Timer actif et au moins 5 publications Python",
    "Temporizador activo y al menos 5 comandos publicados",
    "Timer aktiv und mindestens 5 Befehle veröffentlicht",
    "Temporizador ativo e pelo menos 5 comandos publicados"
  ],
  "Front, left and right sectors computed from actual scan angles": [
    "Voor-, linker- en rechtersector berekend uit echte scanhoeken",
    "Secteurs avant, gauche et droit calculés à partir des angles du scan",
    "Sectores frontal, izquierdo y derecho calculados con ángulos del scan",
    "Sektoren vorne, links und rechts aus Scanwinkeln berechnet",
    "Setores frontal, esquerdo e direito calculados com ângulos do scan"
  ],
  "Reacted to obstacle, travelled over 2 m and avoided collisions": [
    "Gereageerd op obstakel, meer dan 2 m gereden zonder botsing",
    "Réaction à l’obstacle et trajet de plus de 2 m sans collision",
    "Reaccionó al obstáculo y recorrió más de 2 m sin colisiones",
    "Auf Hindernis reagiert, über 2 m ohne Kollision gefahren",
    "Reagiu ao obstáculo e percorreu mais de 2 m sem colisões"
  ],
  "Declared and used parameters while publishing motion": [
    "Parameters gedeclareerd en gebruikt bij bewegingscommando’s",
    "Paramètres déclarés et utilisés pour commander le mouvement",
    "Parámetros declarados y usados al publicar movimiento",
    "Parameter deklariert und zur Bewegungssteuerung verwendet",
    "Parâmetros declarados e usados ao publicar movimento"
  ],
  "Live parameter changed and Python read both values": [
    "Parameter gewijzigd tijdens uitvoering en beide waarden gelezen",
    "Paramètre modifié pendant l’exécution et deux valeurs lues",
    "Parámetro cambiado en vivo; Python leyó ambos valores",
    "Parameter live geändert; Python las beide Werte",
    "Parâmetro alterado em execução; Python leu ambos os valores"
  ],
  "Published three valid TargetInfo messages through the graph": [
    "Drie geldige TargetInfo-berichten gepubliceerd",
    "Trois messages TargetInfo valides publiés dans le graphe",
    "Tres mensajes TargetInfo válidos publicados",
    "Drei gültige TargetInfo-Nachrichten veröffentlicht",
    "Três mensagens TargetInfo válidas publicadas"
  ],
  "Action completed and final result received": [
    "Actie voltooid en eindresultaat ontvangen",
    "Action terminée et résultat final reçu",
    "Acción completada y resultado final recibido",
    "Aktion abgeschlossen und Endergebnis empfangen",
    "Ação concluída e resultado final recebido"
  ],
  "Goal accepted, feedback processed and success result received": [
    "Doel geaccepteerd, feedback verwerkt en succesresultaat ontvangen",
    "Objectif accepté, feedback traité et résultat réussi reçu",
    "Objetivo aceptado, feedback procesado y resultado correcto",
    "Ziel angenommen, Feedback verarbeitet und Erfolg empfangen",
    "Objetivo aceite, feedback processado e resultado de sucesso recebido"
  ],
  "Active goal cancelled and cancellation result received": [
    "Lopend doel geannuleerd en resultaat ontvangen",
    "Objectif actif annulé et résultat d’annulation reçu",
    "Objetivo activo cancelado y resultado recibido",
    "Aktives Ziel abgebrochen und Ergebnis empfangen",
    "Objetivo ativo cancelado e resultado recebido"
  ],
  "Odometry callback reported correct x, y and yaw": [
    "Odometrie-callback rapporteerde correcte x, y en yaw",
    "Le callback d’odométrie a rapporté x, y et yaw correctement",
    "Callback de odometría informó x, y, yaw correctos",
    "Odometrie-Callback meldete korrekte x, y und yaw",
    "Callback de odometria comunicou x, y e yaw corretos"
  ],
  "TF lookup reported the laser origin in odom three times": [
    "TF-query rapporteerde de laseroorsprong driemaal in odom",
    "La requête TF a rapporté trois fois l’origine du laser dans odom",
    "Consulta TF informó tres veces el origen del láser en odom",
    "TF-Abfrage meldete den Laserursprung dreimal in odom",
    "Consulta TF comunicou três vezes a origem do laser em odom"
  ],
  "Computed target coordinates in base_link from TF": [
    "Doelcoördinaten in base_link berekend met TF",
    "Coordonnées de la cible dans base_link calculées avec TF",
    "Coordenadas del objetivo en base_link calculadas con TF",
    "Zielkoordinaten in base_link aus TF berechnet",
    "Coordenadas do alvo em base_link calculadas com TF"
  ],
  "Used odometry and stopped at the goal for 0.5 seconds": [
    "Feedback gebruikt en 0.5 s stilgestaan bij het doel",
    "Feedback utilisé et arrêt à la cible pendant 0.5 s",
    "Usó odometría y paró en el objetivo durante 0.5 s",
    "Odometrie genutzt und 0.5 s am Ziel angehalten",
    "Usou odometria e parou no alvo durante 0.5 s"
  ],
  "Reached the goal with scan safety and no collisions": [
    "Doel bereikt met scanveiligheid en zonder botsingen",
    "Cible atteinte avec sécurité LiDAR et sans collision",
    "Objetivo alcanzado con seguridad LiDAR y sin colisiones",
    "Ziel mit Scan-Schutz ohne Kollision erreicht",
    "Alvo alcançado com segurança LiDAR e sem colisões"
  ],
  "Processed images and scan, centered target and stopped at safe range": [
    "Beelden en scan verwerkt, doel gecentreerd en veilig gestopt",
    "Images et scan traités, cible centrée et arrêt à distance sûre",
    "Procesó imagen y scan, centró el objetivo y paró a distancia segura",
    "Bilder und Scan verarbeitet, Ziel zentriert und sicher angehalten",
    "Processou imagem e scan, centrou o alvo e parou a distância segura"
  ],
  "Camera callback received at least 3 images": [
    "Camera-callback ontving minstens 3 beelden",
    "Le callback caméra a reçu au moins 3 images",
    "Callback de cámara recibió al menos 3 imágenes",
    "Kamera-Callback empfing mindestens 3 Bilder",
    "Callback da câmara recebeu pelo menos 3 imagens"
  ],
  "Image width and height accessed": [
    "Breedte en hoogte van het beeld gelezen",
    "Largeur et hauteur de l’image lues",
    "Anchura y altura de imagen leídas",
    "Bildbreite und -höhe gelesen",
    "Largura e altura da imagem lidas"
  ],
  "Image pixels accessed for processing": [
    "Beeldpixels gelezen voor verwerking",
    "Pixels de l’image lus pour traitement",
    "Píxeles de imagen leídos para procesar",
    "Bildpixel zur Verarbeitung gelesen",
    "Píxeis da imagem lidos para processar"
  ],
  "Correct shape and channel means reported": [
    "Correcte vorm en kanaalgemiddelden gerapporteerd",
    "Forme et moyennes des canaux correctement rapportées",
    "Forma y medias de canales correctas",
    "Korrekte Form und Kanalmittelwerte gemeldet",
    "Forma e médias dos canais corretas"
  ],
  "Detection correct in all 4 varied scenes": [
    "Detectie correct in alle 4 gevarieerde scènes",
    "Détection correcte dans les 4 scènes variées",
    "Detección correcta en las 4 escenas",
    "Erkennung in allen 4 Szenen korrekt",
    "Deteção correta nas 4 cenas"
  ],
  "Centroid correct in all 4 varied scenes": [
    "Zwaartepunt correct in alle 4 gevarieerde scènes",
    "Centroïde correct dans les 4 scènes variées",
    "Centroide correcto en las 4 escenas",
    "Schwerpunkt in allen 4 Szenen korrekt",
    "Centroide correto nas 4 cenas"
  ],
  "Python client created → request → response → robot reset": [
    "Python-client gemaakt → verzoek → antwoord → robot gereset",
    "Client Python créé → requête → réponse → robot réinitialisé",
    "Cliente Python creado → petición → respuesta → robot reiniciado",
    "Python-Client erstellt → Anfrage → Antwort → Roboter zurückgesetzt",
    "Cliente Python criado → pedido → resposta → robô reiniciado"
  ],
  "Python published control commands": [
    "Python publiceerde besturingscommando’s",
    "Python a publié des commandes de contrôle",
    "Python publicó comandos de control",
    "Python veröffentlichte Steuerbefehle",
    "Python publicou comandos de controlo"
  ],
  "Target centered and robot stopped for 8 camera frames": [
    "Doel gecentreerd en robot stil voor 8 camerabeelden",
    "Cible centrée et robot arrêté pendant 8 images",
    "Objetivo centrado y robot parado durante 8 imágenes",
    "Ziel zentriert und Roboter für 8 Bilder angehalten",
    "Alvo centrado e robô parado durante 8 imagens"
  ],
  "Language": [
    "Taal",
    "Langue",
    "Idioma",
    "Sprache",
    "Idioma"
  ],
  "Layout": [
    "Indeling",
    "Disposition",
    "Diseño",
    "Anordnung",
    "Disposição"
  ],
  "Light": [
    "Licht",
    "Clair",
    "Claro",
    "Hell",
    "Claro"
  ],
  "Dark": [
    "Donker",
    "Sombre",
    "Oscuro",
    "Dunkel",
    "Escuro"
  ],
  "Workbench": [
    "Werkbank",
    "Atelier",
    "Mesa de trabajo",
    "Arbeitsplatz",
    "Bancada"
  ],
  "Stacked": [
    "Onder elkaar",
    "Empilé",
    "Apilado",
    "Untereinander",
    "Empilhado"
  ],
  "Reset": [
    "Resetten",
    "Réinitialiser",
    "Reiniciar",
    "Zurücksetzen",
    "Reiniciar"
  ],
  "Mission": [
    "Opdracht",
    "Mission",
    "Tarea",
    "Aufgabe",
    "Tarefa"
  ],
  "Robot": [
    "Robot",
    "Robot",
    "Robot",
    "Roboter",
    "Robô"
  ],
  "Graph": [
    "Graaf",
    "Graphe",
    "Grafo",
    "Graph",
    "Grafo"
  ],
  "Learning terminals": [
    "Leerterminals",
    "Terminaux pédagogiques",
    "Terminales de aprendizaje",
    "Lernterminals",
    "Terminais de aprendizagem"
  ],
  "Session": [
    "Sessie",
    "Session",
    "Sesión",
    "Sitzung",
    "Sessão"
  ],
  "Nodes & Topics": [
    "Nodes en topics",
    "Nœuds et topics",
    "Nodos y topics",
    "Knoten und Topics",
    "Nós e topics"
  ],
  "Callbacks & LiDAR": [
    "Callbacks en LiDAR",
    "Callbacks et LiDAR",
    "Callbacks y LiDAR",
    "Callbacks und LiDAR",
    "Callbacks e LiDAR"
  ],
  "Perception & Services": [
    "Perceptie en services",
    "Perception et services",
    "Percepción y servicios",
    "Wahrnehmung und Dienste",
    "Perceção e serviços"
  ],
  "Parameters & Actions": [
    "Parameters en acties",
    "Paramètres et actions",
    "Parámetros y acciones",
    "Parameter und Aktionen",
    "Parâmetros e ações"
  ],
  "Odometry & Frames": [
    "Odometrie en frames",
    "Odométrie et repères",
    "Odometría y marcos",
    "Odometrie und Koordinatensysteme",
    "Odometria e referenciais"
  ],
  "Debugging Challenge": [
    "Debugopdracht",
    "Défi de débogage",
    "Reto de depuración",
    "Debugging-Aufgabe",
    "Desafio de depuração"
  ],
  "Real environment": [
    "Echte omgeving",
    "Environnement réel",
    "Entorno real",
    "Reale Umgebung",
    "Ambiente real"
  ],
  "Source": [
    "Broncode",
    "Code source",
    "Código fuente",
    "Quellcode",
    "Código-fonte"
  ],
  "Licences": [
    "Licenties",
    "Licences",
    "Licencias",
    "Lizenzen",
    "Licenças"
  ],
  "About": [
    "Over het project",
    "À propos",
    "Acerca del proyecto",
    "Über das Projekt",
    "Sobre o projeto"
  ],
  "Technical details": [
    "Technische details",
    "Détails techniques",
    "Detalles técnicos",
    "Technische Details",
    "Detalhes técnicos"
  ],
  "Educational runtime": [
    "Educatieve runtime",
    "Runtime pédagogique",
    "Runtime educativo",
    "Lernumgebung",
    "Runtime educativo"
  ],
  "Interactive robotics learning in your browser.": [
    "Interactief robotica leren in je browser.",
    "Apprentissage interactif de la robotique dans votre navigateur.",
    "Aprendizaje interactivo de robótica en tu navegador.",
    "Robotik interaktiv im Browser lernen.",
    "Aprendizagem interativa de robótica no navegador."
  ],
  "6 sessions · Python · No installation": [
    "6 sessies · Python · Geen installatie",
    "6 sessions · Python · Sans installation",
    "6 sesiones · Python · Sin instalación",
    "6 Sitzungen · Python · Ohne Installation",
    "6 sessões · Python · Sem instalação"
  ],
  "Open-source browser robotics education": [
    "Open-source roboticaonderwijs in de browser",
    "Enseignement robotique open source dans le navigateur",
    "Educación robótica de código abierto en el navegador",
    "Open-Source-Robotiklehre im Browser",
    "Ensino de robótica de código aberto no navegador"
  ],
  "Real Python with an educational robotics runtime.": [
    "Echte Python met een educatieve roboticaruntime.",
    "Python réel avec un runtime robotique pédagogique.",
    "Python real con un runtime educativo de robótica.",
    "Echtes Python mit einer Robotik-Lernumgebung.",
    "Python real com um runtime educativo de robótica."
  ],
  "Complete the TODOs, then Run. Tab indents; Escape then Tab leaves the editor. Stop terminates Python.": [
    "Vul de TODO’s aan en voer uit. Tab springt in; Escape en Tab verlaten de editor. Stop beëindigt Python.",
    "Complétez les TODO puis exécutez. Tab indente ; Échap puis Tab quitte l’éditeur. Stop termine Python.",
    "Completa los TODO y ejecuta. Tab indenta; Escape y Tab salen del editor. Detener termina Python.",
    "TODOs ergänzen und ausführen. Tab rückt ein; Escape und Tab verlassen den Editor. Stop beendet Python.",
    "Completa os TODO e executa. Tab indenta; Escape e Tab saem do editor. Parar termina Python."
  ],
  "Exercise complete.": [
    "Oefening voltooid.",
    "Exercice terminé.",
    "Ejercicio completado.",
    "Übung abgeschlossen.",
    "Exercício concluído."
  ],
  "Not complete yet. Travel at least 1 m.": [
    "Nog niet voltooid. Rij minstens 1 m.",
    "Pas encore terminé. Parcourez au moins 1 m.",
    "Aún incompleto. Recorre al menos 1 m.",
    "Noch nicht abgeschlossen. Fahre mindestens 1 m.",
    "Ainda incompleto. Percorre pelo menos 1 m."
  ],
  "Ready. Discover the graph in the terminal.": [
    "Klaar. Verken de graaf in de terminal.",
    "Prêt. Explorez le graphe dans le terminal.",
    "Listo. Explora el grafo en el terminal.",
    "Bereit. Erkunde den Graphen im Terminal.",
    "Pronto. Explora o grafo no terminal."
  ],
  "Loading lesson…": [
    "Les laden…",
    "Chargement de l’exercice…",
    "Cargando ejercicio…",
    "Übung wird geladen…",
    "A carregar exercício…"
  ],
  "Reset complete.": [
    "Reset voltooid.",
    "Réinitialisation terminée.",
    "Reinicio completado.",
    "Zurückgesetzt.",
    "Reinício concluído."
  ],
  "Ready": [
    "Klaar",
    "Prêt",
    "Listo",
    "Bereit",
    "Pronto"
  ],
  "Command active": [
    "Opdracht actief",
    "Commande active",
    "Comando activo",
    "Befehl aktiv",
    "Comando ativo"
  ],
  "Store the latest detection on self so another callback can use it.": [
    "Bewaar de laatste detectie op self voor andere callbacks.",
    "Mémorisez la dernière détection sur self pour les autres callbacks.",
    "Guarda la última detección en self para otros callbacks.",
    "Speichere die letzte Erkennung in self für andere Callbacks.",
    "Guarda a última deteção em self para outros callbacks."
  ],
  "Camera callback → node state → other callbacks.": [
    "Camera-callback → nodetoestand → andere callbacks.",
    "Callback caméra → état du nœud → autres callbacks.",
    "Callback de cámara → estado del nodo → otros callbacks.",
    "Kamera-Callback → Knotenzustand → andere Callbacks.",
    "Callback da câmara → estado do nó → outros callbacks."
  ],
  "Put your Python node in an ament_python package. Build the workspace with colcon, then run the node with ros2 run.": [
    "Plaats je Python-node in een ament_python-package. Bouw met colcon en start met ros2 run.",
    "Placez le nœud Python dans un package ament_python. Construisez avec colcon, puis lancez avec ros2 run.",
    "Coloca el nodo Python en un paquete ament_python. Compila con colcon y ejecútalo con ros2 run.",
    "Lege den Python-Knoten in ein ament_python-Paket. Baue mit colcon und starte mit ros2 run.",
    "Coloca o nó Python num pacote ament_python. Compila com colcon e executa com ros2 run."
  ],
  "/cmd_vel discovered": [
    "/cmd_vel ontdekt",
    "/cmd_vel découvert",
    "/cmd_vel descubierto",
    "/cmd_vel entdeckt",
    "/cmd_vel descoberto"
  ],
  "Valid Twist published": [
    "Geldige Twist gepubliceerd",
    "Twist valide publié",
    "Twist válido publicado",
    "Gültigen Twist veröffentlicht",
    "Twist válido publicado"
  ],
  "Distance travelled:": [
    "Afgelegde afstand:",
    "Distance parcourue :",
    "Distancia recorrida:",
    "Zurückgelegte Strecke:",
    "Distância percorrida:"
  ],
  "Scan callback reported three correct finite distances": [
    "Scan-callback rapporteerde drie juiste eindige afstanden",
    "Callback scan : trois distances finies correctes",
    "Callback de scan informó tres distancias finitas correctas",
    "Scan-Callback meldete drei korrekte endliche Abstände",
    "Callback de scan comunicou três distâncias finitas corretas"
  ],
  "Moved, then stopped 0.55–1.10 m before the obstacle": [
    "Gereden en 0.55–1.10 m voor obstakel gestopt",
    "Déplacement puis arrêt à 0.55–1.10 m de l’obstacle",
    "Avanzó y paró a 0.55–1.10 m del obstáculo",
    "Gefahren und 0.55–1.10 m vor dem Hindernis angehalten",
    "Avançou e parou a 0.55–1.10 m do obstáculo"
  ],
  "Visited the waypoints in order and stopped at the final goal": [
    "Waypoints op volgorde bezocht en bij einddoel gestopt",
    "Points de passage visités dans l’ordre, arrêt à l’arrivée",
    "Visitó los puntos en orden y paró en el destino",
    "Wegpunkte der Reihe nach besucht und am Ziel angehalten",
    "Visitou os pontos por ordem e parou no destino"
  ],
  "Official ROS 2 package tutorial": [
    "Officiële ROS 2-packagehandleiding",
    "Tutoriel officiel des packages ROS 2",
    "Tutorial oficial de paquetes ROS 2",
    "Offizielles ROS 2-Paket-Tutorial",
    "Tutorial oficial de pacotes ROS 2"
  ],
  "Official custom-interface tutorial": [
    "Officiële handleiding voor eigen interfaces",
    "Tutoriel officiel des interfaces personnalisées",
    "Tutorial oficial de interfaces propias",
    "Offizielles Tutorial für eigene Schnittstellen",
    "Tutorial oficial de interfaces próprias"
  ],
  "Use a second terminal to observe messages. Ctrl+C stops a stream.": [
    "Gebruik een tweede terminal om berichten te volgen. Ctrl+C stopt de stream.",
    "Observez les messages dans un second terminal. Ctrl+C arrête le flux.",
    "Observa mensajes en otro terminal. Ctrl+C detiene el flujo.",
    "Beobachte Nachrichten im zweiten Terminal. Ctrl+C stoppt den Stream.",
    "Observa mensagens noutro terminal. Ctrl+C para o fluxo."
  ],
  "A Twist carries velocity, not position. Here, one command runs for 2 seconds, then the controller stops automatically.": [
    "Een Twist bevat snelheid, geen positie. Hier duurt één opdracht 2 seconden; daarna stopt de controller.",
    "Twist contient une vitesse, pas une position. Ici, une commande dure 2 secondes, puis le contrôleur s’arrête.",
    "Twist contiene velocidad, no posición. Aquí un comando dura 2 segundos y el controlador se detiene.",
    "Twist enthält Geschwindigkeit, keine Position. Hier wirkt ein Befehl 2 Sekunden, dann stoppt der Controller.",
    "Twist contém velocidade, não posição. Aqui um comando dura 2 segundos e o controlador para."
  ],
  "One graph, multiple terminals. Observe in one; publish in another.": [
    "Eén graaf, meerdere terminals. Volg berichten in één en publiceer in een andere.",
    "Un graphe, plusieurs terminaux. Observez dans l’un, publiez dans l’autre.",
    "Un grafo, varios terminales. Observa en uno y publica en otro.",
    "Ein Graph, mehrere Terminals. Beobachte in einem, sende im anderen.",
    "Um grafo, vários terminais. Observa num e publica noutro."
  ],
  "Camera · /camera/image_raw": [
    "Camera · /camera/image_raw",
    "Caméra · /camera/image_raw",
    "Cámara · /camera/image_raw",
    "Kamera · /camera/image_raw",
    "Câmara · /camera/image_raw"
  ],
  "No student detection reported": [
    "Nog geen detectie gerapporteerd",
    "Aucune détection signalée",
    "Sin detección comunicada",
    "Noch keine Erkennung gemeldet",
    "Nenhuma deteção comunicada"
  ],
  "Waiting for image…": [
    "Wachten op beeld…",
    "En attente d’image…",
    "Esperando imagen…",
    "Warte auf Bild…",
    "À espera de imagem…"
  ],
  "Loading…": [
    "Laden…",
    "Chargement…",
    "Cargando…",
    "Wird geladen…",
    "A carregar…"
  ],
  "Enable JavaScript to load the browser lab.": [
    "Schakel JavaScript in om de les te laden.",
    "Activez JavaScript pour charger l’exercice.",
    "Activa JavaScript para cargar el ejercicio.",
    "Aktiviere JavaScript, um die Übung zu laden.",
    "Ativa JavaScript para carregar o exercício."
  ],
  "This lab needs JavaScript enabled to run the robot simulator.": [
    "Deze les heeft JavaScript nodig voor de simulator.",
    "Cet exercice nécessite JavaScript pour le simulateur.",
    "Este ejercicio necesita JavaScript para el simulador.",
    "Diese Übung benötigt JavaScript für den Simulator.",
    "Este exercício precisa de JavaScript para o simulador."
  ],
  "travel": [
    "afstand",
    "trajet",
    "recorrido",
    "Strecke",
    "percurso"
  ],
  "Terminals share one graph. Observe messages and robot motion.": [
    "Terminals delen één graaf. Volg berichten en robotbeweging.",
    "Les terminaux partagent un graphe. Observez messages et mouvement.",
    "Los terminales comparten un grafo. Observa mensajes y movimiento.",
    "Die Terminals teilen einen Graphen. Beobachte Nachrichten und Bewegung.",
    "Os terminais partilham um grafo. Observa mensagens e movimento."
  ],
  "Review the terminal error and try again.": [
    "Bekijk de terminalfout en probeer opnieuw.",
    "Consultez l’erreur du terminal et réessayez.",
    "Revisa el error del terminal e inténtalo de nuevo.",
    "Prüfe den Terminalfehler und versuche es erneut.",
    "Revê o erro do terminal e tenta novamente."
  ],
  "Review the terminal error.": [
    "Bekijk de terminalfout.",
    "Consultez l’erreur du terminal.",
    "Revisa el error del terminal.",
    "Prüfe den Terminalfehler.",
    "Revê o erro do terminal."
  ],
  "Run your Python detector before checking.": [
    "Voer je Python-detector uit voor de controle.",
    "Exécutez le détecteur Python avant la vérification.",
    "Ejecuta el detector Python antes de comprobar.",
    "Starte den Python-Detektor vor der Prüfung.",
    "Executa o detetor Python antes de verificar."
  ],
  "Camera": [
    "Camera",
    "Caméra",
    "Cámara",
    "Kamera",
    "Câmara"
  ],
  "Frames": [
    "Frames",
    "Repères",
    "Marcos",
    "Koordinatensysteme",
    "Referenciais"
  ],
  "Transform inspector": [
    "Transformatie-inspector",
    "Inspecteur de transformations",
    "Inspector de transformaciones",
    "Transformationsinspektor",
    "Inspetor de transformações"
  ],
  "Target frame": [
    "Doelframe",
    "Repère cible",
    "Marco destino",
    "Zielkoordinatensystem",
    "Referencial de destino"
  ],
  "Source frame": [
    "Bronframe",
    "Repère source",
    "Marco origen",
    "Quellkoordinatensystem",
    "Referencial de origem"
  ],
  "Express the source frame in the target frame: lookup_transform(target_frame, source_frame, ...).": [
    "Druk het bronframe uit in het doelframe: lookup_transform(target_frame, source_frame, ...).",
    "Exprimez le repère source dans le repère cible : lookup_transform(target_frame, source_frame, ...).",
    "Expresa el marco origen en el marco destino: lookup_transform(target_frame, source_frame, ...).",
    "Drücke das Quellkoordinatensystem im Zielkoordinatensystem aus: lookup_transform(target_frame, source_frame, ...).",
    "Expressa o referencial de origem no referencial de destino: lookup_transform(target_frame, source_frame, ...)."
  ],
  "Relative target vector": [
    "Relatieve doelvector",
    "Vecteur relatif vers la cible",
    "Vector relativo al objetivo",
    "Relativer Zielvektor",
    "Vetor relativo ao alvo"
  ],
  "TF hierarchy": [
    "TF-hiërarchie",
    "Hiérarchie TF",
    "Jerarquía TF",
    "TF-Hierarchie",
    "Hierarquia TF"
  ],
  "Selected frame": [
    "Geselecteerd frame",
    "Repère sélectionné",
    "Marco seleccionado",
    "Ausgewähltes Koordinatensystem",
    "Referencial selecionado"
  ],
  "Frame": [
    "Frame",
    "Repère",
    "Marco",
    "Koordinatensystem",
    "Referencial"
  ],
  "Parent": [
    "Ouderframe",
    "Parent",
    "Padre",
    "Übergeordnet",
    "Pai"
  ],
  "distance": [
    "afstand",
    "distance",
    "distancia",
    "Abstand",
    "distância"
  ],
  "bearing": [
    "richting",
    "direction",
    "dirección",
    "Richtung",
    "direção"
  ],
  "Latest 2D transforms only. Real tf2 also supports 3D transforms and time history.": [
    "Alleen de laatste 2D-transformaties. Echte tf2 ondersteunt ook 3D en tijdhistoriek.",
    "Dernières transformations 2D uniquement. tf2 réel gère aussi la 3D et l’historique temporel.",
    "Solo transformaciones 2D actuales. tf2 real también admite 3D e historial temporal.",
    "Nur aktuelle 2D-Transformationen. Echtes tf2 unterstützt auch 3D und Zeitverläufe.",
    "Apenas transformações 2D atuais. tf2 real também suporta 3D e histórico temporal."
  ],
  "Grid: 1 m · +x right · +y up": [
    "Raster: 1 m · +x rechts · +y boven",
    "Grille : 1 m · +x droite · +y haut",
    "Cuadrícula: 1 m · +x derecha · +y arriba",
    "Raster: 1 m · +x rechts · +y oben",
    "Grelha: 1 m · +x direita · +y acima"
  ],
  "Python source code": [
    "Python-broncode",
    "Code source Python",
    "Código fuente Python",
    "Python-Quellcode",
    "Código-fonte Python"
  ],
  "Python output": [
    "Python-uitvoer",
    "Sortie Python",
    "Salida Python",
    "Python-Ausgabe",
    "Saída Python"
  ],
  "Course sessions": [
    "Cursussessies",
    "Sessions du cours",
    "Sesiones del curso",
    "Kurssitzungen",
    "Sessões do curso"
  ],
  "Coordinate frames in the robot world": [
    "Coördinatenframes in de robotwereld",
    "Repères dans le monde du robot",
    "Marcos de coordenadas en el mundo del robot",
    "Koordinatensysteme in der Roboterwelt",
    "Referenciais no mundo do robô"
  ],
  "From browser to a real robot": [
    "Van browser naar echte robot",
    "Du navigateur au robot réel",
    "Del navegador a un robot real",
    "Vom Browser zum echten Roboter",
    "Do navegador a um robô real"
  ]
};
