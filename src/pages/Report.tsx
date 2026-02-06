import { useState } from 'react';
import { FloatingNav } from '@/components/FloatingNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { useIncidents, useIncidentStats } from '@/hooks/useIncidents';
import { Skeleton } from '@/components/ui/skeleton';
import { ITALIAN_REGIONS, ACCIDENT_TYPE_LABELS } from '@/types/incident';
import { 
  FileText, 
  Download, 
  Calendar,
  FileSpreadsheet,
  FileJson,
  Printer,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings2,
  Sparkles,
  MapPin,
  Car,
  Users,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

type ExportFormat = 'pdf' | 'excel' | 'json';

export default function Report() {
  const { data: incidents, isLoading: incidentsLoading } = useIncidents({});
  const { data: stats, isLoading: statsLoading } = useIncidentStats();

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [includeStats, setIncludeStats] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);

  const isLoading = incidentsLoading || statsLoading;

  const recentReports = [
    {
      id: '1',
      title: 'Report Mensile Incidenti',
      description: 'Analisi completa degli incidenti del mese corrente',
      date: new Date(),
      status: 'completed',
      type: 'PDF'
    },
    {
      id: '2',
      title: 'Export Dati Regionale',
      description: 'Esportazione dati per regione Lombardia',
      date: new Date(Date.now() - 86400000),
      status: 'completed',
      type: 'Excel'
    },
    {
      id: '3',
      title: 'Statistiche Trimestrali',
      description: 'Report statistico Q1 2025',
      date: new Date(Date.now() - 172800000),
      status: 'pending',
      type: 'PDF'
    }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: FileText, color: 'text-destructive', bg: 'bg-destructive/10' },
    { value: 'excel', label: 'Excel', icon: FileSpreadsheet, color: 'text-success', bg: 'bg-success/10' },
    { value: 'json', label: 'JSON', icon: FileJson, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-mesh">
        <FloatingNav />
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pt-20 sm:pt-24">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} variant="glass" className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-16 w-full" />
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <FloatingNav />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pt-20 sm:pt-24">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Report</h1>
              <p className="text-muted-foreground text-sm">Genera report personalizzati</p>
            </div>
          </div>

          {/* Custom Report Generator - Improved */}
          <Card variant="glass" className="overflow-hidden">
            {/* Header with gradient */}
            <div className="p-5 border-b border-border/30 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Settings2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Report Personalizzato</h3>
                  <p className="text-sm text-muted-foreground">Configura i parametri per generare un report su misura</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-5 sm:space-y-6">
              {/* Filters Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Date From */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Data Inizio
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="glass" className="w-full justify-start font-normal">
                        {dateFrom ? format(dateFrom, 'dd/MM/yyyy') : 'Seleziona data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        locale={it}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Date To */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Data Fine
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="glass" className="w-full justify-start font-normal">
                        {dateTo ? format(dateTo, 'dd/MM/yyyy') : 'Seleziona data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        locale={it}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Region */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Regione
                  </label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tutte le regioni" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutte le regioni</SelectItem>
                      {ITALIAN_REGIONS.map((region) => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Accident Type */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    Tipo Incidente
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tutti i tipi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti i tipi</SelectItem>
                      {Object.entries(ACCIDENT_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-medium">Formato Export</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {formatOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setExportFormat(option.value as ExportFormat)}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1.5 sm:gap-2 ${
                        exportFormat === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border/30 hover:border-border/60 hover:bg-muted/10'
                      }`}
                    >
                      <div className={`p-2 sm:p-2.5 rounded-lg ${option.bg}`}>
                        <option.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${option.color}`} />
                      </div>
                      <span className="font-medium text-xs sm:text-sm">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Options */}
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-medium">Contenuto Report</label>
                <div className="grid grid-cols-1 gap-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                    <Checkbox 
                      checked={includeStats} 
                      onCheckedChange={(checked) => setIncludeStats(checked as boolean)} 
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Statistiche</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                    <Checkbox 
                      checked={includeCharts} 
                      onCheckedChange={(checked) => setIncludeCharts(checked as boolean)} 
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">Grafici</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                    <Checkbox 
                      checked={includeDetails} 
                      onCheckedChange={(checked) => setIncludeDetails(checked as boolean)} 
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <Users className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">Dettagli Vittime</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Preview Summary */}
              <div className="p-3 sm:p-4 rounded-xl bg-muted/10 border border-border/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs sm:text-sm font-medium">Anteprima</span>
                  <Badge variant="glass-primary" size="sm">{incidents?.length || 0} record</Badge>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                  <div className="p-2 rounded-lg bg-background/50">
                    <div className="text-base sm:text-lg font-bold">{stats?.totalIncidents || 0}</div>
                    <div className="text-[8px] sm:text-[10px] text-muted-foreground uppercase">Incidenti</div>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50">
                    <div className="text-base sm:text-lg font-bold text-destructive">{stats?.totalDeceased || 0}</div>
                    <div className="text-[8px] sm:text-[10px] text-muted-foreground uppercase">Vittime</div>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50">
                    <div className="text-base sm:text-lg font-bold">{Object.keys(stats?.byRegion || {}).length}</div>
                    <div className="text-[8px] sm:text-[10px] text-muted-foreground uppercase">Regioni</div>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50">
                    <div className="text-base sm:text-lg font-bold">{Object.keys(stats?.byType || {}).length}</div>
                    <div className="text-[8px] sm:text-[10px] text-muted-foreground uppercase">Tipi</div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20">
                <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Genera {exportFormat.toUpperCase()}
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Recent Reports */}
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Report Recenti</h3>
            </div>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div 
                  key={report.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      report.type === 'PDF' ? 'bg-destructive/10' : 'bg-success/10'
                    }`}>
                      {report.type === 'PDF' ? (
                        <FileText className={`h-4 w-4 ${report.type === 'PDF' ? 'text-destructive' : 'text-success'}`} />
                      ) : (
                        <FileSpreadsheet className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{report.title}</div>
                      <div className="text-xs text-muted-foreground">{report.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-muted-foreground">
                        {format(report.date, 'dd MMM yyyy', { locale: it })}
                      </div>
                      <Badge 
                        variant={report.status === 'completed' ? 'glass-success' : 'glass-warning'}
                        size="sm"
                      >
                        {report.status === 'completed' ? (
                          <><CheckCircle className="h-3 w-3 mr-1" /> Completato</>
                        ) : (
                          <><AlertCircle className="h-3 w-3 mr-1" /> In attesa</>
                        )}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
