export interface GenerationRequest {
  id?: number;
  generationRequestId?: number;
  projectName?: string;

  framework: string;
  lenguaje?: string;
  estilo?: string;
  incluirTests?: boolean;
  incluirDoc?: boolean;
  estado?: 'Pending' | 'Processing' | 'Completed' | 'Failed' | string;
  status?: 'Pending' | 'Processing' | 'Completed' | 'Failed' | string;

  resultadoPath?: string;
  componentesGenerados?: number;
  lineasDeCodigo?: number;
  totalTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
  errorMessage?: string;
  sonarBugs?: number;
  sonarVulnerabilities?: number;
  sonarCodeSmells?: number;
  lighthousePerformanceScore?: number;
  lighthouseAccessibilityScore?: number;
  generationLogs?: GenerationLog[];
  fechaCreacion: string;
  fechaActualizacion?: string;
  gitHubRepoUrl?: string | null;
  projectDescription?: string;
}

export interface GenerationLog {
  timestamp: string;
  logLevel?: string;
  message?: string;
}
