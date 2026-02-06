import { useState } from 'react';
import { FloatingNav } from '@/components/FloatingNav';
import { FloatingFilters } from '@/components/FloatingFilters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { IncidentFilters } from '@/types/incident';
import { 
  FileText, 
  Download, 
  FileSpreadsheet,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

type ExportFormat = 'pdf' | 'excel';

export default function Report() {
  const [filters, setFilters] = useState<IncidentFilters>({});

  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');

  

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

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <FloatingNav />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pt-20 sm:pt-24">
        <div className="space-y-4 sm:space-y-6">
          {/* Floating Filters with Format Selector */}
          <FloatingFilters 
            filters={filters} 
            onFiltersChange={setFilters}
            showFormatSelector
            exportFormat={exportFormat}
            onExportFormatChange={setExportFormat}
            onGenerate={() => console.log('Generate', exportFormat)}
          />


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
