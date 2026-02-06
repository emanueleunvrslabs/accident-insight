import { motion } from "framer-motion";
import { Calendar, Euro, MapPin, ArrowRight, Clock } from "lucide-react";

// Flag components
const ItalyFlag = () => (
  <div className="w-5 h-3.5 rounded-sm overflow-hidden flex flex-shrink-0 shadow-sm">
    <div className="w-1/3 bg-[#009246]" />
    <div className="w-1/3 bg-white" />
    <div className="w-1/3 bg-[#CE2B37]" />
  </div>
);

const EUFlag = () => (
  <div className="w-5 h-3.5 rounded-sm overflow-hidden bg-[#003399] flex items-center justify-center flex-shrink-0 shadow-sm">
    <div className="relative w-3 h-3">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#FFCC00] left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-5px)`,
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
          }}
        />
      ))}
    </div>
  </div>
);

const bandi = [
  {
    id: 1,
    title: "Bando Innovazione Digitale PMI",
    region: "Lombardia",
    amount: "50.000",
    deadline: "15 Mar 2026",
    category: "Digitalizzazione",
    status: "Aperto",
    match: 92,
    flag: "italy" as const,
  },
  {
    id: 2,
    title: "Fondo Startup Innovative",
    region: "Nazionale",
    amount: "150.000",
    deadline: "28 Feb 2026",
    category: "Startup",
    status: "Aperto",
    match: 87,
    flag: "italy" as const,
  },
  {
    id: 3,
    title: "Contributi Green Economy",
    region: "Emilia-Romagna",
    amount: "80.000",
    deadline: "10 Apr 2026",
    category: "Sostenibilità",
    status: "Aperto",
    match: 78,
    flag: "italy" as const,
  },
  {
    id: 4,
    title: "Horizon Europe - EIC Accelerator",
    region: "Europa",
    amount: "2.500.000",
    deadline: "20 Mag 2026",
    category: "Ricerca",
    status: "Aperto",
    match: 65,
    flag: "eu" as const,
  },
  {
    id: 5,
    title: "Bando Export e Internazionalizzazione",
    region: "Veneto",
    amount: "35.000",
    deadline: "30 Mar 2026",
    category: "Export",
    status: "Aperto",
    match: 81,
    flag: "italy" as const,
  },
  {
    id: 6,
    title: "Credito d'Imposta R&S",
    region: "Nazionale",
    amount: "200.000",
    deadline: "31 Dic 2026",
    category: "Ricerca",
    status: "Aperto",
    match: 95,
    flag: "italy" as const,
  },
];

const BandoCard = ({ bando, index }: { bando: typeof bandi[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="flex-shrink-0 w-[340px] md:w-[380px] h-[320px] group cursor-pointer"
    >
      <div 
        className="relative h-full rounded-2xl p-6 glass-card-hover flex flex-col"
      >
        {/* Top Row - Category & Match Badge */}
        <div className="flex items-center justify-between mb-4">
          {/* Category Tag */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
            {bando.category}
          </div>
          
          {/* Match Badge */}
          <div 
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              bando.match >= 90 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : bando.match >= 75 
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-white/10 text-foreground/70'
            }`}
          >
            {bando.match}% Match
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
          {bando.title}
        </h3>

        {/* Details */}
        <div className="space-y-2 mb-6 flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {bando.flag === "italy" ? <ItalyFlag /> : <EUFlag />}
            <MapPin className="w-4 h-4 text-primary/70" />
            <span>{bando.region}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Euro className="w-4 h-4 text-primary/70" />
            <span className="font-semibold text-foreground">Fino a €{bando.amount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary/70" />
            <span>Scadenza: {bando.deadline}</span>
          </div>
        </div>

        {/* Status & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">{bando.status}</span>
          </div>
          <motion.div 
            className="flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all"
          >
            Scopri
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export const BandiGallerySection = () => {
  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            Bandi Disponibili
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Scopri i bandi più adatti a te
          </h2>
          <p className="text-lg text-muted-foreground">
            La nostra AI analizza il tuo profilo e ti mostra i bandi con la percentuale di compatibilità più alta.
          </p>
        </motion.div>
      </div>

      {/* Horizontal Scrolling Gallery */}
      <div 
        className="flex gap-6 px-4 md:px-8 overflow-x-auto scrollbar-hide pt-4 pb-4"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Spacer for initial offset */}
        <div className="flex-shrink-0 w-4 md:w-[calc((100vw-1280px)/2)]" />
        
        {bandi.map((bando, index) => (
          <div key={bando.id} style={{ scrollSnapAlign: 'start' }}>
            <BandoCard bando={bando} index={index} />
          </div>
        ))}

        {/* View All Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="flex-shrink-0 w-[280px]"
          style={{ scrollSnapAlign: 'start' }}
        >
          <a 
            href="/bandi"
            className="flex flex-col items-center justify-center h-full min-h-[320px] rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <ArrowRight className="w-7 h-7 text-primary" />
            </div>
            <span className="text-lg font-semibold text-primary">Vedi tutti i bandi</span>
            <span className="text-sm text-muted-foreground mt-1">+500 opportunità</span>
          </a>
        </motion.div>

        {/* Spacer for end offset */}
        <div className="flex-shrink-0 w-8" />
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="flex justify-center mt-8"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
          <span>Scorri per vedere altri bandi</span>
        </div>
      </motion.div>
    </section>
  );
};
