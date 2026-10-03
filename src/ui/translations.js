export default {
  "Edit the TODOs, then Run. Tab inserts four spaces; Escape then Tab leaves the editor. Stop terminates Python and its subscriptions. First run downloads Pyodide and NumPy from jsDelivr.": [
    "Vul de TODO’s aan en voer uit. Tab voegt vier spaties toe; Escape gevolgd door Tab verlaat de editor. Stop beëindigt Python en de subscriptions. De eerste uitvoering downloadt Pyodide en NumPy via jsDelivr.",
    "Complétez les TODO puis exécutez. Tab insère quatre espaces ; Échap puis Tab quitte l’éditeur. Stop termine Python et ses abonnements. La première exécution télécharge Pyodide et NumPy depuis jsDelivr."
  ],
  "A callback can store its latest result on the node. Other callbacks or service logic can then use it without processing the same image again.": [
    "Een callback kan zijn laatste resultaat in de node bewaren. Andere callbacks of services kunnen het gebruiken zonder het beeld opnieuw te verwerken.",
    "Un callback peut mémoriser son dernier résultat dans le nœud. D’autres callbacks ou services peuvent l’utiliser sans retraiter l’image."
  ],
  "Camera callback → updates node state → other node logic uses that state. This is an explanatory pattern, not a required solution.": [
    "Camera-callback → werkt de nodetoestand bij → andere logica gebruikt die toestand. Dit is een voorbeeldpatroon, geen verplichte oplossing.",
    "Callback caméra → met à jour l’état du nœud → d’autres traitements utilisent cet état. Ce schéma est explicatif, pas une solution imposée."
  ],
  "KineCourse runs the Python code directly in the browser. On a real ROS 2 system, the same node would normally be placed inside a ROS package and executed from a built workspace.": [
    "KineCourse voert Python rechtstreeks in de browser uit. Op een echt ROS 2-systeem staat dezelfde node normaal in een ROS-package en wordt hij vanuit een gebouwde workspace uitgevoerd.",
    "KineCourse exécute Python directement dans le navigateur. Sur un vrai système ROS 2, le même nœud se trouve normalement dans un package ROS et s’exécute depuis un workspace construit."
  ],
  "A Python package uses ament_python and declares a console entry point named detector in setup.py. With that package inside ~/ros2_ws/src and its dependencies installed:": [
    "Een Python-package gebruikt ament_python en declareert een console-entrypoint detector in setup.py. Met het package in ~/ros2_ws/src en de afhankelijkheden geïnstalleerd:",
    "Un package Python utilise ament_python et déclare un point d’entrée detector dans setup.py. Avec ce package dans ~/ros2_ws/src et ses dépendances installées :"
  ],
  "These are real-machine commands, not commands executed by the learning terminal. You do not need CMake for this Python package.": [
    "Dit zijn opdrachten voor een echte machine; de leerterminal voert ze niet uit. Voor dit Python-package is geen CMake nodig.",
    "Ces commandes sont destinées à une vraie machine ; le terminal pédagogique ne les exécute pas. Ce package Python ne nécessite pas CMake."
  ],
  "What is simulated? Python API and checker notes": [
    "Wat is gesimuleerd? Python-API en controles",
    "Qu’est-ce qui est simulé ? API Python et vérifications"
  ],
  "KineCourse is an educational ROS 2 simulator. Its Python API and CLI reproduce the ROS 2 concepts used in these lessons, but the browser environment is not a complete DDS-based ROS 2 installation.": [
    "KineCourse is een educatieve ROS 2-simulator. De Python-API en CLI bootsen de concepten uit deze lessen na, maar de browser is geen volledige ROS 2-installatie op basis van DDS.",
    "KineCourse est un simulateur pédagogique ROS 2. Son API Python et sa CLI reproduisent les concepts utilisés dans ces cours, mais le navigateur n’est pas une installation ROS 2 complète basée sur DDS."
  ],
  "Nodes, topics & motion": [
    "Nodes, topics en beweging",
    "Nœuds, topics et mouvement"
  ],
  "Explore the ROS 2 mental model, one message at a time.": [
    "Ontdek het ROS 2-denkmodel, bericht voor bericht.",
    "Découvrez le modèle mental de ROS 2, message par message."
  ],
  "A small command. A moving robot.": [
    "Een kleine opdracht. Een bewegende robot.",
    "Une petite commande. Un robot en mouvement."
  ],
  "Real ROS 2 →": [
    "Echte ROS 2 →",
    "ROS 2 réel →"
  ],
  "Execute": [
    "Uitvoeren",
    "Exécuter"
  ],
  "Stop command": [
    "Opdracht stoppen",
    "Arrêter la commande"
  ],
  "Close": [
    "Sluiten",
    "Fermer"
  ],
  "All hints revealed": [
    "Alle hints getoond",
    "Tous les indices affichés"
  ],
  "From KineCourse to real ROS 2": [
    "Van KineCourse naar echte ROS 2",
    "De KineCourse à ROS 2 réel"
  ],
  "A Python workspace": [
    "Een Python-workspace",
    "Un workspace Python"
  ],
  "Custom interfaces and CMake": [
    "Eigen interfaces en CMake",
    "Interfaces personnalisées et CMake"
  ],
  "What changes on a real robot?": [
    "Wat verandert op een echte robot?",
    "Qu’est-ce qui change sur un vrai robot ?"
  ],
  "Learn by experimenting": [
    "Leren door te experimenteren",
    "Apprendre en expérimentant"
  ],
  "Custom interfaces on a real ROS 2 machine": [
    "Eigen interfaces op een echte ROS 2-machine",
    "Interfaces personnalisées sur une vraie machine ROS 2"
  ],
  "Real interface packages use ament_cmake and rosidl_generate_interfaces during the build. The browser provides generated-like Python classes directly. You do not need to write or run CMake here.": [
    "Echte interfacepackages gebruiken ament_cmake en rosidl_generate_interfaces tijdens het bouwen. De browser levert de Python-klassen rechtstreeks. Je hoeft hier geen CMake te schrijven of uit te voeren.",
    "Les vrais packages d’interfaces utilisent ament_cmake et rosidl_generate_interfaces lors de la compilation. Le navigateur fournit directement les classes Python. Vous n’avez pas à écrire ni exécuter CMake ici."
  ],
  "The browser taught the graph and control loop. A real ROS 2 installation adds packages, dependencies, build tools and middleware. These commands belong on a real machine, not in the learning terminal.": [
    "De browser leerde je de graaf en regellus. Een echte ROS 2-installatie voegt packages, afhankelijkheden, bouwtools en middleware toe. Deze opdrachten horen op een echte machine, niet in de leerterminal.",
    "Le navigateur vous a appris le graphe et la boucle de commande. Une vraie installation ROS 2 ajoute packages, dépendances, outils de construction et middleware. Ces commandes appartiennent à une vraie machine, pas au terminal pédagogique."
  ],
  "Use ament_python for a Python package. package.xml declares dependencies and metadata. setup.py packages the module and registers a console_scripts entry point such as detector = camera_detector.detector:main. setup.cfg installs scripts where ros2 run expects them. Put node creation and spinning inside main().": [
    "Gebruik ament_python voor een Python-package. package.xml beschrijft afhankelijkheden en metadata. setup.py verpakt de module en registreert een console_scripts-entrypoint zoals detector = camera_detector.detector:main. setup.cfg installeert scripts waar ros2 run ze verwacht. Maak en spin de node in main().",
    "Utilisez ament_python pour un package Python. package.xml déclare les dépendances et métadonnées. setup.py empaquette le module et enregistre un point d’entrée console_scripts tel que detector = camera_detector.detector:main. setup.cfg installe les scripts où ros2 run les attend. Créez le nœud et appelez spin dans main()."
  ],
  "First source your installed ROS distribution’s setup.bash and install the declared dependencies. colcon builds packages; sourcing install/setup.bash makes the built workspace discoverable. Python-only exercises do not require writing CMake.": [
    "Source eerst setup.bash van de geïnstalleerde ROS-distributie en installeer de afhankelijkheden. colcon bouwt packages; source install/setup.bash maakt de workspace vindbaar. Voor de Python-oefeningen schrijf je geen CMake.",
    "Sourcez d’abord setup.bash de la distribution ROS installée et installez les dépendances. colcon construit les packages ; source install/setup.bash rend le workspace accessible. Les exercices Python ne nécessitent pas d’écrire du CMake."
  ],
  "Real custom-interface packages use ament_cmake and rosidl_generate_interfaces to generate language bindings during the build. The browser provides the small Python classes directly; it does not run an interface generator. CMakeLists.txt also belongs in future C++/ament_cmake packages, not in the core Python exercises.": [
    "Echte interfacepackages gebruiken ament_cmake en rosidl_generate_interfaces om taalbindings te genereren. De browser levert kleine Python-klassen rechtstreeks, zonder generator. CMakeLists.txt hoort ook bij toekomstige C++/ament_cmake-packages, niet bij de basis-Python-oefeningen.",
    "Les vrais packages d’interfaces utilisent ament_cmake et rosidl_generate_interfaces pour générer les bindings. Le navigateur fournit directement de petites classes Python, sans générateur. CMakeLists.txt concerne aussi les futurs packages C++/ament_cmake, pas les exercices Python de base."
  ],
  "Install real rclpy and message packages through your ROS distribution. Replace educational helpers with logging or your own tests. Provide real camera/LiDAR drivers, correct QoS, a real TF broadcaster and an action server matching your interface. TF timestamps, middleware discovery, executors and hardware safety now matter. Begin with a simulator or a stationary robot before enabling motion.": [
    "Installeer echte rclpy- en berichtpackages via je ROS-distributie. Vervang onderwijshelpers door logging of eigen tests. Voorzie camera/LiDAR-drivers, juiste QoS, een TF-broadcaster en een passende action-server. Tijdstempels, discovery, executors en hardwareveiligheid worden belangrijk. Begin in een simulator of met een stilstaande robot.",
    "Installez les vrais packages rclpy et de messages via votre distribution ROS. Remplacez les helpers pédagogiques par des logs ou vos tests. Prévoyez des pilotes caméra/LiDAR, une QoS correcte, un broadcaster TF et un serveur d’action adapté. Horodatages, découverte, executors et sécurité matérielle deviennent importants. Commencez en simulation ou avec un robot immobile."
  ],
  "The browser’s 2-second velocity timeout, bounded callbacks, latest-only planar TF and limited action server are teaching choices. They are not guarantees from ROS 2.": [
    "De time-out van 2 seconden, begrensde callbacks, nieuwste vlakke TF en beperkte action-server zijn onderwijskeuzes. ROS 2 garandeert dit gedrag niet.",
    "Le délai de vitesse de 2 secondes, les callbacks bornés, le TF plan limité au dernier état et le serveur d’action restreint sont des choix pédagogiques, pas des garanties de ROS 2."
  ],
  "Scan subscriber accessed range data in three callbacks": [
    "Scan-subscriber las afstanden in drie callbacks",
    "Le subscriber du scan a lu les distances dans trois callbacks"
  ],
  "Python subscriber received 3 String messages": [
    "Python-subscriber ontving 3 String-berichten",
    "Le subscriber Python a reçu 3 messages String"
  ],
  "Timer fired and Python published at least 5 commands": [
    "Timer actief en minstens 5 Python-publicaties",
    "Timer actif et au moins 5 publications Python"
  ],
  "Front, left and right sectors computed from actual scan angles": [
    "Voor-, linker- en rechtersector berekend uit echte scanhoeken",
    "Secteurs avant, gauche et droit calculés à partir des angles du scan"
  ],
  "Reacted to obstacle, travelled over 2 m and avoided collisions": [
    "Gereageerd op obstakel, meer dan 2 m gereden zonder botsing",
    "Réaction à l’obstacle et trajet de plus de 2 m sans collision"
  ],
  "Declared and used parameters while publishing motion": [
    "Parameters gedeclareerd en gebruikt bij bewegingscommando’s",
    "Paramètres déclarés et utilisés pour commander le mouvement"
  ],
  "Live parameter changed and Python read both values": [
    "Parameter gewijzigd tijdens uitvoering en beide waarden gelezen",
    "Paramètre modifié pendant l’exécution et deux valeurs lues"
  ],
  "Published three valid TargetInfo messages through the graph": [
    "Drie geldige TargetInfo-berichten gepubliceerd",
    "Trois messages TargetInfo valides publiés dans le graphe"
  ],
  "Action completed and final result received": [
    "Actie voltooid en eindresultaat ontvangen",
    "Action terminée et résultat final reçu"
  ],
  "Goal accepted, feedback processed and success result received": [
    "Doel geaccepteerd, feedback verwerkt en succesresultaat ontvangen",
    "Objectif accepté, feedback traité et résultat réussi reçu"
  ],
  "Active goal cancelled and cancellation result received": [
    "Lopend doel geannuleerd en resultaat ontvangen",
    "Objectif actif annulé et résultat d’annulation reçu"
  ],
  "Odometry callback reported correct x, y and yaw": [
    "Odometrie-callback rapporteerde correcte x, y en yaw",
    "Le callback d’odométrie a rapporté x, y et yaw correctement"
  ],
  "TF lookup reported the laser origin in odom three times": [
    "TF-query rapporteerde de laseroorsprong driemaal in odom",
    "La requête TF a rapporté trois fois l’origine du laser dans odom"
  ],
  "Computed target coordinates in base_link from TF": [
    "Doelcoördinaten in base_link berekend met TF",
    "Coordonnées de la cible dans base_link calculées avec TF"
  ],
  "Used odometry and stopped at the goal for 0.5 seconds": [
    "Feedback gebruikt en 0.5 s stilgestaan bij het doel",
    "Feedback utilisé et arrêt à la cible pendant 0.5 s"
  ],
  "Reached the goal with scan safety and no collisions": [
    "Doel bereikt met scanveiligheid en zonder botsingen",
    "Cible atteinte avec sécurité LiDAR et sans collision"
  ],
  "Processed images and scan, centered target and stopped at safe range": [
    "Beelden en scan verwerkt, doel gecentreerd en veilig gestopt",
    "Images et scan traités, cible centrée et arrêt à distance sûre"
  ],
  "Camera callback received at least 3 images": [
    "Camera-callback ontving minstens 3 beelden",
    "Le callback caméra a reçu au moins 3 images"
  ],
  "Image width and height accessed": [
    "Breedte en hoogte van het beeld gelezen",
    "Largeur et hauteur de l’image lues"
  ],
  "Image pixels accessed for processing": [
    "Beeldpixels gelezen voor verwerking",
    "Pixels de l’image lus pour traitement"
  ],
  "Correct shape and channel means reported": [
    "Correcte vorm en kanaalgemiddelden gerapporteerd",
    "Forme et moyennes des canaux correctement rapportées"
  ],
  "Detection correct in all 4 varied scenes": [
    "Detectie correct in alle 4 gevarieerde scènes",
    "Détection correcte dans les 4 scènes variées"
  ],
  "Centroid correct in all 4 varied scenes": [
    "Zwaartepunt correct in alle 4 gevarieerde scènes",
    "Centroïde correct dans les 4 scènes variées"
  ],
  "Python client created → request → response → robot reset": [
    "Python-client gemaakt → verzoek → antwoord → robot gereset",
    "Client Python créé → requête → réponse → robot réinitialisé"
  ],
  "Python published control commands": [
    "Python publiceerde besturingscommando’s",
    "Python a publié des commandes de contrôle"
  ],
  "Target centered and robot stopped for 8 camera frames": [
    "Doel gecentreerd en robot stil voor 8 camerabeelden",
    "Cible centrée et robot arrêté pendant 8 images"
  ],
  "Python and NumPy are real. rclpy, Image, Twist, Trigger and cv_bridge are small educational implementations. KineCourse provides a lightweight educational subset of OpenCV-compatible functions: cv2.inRange, countNonZero and moments (m00, m10, m01). No full OpenCV, HSV conversion or real camera is installed.": [
    "Python en NumPy zijn echt. rclpy, Image, Twist, Trigger en cv_bridge zijn kleine onderwijsimplementaties. De beperkte cv2-helper biedt inRange, countNonZero en moments (m00, m10, m01), geen volledige OpenCV, HSV-conversie of echte camera.",
    "Python et NumPy sont réels. rclpy, Image, Twist, Trigger et cv_bridge sont de petites implémentations pédagogiques. Le helper cv2 limité propose inRange, countNonZero et moments (m00, m10, m01), sans OpenCV complet, conversion HSV ni caméra réelle."
  ],
  "The 8 Hz camera renders synthetic RGB pixels from robot pose. Python receives only those pixels and Image metadata, not target coordinates. The checker helpers report your computed values: report_image_stats(shape, channel_means) and report_detection(visible, cx=None). These helpers are specific to this teaching environment. Detection checks change the visible scene and require several correct frames per scene.": [
    "De camera maakt synthetische RGB-pixels op 8 Hz vanuit de robotpose. Python ontvangt pixels en beeldmetadata, geen doelcoördinaten. report_image_stats en report_detection geven je berekeningen door aan de controle; dit zijn onderwijshelpers. De detectiecontrole varieert de scène en vereist meerdere correcte beelden per scène.",
    "La caméra produit des pixels RGB synthétiques à 8 Hz depuis la pose du robot. Python reçoit les pixels et métadonnées, pas les coordonnées de la cible. report_image_stats et report_detection transmettent vos calculs au vérificateur ; ce sont des helpers pédagogiques. La vérification varie les scènes et exige plusieurs images correctes par scène."
  ],
  "rclpy.spin yields to the browser worker event loop; statements after spin are not resumed. Use asynchronous service calls with future.add_done_callback. Stop terminates the worker, so Python finally blocks are not guaranteed to run. Callback queues are bounded: a busy callback drops camera frames rather than accumulating them. Python service servers and DDS are not implemented. Other sessions introduce simulation-clock timers and a limited educational action client. The final challenge uses a Twist publisher, not the ROS action protocol.": [
    "rclpy.spin geeft de uitvoering aan de eventloop van de worker; code na spin wordt niet hervat. Gebruik asynchrone services met future.add_done_callback. Stop beëindigt de worker; finally-blokken worden niet gegarandeerd uitgevoerd. Trage callbacks laten beelden vallen. Python-serviceservers en DDS ontbreken. Andere sessies introduceren timers en een beperkte action-client. De camerauitdaging gebruikt Twist, niet het action-protocol.",
    "rclpy.spin passe la main à la boucle d’événements du worker ; le code après spin ne reprend pas. Utilisez des services asynchrones avec future.add_done_callback. Stop termine le worker ; les blocs finally ne sont pas garantis. Les callbacks lents perdent des images. Les serveurs de service Python et DDS ne sont pas implémentés. D’autres séances introduisent timers et client d’action limité. Le défi caméra utilise Twist, pas le protocole d’action."
  ]
};
