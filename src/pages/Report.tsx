import { FloatingNav } from '@/components/FloatingNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIncidents, useIncidentStats } from '@/hooks/useIncidents';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  FileSpreadsheet,
  FileJson,
  Printer,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export default function Report() {
  const { data: incidents, isLoading: incidentsLoading } = useIncidents({});
  const { data: stats, isLoading: statsLoading } = useIncidentStats();

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Report</h1>
                <p className="text-muted-foreground text-sm">Genera e scarica report personalizzati</p>
              </div>
            </div>
          </div>

          {/* Quick Export Options */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card variant="glass" className="p-4 hover:scale-[1.02] transition-transform cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                  <FileText className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <div className="font-medium text-sm">Export PDF</div>
                  <div className="text-xs text-muted-foreground">Report completo</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-4 hover:scale-[1.02] transition-transform cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-success/10 group-hover:bg-success/20 transition-colors">
                  <FileSpreadsheet className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="font-medium text-sm">Export Excel</div>
                  <div className="text-xs text-muted-foreground">Dati tabellari</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-4 hover:scale-[1.02] transition-transform cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-warning/10 group-hover:bg-warning/20 transition-colors">
                  <FileJson className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <div className="font-medium text-sm">Export JSON</div>
                  <div className="text-xs text-muted-foreground">Dati grezzi</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-4 hover:scale-[1.02] transition-transform cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Printer className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Stampa</div>
                  <div className="text-xs text-muted-foreground">Versione stampabile</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Report Generator */}
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Genera Report Personalizzato</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Periodo</label>
                <Button variant="glass" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Seleziona date
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Regione</label>
                <Button variant="glass" className="w-full justify-start">
                  <Filter className="h-4 w-4 mr-2" />
                  Tutte le regioni
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Formato</label>
                <Button variant="glass" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="glass" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Genera Report
              </Button>
              <Button variant="glass" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Data Summary */}
          <Card variant="glass" className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Dati Disponibili per Export</h3>
              <Badge variant="glass-success">{incidents?.length || 0} record</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-xl bg-muted/20">
                <div className="text-xl font-bold">{stats?.totalIncidents || 0}</div>
                <div className="text-xs text-muted-foreground">Incidenti</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/20">
                <div className="text-xl font-bold">{stats?.totalDeceased || 0}</div>
                <div className="text-xs text-muted-foreground">Vittime</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/20">
                <div className="text-xl font-bold">{Object.keys(stats?.byRegion || {}).length}</div>
                <div className="text-xs text-muted-foreground">Regioni</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/20">
                <div className="text-xl font-bold">{Object.keys(stats?.byType || {}).length}</div>
                <div className="text-xs text-muted-foreground">Tipologie</div>
              </div>
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
