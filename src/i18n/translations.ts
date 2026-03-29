/**
 * Translation files for EcoRover application
 * Supports English (en) and Italian (it)
 */

export type Language = "en" | "it";

export interface Translations {
  // Navigation
  nav: {
    dashboard: string;
    navigation: string;
    energy: string;
    vision: string;
    storage: string;
    safety: string;
    impact: string;
    cloud: string;
    analytics: string;
    aiPerformance: string;
    roi: string;
    team: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    systemReadiness: string;
    operational: string;
    motors: string;
    ai: string;
    power: string;
    wasteItemsCollected: string;
    detectionRate: string;
    cpuLoad: string;
    temperature: string;
    uptime: string;
    distance: string;
    powerOutput: string;
    allSystemsNominal: string;
    liveAlerts: string;
  };
  
  // Common
  common: {
    connected: string;
    charging: string;
    mass: string;
    lastEmpty: string;
    nearFull: string;
    totalCollectedMass: string;
    collectionSummary: string;
    todayCollection: string;
    itemsSorted: string;
    averageAccuracy: string;
    hours: string;
    minutes: string;
    seconds: string;
    ago: string;
  };
  
  // Energy
  energy: {
    title: string;
    subtitle: string;
    solarInput: string;
    consumption: string;
    netPower: string;
    batteryTemp: string;
    batteryStatus: string;
    solarProduction: string;
    thermalHeatmap: string;
    hoursOfAutonomy: string;
    kWhGeneratedToday: string;
    kWhConsumedToday: string;
  };
  
  // Navigation
  navigation: {
    title: string;
    subtitle: string;
    currentSpeed: string;
    totalDistance: string;
    pathEfficiency: string;
    obstacleRadar: string;
    clearZone: string;
    staticObject: string;
    detectedWaste: string;
    movingObject: string;
    actualPath: string;
    plannedPath: string;
    wasteDensity: string;
  };
  
  // Storage
  storage: {
    title: string;
    subtitle: string;
    organicBinWarning: string;
    organicBinWarningMessage: string;
    collectionSummaryMessage: string;
  };
  
  // Mode Selector
  mode: {
    operationMode: string;
    autonomous: string;
    autonomousDesc: string;
    manual: string;
    manualDesc: string;
    ecoSave: string;
    ecoSaveDesc: string;
    modeActive: string;
  };
  
  // Sidebar
  sidebar: {
    missionControl: string;
  };
  
  // Initialize DB
  initialize: {
    title: string;
    subtitle: string;
    button: string;
    whatThisDoes: string;
    createsDashboard: string;
    setsUpBins: string;
    initializesEnergy: string;
    setsUpNavigation: string;
    createsVision: string;
    addsAnalytics: string;
    setsUpAlerts: string;
  };
  
  // Data translations (for Firebase data)
  data: {
    binTypes: {
      plastic: string;
      organic: string;
      paper: string;
    };
    wasteTypes: {
      plastic: string;
      organic: string;
      paper: string;
      other: string;
    };
    detectionTypes: {
      plasticBottle: string;
      paperCup: string;
      bananaPeel: string;
      cardboard: string;
      aluminumCan: string;
      [key: string]: string; // Allow dynamic keys
    };
    status: {
      complete: string;
      active: string;
      normal: string;
      warm: string;
      optimal: string;
      ok: string;
      [key: string]: string;
    };
    thermalLabels: {
      motor1: string;
      motor2: string;
      motor3: string;
      motor4: string;
      batteryPack: string;
      armServo: string;
      rpiCpu: string;
      esp32: string;
      [key: string]: string;
    };
    alertMessages: {
      wasteCollected: string;
      solarCharging: string;
      binCapacity: string;
      aiDetected: string;
      navigationRecalculated: string;
      [key: string]: string;
    };
    zones: {
      zoneA: string;
      zoneB: string;
      zoneC: string;
      zoneD: string;
      zoneE: string;
      zoneF: string;
      [key: string]: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      dashboard: "Dashboard",
      navigation: "Navigation & Mapping",
      energy: "Energy Management",
      vision: "Vision & AI",
      storage: "Storage & Bins",
      safety: "Safety & Diagnostics",
      impact: "Environmental Impact",
      cloud: "Cloud Data & Logs",
      analytics: "Waste Intelligence",
      aiPerformance: "AI Performance",
      roi: "Technical ROI",
      team: "Team & System Info",
    },
    dashboard: {
      title: "System Overview",
      subtitle: "Real-time monitoring dashboard",
      systemReadiness: "System Readiness",
      operational: "Operational",
      motors: "Motors",
      ai: "AI",
      power: "Power",
      wasteItemsCollected: "Waste Items Collected Today",
      detectionRate: "Detection Rate",
      cpuLoad: "CPU Load",
      temperature: "Temperature",
      uptime: "Uptime",
      distance: "Distance",
      powerOutput: "Power",
      allSystemsNominal: "All Systems Nominal",
      liveAlerts: "Live Alerts",
    },
    common: {
      connected: "Connected",
      charging: "Charging",
      mass: "Mass",
      lastEmpty: "Last Empty",
      nearFull: "Near Full",
      totalCollectedMass: "Total Collected Mass",
      collectionSummary: "Collection Summary",
      todayCollection: "Today's collection:",
      itemsSorted: "items sorted successfully.",
      averageAccuracy: "Average sorting accuracy:",
      hours: "hrs",
      minutes: "m",
      seconds: "s",
      ago: "ago",
    },
    energy: {
      title: "Energy Management",
      subtitle: "Solar power and battery analytics",
      solarInput: "Solar Input",
      consumption: "Consumption",
      netPower: "Net Power",
      batteryTemp: "Battery Temp",
      batteryStatus: "Battery Status",
      solarProduction: "Solar Production vs Consumption",
      thermalHeatmap: "Thermal Heatmap",
      hoursOfAutonomy: "Hours of Autonomy",
      kWhGeneratedToday: "kWh Generated Today",
      kWhConsumedToday: "kWh Consumed Today",
    },
    navigation: {
      title: "Navigation & Mapping",
      subtitle: "Real-time position and route intelligence",
      currentSpeed: "Current Speed",
      totalDistance: "Total Distance",
      pathEfficiency: "Path Efficiency",
      obstacleRadar: "360° Obstacle Radar",
      clearZone: "Clear zone",
      staticObject: "Static object",
      detectedWaste: "Detected waste",
      movingObject: "Moving object",
      actualPath: "Actual Path",
      plannedPath: "Planned Path",
      wasteDensity: "Waste Density",
    },
    storage: {
      title: "Storage & Bin Levels",
      subtitle: "Waste container capacity monitoring",
      organicBinWarning: "Organic Bin Warning",
      organicBinWarningMessage: "Organic waste container at 82% capacity. Consider emptying soon to maintain efficiency.",
      collectionSummaryMessage: "Today's collection: 127 items sorted successfully. Average sorting accuracy: 98.2%",
    },
    mode: {
      operationMode: "Operation Mode",
      autonomous: "Autonomous",
      autonomousDesc: "AI-controlled navigation",
      manual: "Manual",
      manualDesc: "Remote control mode",
      ecoSave: "Eco-Save",
      ecoSaveDesc: "Low power operation",
      modeActive: "Mode Active",
    },
    sidebar: {
      missionControl: "Mission Control",
    },
    initialize: {
      title: "Initialize Firebase Database",
      subtitle: "This will set up the initial data structure in your Firebase Realtime Database. Run this once after setting up Firebase.",
      button: "Initialize Database",
      whatThisDoes: "What this does:",
      createsDashboard: "Creates dashboard metrics",
      setsUpBins: "Sets up bin data",
      initializesEnergy: "Initializes energy data",
      setsUpNavigation: "Sets up navigation data",
      createsVision: "Creates vision/AI data",
      addsAnalytics: "Adds analytics data",
      setsUpAlerts: "Sets up alerts and logs",
    },
    data: {
      binTypes: {
        plastic: "Plastic",
        organic: "Organic",
        paper: "Paper/Glass",
      },
      wasteTypes: {
        plastic: "Plastic",
        organic: "Organic",
        paper: "Paper",
        other: "Other",
      },
      detectionTypes: {
        plasticBottle: "Plastic Bottle",
        paperCup: "Paper Cup",
        bananaPeel: "Banana Peel",
        cardboard: "Cardboard",
        aluminumCan: "Aluminum Can",
      },
      status: {
        complete: "Complete",
        active: "Active",
        normal: "Normal",
        warm: "Warm",
        optimal: "Optimal",
        ok: "OK",
      },
      thermalLabels: {
        motor1: "Motor 1",
        motor2: "Motor 2",
        motor3: "Motor 3",
        motor4: "Motor 4",
        batteryPack: "Battery Pack",
        armServo: "Arm Servo",
        rpiCpu: "RPi CPU",
        esp32: "ESP32",
      },
      alertMessages: {
        wasteCollected: "Waste item collected - {type}",
        solarCharging: "Solar charging optimal - {value}W input",
        binCapacity: "{type} bin at {level}% capacity",
        aiDetected: "AI detected recyclable item",
        navigationRecalculated: "Navigation recalculated - new path",
      },
      zones: {
        zoneA: "Zone A",
        zoneB: "Zone B",
        zoneC: "Zone C",
        zoneD: "Zone D",
        zoneE: "Zone E",
        zoneF: "Zone F",
      },
    },
  },
  it: {
    nav: {
      dashboard: "Cruscotto",
      navigation: "Navigazione e Mappatura",
      energy: "Gestione Energia",
      vision: "Visione e AI",
      storage: "Stoccaggio e Contenitori",
      safety: "Sicurezza e Diagnostica",
      impact: "Impatto Ambientale",
      cloud: "Dati Cloud e Log",
      analytics: "Intelligenza Rifiuti",
      aiPerformance: "Prestazioni AI",
      roi: "ROI Tecnico",
      team: "Team e Info Sistema",
    },
    dashboard: {
      title: "Panoramica Sistema",
      subtitle: "Cruscotto di monitoraggio in tempo reale",
      systemReadiness: "Pronto Sistema",
      operational: "Operativo",
      motors: "Motori",
      ai: "AI",
      power: "Energia",
      wasteItemsCollected: "Oggetti Rifiuti Raccolti Oggi",
      detectionRate: "Tasso di Rilevamento",
      cpuLoad: "Carico CPU",
      temperature: "Temperatura",
      uptime: "Tempo Attivo",
      distance: "Distanza",
      powerOutput: "Energia",
      allSystemsNominal: "Tutti i Sistemi Normali",
      liveAlerts: "Avvisi in Diretta",
    },
    common: {
      connected: "Connesso",
      charging: "In Carica",
      mass: "Massa",
      lastEmpty: "Ultimo Svuotamento",
      nearFull: "Quasi Pieno",
      totalCollectedMass: "Massa Totale Raccolta",
      collectionSummary: "Riepilogo Raccolta",
      todayCollection: "Raccolta di oggi:",
      itemsSorted: "oggetti ordinati con successo.",
      averageAccuracy: "Precisione media di ordinamento:",
      hours: "ore",
      minutes: "m",
      seconds: "s",
      ago: "fa",
    },
    energy: {
      title: "Gestione Energia",
      subtitle: "Analisi energia solare e batteria",
      solarInput: "Ingresso Solare",
      consumption: "Consumo",
      netPower: "Energia Netta",
      batteryTemp: "Temp Batteria",
      batteryStatus: "Stato Batteria",
      solarProduction: "Produzione Solare vs Consumo",
      thermalHeatmap: "Mappa Termica",
      hoursOfAutonomy: "Ore di Autonomia",
      kWhGeneratedToday: "kWh Generati Oggi",
      kWhConsumedToday: "kWh Consumati Oggi",
    },
    navigation: {
      title: "Navigazione e Mappatura",
      subtitle: "Posizione in tempo reale e intelligenza percorso",
      currentSpeed: "Velocità Corrente",
      totalDistance: "Distanza Totale",
      pathEfficiency: "Efficienza Percorso",
      obstacleRadar: "Radar Ostacoli 360°",
      clearZone: "Zona libera",
      staticObject: "Oggetto statico",
      detectedWaste: "Rifiuto rilevato",
      movingObject: "Oggetto in movimento",
      actualPath: "Percorso Effettivo",
      plannedPath: "Percorso Pianificato",
      wasteDensity: "Densità Rifiuti",
    },
    storage: {
      title: "Stoccaggio e Livelli Contenitori",
      subtitle: "Monitoraggio capacità contenitori rifiuti",
      organicBinWarning: "Avviso Contenitore Organico",
      organicBinWarningMessage: "Contenitore rifiuti organici all'82% di capacità. Considerare lo svuotamento presto per mantenere l'efficienza.",
      collectionSummaryMessage: "Raccolta di oggi: 127 oggetti ordinati con successo. Precisione media di ordinamento: 98.2%",
    },
    mode: {
      operationMode: "Modalità Operazione",
      autonomous: "Autonomo",
      autonomousDesc: "Navigazione controllata da AI",
      manual: "Manuale",
      manualDesc: "Modalità controllo remoto",
      ecoSave: "Risparmio Energetico",
      ecoSaveDesc: "Funzionamento a bassa potenza",
      modeActive: "Modalità Attiva",
    },
    sidebar: {
      missionControl: "Controllo Missione",
    },
    initialize: {
      title: "Inizializza Database Firebase",
      subtitle: "Questo configurerà la struttura dati iniziale nel tuo Firebase Realtime Database. Esegui questo una volta dopo aver configurato Firebase.",
      button: "Inizializza Database",
      whatThisDoes: "Cosa fa:",
      createsDashboard: "Crea metriche cruscotto",
      setsUpBins: "Configura dati contenitori",
      initializesEnergy: "Inizializza dati energia",
      setsUpNavigation: "Configura dati navigazione",
      createsVision: "Crea dati visione/AI",
      addsAnalytics: "Aggiunge dati analitici",
      setsUpAlerts: "Configura avvisi e log",
    },
    data: {
      binTypes: {
        plastic: "Plastica",
        organic: "Organico",
        paper: "Carta/Vetro",
      },
      wasteTypes: {
        plastic: "Plastica",
        organic: "Organico",
        paper: "Carta",
        other: "Altro",
      },
      detectionTypes: {
        plasticBottle: "Bottiglia di Plastica",
        paperCup: "Bicchiere di Carta",
        bananaPeel: "Buccia di Banana",
        cardboard: "Cartone",
        aluminumCan: "Lattina di Alluminio",
      },
      status: {
        complete: "Completato",
        active: "Attivo",
        normal: "Normale",
        warm: "Caldo",
        optimal: "Ottimale",
        ok: "OK",
      },
      thermalLabels: {
        motor1: "Motore 1",
        motor2: "Motore 2",
        motor3: "Motore 3",
        motor4: "Motore 4",
        batteryPack: "Pacco Batteria",
        armServo: "Servo Braccio",
        rpiCpu: "CPU RPi",
        esp32: "ESP32",
      },
      alertMessages: {
        wasteCollected: "Oggetto rifiuto raccolto - {type}",
        solarCharging: "Carica solare ottimale - {value}W in ingresso",
        binCapacity: "Contenitore {type} al {level}% di capacità",
        aiDetected: "AI ha rilevato oggetto riciclabile",
        navigationRecalculated: "Navigazione ricalcolata - nuovo percorso",
      },
      zones: {
        zoneA: "Zona A",
        zoneB: "Zona B",
        zoneC: "Zona C",
        zoneD: "Zona D",
        zoneE: "Zona E",
        zoneF: "Zona F",
      },
    },
  },
};

