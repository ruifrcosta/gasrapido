import { PricingService, PricingFactors } from './pricingService';

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: {
    basePrice: number;
    demandMultiplier: number;
    scarcityLevel: number;
    weatherImpact: number;
    trafficImpact: number;
  };
  expectedPriceRange: {
    min: number;
    max: number;
  };
}

export interface SimulationResult {
  scenarioId: string;
  timestamp: string;
  inputParameters: any;
  calculatedPrice: number;
  expectedRange: { min: number; max: number };
  deviation: number;
  passed: boolean;
}

export class PricingSimulationService {
  private pricingEngine: PricingService;

  constructor(pricingEngine: PricingService) {
    this.pricingEngine = pricingEngine;
  }

  /**
   * Define cenários de teste padrão
   */
  getDefaultScenarios(): SimulationScenario[] {
    return [
      {
        id: 'normal-demand',
        name: 'Demanda Normal',
        description: 'Condições normais de mercado',
        parameters: {
          basePrice: 2500,
          demandMultiplier: 1.0,
          scarcityLevel: 1.0,
          weatherImpact: 0.0,
          trafficImpact: 0.0
        },
        expectedPriceRange: {
          min: 2400,
          max: 2600
        }
      },
      {
        id: 'high-demand',
        name: 'Alta Demanda',
        description: 'Período de pico de demanda',
        parameters: {
          basePrice: 2500,
          demandMultiplier: 1.5,
          scarcityLevel: 1.2,
          weatherImpact: 0.1,
          trafficImpact: 0.05
        },
        expectedPriceRange: {
          min: 3000,
          max: 3500
        }
      },
      {
        id: 'low-demand',
        name: 'Baixa Demanda',
        description: 'Período de baixa demanda',
        parameters: {
          basePrice: 2500,
          demandMultiplier: 0.7,
          scarcityLevel: 0.8,
          weatherImpact: -0.05,
          trafficImpact: -0.02
        },
        expectedPriceRange: {
          min: 2000,
          max: 2300
        }
      },
      {
        id: 'scarcity-event',
        name: 'Evento de Escassez',
        description: 'Produto em baixa disponibilidade',
        parameters: {
          basePrice: 2500,
          demandMultiplier: 1.2,
          scarcityLevel: 2.0,
          weatherImpact: 0.15,
          trafficImpact: 0.1
        },
        expectedPriceRange: {
          min: 3500,
          max: 4500
        }
      }
    ];
  }

  /**
   * Executar simulação para um cenário específico
   */
  async runSimulation(scenario: SimulationScenario): Promise<SimulationResult> {
    try {
      // Converter parâmetros para o formato esperado pelo PricingService
      const factors: PricingFactors = {
        scarcity: scenario.parameters.scarcityLevel,
        weather: scenario.parameters.weatherImpact,
        traffic: scenario.parameters.trafficImpact,
        demand: scenario.parameters.demandMultiplier,
        timeOfDay: 0.5, // Valor médio
        dayOfWeek: 0.5  // Valor médio
      };

      // Calcular preço usando o motor de precificação
      const priceCalculation = this.pricingEngine.calculateDynamicPrice(
        scenario.parameters.basePrice,
        factors
      );

      const calculatedPrice = priceCalculation.finalPrice;

      // Calcular desvio em relação à faixa esperada
      const deviation = Math.abs(calculatedPrice - 
        ((scenario.expectedPriceRange.min + scenario.expectedPriceRange.max) / 2));

      // Verificar se o preço está dentro da faixa esperada
      const passed = calculatedPrice >= scenario.expectedPriceRange.min && 
                     calculatedPrice <= scenario.expectedPriceRange.max;

      return {
        scenarioId: scenario.id,
        timestamp: new Date().toISOString(),
        inputParameters: scenario.parameters,
        calculatedPrice,
        expectedRange: scenario.expectedPriceRange,
        deviation,
        passed
      };
    } catch (error) {
      throw new Error(`Falha ao executar simulação: ${error}`);
    }
  }

  /**
   * Executar todas as simulações
   */
  async runAllSimulations(): Promise<SimulationResult[]> {
    const scenarios = this.getDefaultScenarios();
    const results: SimulationResult[] = [];

    for (const scenario of scenarios) {
      const result = await this.runSimulation(scenario);
      results.push(result);
    }

    return results;
  }

  /**
   * Gerar relatório de simulação
   */
  generateSimulationReport(results: SimulationResult[]): string {
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = results.filter(r => !r.passed).length;
    const successRate = (passedTests / results.length) * 100;

    let report = `Relatório de Simulação do Motor de Precificação
====================================

Total de Testes: ${results.length}
Testes Passados: ${passedTests}
Testes Falhos: ${failedTests}
Taxa de Sucesso: ${successRate.toFixed(2)}%

Detalhes dos Testes:
`;

    results.forEach((result, index) => {
      const scenario = this.getDefaultScenarios().find(s => s.id === result.scenarioId);
      report += `
${index + 1}. ${scenario?.name || result.scenarioId}
   Descrição: ${scenario?.description || 'N/A'}
   Preço Calculado: ${result.calculatedPrice.toFixed(2)} AOA
   Faixa Esperada: ${result.expectedRange.min.toFixed(2)} - ${result.expectedRange.max.toFixed(2)} AOA
   Desvio: ${result.deviation.toFixed(2)}
   Status: ${result.passed ? 'PASSOU' : 'FALHOU'}
`;
    });

    return report;
  }
}

export default PricingSimulationService;