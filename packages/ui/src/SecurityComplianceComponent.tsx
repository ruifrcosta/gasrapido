// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { SecurityComplianceService, AuditLog, DataEncryptionKey, ComplianceReport, SecurityPolicy } from '@gasrapido/shared';

interface SecurityComplianceComponentProps {
  securityService: SecurityComplianceService;
}

const SecurityComplianceComponent: React.FC<SecurityComplianceComponentProps> = ({ 
  securityService 
}) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [encryptionKeys, setEncryptionKeys] = useState<DataEncryptionKey[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'encryption' | 'compliance' | 'policies'>('audit');
  const [newKeyName, setNewKeyName] = useState('');
  const [reportType, setReportType] = useState('general');
  const [reportPeriod, setReportPeriod] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [auditLogsResult, keysResult, reportsResult, policiesResult] = await Promise.all([
        securityService.getAuditLogs({ limit: 50 }),
        securityService.getActiveEncryptionKeys(),
        securityService.getComplianceReports(10),
        securityService.getSecurityPolicies()
      ]);

      if (auditLogsResult.error) throw auditLogsResult.error;
      if (keysResult.error) throw keysResult.error;
      if (reportsResult.error) throw reportsResult.error;
      if (policiesResult.error) throw policiesResult.error;

      setAuditLogs(auditLogsResult.logs);
      setEncryptionKeys(keysResult.keys);
      setComplianceReports(reportsResult.reports);
      setSecurityPolicies(policiesResult.policies);
      
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados de segurança e compliance');
      console.error('Error fetching security data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    if (!newKeyName) {
      setError('Por favor, informe um nome para a chave');
      return;
    }

    try {
      const { key, error } = await securityService.generateEncryptionKey(newKeyName);
      
      if (error) throw error;
      
      if (key) {
        setEncryptionKeys([key, ...encryptionKeys]);
        setNewKeyName('');
        setError(null);
      }
    } catch (err) {
      setError('Erro ao gerar chave de criptografia');
      console.error('Error generating encryption key:', err);
    }
  };

  const handleRotateKey = async (keyId: string) => {
    try {
      const { success, error } = await securityService.rotateEncryptionKey(keyId);
      
      if (error) throw error;
      
      if (success) {
        // Refresh keys
        const { keys, error: fetchError } = await securityService.getActiveEncryptionKeys();
        
        if (fetchError) throw fetchError;
        
        setEncryptionKeys(keys);
        setError(null);
      }
    } catch (err) {
      setError('Erro ao rotacionar chave de criptografia');
      console.error('Error rotating encryption key:', err);
    }
  };

  const handleGenerateReport = async () => {
    if (!reportPeriod.start || !reportPeriod.end) {
      setError('Por favor, selecione um período para o relatório');
      return;
    }

    try {
      const { report, error } = await securityService.generateComplianceReport(
        reportType,
        reportPeriod.start,
        reportPeriod.end,
        'current-user-id' // This would be the actual user ID in a real app
      );
      
      if (error) throw error;
      
      if (report) {
        setComplianceReports([report, ...complianceReports]);
        setError(null);
      }
    } catch (err) {
      setError('Erro ao gerar relatório de compliance');
      console.error('Error generating compliance report:', err);
    }
  };

  const getActionLabel = (action: string): string => {
    const actionLabels: Record<string, string> = {
      'login': 'Login',
      'logout': 'Logout',
      'create_user': 'Criar Usuário',
      'update_user': 'Atualizar Usuário',
      'delete_user': 'Excluir Usuário',
      'encrypt_data': 'Criptografar Dados',
      'decrypt_data': 'Descriptografar Dados',
      'generate_encryption_key': 'Gerar Chave de Criptografia',
      'rotate_encryption_key': 'Rotacionar Chave de Criptografia',
      'security_violation_detected': 'Violação de Segurança Detectada'
    };
    
    return actionLabels[action] || action;
  };

  const getSeverityLabel = (severity: string): string => {
    const severityLabels: Record<string, string> = {
      'low': 'Baixa',
      'medium': 'Média',
      'high': 'Alta',
      'critical': 'Crítica'
    };
    
    return severityLabels[severity] || severity;
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      case 'critical': return '#d32f2f';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Carregando dados de segurança e compliance...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Segurança e Compliance</h2>
      
      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'audit' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('audit')}
        >
          Auditoria ({auditLogs.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'encryption' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('encryption')}
        >
          Criptografia ({encryptionKeys.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'compliance' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('compliance')}
        >
          Compliance ({complianceReports.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'policies' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('policies')}
        >
          Políticas ({securityPolicies.length})
        </button>
      </div>
      
      {error && (
        <div style={styles.error}>{error}</div>
      )}
      
      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div style={styles.tabContent}>
          <h3 style={styles.sectionTitle}>Logs de Auditoria</h3>
          <div style={styles.auditLogsContainer}>
            {auditLogs.length > 0 ? (
              auditLogs.map(log => (
                <div key={log.id} style={styles.auditLogItem}>
                  <div style={styles.auditLogHeader}>
                    <span style={styles.auditLogAction}>{getActionLabel(log.action)}</span>
                    <span style={styles.auditLogTime}>
                      {new Date(log.timestamp).toLocaleString('pt-AO')}
                    </span>
                  </div>
                  <div style={styles.auditLogDetails}>
                    <div style={styles.auditLogDetail}>
                      <strong>Usuário:</strong> {log.user_id}
                    </div>
                    <div style={styles.auditLogDetail}>
                      <strong>Recurso:</strong> {log.resource_type} ({log.resource_id})
                    </div>
                    <div style={styles.auditLogDetail}>
                      <strong>IP:</strong> {log.ip_address}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noData}>Nenhum log de auditoria encontrado</div>
            )}
          </div>
        </div>
      )}
      
      {/* Encryption Keys Tab */}
      {activeTab === 'encryption' && (
        <div style={styles.tabContent}>
          <h3 style={styles.sectionTitle}>Chaves de Criptografia</h3>
          
          {/* Generate Key Form */}
          <div style={styles.keyGenerationForm}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nome da Chave</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                style={styles.formInput}
                placeholder="Informe um nome para a nova chave"
              />
            </div>
            <button
              onClick={handleGenerateKey}
              style={styles.generateButton}
            >
              Gerar Nova Chave
            </button>
          </div>
          
          {/* Active Keys */}
          <div style={styles.keysList}>
            {encryptionKeys.length > 0 ? (
              encryptionKeys.map(key => (
                <div key={key.id} style={styles.keyItem}>
                  <div style={styles.keyHeader}>
                    <h4 style={styles.keyName}>{key.name}</h4>
                    <span style={{
                      ...styles.keyStatus,
                      ...(key.is_active ? styles.activeStatus : styles.inactiveStatus)
                    }}>
                      {key.is_active ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  <div style={styles.keyDetails}>
                    <div style={styles.keyDetail}>
                      <strong>Algoritmo:</strong> {key.algorithm}
                    </div>
                    <div style={styles.keyDetail}>
                      <strong>Criada em:</strong> {new Date(key.created_at).toLocaleDateString('pt-AO')}
                    </div>
                    <div style={styles.keyDetail}>
                      <strong>Expira em:</strong> {new Date(key.expires_at).toLocaleDateString('pt-AO')}
                    </div>
                  </div>
                  {key.is_active && (
                    <button
                      onClick={() => handleRotateKey(key.id)}
                      style={styles.rotateButton}
                    >
                      Rotacionar Chave
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div style={styles.noData}>Nenhuma chave de criptografia encontrada</div>
            )}
          </div>
        </div>
      )}
      
      {/* Compliance Reports Tab */}
      {activeTab === 'compliance' && (
        <div style={styles.tabContent}>
          <h3 style={styles.sectionTitle}>Relatórios de Compliance</h3>
          
          {/* Generate Report Form */}
          <div style={styles.reportGenerationForm}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Tipo de Relatório</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                style={styles.formInput}
              >
                <option value="general">Geral</option>
                <option value="gdpr">GDPR</option>
                <option value="hipaa">HIPAA</option>
                <option value="sox">SOX</option>
                <option value="pci">PCI DSS</option>
              </select>
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Data Inicial</label>
                <input
                  type="date"
                  value={reportPeriod.start}
                  onChange={(e) => setReportPeriod({...reportPeriod, start: e.target.value})}
                  style={styles.formInput}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Data Final</label>
                <input
                  type="date"
                  value={reportPeriod.end}
                  onChange={(e) => setReportPeriod({...reportPeriod, end: e.target.value})}
                  style={styles.formInput}
                />
              </div>
            </div>
            
            <button
              onClick={handleGenerateReport}
              style={styles.generateButton}
            >
              Gerar Relatório
            </button>
          </div>
          
          {/* Reports List */}
          <div style={styles.reportsList}>
            {complianceReports.length > 0 ? (
              complianceReports.map(report => (
                <div key={report.id} style={styles.reportItem}>
                  <div style={styles.reportHeader}>
                    <h4 style={styles.reportTitle}>{report.report_type}</h4>
                    <span style={styles.reportDate}>
                      {new Date(report.generated_at).toLocaleDateString('pt-AO')}
                    </span>
                  </div>
                  <div style={styles.reportDetails}>
                    <div style={styles.reportDetail}>
                      <strong>Período:</strong> {new Date(report.period_start).toLocaleDateString('pt-AO')} - {new Date(report.period_end).toLocaleDateString('pt-AO')}
                    </div>
                    <div style={styles.reportDetail}>
                      <strong>Gerado por:</strong> {report.generated_by}
                    </div>
                  </div>
                  <div style={styles.reportPreview}>
                    {report.content.substring(0, 200)}...
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noData}>Nenhum relatório de compliance encontrado</div>
            )}
          </div>
        </div>
      )}
      
      {/* Security Policies Tab */}
      {activeTab === 'policies' && (
        <div style={styles.tabContent}>
          <h3 style={styles.sectionTitle}>Políticas de Segurança</h3>
          <div style={styles.policiesList}>
            {securityPolicies.length > 0 ? (
              securityPolicies.map(policy => (
                <div key={policy.id} style={styles.policyItem}>
                  <div style={styles.policyHeader}>
                    <h4 style={styles.policyName}>{policy.name}</h4>
                    <span style={{
                      ...styles.policyStatus,
                      ...(policy.is_active ? styles.activeStatus : styles.inactiveStatus)
                    }}>
                      {policy.is_active ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  <p style={styles.policyDescription}>{policy.description}</p>
                  
                  <h5 style={styles.rulesTitle}>Regras</h5>
                  <div style={styles.rulesList}>
                    {policy.rules.map(rule => (
                      <div key={rule.id} style={styles.ruleItem}>
                        <div style={styles.ruleHeader}>
                          <strong style={styles.ruleName}>{rule.rule_name}</strong>
                          <span style={{
                            ...styles.ruleSeverity,
                            backgroundColor: getSeverityColor(rule.severity)
                          }}>
                            {getSeverityLabel(rule.severity)}
                          </span>
                        </div>
                        <p style={styles.ruleDescription}>{rule.rule_description}</p>
                        <div style={styles.ruleDetails}>
                          <div style={styles.ruleDetail}>
                            <strong>Condição:</strong> {rule.condition}
                          </div>
                          <div style={styles.ruleDetail}>
                            <strong>Ação:</strong> {rule.action}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noData}>Nenhuma política de segurança encontrada</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  tabs: {
    display: 'flex',
    marginBottom: '20px',
    borderBottom: '1px solid #ddd',
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#666',
  },
  activeTab: {
    borderBottom: '2px solid #1976d2',
    color: '#1976d2',
  },
  tabContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  loading: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666',
  },
  error: {
    padding: '12px',
    backgroundColor: '#ffebee',
    color: '#d32f2f',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  },
  auditLogsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  auditLogItem: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '16px',
  },
  auditLogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  auditLogAction: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  auditLogTime: {
    fontSize: '12px',
    color: '#666',
  },
  auditLogDetails: {
    fontSize: '14px',
    color: '#666',
  },
  auditLogDetail: {
    marginBottom: '4px',
  },
  noData: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666',
  },
  keyGenerationForm: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '16px',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
  },
  formLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  formInput: {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  generateButton: {
    padding: '12px 24px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  keysList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  keyItem: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '16px',
  },
  keyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  keyName: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0,
  },
  keyStatus: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
  },
  activeStatus: {
    backgroundColor: '#4caf50',
  },
  inactiveStatus: {
    backgroundColor: '#f44336',
  },
  keyDetails: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
  },
  keyDetail: {
    marginBottom: '4px',
  },
  rotateButton: {
    padding: '8px 16px',
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  reportGenerationForm: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  reportsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  reportItem: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '16px',
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  reportTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0,
  },
  reportDate: {
    fontSize: '12px',
    color: '#666',
  },
  reportDetails: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  reportDetail: {
    marginBottom: '4px',
  },
  reportPreview: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
  },
  policiesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  policyItem: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '16px',
  },
  policyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  policyName: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0,
  },
  policyDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
  },
  rulesTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#333',
  },
  rulesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  ruleItem: {
    border: '1px solid #f0f0f0',
    borderRadius: '4px',
    padding: '12px',
    backgroundColor: '#fafafa',
  },
  ruleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  ruleName: {
    fontSize: '14px',
  },
  ruleSeverity: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
  },
  ruleDescription: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px',
  },
  ruleDetails: {
    fontSize: '12px',
    color: '#666',
  },
  ruleDetail: {
    marginBottom: '4px',
  },
};

export default SecurityComplianceComponent;